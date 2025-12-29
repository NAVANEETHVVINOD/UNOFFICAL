import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  WaitlistStatus,
  WaitlistEntry,
  NotificationType,
  RegistrationStatus,
} from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Waitlist claim expiry time in hours
 */
const CLAIM_EXPIRY_HOURS = 24;

/**
 * Waitlist entry with user info
 */
export interface WaitlistEntryWithUser extends WaitlistEntry {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  ticket: {
    name: string;
    price: number;
  };
}

/**
 * WaitlistService - Manages event waitlists
 * Property 7: Waitlist FIFO Ordering
 * Validates: Requirements 15.1-15.7
 */
@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Add user to waitlist (FIFO ordering)
   * Property 7: Waitlist FIFO Ordering
   * Validates: Requirements 15.1, 15.2
   */
  async joinWaitlist(
    eventId: string,
    ticketId: string,
    userId: string,
  ): Promise<WaitlistEntry> {
    // Check if event has waitlist enabled
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { waitlistEnabled: true, status: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.waitlistEnabled) {
      throw new BadRequestException('Waitlist is not enabled for this event');
    }

    // Check if user is already on waitlist
    const existingEntry = await this.prisma.waitlistEntry.findUnique({
      where: {
        eventId_ticketId_userId: { eventId, ticketId, userId },
      },
    });

    if (existingEntry) {
      throw new BadRequestException('You are already on the waitlist for this ticket');
    }

    // Check if user already has a registration
    const existingRegistration = await this.prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId,
        status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.PENDING] },
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('You already have a registration for this event');
    }

    // Get next position (FIFO - highest position + 1)
    const lastEntry = await this.prisma.waitlistEntry.findFirst({
      where: { eventId, ticketId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    const nextPosition = (lastEntry?.position ?? 0) + 1;

    // Create waitlist entry
    const entry = await this.prisma.waitlistEntry.create({
      data: {
        eventId,
        ticketId,
        userId,
        position: nextPosition,
        status: WaitlistStatus.WAITING,
      },
    });

    this.logger.log(
      `WAITLIST_JOIN: User ${userId} joined waitlist for ticket ${ticketId} at position ${nextPosition}`,
    );

    return entry;
  }

  /**
   * Leave waitlist
   * Validates: Requirements 15.1
   */
  async leaveWaitlist(
    eventId: string,
    ticketId: string,
    userId: string,
  ): Promise<void> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: {
        eventId_ticketId_userId: { eventId, ticketId, userId },
      },
    });

    if (!entry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    await this.prisma.waitlistEntry.delete({
      where: { id: entry.id },
    });

    // Reorder positions for remaining entries
    await this.reorderPositions(eventId, ticketId);

    this.logger.log(
      `WAITLIST_LEAVE: User ${userId} left waitlist for ticket ${ticketId}`,
    );
  }

  /**
   * Get user's waitlist position
   * Validates: Requirements 15.7
   */
  async getPosition(
    eventId: string,
    ticketId: string,
    userId: string,
  ): Promise<{ position: number; status: WaitlistStatus } | null> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: {
        eventId_ticketId_userId: { eventId, ticketId, userId },
      },
      select: { position: true, status: true },
    });

    return entry;
  }

  /**
   * Get waitlist for a ticket
   */
  async getWaitlist(
    eventId: string,
    ticketId: string,
  ): Promise<WaitlistEntryWithUser[]> {
    const entries = await this.prisma.waitlistEntry.findMany({
      where: { eventId, ticketId },
      orderBy: { position: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { fullName: true },
            },
          },
        },
        ticket: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });
    
    // Transform to match expected type
    return entries.map(e => ({
      ...e,
      user: {
        id: e.user.id,
        fullName: e.user.profile?.fullName || 'Unknown',
        email: e.user.email || '',
      },
    })) as WaitlistEntryWithUser[];
  }

  /**
   * Notify next user in waitlist when ticket becomes available
   * Property 7: Waitlist FIFO Ordering
   * Validates: Requirements 15.2, 15.3
   */
  async notifyNextInLine(eventId: string, ticketId: string): Promise<WaitlistEntry | null> {
    // Get the first WAITING entry (lowest position = first in line)
    const nextEntry = await this.prisma.waitlistEntry.findFirst({
      where: {
        eventId,
        ticketId,
        status: WaitlistStatus.WAITING,
      },
      orderBy: { position: 'asc' },
      include: {
        event: { select: { title: true } },
        ticket: { select: { name: true } },
      },
    });

    if (!nextEntry) {
      return null;
    }

    // Calculate expiry time
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + CLAIM_EXPIRY_HOURS);

    // Update entry to NOTIFIED
    const updatedEntry = await this.prisma.waitlistEntry.update({
      where: { id: nextEntry.id },
      data: {
        status: WaitlistStatus.NOTIFIED,
        notifiedAt: new Date(),
        expiresAt,
      },
    });

    // Create notification
    await this.prisma.notification.create({
      data: {
        userId: nextEntry.userId,
        type: NotificationType.EVENT,
        title: 'Ticket Available!',
        message: `A ticket for "${nextEntry.event.title}" (${nextEntry.ticket.name}) is now available. Claim it within ${CLAIM_EXPIRY_HOURS} hours before it expires.`,
        actionUrl: `/events/${eventId}`,
      },
    });

    this.logger.log(
      `WAITLIST_NOTIFY: Notified user ${nextEntry.userId} about available ticket ${ticketId}`,
    );

    return updatedEntry;
  }

  /**
   * Claim ticket from waitlist
   * Validates: Requirements 15.4, 15.5
   */
  async claimTicket(
    eventId: string,
    ticketId: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const entry = await this.prisma.waitlistEntry.findUnique({
      where: {
        eventId_ticketId_userId: { eventId, ticketId, userId },
      },
    });

    if (!entry) {
      throw new NotFoundException('Waitlist entry not found');
    }

    if (entry.status !== WaitlistStatus.NOTIFIED) {
      throw new BadRequestException(
        entry.status === WaitlistStatus.WAITING
          ? 'You have not been notified yet. Please wait for your turn.'
          : `Cannot claim ticket. Current status: ${entry.status}`,
      );
    }

    // Check if claim has expired
    if (entry.expiresAt && new Date() > entry.expiresAt) {
      // Mark as expired and notify next person
      await this.prisma.waitlistEntry.update({
        where: { id: entry.id },
        data: { status: WaitlistStatus.EXPIRED },
      });

      // Notify next in line
      await this.notifyNextInLine(eventId, ticketId);

      throw new BadRequestException('Your claim window has expired');
    }

    // Mark as claimed
    await this.prisma.waitlistEntry.update({
      where: { id: entry.id },
      data: { status: WaitlistStatus.CLAIMED },
    });

    this.logger.log(
      `WAITLIST_CLAIM: User ${userId} claimed ticket ${ticketId} from waitlist`,
    );

    return {
      success: true,
      message: 'Ticket claimed successfully. Please complete your registration.',
    };
  }

  /**
   * Process expired waitlist claims - runs every 15 minutes
   * Validates: Requirements 15.5, 15.6
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async processExpiredClaims(): Promise<void> {
    const now = new Date();

    // Find all expired NOTIFIED entries
    const expiredEntries = await this.prisma.waitlistEntry.findMany({
      where: {
        status: WaitlistStatus.NOTIFIED,
        expiresAt: { lt: now },
      },
    });

    for (const entry of expiredEntries) {
      try {
        // Mark as expired
        await this.prisma.waitlistEntry.update({
          where: { id: entry.id },
          data: { status: WaitlistStatus.EXPIRED },
        });

        // Notify next in line
        await this.notifyNextInLine(entry.eventId, entry.ticketId);

        this.logger.log(
          `WAITLIST_EXPIRED: Entry ${entry.id} expired, notified next in line`,
        );
      } catch (error) {
        this.logger.error(`Failed to process expired entry ${entry.id}:`, error);
      }
    }
  }

  /**
   * Called when a ticket becomes available (e.g., cancellation)
   * Validates: Requirements 15.3
   */
  async onTicketAvailable(eventId: string, ticketId: string): Promise<void> {
    // Check if there's anyone waiting
    const waitingCount = await this.prisma.waitlistEntry.count({
      where: {
        eventId,
        ticketId,
        status: WaitlistStatus.WAITING,
      },
    });

    if (waitingCount > 0) {
      await this.notifyNextInLine(eventId, ticketId);
    }
  }

  /**
   * Get waitlist statistics for an event
   */
  async getWaitlistStats(eventId: string): Promise<{
    totalWaiting: number;
    totalNotified: number;
    totalClaimed: number;
    totalExpired: number;
    byTicket: Array<{
      ticketId: string;
      ticketName: string;
      waiting: number;
    }>;
  }> {
    const [waiting, notified, claimed, expired, byTicket] = await Promise.all([
      this.prisma.waitlistEntry.count({
        where: { eventId, status: WaitlistStatus.WAITING },
      }),
      this.prisma.waitlistEntry.count({
        where: { eventId, status: WaitlistStatus.NOTIFIED },
      }),
      this.prisma.waitlistEntry.count({
        where: { eventId, status: WaitlistStatus.CLAIMED },
      }),
      this.prisma.waitlistEntry.count({
        where: { eventId, status: WaitlistStatus.EXPIRED },
      }),
      this.prisma.waitlistEntry.groupBy({
        by: ['ticketId'],
        where: { eventId, status: WaitlistStatus.WAITING },
        _count: true,
      }),
    ]);

    // Get ticket names
    const ticketIds = byTicket.map((t) => t.ticketId);
    const tickets = await this.prisma.ticketType.findMany({
      where: { id: { in: ticketIds } },
      select: { id: true, name: true },
    });

    const ticketMap = new Map(tickets.map((t) => [t.id, t.name]));

    return {
      totalWaiting: waiting,
      totalNotified: notified,
      totalClaimed: claimed,
      totalExpired: expired,
      byTicket: byTicket.map((t) => ({
        ticketId: t.ticketId,
        ticketName: ticketMap.get(t.ticketId) || 'Unknown',
        waiting: t._count,
      })),
    };
  }

  /**
   * Reorder positions after someone leaves
   */
  private async reorderPositions(eventId: string, ticketId: string): Promise<void> {
    const entries = await this.prisma.waitlistEntry.findMany({
      where: { eventId, ticketId },
      orderBy: { position: 'asc' },
      select: { id: true },
    });

    // Update positions sequentially
    for (let i = 0; i < entries.length; i++) {
      await this.prisma.waitlistEntry.update({
        where: { id: entries[i].id },
        data: { position: i + 1 },
      });
    }
  }
}
