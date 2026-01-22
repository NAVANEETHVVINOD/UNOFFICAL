import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  Event,
  Prisma,
  EventLifecycleStatus,
  EventScope,
  EventVisibility,
  AttendanceMode,
} from '@prisma/client';
import { QrService } from './qr.service';
import {
  CreateEventDto,
  EventFiltersDto,
  EventScopeFilter,
  DateRangeFilter,
  PriceTypeFilter,
} from './dto';
import { randomUUID } from 'crypto';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private qrService: QrService,
  ) {}

  /**
   * Find all events with filters
   * Supports scope (campus/global), date range, price type, category, and search
   */
  async findAll(
    filters: EventFiltersDto,
    userId?: string,
    userCollegeId?: string,
  ): Promise<Event[]> {
    const take = filters.limit ? parseInt(filters.limit) : 20;
    const where: Prisma.EventWhereInput = {
      deletedAt: null, // Exclude soft-deleted events
      status: {
        in: [
          EventLifecycleStatus.PUBLISHED,
          EventLifecycleStatus.REGISTRATION_CLOSED,
          EventLifecycleStatus.ONGOING,
          EventLifecycleStatus.COMPLETED,
        ],
      },
    };

    // Scope filter (campus vs global)
    if (filters.scope === EventScopeFilter.COLLEGE && userCollegeId) {
      where.collegeId = userCollegeId;
    } else if (filters.scope === EventScopeFilter.GLOBAL) {
      where.visibility = EventVisibility.PUBLIC;
    } else if (filters.collegeSlug) {
      where.College = { slug: filters.collegeSlug };
    } else if (filters.collegeId) {
      where.collegeId = filters.collegeId;
    }

    // Date range filter
    const now = new Date();
    if (filters.dateRange === DateRangeFilter.TODAY) {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));
      where.startsAt = { gte: startOfDay, lte: endOfDay };
    } else if (filters.dateRange === DateRangeFilter.WEEK) {
      const endOfWeek = new Date(now);
      endOfWeek.setDate(endOfWeek.getDate() + 7);
      where.startsAt = { gte: now, lte: endOfWeek };
    } else if (filters.dateRange === DateRangeFilter.MONTH) {
      const endOfMonth = new Date(now);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      where.startsAt = { gte: now, lte: endOfMonth };
    } else {
      // Default: show upcoming events
      where.startsAt = { gte: new Date() };
    }

    // Price type filter
    if (filters.priceType === PriceTypeFilter.FREE) {
      where.TicketType = {
        some: { price: 0 },
      };
    } else if (filters.priceType === PriceTypeFilter.PAID) {
      where.TicketType = {
        some: { price: { gt: 0 } },
      };
    }

    // Category filter
    if (filters.category) {
      where.category = filters.category;
    }

    // Search filter (title, description, venue)
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { venue: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.event.findMany({
      take,
      skip: filters.cursor ? 1 : 0,
      cursor: filters.cursor ? { id: filters.cursor } : undefined,
      where,
      orderBy: { startsAt: 'asc' },
      include: {
        Club: true,
        College: true,
        User: {
          select: {
            id: true,
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
            quantity: true,
            quantitySold: true,
          },
        },
        _count: {
          select: {
            EventRegistration: {
              where: { status: 'CONFIRMED' },
            },
          },
        },
      },
    });
  }

  /**
   * Find events by scope (campus or global)
   */
  async findByScope(
    scope: 'global' | 'campus',
    collegeId?: string,
  ): Promise<Event[]> {
    const where: Prisma.EventWhereInput = {
      deletedAt: null,
      status: EventLifecycleStatus.PUBLISHED,
      startsAt: { gte: new Date() },
    };

    if (scope === 'campus' && collegeId) {
      where.collegeId = collegeId;
    } else if (scope === 'global') {
      where.visibility = EventVisibility.PUBLIC;
    }

    return this.prisma.event.findMany({
      where,
      orderBy: { startsAt: 'asc' },
      include: {
        Club: true,
        College: true,
        TicketType: true,
      },
    });
  }

  /**
   * Find a single event by ID
   */
  async findOne(id: string): Promise<Event | null> {
    return this.prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        Club: true,
        College: true,
        User: {
          select: {
            id: true,
            Profile: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        TicketType: true,
        EventAgendaBlock: {
          orderBy: [{ day: 'asc' }, { startTime: 'asc' }],
        },
        EventForm: true,
        EventMemberRole: {
          include: {
            User: {
              select: {
                id: true,
                Profile: {
                  select: {
                    fullName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            EventRegistration: {
              where: { status: 'CONFIRMED' },
            },
          },
        },
      },
    });
  }

  /**
   * Create a new event (starts as DRAFT)
   */
  async create(
    data: CreateEventDto,
    user: { id: string; role: string; collegeId?: string | null },
  ): Promise<Event> {
    const { tickets, agendaBlocks, collegeSlug, ...eventData } = data;

    // Determine college connection
    let collegeConnect: Prisma.CollegeCreateNestedOneWithoutEventInput | undefined;
    if (collegeSlug) {
      collegeConnect = { connect: { slug: collegeSlug } };
    } else if (data.collegeId) {
      collegeConnect = { connect: { id: data.collegeId } };
    } else if (user.collegeId) {
      collegeConnect = { connect: { id: user.collegeId } };
    }

    const event = await this.prisma.event.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        title: eventData.title,
        description: eventData.description,
        coverUrl: eventData.coverUrl,
        startsAt: new Date(eventData.startsAt),
        endsAt: new Date(eventData.endsAt),
        timezone: eventData.timezone || 'Asia/Kolkata',
        venue: eventData.venue,
        onlineLink: eventData.onlineLink,
        scope: (eventData.scope as EventScope) || EventScope.COLLEGE,
        category: eventData.category,
        visibility: (eventData.visibility as EventVisibility) || EventVisibility.PUBLIC,
        status: EventLifecycleStatus.DRAFT,
        waitlistEnabled: eventData.waitlistEnabled || false,
        attendanceMode: (eventData.attendanceMode as AttendanceMode) || AttendanceMode.SINGLE_SCAN,
        certificateEnabled: eventData.certificateEnabled || false,
        certificateTemplateId: eventData.certificateTemplateId,
        autoIssueCertificate: eventData.autoIssueCertificate || false,
        User: { connect: { id: user.id } },
        ...(collegeConnect ? { College: collegeConnect } : {}),
        ...(eventData.clubId ? { Club: { connect: { id: eventData.clubId } } } : {}),
        // Create tickets if provided
        ...(tickets && tickets.length > 0
          ? {
              TicketType: {
                create: tickets.map((t) => ({
                  id: randomUUID(),
                  name: t.name,
                  description: t.description,
                  price: t.price || 0,
                  quantity: t.quantity,
                  perUserLimit: t.perUserLimit || 1,
                  salesStart: t.salesStart ? new Date(t.salesStart) : null,
                  salesEnd: t.salesEnd ? new Date(t.salesEnd) : null,
                })),
              },
            }
          : {}),
        // Create agenda blocks if provided
        ...(agendaBlocks && agendaBlocks.length > 0
          ? {
              EventAgendaBlock: {
                create: agendaBlocks.map((a) => ({
                  id: randomUUID(),
                  day: a.day,
                  date: new Date(a.date),
                  startTime: new Date(a.startTime),
                  endTime: new Date(a.endTime),
                  title: a.title,
                  description: a.description,
                })),
              },
            }
          : {}),
      },
      include: {
        TicketType: true,
        EventAgendaBlock: true,
        College: true,
        Club: true,
      },
    });

    // Assign creator role
    await this.prisma.eventMemberRole.create({
      data: {
        id: randomUUID(),
        eventId: event.id,
        userId: user.id,
        role: 'CREATOR',
        assignedBy: user.id,
      },
    });

    return event;
  }

  /**
   * Update an existing event
   */
  async update(
    eventId: string,
    data: Partial<CreateEventDto>,
    userId: string,
  ): Promise<Event> {
    // Check permission
    const hasPermission = await this.hasPermission(eventId, userId, 'EDIT_EVENT');
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to edit this event');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    // Cannot edit cancelled or archived events
    if (
      event.status === EventLifecycleStatus.CANCELLED ||
      event.status === EventLifecycleStatus.ARCHIVED
    ) {
      throw new BadRequestException('Cannot edit cancelled or archived events');
    }

    const { tickets, agendaBlocks, collegeSlug, ...eventData } = data;

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...(eventData.title && { title: eventData.title }),
        ...(eventData.description !== undefined && { description: eventData.description }),
        ...(eventData.coverUrl !== undefined && { coverUrl: eventData.coverUrl }),
        ...(eventData.startsAt && { startsAt: new Date(eventData.startsAt) }),
        ...(eventData.endsAt && { endsAt: new Date(eventData.endsAt) }),
        ...(eventData.timezone && { timezone: eventData.timezone }),
        ...(eventData.venue !== undefined && { venue: eventData.venue }),
        ...(eventData.onlineLink !== undefined && { onlineLink: eventData.onlineLink }),
        ...(eventData.scope && { scope: eventData.scope as EventScope }),
        ...(eventData.category !== undefined && { category: eventData.category }),
        ...(eventData.visibility && { visibility: eventData.visibility as EventVisibility }),
        ...(eventData.waitlistEnabled !== undefined && { waitlistEnabled: eventData.waitlistEnabled }),
        ...(eventData.attendanceMode && { attendanceMode: eventData.attendanceMode as AttendanceMode }),
        ...(eventData.certificateEnabled !== undefined && { certificateEnabled: eventData.certificateEnabled }),
        ...(eventData.certificateTemplateId !== undefined && { certificateTemplateId: eventData.certificateTemplateId }),
        ...(eventData.autoIssueCertificate !== undefined && { autoIssueCertificate: eventData.autoIssueCertificate }),
      },
      include: {
        TicketType: true,
        EventAgendaBlock: true,
        College: true,
        Club: true,
      },
    });
  }

  /**
   * Delete an event (soft delete)
   * Only the creator can delete
   */
  async delete(eventId: string, userId: string): Promise<void> {
    const role = await this.getUserRole(eventId, userId);
    if (role !== 'CREATOR') {
      throw new ForbiddenException('Only the event creator can delete the event');
    }

    await this.prisma.event.update({
      where: { id: eventId },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Publish an event (DRAFT -> PUBLISHED)
   */
  async publish(eventId: string, userId: string): Promise<Event> {
    const hasPermission = await this.hasPermission(eventId, userId, 'EDIT_EVENT');
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to publish this event');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== EventLifecycleStatus.DRAFT) {
      throw new BadRequestException('Only draft events can be published');
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: { status: EventLifecycleStatus.PUBLISHED },
      include: { TicketType: true, College: true, Club: true },
    });
  }

  /**
   * Cancel an event
   */
  async cancel(eventId: string, userId: string, reason?: string): Promise<Event> {
    const hasPermission = await this.hasPermission(eventId, userId, 'EDIT_EVENT');
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to cancel this event');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    if (
      event.status === EventLifecycleStatus.CANCELLED ||
      event.status === EventLifecycleStatus.ARCHIVED
    ) {
      throw new BadRequestException('Event is already cancelled or archived');
    }

    // TODO: Notify all registrants and process refunds (in v2)

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        status: EventLifecycleStatus.CANCELLED,
        rejectionReason: reason,
      },
      include: { TicketType: true, College: true, Club: true },
    });
  }

  /**
   * Archive a completed event
   */
  async archive(eventId: string, userId: string): Promise<Event> {
    const hasPermission = await this.hasPermission(eventId, userId, 'EDIT_EVENT');
    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission to archive this event');
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.deletedAt) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== EventLifecycleStatus.COMPLETED) {
      throw new BadRequestException('Only completed events can be archived');
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: { status: EventLifecycleStatus.ARCHIVED },
      include: { TicketType: true, College: true, Club: true },
    });
  }

  /**
   * Get user's role for an event
   */
  async getUserRole(eventId: string, userId: string): Promise<string | null> {
    // Check if user is the creator
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { createdById: true },
    });

    if (event?.createdById === userId) {
      return 'CREATOR';
    }

    // Check assigned roles
    const role = await this.prisma.eventMemberRole.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    return role?.role || null;
  }

  /**
   * Check if user has permission for an action
   */
  async hasPermission(
    eventId: string,
    userId: string,
    action: string,
  ): Promise<boolean> {
    const role = await this.getUserRole(eventId, userId);
    if (!role) return false;

    const permissions: Record<string, string[]> = {
      CREATOR: [
        'EDIT_EVENT',
        'DELETE_EVENT',
        'MANAGE_TICKETS',
        'PROCESS_REFUNDS',
        'ASSIGN_ROLES',
        'EXPORT_DATA',
        'SCAN_QR',
        'VIEW_ATTENDEES',
        'SEND_MESSAGES',
        'ISSUE_CERTIFICATES',
        'MANUAL_CHECKIN',
      ],
      CO_ORGANIZER: [
        'EDIT_EVENT',
        'MANAGE_TICKETS',
        'PROCESS_REFUNDS',
        'VIEW_ATTENDEES',
        'SEND_MESSAGES',
        'SCAN_QR',
        'MANUAL_CHECKIN',
      ],
      HEAD: ['SCAN_QR', 'VIEW_ATTENDEES', 'MANUAL_CHECKIN'],
      VOLUNTEER: ['SCAN_QR'],
    };

    return permissions[role]?.includes(action) || false;
  }

  // ============ Legacy methods for backward compatibility ============

  async rsvp(
    userId: string,
    eventId: string,
    status: 'GOING' | 'INTERESTED' | 'NOT_GOING',
  ) {
    return this.prisma.eventAttendance.upsert({
      where: {
        eventId_userId: {
          userId,
          eventId,
        },
      },
      update: {
        status,
      },
      create: {
        id: randomUUID(),
        userId,
        eventId,
        status,
      },
    });
  }

  async generateQr(eventId: string) {
    const { qrCodeDataUrl, token } =
      await this.qrService.generateQrCode(eventId);

    await this.prisma.event.update({
      where: { id: eventId },
      data: { qrToken: token },
    });

    return { qrCodeDataUrl, token };
  }

  async checkIn(userId: string, eventId: string, token: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    if (event.qrToken !== token) {
      throw new BadRequestException('Invalid QR Token');
    }

    return this.prisma.eventAttendance.upsert({
      where: {
        eventId_userId: {
          userId,
          eventId,
        },
      },
      update: {
        checkInTime: new Date(),
        checkInMethod: 'QR',
        role: 'ATTENDEE',
        status: 'GOING',
      },
      create: {
        id: randomUUID(),
        userId,
        eventId,
        status: 'GOING',
        checkInTime: new Date(),
        checkInMethod: 'QR',
        role: 'ATTENDEE',
      },
    });
  }
}
