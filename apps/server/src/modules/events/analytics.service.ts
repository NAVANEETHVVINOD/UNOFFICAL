import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrationStatus, EventLifecycleStatus } from '@prisma/client';

/**
 * Analytics data types - exported for controller type inference
 */
export interface EventMetrics {
  totalRegistrations: number;
  confirmedRegistrations: number;
  checkedIn: number;
  totalRevenue: number;
  conversionRate: number;
  attendancePercentage: number;
  waitlistConversionRate: number;
}

export interface RegistrationTimeline {
  date: string;
  count: number;
  cumulative: number;
}

export interface TicketBreakdown {
  ticketId: string;
  ticketName: string;
  sold: number;
  total: number | null;
  revenue: number;
  percentage: number;
}

export interface DropOffFunnel {
  stage: string;
  count: number;
  percentage: number;
}

export interface DailyAttendance {
  day: number;
  date: string;
  checkedIn: number;
  total: number;
  percentage: number;
}

/**
 * AnalyticsService provides event analytics and metrics
 * Validates: Requirements 10.3-10.8
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}


  /**
   * Get key metrics for an event
   * Validates: Requirements 10.3, 10.4, 10.5
   */
  async getEventMetrics(eventId: string): Promise<EventMetrics> {
    const [registrations, waitlistEntries, event] = await Promise.all([
      this.prisma.eventRegistration.findMany({
        where: { eventId, deletedAt: null },
        select: {
          status: true,
          checkInTime: true,
          amountPaid: true,
        },
      }),
      this.prisma.waitlistEntry.findMany({
        where: { eventId },
        select: { status: true },
      }),
      this.prisma.event.findUnique({
        where: { id: eventId },
        select: {
          TicketType: {
            select: { quantity: true },
          },
        },
      }),
    ]);

    const totalRegistrations = registrations.length;
    const confirmedRegistrations = registrations.filter(
      (r) => r.status === RegistrationStatus.CONFIRMED || r.status === RegistrationStatus.ATTENDED,
    ).length;
    const checkedIn = registrations.filter((r) => r.checkInTime !== null).length;
    const totalRevenue = registrations
      .filter((r) => r.status !== RegistrationStatus.REFUNDED)
      .reduce((sum, r) => sum + (r.amountPaid || 0), 0);

    // Calculate total capacity
    const totalCapacity = event?.TicketType.reduce((sum, t) => sum + (t.quantity || 0), 0) || 0;

    // Conversion rate: confirmed / total registrations
    const conversionRate = totalRegistrations > 0
      ? (confirmedRegistrations / totalRegistrations) * 100
      : 0;

    // Attendance percentage: checked in / confirmed
    const attendancePercentage = confirmedRegistrations > 0
      ? (checkedIn / confirmedRegistrations) * 100
      : 0;

    // Waitlist conversion: claimed / total waitlist
    const claimedWaitlist = waitlistEntries.filter((w) => w.status === 'CLAIMED').length;
    const waitlistConversionRate = waitlistEntries.length > 0
      ? (claimedWaitlist / waitlistEntries.length) * 100
      : 0;

    return {
      totalRegistrations,
      confirmedRegistrations,
      checkedIn,
      totalRevenue,
      conversionRate: Math.round(conversionRate * 100) / 100,
      attendancePercentage: Math.round(attendancePercentage * 100) / 100,
      waitlistConversionRate: Math.round(waitlistConversionRate * 100) / 100,
    };
  }

  /**
   * Get registration timeline data for charts
   * Validates: Requirement 10.6
   */
  async getRegistrationTimeline(
    eventId: string,
    days: number = 30,
  ): Promise<RegistrationTimeline[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        createdAt: { gte: startDate },
        deletedAt: null,
      },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by date
    const dateMap = new Map<string, number>();
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dateMap.set(date.toISOString().split('T')[0], 0);
    }

    for (const reg of registrations) {
      const dateKey = reg.createdAt.toISOString().split('T')[0];
      if (dateMap.has(dateKey)) {
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
      }
    }

    // Convert to timeline with cumulative
    const timeline: RegistrationTimeline[] = [];
    let cumulative = 0;
    for (const [date, count] of dateMap) {
      cumulative += count;
      timeline.push({ date, count, cumulative });
    }

    return timeline;
  }

  /**
   * Get ticket type breakdown
   * Validates: Requirement 10.7
   */
  async getTicketBreakdown(eventId: string): Promise<TicketBreakdown[]> {
    const tickets = await this.prisma.ticketType.findMany({
      where: { eventId },
      include: {
        EventRegistration: {
          where: {
            status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
            deletedAt: null,
          },
          select: { amountPaid: true },
        },
      },
    });

    const totalSold = tickets.reduce((sum, t) => sum + t.EventRegistration.length, 0);

    return tickets.map((ticket) => ({
      ticketId: ticket.id,
      ticketName: ticket.name,
      sold: ticket.EventRegistration.length,
      total: ticket.quantity,
      revenue: ticket.EventRegistration.reduce((sum, r) => sum + (r.amountPaid || 0), 0),
      percentage: totalSold > 0
        ? Math.round((ticket.EventRegistration.length / totalSold) * 100 * 100) / 100
        : 0,
    }));
  }

  /**
   * Get drop-off funnel data
   * Validates: Requirement 10.8
   */
  async getDropOffFunnel(eventId: string): Promise<DropOffFunnel[]> {
    const [
      pageViews,
      registrationStarts,
      registrations,
      payments,
      confirmed,
      checkedIn,
    ] = await Promise.all([
      // Page views would come from analytics tracking - using registrations as proxy
      this.prisma.eventRegistration.count({
        where: { eventId, deletedAt: null },
      }),
      // Registration starts (all statuses)
      this.prisma.eventRegistration.count({
        where: { eventId, deletedAt: null },
      }),
      // Completed registrations (pending + confirmed + attended)
      this.prisma.eventRegistration.count({
        where: {
          eventId,
          status: { in: [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
          deletedAt: null,
        },
      }),
      // Payments completed
      this.prisma.eventRegistration.count({
        where: {
          eventId,
          status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
          amountPaid: { gt: 0 },
          deletedAt: null,
        },
      }),
      // Confirmed registrations
      this.prisma.eventRegistration.count({
        where: {
          eventId,
          status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
          deletedAt: null,
        },
      }),
      // Checked in
      this.prisma.eventRegistration.count({
        where: {
          eventId,
          checkInTime: { not: null },
          deletedAt: null,
        },
      }),
    ]);

    const baseCount = Math.max(registrationStarts, 1);

    return [
      {
        stage: 'Registration Started',
        count: registrationStarts,
        percentage: 100,
      },
      {
        stage: 'Form Completed',
        count: registrations,
        percentage: Math.round((registrations / baseCount) * 100 * 100) / 100,
      },
      {
        stage: 'Payment Completed',
        count: payments || confirmed, // Use confirmed if no payments (free event)
        percentage: Math.round(((payments || confirmed) / baseCount) * 100 * 100) / 100,
      },
      {
        stage: 'Confirmed',
        count: confirmed,
        percentage: Math.round((confirmed / baseCount) * 100 * 100) / 100,
      },
      {
        stage: 'Checked In',
        count: checkedIn,
        percentage: Math.round((checkedIn / baseCount) * 100 * 100) / 100,
      },
    ];
  }

  /**
   * Get daily attendance for multi-day events
   * Validates: Requirement 20.6
   */
  async getDailyAttendance(eventId: string): Promise<DailyAttendance[]> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        startsAt: true,
        endsAt: true,
        EventRegistration: {
          where: {
            status: RegistrationStatus.ATTENDED,
            checkInTime: { not: null },
            deletedAt: null,
          },
          select: {
            checkInTime: true,
            checkInDay: true,
          },
        },
      },
    });

    if (!event) return [];

    // Calculate number of days
    const startDate = new Date(event.startsAt);
    const endDate = new Date(event.endsAt);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const numDays = Math.max(1, daysDiff);

    const totalRegistrations = event.EventRegistration.length;
    const dailyData: DailyAttendance[] = [];

    for (let day = 1; day <= numDays; day++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + day - 1);

      const checkedInOnDay = event.EventRegistration.filter((r) => {
        if (r.checkInDay === day) return true;
        if (r.checkInTime) {
          const checkInDate = new Date(r.checkInTime);
          return checkInDate.toDateString() === dayDate.toDateString();
        }
        return false;
      }).length;

      dailyData.push({
        day,
        date: dayDate.toISOString().split('T')[0],
        checkedIn: checkedInOnDay,
        total: totalRegistrations,
        percentage: totalRegistrations > 0
          ? Math.round((checkedInOnDay / totalRegistrations) * 100 * 100) / 100
          : 0,
      });
    }

    return dailyData;
  }

  /**
   * Get comprehensive analytics summary
   */
  async getAnalyticsSummary(eventId: string): Promise<{
    metrics: EventMetrics;
    timeline: RegistrationTimeline[];
    ticketBreakdown: TicketBreakdown[];
    funnel: DropOffFunnel[];
    dailyAttendance: DailyAttendance[];
  }> {
    const [metrics, timeline, ticketBreakdown, funnel, dailyAttendance] = await Promise.all([
      this.getEventMetrics(eventId),
      this.getRegistrationTimeline(eventId),
      this.getTicketBreakdown(eventId),
      this.getDropOffFunnel(eventId),
      this.getDailyAttendance(eventId),
    ]);

    return {
      metrics,
      timeline,
      ticketBreakdown,
      funnel,
      dailyAttendance,
    };
  }
}
