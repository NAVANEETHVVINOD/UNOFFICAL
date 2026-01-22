import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventLifecycleStatus, Event, NotificationType, RegistrationStatus } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';

/**
 * Valid state transitions for the Event Lifecycle State Machine
 * Property 6: Event Lifecycle State Machine
 * Validates: Requirements 11.1-11.7
 * 
 * Valid transitions:
 * - DRAFT → PUBLISHED (manual)
 * - PUBLISHED → REGISTRATION_CLOSED (auto on deadline or manual)
 * - PUBLISHED → CANCELLED (manual)
 * - REGISTRATION_CLOSED → ONGOING (auto on start time)
 * - REGISTRATION_CLOSED → CANCELLED (manual)
 * - ONGOING → COMPLETED (auto on end time)
 * - ONGOING → CANCELLED (manual)
 * - COMPLETED → ARCHIVED (manual)
 */
const VALID_TRANSITIONS: Record<EventLifecycleStatus, EventLifecycleStatus[]> = {
  [EventLifecycleStatus.DRAFT]: [EventLifecycleStatus.PUBLISHED],
  [EventLifecycleStatus.PUBLISHED]: [
    EventLifecycleStatus.REGISTRATION_CLOSED,
    EventLifecycleStatus.CANCELLED,
  ],
  [EventLifecycleStatus.REGISTRATION_CLOSED]: [
    EventLifecycleStatus.ONGOING,
    EventLifecycleStatus.CANCELLED,
  ],
  [EventLifecycleStatus.ONGOING]: [
    EventLifecycleStatus.COMPLETED,
    EventLifecycleStatus.CANCELLED,
  ],
  [EventLifecycleStatus.COMPLETED]: [EventLifecycleStatus.ARCHIVED],
  [EventLifecycleStatus.CANCELLED]: [], // Terminal state
  [EventLifecycleStatus.ARCHIVED]: [], // Terminal state
};

/**
 * State transition result
 */
export interface StateTransitionResult {
  success: boolean;
  previousStatus: EventLifecycleStatus;
  newStatus: EventLifecycleStatus;
  event?: Event;
  error?: string;
}

@Injectable()
export class LifecycleService {
  private readonly logger = new Logger(LifecycleService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Check if a state transition is valid
   * Property 6: Event Lifecycle State Machine
   */
  isValidTransition(
    currentStatus: EventLifecycleStatus,
    targetStatus: EventLifecycleStatus,
  ): boolean {
    const validTargets = VALID_TRANSITIONS[currentStatus] || [];
    return validTargets.includes(targetStatus);
  }

  /**
   * Get valid next states for a given status
   */
  getValidNextStates(currentStatus: EventLifecycleStatus): EventLifecycleStatus[] {
    return VALID_TRANSITIONS[currentStatus] || [];
  }

  /**
   * Transition an event to a new status
   * Property 6: Event Lifecycle State Machine
   * Validates: Requirements 11.1-11.7
   */
  async transitionTo(
    eventId: string,
    targetStatus: EventLifecycleStatus,
    reason?: string,
  ): Promise<StateTransitionResult> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    const currentStatus = event.status;

    // Validate transition
    if (!this.isValidTransition(currentStatus, targetStatus)) {
      return {
        success: false,
        previousStatus: currentStatus,
        newStatus: currentStatus,
        error: `Invalid transition from ${currentStatus} to ${targetStatus}`,
      };
    }

    // Perform transition
    const updatedEvent = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        status: targetStatus,
        ...(reason && targetStatus === EventLifecycleStatus.CANCELLED
          ? { rejectionReason: reason }
          : {}),
      },
      include: {
        TicketType: true,
        College: true,
        Club: true,
      },
    });

    this.logger.log(
      `EVENT_LIFECYCLE: Event ${eventId} transitioned from ${currentStatus} to ${targetStatus}`,
    );

    return {
      success: true,
      previousStatus: currentStatus,
      newStatus: targetStatus,
      event: updatedEvent,
    };
  }

  /**
   * Publish an event (DRAFT → PUBLISHED)
   * Validates: Requirements 11.1
   */
  async publish(eventId: string): Promise<StateTransitionResult> {
    return this.transitionTo(eventId, EventLifecycleStatus.PUBLISHED);
  }

  /**
   * Close registration (PUBLISHED → REGISTRATION_CLOSED)
   * Validates: Requirements 11.2
   */
  async closeRegistration(eventId: string): Promise<StateTransitionResult> {
    return this.transitionTo(eventId, EventLifecycleStatus.REGISTRATION_CLOSED);
  }

  /**
   * Start event (REGISTRATION_CLOSED → ONGOING)
   * Validates: Requirements 11.3
   */
  async startEvent(eventId: string): Promise<StateTransitionResult> {
    return this.transitionTo(eventId, EventLifecycleStatus.ONGOING);
  }

  /**
   * Complete event (ONGOING → COMPLETED)
   * Validates: Requirements 11.4
   */
  async completeEvent(eventId: string): Promise<StateTransitionResult> {
    return this.transitionTo(eventId, EventLifecycleStatus.COMPLETED);
  }

  /**
   * Archive event (COMPLETED → ARCHIVED)
   * Validates: Requirements 11.5
   */
  async archiveEvent(eventId: string): Promise<StateTransitionResult> {
    return this.transitionTo(eventId, EventLifecycleStatus.ARCHIVED);
  }

  /**
   * Cancel event (from PUBLISHED, REGISTRATION_CLOSED, or ONGOING → CANCELLED)
   * Validates: Requirements 11.7
   * Notifies all registrants and handles refund processing (v2)
   */
  async cancelEvent(eventId: string, reason: string): Promise<StateTransitionResult> {
    if (!reason || reason.trim().length < 3) {
      throw new BadRequestException('Cancellation reason is required');
    }

    // Get event details for notification
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        title: true,
        status: true,
        deletedAt: true,
      },
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    // Perform the transition
    const result = await this.transitionTo(eventId, EventLifecycleStatus.CANCELLED, reason);

    if (result.success) {
      // Notify all registrants about cancellation
      await this.notifyRegistrantsOfCancellation(eventId, event.title, reason);
    }

    return result;
  }

  /**
   * Notify all registrants about event cancellation
   * Validates: Requirements 11.7
   */
  private async notifyRegistrantsOfCancellation(
    eventId: string,
    eventTitle: string,
    reason: string,
  ): Promise<void> {
    // Get all confirmed registrations
    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
        deletedAt: null,
      },
      select: {
        userId: true,
        amountPaid: true,
      },
    });

    this.logger.log(
      `CANCELLATION_NOTIFY: Notifying ${registrations.length} registrants about cancellation of event ${eventId}`,
    );

    // Create notifications for all registrants
    const notifications = registrations.map((reg) => ({
      id: randomUUID(),
      userId: reg.userId,
      type: NotificationType.EVENT,
      title: 'Event Cancelled',
      message: `"${eventTitle}" has been cancelled. Reason: ${reason}${
        reg.amountPaid && reg.amountPaid > 0
          ? '. Refund processing will be handled separately.'
          : ''
      }`,
      actionUrl: `/events/${eventId}`,
    }));

    // Batch create notifications
    if (notifications.length > 0) {
      await this.prisma.notification.createMany({
        data: notifications,
      });
    }

    // Update registration statuses to CANCELLED
    await this.prisma.eventRegistration.updateMany({
      where: {
        eventId,
        status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
      },
      data: {
        status: RegistrationStatus.CANCELLED,
      },
    });

    // Note: Refund processing is not supported in v1 per spec
    // In v2, we would process refunds here for paid registrations
  }

  /**
   * Automatic lifecycle transitions - runs every minute
   * Handles:
   * - PUBLISHED → REGISTRATION_CLOSED (when registration deadline passes)
   * - REGISTRATION_CLOSED → ONGOING (when event starts)
   * - ONGOING → COMPLETED (when event ends)
   * Validates: Requirements 11.2, 11.3, 11.4
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processAutomaticTransitions(): Promise<void> {
    const now = new Date();

    // Close registration for events past their registration deadline
    await this.closeRegistrationForPastDeadlines(now);

    // Start events that have begun
    await this.startEventsAtStartTime(now);

    // Complete events that have ended
    await this.completeEventsAtEndTime(now);
  }

  /**
   * Close registration for events past their deadline
   * Uses ticket salesEnd as registration deadline
   */
  private async closeRegistrationForPastDeadlines(now: Date): Promise<void> {
    // Find published events where all tickets have salesEnd in the past
    const eventsToClose = await this.prisma.event.findMany({
      where: {
        status: EventLifecycleStatus.PUBLISHED,
        deletedAt: null,
        // Event hasn't started yet but registration should close
        startsAt: { gt: now },
        TicketType: {
          every: {
            OR: [
              { salesEnd: { lt: now } },
              { salesEnd: null }, // If no salesEnd, use event start time
            ],
          },
        },
      },
      include: {
        TicketType: {
          select: { salesEnd: true },
        },
      },
    });

    // Also close registration for events about to start (within 1 hour)
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const eventsAboutToStart = await this.prisma.event.findMany({
      where: {
        status: EventLifecycleStatus.PUBLISHED,
        deletedAt: null,
        startsAt: { lte: oneHourFromNow, gt: now },
      },
    });

    const allEventsToClose = [...eventsToClose, ...eventsAboutToStart];
    const uniqueEvents = [...new Map(allEventsToClose.map(e => [e.id, e])).values()];

    for (const event of uniqueEvents) {
      try {
        await this.transitionTo(event.id, EventLifecycleStatus.REGISTRATION_CLOSED);
        this.logger.log(`AUTO_TRANSITION: Closed registration for event ${event.id}`);
      } catch (error) {
        this.logger.error(`Failed to close registration for event ${event.id}:`, error);
      }
    }
  }

  /**
   * Start events that have reached their start time
   */
  private async startEventsAtStartTime(now: Date): Promise<void> {
    const eventsToStart = await this.prisma.event.findMany({
      where: {
        status: EventLifecycleStatus.REGISTRATION_CLOSED,
        deletedAt: null,
        startsAt: { lte: now },
        endsAt: { gt: now },
      },
    });

    for (const event of eventsToStart) {
      try {
        await this.transitionTo(event.id, EventLifecycleStatus.ONGOING);
        this.logger.log(`AUTO_TRANSITION: Started event ${event.id}`);
      } catch (error) {
        this.logger.error(`Failed to start event ${event.id}:`, error);
      }
    }
  }

  /**
   * Complete events that have reached their end time
   */
  private async completeEventsAtEndTime(now: Date): Promise<void> {
    const eventsToComplete = await this.prisma.event.findMany({
      where: {
        status: EventLifecycleStatus.ONGOING,
        deletedAt: null,
        endsAt: { lte: now },
      },
    });

    for (const event of eventsToComplete) {
      try {
        await this.transitionTo(event.id, EventLifecycleStatus.COMPLETED);
        this.logger.log(`AUTO_TRANSITION: Completed event ${event.id}`);
      } catch (error) {
        this.logger.error(`Failed to complete event ${event.id}:`, error);
      }
    }
  }

  /**
   * Get current lifecycle status for an event
   */
  async getStatus(eventId: string): Promise<{
    status: EventLifecycleStatus;
    validNextStates: EventLifecycleStatus[];
    isTerminal: boolean;
  }> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { status: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const validNextStates = this.getValidNextStates(event.status);

    return {
      status: event.status,
      validNextStates,
      isTerminal: validNextStates.length === 0,
    };
  }
}
