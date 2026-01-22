import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType, EventLifecycleStatus, RegistrationStatus } from '@prisma/client';
import { randomUUID } from 'crypto';

/**
 * EventNotificationService handles all event-related notifications
 * Validates: Requirements 12.1-12.6, 16.1-16.6
 */
@Injectable()
export class EventNotificationService {
  private readonly logger = new Logger(EventNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Send registration confirmation notification
   * Validates: Requirement 12.1, 21.3 (no-refund reminder)
   */
  async sendRegistrationConfirmation(
    registrationId: string,
    eventId: string,
    userId: string,
  ): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true, startsAt: true, venue: true },
    });

    if (!event) return;

    // Check if this is a paid registration
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        TicketType: { select: { price: true } },
      },
    });

    const isPaidTicket = registration?.TicketType?.price && registration.TicketType.price > 0;

    const formattedDate = event.startsAt.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Include no-refund reminder for paid tickets (Requirement 21.3)
    const noRefundReminder = isPaidTicket 
      ? ' Note: This event does not support refunds.' 
      : '';

    await this.notificationsService.createNotification({
      userId,
      type: NotificationType.EVENT,
      title: 'Registration Confirmed',
      message: `You're registered for "${event.title}" on ${formattedDate}${event.venue ? ` at ${event.venue}` : ''}.${noRefundReminder}`,
      actionUrl: `/events/${eventId}`,
    });
  }

  /**
   * Send 24-hour reminder notification
   * Validates: Requirement 12.2
   * Runs every hour to check for events starting in ~24 hours
   */
  @Cron(CronExpression.EVERY_HOUR)
  async sendEventReminders(): Promise<void> {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in25Hours = new Date(now.getTime() + 25 * 60 * 60 * 1000);

    // Find events starting in 24-25 hours
    const upcomingEvents = await this.prisma.event.findMany({
      where: {
        status: { in: [EventLifecycleStatus.PUBLISHED, EventLifecycleStatus.REGISTRATION_CLOSED] },
        startsAt: { gte: in24Hours, lt: in25Hours },
        deletedAt: null,
      },
      include: {
        EventRegistration: {
          where: {
            status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
            deletedAt: null,
          },
          select: { userId: true },
        },
      },
    });

    for (const event of upcomingEvents) {
      const formattedTime = event.startsAt.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });

      for (const registration of event.EventRegistration) {
        try {
          await this.notificationsService.createNotification({
            userId: registration.userId,
            type: NotificationType.EVENT,
            title: 'Event Tomorrow',
            message: `Reminder: "${event.title}" starts tomorrow at ${formattedTime}${event.venue ? ` at ${event.venue}` : ''}.`,
            actionUrl: `/events/${event.id}`,
          });
        } catch (error) {
          this.logger.error(`Failed to send reminder to user ${registration.userId}`, error);
        }
      }

      this.logger.log(`Sent ${event.EventRegistration.length} reminders for event ${event.id}`);
    }
  }


  /**
   * Send event update notification to all registrants
   * Validates: Requirement 12.3
   */
  async sendEventUpdate(
    eventId: string,
    updateType: 'time' | 'venue' | 'details',
    details?: string,
  ): Promise<number> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        EventRegistration: {
          where: {
            status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
            deletedAt: null,
          },
          select: { userId: true },
        },
      },
    });

    if (!event) return 0;

    const updateMessages: Record<string, string> = {
      time: `The time for "${event.title}" has been updated.`,
      venue: `The venue for "${event.title}" has been changed.`,
      details: `"${event.title}" has been updated. ${details || 'Check the event page for details.'}`,
    };

    let sentCount = 0;
    for (const registration of event.EventRegistration) {
      try {
        await this.notificationsService.createNotification({
          userId: registration.userId,
          type: NotificationType.EVENT,
          title: 'Event Updated',
          message: updateMessages[updateType],
          actionUrl: `/events/${eventId}`,
        });
        sentCount++;
      } catch (error) {
        this.logger.error(`Failed to send update to user ${registration.userId}`, error);
      }
    }

    return sentCount;
  }

  /**
   * Send cancellation notification to all registrants
   * Validates: Requirement 12.4
   */
  async sendCancellationNotification(
    eventId: string,
    reason?: string,
  ): Promise<number> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        EventRegistration: {
          where: {
            status: { in: [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED] },
            deletedAt: null,
          },
          select: { userId: true },
        },
      },
    });

    if (!event) return 0;

    let sentCount = 0;
    for (const registration of event.EventRegistration) {
      try {
        await this.notificationsService.createNotification({
          userId: registration.userId,
          type: NotificationType.EVENT,
          title: 'Event Cancelled',
          message: `"${event.title}" has been cancelled.${reason ? ` Reason: ${reason}` : ''} If you made a payment, a refund will be processed.`,
          actionUrl: `/events/${eventId}`,
        });
        sentCount++;
      } catch (error) {
        this.logger.error(`Failed to send cancellation to user ${registration.userId}`, error);
      }
    }

    return sentCount;
  }

  /**
   * Send certificate issuance notification
   * Validates: Requirement 12.5
   */
  async sendCertificateNotification(
    eventId: string,
    userId: string,
    certificateId: string,
  ): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true },
    });

    if (!event) return;

    await this.notificationsService.createNotification({
      userId,
      type: NotificationType.EVENT,
      title: 'Certificate Issued',
      message: `Your certificate for "${event.title}" is ready! Download it from your profile.`,
      actionUrl: `/events/${eventId}/certificates`,
    });
  }

  /**
   * Send waitlist notification when spot becomes available
   * Validates: Requirement 15.4
   */
  async sendWaitlistNotification(
    eventId: string,
    userId: string,
    ticketName: string,
    expiresAt: Date,
  ): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true },
    });

    if (!event) return;

    const expiryTime = expiresAt.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    await this.notificationsService.createNotification({
      userId,
      type: NotificationType.EVENT,
      title: 'Spot Available!',
      message: `A ${ticketName} ticket for "${event.title}" is now available! Claim it before ${expiryTime}.`,
      actionUrl: `/events/${eventId}`,
    });
  }

  /**
   * Send organizer message to target audience
   * Validates: Requirements 16.1-16.6
   */
  async sendOrganizerMessage(
    eventId: string,
    senderId: string,
    targetAudience: 'ALL_REGISTRANTS' | 'CHECKED_IN' | 'VOLUNTEERS' | 'HEADS',
    subject: string,
    body: string,
  ): Promise<{ success: boolean; sentCount: number; error?: string }> {
    // Check rate limit (3 messages per day per event)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const messageCount = await this.prisma.eventMessage.count({
      where: {
        eventId,
        createdAt: { gte: today },
      },
    });

    if (messageCount >= 3) {
      return {
        success: false,
        sentCount: 0,
        error: 'Rate limit exceeded. Maximum 3 messages per day per event.',
      };
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true },
    });

    if (!event) {
      return { success: false, sentCount: 0, error: 'Event not found' };
    }

    // Get target users based on audience
    let userIds: string[] = [];

    switch (targetAudience) {
      case 'ALL_REGISTRANTS':
        const registrations = await this.prisma.eventRegistration.findMany({
          where: {
            eventId,
            status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
            deletedAt: null,
          },
          select: { userId: true },
        });
        userIds = registrations.map((r) => r.userId);
        break;

      case 'CHECKED_IN':
        const checkedIn = await this.prisma.eventRegistration.findMany({
          where: {
            eventId,
            status: RegistrationStatus.ATTENDED,
            checkInTime: { not: null },
            deletedAt: null,
          },
          select: { userId: true },
        });
        userIds = checkedIn.map((r) => r.userId);
        break;

      case 'VOLUNTEERS':
        const volunteers = await this.prisma.eventMemberRole.findMany({
          where: {
            eventId,
            role: 'VOLUNTEER',
          },
          select: { userId: true },
        });
        userIds = volunteers.map((r) => r.userId);
        break;

      case 'HEADS':
        const heads = await this.prisma.eventMemberRole.findMany({
          where: {
            eventId,
            role: 'HEAD',
          },
          select: { userId: true },
        });
        userIds = heads.map((r) => r.userId);
        break;
    }

    // Log the message
    await this.prisma.eventMessage.create({
      data: {
        id: randomUUID(),
        eventId,
        senderId,
        targetAudience,
        subject,
        body,
      },
    });

    // Send notifications
    let sentCount = 0;
    for (const userId of userIds) {
      try {
        await this.notificationsService.createNotification({
          userId,
          type: NotificationType.EVENT,
          title: subject,
          message: body,
          actionUrl: `/events/${eventId}`,
          actorId: senderId,
        });
        sentCount++;
      } catch (error) {
        this.logger.error(`Failed to send message to user ${userId}`, error);
      }
    }

    return { success: true, sentCount };
  }

  /**
   * Get message history for an event
   * Validates: Requirement 16.5
   */
  async getMessageHistory(eventId: string): Promise<any[]> {
    return this.prisma.eventMessage.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: {
        User: {
          select: {
            id: true,
            Profile: {
              select: { fullName: true },
            },
          },
        },
      },
    });
  }
}
