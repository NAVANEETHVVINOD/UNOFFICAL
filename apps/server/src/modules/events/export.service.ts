import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrationStatus } from '@prisma/client';
import { FormService, FormSchema, FormResponse } from './forms.service';

/**
 * Export format options
 */
export enum ExportFormat {
  CSV = 'csv',
  JSON = 'json',
}

/**
 * Attendee data for export
 */
export interface AttendeeExportData {
  registrationId: string;
  userId: string;
  fullName: string;
  email: string;
  ticketType: string;
  ticketPrice: number;
  status: RegistrationStatus;
  registeredAt: Date;
  checkedIn: boolean;
  checkInTime?: Date;
  formResponses?: FormResponse;
}

/**
 * Export result
 */
export interface ExportResult {
  format: ExportFormat;
  filename: string;
  data: string;
  mimeType: string;
  recordCount: number;
}

/**
 * ExportService - Handles data export for events
 * Validates: Requirements 10.1, 10.2
 */
@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    private prisma: PrismaService,
    private formService: FormService,
  ) {}

  /**
   * Export attendee data for an event
   * Validates: Requirements 10.1, 10.2
   * Restricted to Creator/Co-Organizer
   */
  async exportAttendees(
    eventId: string,
    userId: string,
    format: ExportFormat = ExportFormat.CSV,
  ): Promise<ExportResult> {
    // Check permission (Creator or Co-Organizer only)
    const hasPermission = await this.checkExportPermission(eventId, userId);
    if (!hasPermission) {
      throw new ForbiddenException(
        'Only event creators and co-organizers can export data',
      );
    }

    // Get event details
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { title: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Get form schema for column headers
    const formSchema = await this.formService.getFormSchema(eventId);

    // Get all registrations with user data
    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        deletedAt: null,
      },
      include: {
        User: {
          select: {
            id: true,
            email: true,
            Profile: {
              select: { fullName: true },
            },
          },
        },
        TicketType: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Transform to export data
    const attendees: AttendeeExportData[] = registrations.map((r) => ({
      registrationId: r.id,
      userId: r.User.id,
      fullName: r.User.Profile?.fullName || 'Unknown',
      email: r.User.email || '',
      ticketType: r.TicketType.name,
      ticketPrice: r.TicketType.price / 100, // Convert from paise to rupees
      status: r.status,
      registeredAt: r.createdAt,
      checkedIn: r.qrUsed,
      checkInTime: r.checkInTime || undefined,
      formResponses: r.formResponses as unknown as FormResponse,
    }));

    // Generate export based on format
    let result: ExportResult;

    if (format === ExportFormat.CSV) {
      result = this.generateCSV(event.title, attendees, formSchema);
    } else {
      result = this.generateJSON(event.title, attendees);
    }

    this.logger.log(
      `EXPORT: User ${userId} exported ${attendees.length} attendees for event ${eventId} in ${format} format`,
    );

    return result;
  }

  /**
   * Generate CSV export
   */
  private generateCSV(
    eventTitle: string,
    attendees: AttendeeExportData[],
    formSchema: FormSchema | null,
  ): ExportResult {
    // Build headers
    const baseHeaders = [
      'Registration ID',
      'Full Name',
      'Email',
      'Ticket Type',
      'Ticket Price (₹)',
      'Status',
      'Registered At',
      'Checked In',
      'Check-In Time',
    ];

    // Add form field headers
    const formHeaders: string[] = [];
    if (formSchema) {
      for (const field of formSchema.fields) {
        formHeaders.push(field.label);
      }
    }

    const headers = [...baseHeaders, ...formHeaders];

    // Build rows
    const rows: string[][] = [];

    for (const attendee of attendees) {
      const baseRow = [
        attendee.registrationId,
        this.escapeCSV(attendee.fullName),
        this.escapeCSV(attendee.email),
        this.escapeCSV(attendee.ticketType),
        attendee.ticketPrice.toString(),
        attendee.status,
        this.formatDate(attendee.registeredAt),
        attendee.checkedIn ? 'Yes' : 'No',
        attendee.checkInTime ? this.formatDate(attendee.checkInTime) : '',
      ];

      // Add form responses
      const formValues: string[] = [];
      if (formSchema && attendee.formResponses) {
        for (const field of formSchema.fields) {
          const value = attendee.formResponses[field.id];
          if (Array.isArray(value)) {
            formValues.push(this.escapeCSV(value.join(', ')));
          } else if (value !== undefined && value !== null) {
            formValues.push(this.escapeCSV(String(value)));
          } else {
            formValues.push('');
          }
        }
      } else if (formSchema) {
        // Fill with empty values if no responses
        formValues.push(...formSchema.fields.map(() => ''));
      }

      rows.push([...baseRow, ...formValues]);
    }

    // Generate CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const filename = `${this.sanitizeFilename(eventTitle)}_attendees_${this.formatDateForFilename(new Date())}.csv`;

    return {
      format: ExportFormat.CSV,
      filename,
      data: csvContent,
      mimeType: 'text/csv',
      recordCount: attendees.length,
    };
  }

  /**
   * Generate JSON export
   */
  private generateJSON(
    eventTitle: string,
    attendees: AttendeeExportData[],
  ): ExportResult {
    const exportData = {
      eventTitle,
      exportedAt: new Date().toISOString(),
      totalAttendees: attendees.length,
      attendees: attendees.map((a) => ({
        ...a,
        ticketPrice: a.ticketPrice, // Already converted to rupees
        registeredAt: a.registeredAt.toISOString(),
        checkInTime: a.checkInTime?.toISOString(),
      })),
    };

    const filename = `${this.sanitizeFilename(eventTitle)}_attendees_${this.formatDateForFilename(new Date())}.json`;

    return {
      format: ExportFormat.JSON,
      filename,
      data: JSON.stringify(exportData, null, 2),
      mimeType: 'application/json',
      recordCount: attendees.length,
    };
  }

  /**
   * Check if user has export permission
   */
  private async checkExportPermission(
    eventId: string,
    userId: string,
  ): Promise<boolean> {
    // Check if user is creator
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { createdById: true },
    });

    if (event?.createdById === userId) {
      return true;
    }

    // Check if user is co-organizer
    const role = await this.prisma.eventMemberRole.findUnique({
      where: {
        eventId_userId: { eventId, userId },
      },
    });

    return role?.role === 'CO_ORGANIZER';
  }

  /**
   * Escape CSV value
   */
  private escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Format date for display
   */
  private formatDate(date: Date): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * Format date for filename
   */
  private formatDateForFilename(date: Date): string {
    return date.toISOString().substring(0, 10);
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, 50);
  }

  /**
   * Get export statistics for an event
   */
  async getExportStats(eventId: string): Promise<{
    totalRegistrations: number;
    confirmedCount: number;
    checkedInCount: number;
    cancelledCount: number;
  }> {
    const [total, confirmed, checkedIn, cancelled] = await Promise.all([
      this.prisma.eventRegistration.count({
        where: { eventId, deletedAt: null },
      }),
      this.prisma.eventRegistration.count({
        where: { eventId, status: RegistrationStatus.CONFIRMED, deletedAt: null },
      }),
      this.prisma.eventRegistration.count({
        where: { eventId, status: RegistrationStatus.ATTENDED, deletedAt: null },
      }),
      this.prisma.eventRegistration.count({
        where: { eventId, status: RegistrationStatus.CANCELLED, deletedAt: null },
      }),
    ]);

    return {
      totalRegistrations: total,
      confirmedCount: confirmed,
      checkedInCount: checkedIn,
      cancelledCount: cancelled,
    };
  }
}
