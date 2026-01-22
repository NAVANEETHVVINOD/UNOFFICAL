import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TicketType, EventRegistration, RegistrationStatus, NotificationType } from '@prisma/client';
import { randomBytes, createHmac } from 'crypto';
import { randomUUID } from 'crypto';

export interface TicketAvailability {
  ticketId: string;
  name: string;
  price: number;
  available: number | null; // null = unlimited
  total: number | null;
  sold: number;
  status: 'AVAILABLE' | 'SOLD_OUT' | 'NOT_ON_SALE' | 'SALES_ENDED';
  salesStart: Date | null;
  salesEnd: Date | null;
  perUserLimit: number;
  userPurchased: number;
}

export interface ReservationResult {
  success: boolean;
  registrationId?: string;
  qrToken?: string;
  error?: string;
}

@Injectable()
export class TicketsService {
  private readonly QR_SECRET = process.env.QR_HMAC_SECRET || 'default-secret-change-in-production';

  constructor(private prisma: PrismaService) {}

  /**
   * Get ticket availability for an event
   */
  async getAvailability(eventId: string, userId?: string): Promise<TicketAvailability[]> {
    const tickets = await this.prisma.ticketType.findMany({
      where: { eventId },
      include: {
        EventRegistration: userId
          ? {
              where: {
                userId,
                status: { in: [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED] },
              },
            }
          : false,
      },
    });

    const now = new Date();

    return tickets.map((ticket) => {
      const available = ticket.quantity !== null ? ticket.quantity - ticket.quantitySold : null;
      const userPurchased = userId && ticket.EventRegistration ? ticket.EventRegistration.length : 0;

      let status: TicketAvailability['status'] = 'AVAILABLE';
      if (ticket.salesStart && ticket.salesStart > now) {
        status = 'NOT_ON_SALE';
      } else if (ticket.salesEnd && ticket.salesEnd < now) {
        status = 'SALES_ENDED';
      } else if (available !== null && available <= 0) {
        status = 'SOLD_OUT';
      }

      return {
        ticketId: ticket.id,
        name: ticket.name,
        price: ticket.price,
        available,
        total: ticket.quantity,
        sold: ticket.quantitySold,
        status,
        salesStart: ticket.salesStart,
        salesEnd: ticket.salesEnd,
        perUserLimit: ticket.perUserLimit,
        userPurchased,
      };
    });
  }

  /**
   * Reserve a ticket atomically
   * Uses database transaction with row-level locking to prevent overselling
   */
  async reserveTicket(
    eventId: string,
    ticketId: string,
    userId: string,
    formResponses?: Record<string, unknown>,
    noRefundConsent?: boolean,
  ): Promise<ReservationResult> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Lock the ticket row for update
        const ticket = await tx.ticketType.findUnique({
          where: { id: ticketId },
          include: {
            Event: {
              select: { title: true },
            },
          },
        });

        if (!ticket || ticket.eventId !== eventId) {
          return { success: false, error: 'Ticket type not found' };
        }

        // Check sales window
        const now = new Date();
        if (ticket.salesStart && ticket.salesStart > now) {
          return { success: false, error: 'Ticket sales have not started yet' };
        }
        if (ticket.salesEnd && ticket.salesEnd < now) {
          return { success: false, error: 'Ticket sales have ended' };
        }

        // Check availability
        if (ticket.quantity !== null && ticket.quantitySold >= ticket.quantity) {
          return { success: false, error: 'Ticket sold out' };
        }

        // Check per-user limit
        const existingRegistrations = await tx.eventRegistration.count({
          where: {
            eventId,
            ticketId,
            userId,
            status: { in: [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED] },
          },
        });

        if (existingRegistrations >= ticket.perUserLimit) {
          return { success: false, error: `You can only purchase ${ticket.perUserLimit} ticket(s) of this type` };
        }

        // Check if user already registered for this event
        const existingEventReg = await tx.eventRegistration.findUnique({
          where: { eventId_userId: { eventId, userId } },
        });

        if (existingEventReg && existingEventReg.status !== RegistrationStatus.CANCELLED) {
          return { success: false, error: 'You are already registered for this event' };
        }

        // Generate QR token
        const qrToken = this.generateQrToken(eventId, userId);
        const isFree = ticket.price === 0;

        // Create registration
        const registration = await tx.eventRegistration.create({
          data: {
            id: randomUUID(),
            eventId,
            ticketId,
            userId,
            status: isFree ? RegistrationStatus.CONFIRMED : RegistrationStatus.PENDING,
            qrToken,
            formResponses: formResponses ? JSON.parse(JSON.stringify(formResponses)) : undefined,
            noRefundConsent: noRefundConsent || false,
          },
        });

        // Increment sold count
        await tx.ticketType.update({
          where: { id: ticketId },
          data: { quantitySold: { increment: 1 } },
        });

        return {
          success: true,
          registrationId: registration.id,
          qrToken: registration.qrToken,
          isFree,
          eventTitle: ticket.Event.title,
          ticketName: ticket.name,
        };
      }, {
        isolationLevel: 'Serializable', // Strongest isolation to prevent race conditions
        timeout: 10000, // 10 second timeout
      });

      // Send notification for free events (auto-confirmed)
      if (result.success && result.isFree) {
        await this.createRegistrationNotification(
          userId,
          eventId,
          result.eventTitle!,
          result.ticketName!,
        );
      }

      return {
        success: result.success,
        registrationId: result.registrationId,
        qrToken: result.qrToken,
        error: result.error,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return { success: false, error: 'You are already registered for this event' };
      }
      throw error;
    }
  }


  /**
   * Confirm a pending registration (after payment)
   */
  async confirmRegistration(registrationId: string): Promise<EventRegistration> {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.status !== RegistrationStatus.PENDING) {
      throw new BadRequestException('Registration is not in pending status');
    }

    return this.prisma.eventRegistration.update({
      where: { id: registrationId },
      data: { status: RegistrationStatus.CONFIRMED },
    });
  }

  /**
   * Release a reservation (cancel pending registration)
   * Returns the ticket to available pool
   */
  async releaseReservation(registrationId: string, userId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const registration = await tx.eventRegistration.findUnique({
        where: { id: registrationId },
      });

      if (!registration) {
        throw new NotFoundException('Registration not found');
      }

      if (registration.userId !== userId) {
        throw new BadRequestException('You can only cancel your own registration');
      }

      if (registration.status === RegistrationStatus.CANCELLED) {
        return; // Already cancelled
      }

      if (registration.status === RegistrationStatus.CONFIRMED) {
        throw new BadRequestException('Cannot cancel confirmed registration. Contact organizer for refund.');
      }

      // Update registration status
      await tx.eventRegistration.update({
        where: { id: registrationId },
        data: { status: RegistrationStatus.CANCELLED },
      });

      // Decrement sold count
      await tx.ticketType.update({
        where: { id: registration.ticketId },
        data: { quantitySold: { decrement: 1 } },
      });
    });
  }

  /**
   * Get user's registration for an event
   */
  async getUserRegistration(eventId: string, userId: string): Promise<EventRegistration | null> {
    return this.prisma.eventRegistration.findUnique({
      where: { eventId_userId: { eventId, userId } },
      include: {
        TicketType: true,
        EventPayment: true,
        EventCertificate: true,
      },
    });
  }

  /**
   * Get all registrations for an event (for organizers)
   */
  async getEventRegistrations(
    eventId: string,
    status?: RegistrationStatus,
    limit = 50,
    cursor?: string,
  ): Promise<EventRegistration[]> {
    return this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        ...(status && { status }),
        deletedAt: null,
      },
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            Profile: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        TicketType: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    });
  }

  /**
   * Create or update a ticket type
   */
  async upsertTicketType(
    eventId: string,
    ticketData: {
      id?: string;
      name: string;
      description?: string;
      price: number;
      quantity?: number | null;
      perUserLimit?: number;
      salesStart?: Date | null;
      salesEnd?: Date | null;
    },
  ): Promise<TicketType> {
    if (ticketData.id) {
      // Update existing
      return this.prisma.ticketType.update({
        where: { id: ticketData.id },
        data: {
          name: ticketData.name,
          description: ticketData.description,
          price: ticketData.price,
          quantity: ticketData.quantity,
          perUserLimit: ticketData.perUserLimit || 1,
          salesStart: ticketData.salesStart,
          salesEnd: ticketData.salesEnd,
        },
      });
    }

    // Create new
    return this.prisma.ticketType.create({
      data: {
        id: randomUUID(),
        eventId,
        name: ticketData.name,
        description: ticketData.description,
        price: ticketData.price,
        quantity: ticketData.quantity,
        perUserLimit: ticketData.perUserLimit || 1,
        salesStart: ticketData.salesStart,
        salesEnd: ticketData.salesEnd,
      },
    });
  }

  /**
   * Delete a ticket type (only if no registrations)
   */
  async deleteTicketType(ticketId: string): Promise<void> {
    const registrations = await this.prisma.eventRegistration.count({
      where: { ticketId },
    });

    if (registrations > 0) {
      throw new BadRequestException('Cannot delete ticket type with existing registrations');
    }

    await this.prisma.ticketType.delete({
      where: { id: ticketId },
    });
  }

  /**
   * Generate a signed QR token for a registration
   */
  private generateQrToken(eventId: string, userId: string): string {
    const timestamp = Date.now();
    const random = randomBytes(8).toString('hex');
    const payload = `${eventId}:${userId}:${timestamp}:${random}`;
    const signature = createHmac('sha256', this.QR_SECRET)
      .update(payload)
      .digest('hex')
      .substring(0, 16);
    return `${payload}:${signature}`;
  }

  /**
   * Verify a QR token
   */
  verifyQrToken(token: string): { valid: boolean; eventId?: string; userId?: string } {
    const parts = token.split(':');
    if (parts.length !== 5) {
      return { valid: false };
    }

    const [eventId, userId, timestamp, random, signature] = parts;
    const payload = `${eventId}:${userId}:${timestamp}:${random}`;
    const expectedSignature = createHmac('sha256', this.QR_SECRET)
      .update(payload)
      .digest('hex')
      .substring(0, 16);

    if (signature !== expectedSignature) {
      return { valid: false };
    }

    return { valid: true, eventId, userId };
  }

  /**
   * Get all events a user is registered for
   */
  async getUserRegisteredEvents(userId: string): Promise<EventRegistration[]> {
    return this.prisma.eventRegistration.findMany({
      where: {
        userId,
        status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
        deletedAt: null,
      },
      include: {
        Event: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
            startsAt: true,
            endsAt: true,
            venue: true,
            onlineLink: true,
            status: true,
          },
        },
        TicketType: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Create registration confirmation notification
   */
  async createRegistrationNotification(
    userId: string,
    eventId: string,
    eventTitle: string,
    ticketName: string,
  ): Promise<void> {
    await this.prisma.notification.create({
      data: {
        id: randomUUID(),
        userId,
        type: NotificationType.EVENT,
        title: 'Registration Confirmed',
        message: `You're registered for "${eventTitle}" with ${ticketName} ticket.`,
        actionUrl: `/events/${eventId}`,
      },
    });
  }
}
