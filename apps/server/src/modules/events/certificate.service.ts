import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrationStatus, NotificationType } from '@prisma/client';

/**
 * Certificate template definition
 */
export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  placeholders: string[]; // e.g., ['{{name}}', '{{event}}', '{{date}}']
}

/**
 * Certificate data for generation
 */
export interface CertificateData {
  attendeeName: string;
  eventTitle: string;
  eventDate: string;
  organizerName: string;
  certificateId: string;
  issuedAt: string;
}

/**
 * Certificate record
 */
export interface Certificate {
  id: string;
  eventId: string;
  userId: string;
  templateId: string;
  fileUrl: string;
  issuedAt: Date;
}

/**
 * Available certificate templates
 * In production, these would be stored in a database or file system
 */
const CERTIFICATE_TEMPLATES: CertificateTemplate[] = [
  {
    id: 'default',
    name: 'Default Certificate',
    description: 'A simple, elegant certificate of participation',
    previewUrl: '/templates/certificate-default.png',
    placeholders: ['{{name}}', '{{event}}', '{{date}}', '{{organizer}}'],
  },
  {
    id: 'modern',
    name: 'Modern Certificate',
    description: 'A modern, minimalist design',
    previewUrl: '/templates/certificate-modern.png',
    placeholders: ['{{name}}', '{{event}}', '{{date}}', '{{organizer}}'],
  },
  {
    id: 'classic',
    name: 'Classic Certificate',
    description: 'A traditional, formal certificate design',
    previewUrl: '/templates/certificate-classic.png',
    placeholders: ['{{name}}', '{{event}}', '{{date}}', '{{organizer}}'],
  },
];

/**
 * CertificateService - Manages certificate generation and issuance
 * Property 10: Certificate Issuance Rules
 * Validates: Requirements 8.1-8.9
 */
@Injectable()
export class CertificateService {
  private readonly logger = new Logger(CertificateService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get available certificate templates
   * Validates: Requirements 8.1
   */
  getTemplates(): CertificateTemplate[] {
    return CERTIFICATE_TEMPLATES;
  }

  /**
   * Get a specific template by ID
   */
  getTemplate(templateId: string): CertificateTemplate | null {
    return CERTIFICATE_TEMPLATES.find((t) => t.id === templateId) || null;
  }

  /**
   * Issue certificate to an attendee
   * Property 10: Certificate Issuance Rules
   * Validates: Requirements 8.3, 8.4
   * Only issues to users who have checked in (attended)
   */
  async issueCertificate(
    eventId: string,
    userId: string,
    issuerId: string,
    reason?: string,
  ): Promise<Certificate> {
    // Get event details
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        title: true,
        startsAt: true,
        certificateEnabled: true,
        certificateTemplateId: true,
        createdBy: {
          select: {
            profile: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.certificateEnabled) {
      throw new BadRequestException('Certificates are not enabled for this event');
    }

    // Get registration
    const registration = await this.prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            profile: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    // Property 10: Only issue to attended users
    if (registration.status !== RegistrationStatus.ATTENDED) {
      throw new BadRequestException(
        'Certificates can only be issued to users who have attended the event',
      );
    }

    // Check if certificate already exists
    const existingCert = await this.prisma.eventCertificate.findFirst({
      where: { eventId, userId },
    });

    if (existingCert) {
      throw new BadRequestException('Certificate has already been issued to this user');
    }

    // Generate certificate
    const templateId = event.certificateTemplateId || 'default';
    const certificateData: CertificateData = {
      attendeeName: registration.user.profile?.fullName || 'Attendee',
      eventTitle: event.title,
      eventDate: this.formatDate(event.startsAt),
      organizerName: event.createdBy.profile?.fullName || 'Event Organizer',
      certificateId: this.generateCertificateId(),
      issuedAt: this.formatDate(new Date()),
    };

    // Generate PDF (placeholder - in production, use a PDF library)
    const fileUrl = await this.generateCertificatePDF(templateId, certificateData);

    // Create certificate record
    const certificate = await this.prisma.eventCertificate.create({
      data: {
        eventId,
        userId,
        templateId,
        fileUrl,
      },
    });

    // Update registration with certificate ID
    await this.prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { certificateId: certificate.id },
    });

    // Send notification
    await this.prisma.notification.create({
      data: {
        userId,
        type: NotificationType.EVENT,
        title: 'Certificate Issued',
        message: `Your certificate for "${event.title}" is now available for download.`,
        actionUrl: `/events/${eventId}/certificates`,
      },
    });

    this.logger.log(
      `CERTIFICATE_ISSUED: Certificate ${certificate.id} issued to user ${userId} for event ${eventId}${reason ? ` (Reason: ${reason})` : ''}`,
    );

    return {
      id: certificate.id,
      eventId: certificate.eventId,
      userId: certificate.userId,
      templateId: certificate.templateId,
      fileUrl: certificate.fileUrl,
      issuedAt: certificate.issuedAt,
    };
  }

  /**
   * Auto-issue certificates to all attended users
   * Validates: Requirements 8.3
   */
  async autoIssueCertificates(eventId: string): Promise<{
    issued: number;
    skipped: number;
    errors: string[];
  }> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: {
        certificateEnabled: true,
        autoIssueCertificate: true,
        createdById: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (!event.certificateEnabled || !event.autoIssueCertificate) {
      throw new BadRequestException('Auto-issue is not enabled for this event');
    }

    // Get all attended registrations without certificates
    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        status: RegistrationStatus.ATTENDED,
        certificateId: null,
        deletedAt: null,
      },
      select: { userId: true },
    });

    let issued = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const reg of registrations) {
      try {
        await this.issueCertificate(eventId, reg.userId, event.createdById);
        issued++;
      } catch (error) {
        if (error instanceof BadRequestException) {
          skipped++;
        } else {
          errors.push(`Failed to issue certificate to user ${reg.userId}: ${error.message}`);
        }
      }
    }

    this.logger.log(
      `AUTO_ISSUE: Issued ${issued} certificates for event ${eventId}, skipped ${skipped}, errors: ${errors.length}`,
    );

    return { issued, skipped, errors };
  }

  /**
   * Get certificate for a user
   * Validates: Requirements 8.6
   */
  async getCertificate(
    eventId: string,
    userId: string,
  ): Promise<Certificate | null> {
    const cert = await this.prisma.eventCertificate.findFirst({
      where: { eventId, userId },
    });

    if (!cert) return null;

    return {
      id: cert.id,
      eventId: cert.eventId,
      userId: cert.userId,
      templateId: cert.templateId,
      fileUrl: cert.fileUrl,
      issuedAt: cert.issuedAt,
    };
  }

  /**
   * Get all certificates for a user
   * Validates: Requirements 8.8
   */
  async getUserCertificates(userId: string): Promise<
    Array<{
      certificate: Certificate;
      eventTitle: string;
      eventDate: Date;
    }>
  > {
    const certs = await this.prisma.eventCertificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });

    // Fetch event details for each certificate
    const results = await Promise.all(
      certs.map(async (c) => {
        const event = await this.prisma.event.findUnique({
          where: { id: c.eventId },
          select: { title: true, startsAt: true },
        });
        return {
          certificate: {
            id: c.id,
            eventId: c.eventId,
            userId: c.userId,
            templateId: c.templateId,
            fileUrl: c.fileUrl,
            issuedAt: c.issuedAt,
          },
          eventTitle: event?.title || 'Unknown Event',
          eventDate: event?.startsAt || new Date(),
        };
      }),
    );

    return results;
  }

  /**
   * Get all certificates for an event
   * Validates: Requirements 8.7
   */
  async getEventCertificates(eventId: string): Promise<
    Array<{
      certificate: Certificate;
      userName: string;
      userEmail: string;
    }>
  > {
    const certs = await this.prisma.eventCertificate.findMany({
      where: { eventId },
      orderBy: { issuedAt: 'desc' },
    });

    // Fetch user details for each certificate
    const results = await Promise.all(
      certs.map(async (c) => {
        const user = await this.prisma.user.findUnique({
          where: { id: c.userId },
          select: {
            email: true,
            profile: { select: { fullName: true } },
          },
        });
        return {
          certificate: {
            id: c.id,
            eventId: c.eventId,
            userId: c.userId,
            templateId: c.templateId,
            fileUrl: c.fileUrl,
            issuedAt: c.issuedAt,
          },
          userName: user?.profile?.fullName || 'Unknown',
          userEmail: user?.email || '',
        };
      }),
    );

    return results;
  }

  /**
   * Check if user is eligible for certificate
   * Property 10: Certificate Issuance Rules
   */
  async isEligibleForCertificate(eventId: string, userId: string): Promise<{
    eligible: boolean;
    reason?: string;
  }> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { certificateEnabled: true },
    });

    if (!event) {
      return { eligible: false, reason: 'Event not found' };
    }

    if (!event.certificateEnabled) {
      return { eligible: false, reason: 'Certificates not enabled for this event' };
    }

    const registration = await this.prisma.eventRegistration.findFirst({
      where: { eventId, userId, deletedAt: null },
    });

    if (!registration) {
      return { eligible: false, reason: 'Not registered for this event' };
    }

    if (registration.status !== RegistrationStatus.ATTENDED) {
      return { eligible: false, reason: 'Must attend the event to receive certificate' };
    }

    if (registration.certificateId) {
      return { eligible: false, reason: 'Certificate already issued' };
    }

    return { eligible: true };
  }

  /**
   * Generate certificate PDF
   * In production, this would use a PDF library like PDFKit or Puppeteer
   */
  private async generateCertificatePDF(
    templateId: string,
    data: CertificateData,
  ): Promise<string> {
    // Placeholder implementation
    // In production, generate actual PDF and upload to S3/storage
    const filename = `certificates/${data.certificateId}.pdf`;
    
    this.logger.log(
      `CERTIFICATE_PDF: Generated certificate ${data.certificateId} using template ${templateId}`,
    );

    // Return placeholder URL - in production, return actual S3 URL
    return `/api/certificates/${data.certificateId}/download`;
  }

  /**
   * Generate unique certificate ID
   */
  private generateCertificateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `CERT-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Format date for certificate
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}
