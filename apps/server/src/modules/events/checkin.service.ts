import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrationStatus, NotificationType } from '@prisma/client';
import { createHmac, randomBytes } from 'crypto';
import * as QRCode from 'qrcode';

/**
 * Check-in result interface
 * Validates: Requirements 6.1-6.9
 */
export interface CheckInResult {
  success: boolean;
  registrationId: string;
  attendeeName: string;
  ticketType: string;
  checkInTime: Date;
  isFirstScan: boolean;
  error?: string;
  errorCode?: CheckInErrorCode;
}

/**
 * Error codes for check-in failures
 */
export enum CheckInErrorCode {
  INVALID_TOKEN = 'INVALID_QR_TOKEN',
  TOKEN_ALREADY_USED = 'QR_ALREADY_USED',
  REGISTRATION_NOT_FOUND = 'REGISTRATION_NOT_FOUND',
  NOT_CONFIRMED = 'NOT_CONFIRMED',
  EVENT_NOT_STARTED = 'EVENT_NOT_STARTED',
  EVENT_ENDED = 'EVENT_ENDED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
}

/**
 * QR token payload structure
 */
interface QrTokenPayload {
  eventId: string;
  userId: string;
  registrationId: string;
  timestamp: number;
  random: string;
}

@Injectable()
export class CheckInService {
  private readonly logger = new Logger(CheckInService.name);
  private readonly QR_SECRET = process.env.QR_HMAC_SECRET || 'default-secret-change-in-production';

  constructor(private prisma: PrismaService) {}

  /**
   * Generate a signed QR token for a registration
   * Property 3: QR Token Round-Trip
   * Validates: Requirements 6.1
   */
  generateQrToken(eventId: string, userId: string, registrationId: string): string {
    const timestamp = Date.now();
    const random = randomBytes(8).toString('hex');
    const payload = `${eventId}:${userId}:${registrationId}:${timestamp}:${random}`;
    const signature = this.signPayload(payload);
    return `${payload}:${signature}`;
  }

  /**
   * Verify a QR token and extract payload
   * Property 3: QR Token Round-Trip
   * Validates: Requirements 6.1
   */
  verifyQrToken(token: string): { valid: boolean; payload?: QrTokenPayload; error?: string } {
    const parts = token.split(':');
    if (parts.length !== 6) {
      return { valid: false, error: 'Invalid token format' };
    }

    const [eventId, userId, registrationId, timestampStr, random, signature] = parts;
    const payload = `${eventId}:${userId}:${registrationId}:${timestampStr}:${random}`;
    const expectedSignature = this.signPayload(payload);

    if (signature !== expectedSignature) {
      return { valid: false, error: 'Invalid token signature' };
    }

    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) {
      return { valid: false, error: 'Invalid timestamp' };
    }

    return {
      valid: true,
      payload: {
        eventId,
        userId,
        registrationId,
        timestamp,
        random,
      },
    };
  }

  /**
   * Generate QR code data URL for a registration
   * Validates: Requirements 6.1
   */
  async generateQrCode(registrationId: string): Promise<{ qrDataUrl: string; token: string }> {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      select: {
        id: true,
        eventId: true,
        userId: true,
        qrToken: true,
        status: true,
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.status !== RegistrationStatus.CONFIRMED) {
      throw new BadRequestException('Registration is not confirmed');
    }

    // Use existing token or generate new one
    let token = registration.qrToken;
    if (!token) {
      token = this.generateQrToken(registration.eventId, registration.userId, registration.id);
      await this.prisma.eventRegistration.update({
        where: { id: registrationId },
        data: { qrToken: token },
      });
    }

    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(token, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 300,
    });

    return { qrDataUrl, token };
  }

  /**
   * Process check-in from QR scan
   * Property 4: QR Single-Use Enforcement
   * Validates: Requirements 6.2-6.5
   */
  async checkIn(
    eventId: string,
    token: string,
    scannerId: string,
  ): Promise<CheckInResult> {
    // Verify token
    const verification = this.verifyQrToken(token);
    if (!verification.valid || !verification.payload) {
      this.logger.warn(`Invalid QR token scan attempt for event ${eventId}`);
      return {
        success: false,
        registrationId: '',
        attendeeName: '',
        ticketType: '',
        checkInTime: new Date(),
        isFirstScan: false,
        error: verification.error || 'Invalid QR token',
        errorCode: CheckInErrorCode.INVALID_TOKEN,
      };
    }

    const { payload } = verification;

    // Verify token is for this event
    if (payload.eventId !== eventId) {
      return {
        success: false,
        registrationId: '',
        attendeeName: '',
        ticketType: '',
        checkInTime: new Date(),
        isFirstScan: false,
        error: 'QR code is for a different event',
        errorCode: CheckInErrorCode.INVALID_TOKEN,
      };
    }

    // Get registration with user and ticket info
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: payload.registrationId },
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
          },
        },
        event: {
          select: {
            startsAt: true,
            endsAt: true,
            title: true,
          },
        },
      },
    });

    if (!registration) {
      return {
        success: false,
        registrationId: payload.registrationId,
        attendeeName: '',
        ticketType: '',
        checkInTime: new Date(),
        isFirstScan: false,
        error: 'Registration not found',
        errorCode: CheckInErrorCode.REGISTRATION_NOT_FOUND,
      };
    }

    // Verify registration is confirmed
    if (registration.status !== RegistrationStatus.CONFIRMED && 
        registration.status !== RegistrationStatus.ATTENDED) {
      return {
        success: false,
        registrationId: registration.id,
        attendeeName: registration.user.profile?.fullName || 'Unknown',
        ticketType: registration.ticket.name,
        checkInTime: new Date(),
        isFirstScan: false,
        error: 'Registration is not confirmed',
        errorCode: CheckInErrorCode.NOT_CONFIRMED,
      };
    }

    // Check if already used (single-use enforcement)
    // Property 4: QR Single-Use Enforcement
    if (registration.qrUsed) {
      return {
        success: false,
        registrationId: registration.id,
        attendeeName: registration.user.profile?.fullName || 'Unknown',
        ticketType: registration.ticket.name,
        checkInTime: registration.checkInTime || new Date(),
        isFirstScan: false,
        error: 'QR code has already been used',
        errorCode: CheckInErrorCode.TOKEN_ALREADY_USED,
      };
    }

    const now = new Date();

    // Mark as checked in
    await this.prisma.eventRegistration.update({
      where: { id: registration.id },
      data: {
        qrUsed: true,
        checkInTime: now,
        checkInBy: scannerId,
        checkInMethod: 'QR_SCAN',
        status: RegistrationStatus.ATTENDED,
      },
    });

    this.logger.log(
      `CHECK_IN: User ${registration.userId} checked in to event ${eventId} by scanner ${scannerId}`,
    );

    return {
      success: true,
      registrationId: registration.id,
      attendeeName: registration.user.profile?.fullName || 'Unknown',
      ticketType: registration.ticket.name,
      checkInTime: now,
      isFirstScan: true,
    };
  }

  /**
   * Manual check-in with reason (for Heads when QR fails)
   * Validates: Requirements 6.6, 6.7
   */
  async manualCheckIn(
    eventId: string,
    registrationId: string,
    scannerId: string,
    reason: string,
  ): Promise<CheckInResult> {
    if (!reason || reason.trim().length < 3) {
      throw new BadRequestException('Reason is required for manual check-in');
    }

    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: { fullName: true },
            },
          },
        },
        ticket: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.eventId !== eventId) {
      throw new BadRequestException('Registration is for a different event');
    }

    if (registration.status !== RegistrationStatus.CONFIRMED &&
        registration.status !== RegistrationStatus.ATTENDED) {
      throw new BadRequestException('Registration is not confirmed');
    }

    const isFirstScan = !registration.qrUsed;
    const now = new Date();

    await this.prisma.eventRegistration.update({
      where: { id: registrationId },
      data: {
        qrUsed: true,
        checkInTime: now,
        checkInBy: scannerId,
        checkInMethod: `MANUAL: ${reason}`,
        status: RegistrationStatus.ATTENDED,
      },
    });

    this.logger.log(
      `MANUAL_CHECK_IN: User ${registration.userId} manually checked in to event ${eventId} by ${scannerId}. Reason: ${reason}`,
    );

    return {
      success: true,
      registrationId: registration.id,
      attendeeName: registration.user.profile?.fullName || 'Unknown',
      ticketType: registration.ticket.name,
      checkInTime: now,
      isFirstScan,
    };
  }

  /**
   * Check out (for entry/exit mode)
   * Validates: Requirements 17.1, 17.2
   */
  async checkOut(
    eventId: string,
    registrationId: string,
    scannerId: string,
  ): Promise<{ success: boolean; checkOutTime: Date }> {
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.eventId !== eventId) {
      throw new BadRequestException('Registration is for a different event');
    }

    if (!registration.checkInTime) {
      throw new BadRequestException('User has not checked in yet');
    }

    const now = new Date();

    await this.prisma.eventRegistration.update({
      where: { id: registrationId },
      data: {
        checkOutTime: now,
      },
    });

    this.logger.log(
      `CHECK_OUT: User ${registration.userId} checked out of event ${eventId} by scanner ${scannerId}`,
    );

    return {
      success: true,
      checkOutTime: now,
    };
  }

  /**
   * Get check-in statistics for an event
   */
  async getCheckInStats(eventId: string): Promise<{
    totalRegistrations: number;
    checkedIn: number;
    pending: number;
    checkInRate: number;
  }> {
    const [total, checkedIn] = await Promise.all([
      this.prisma.eventRegistration.count({
        where: {
          eventId,
          status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
          deletedAt: null,
        },
      }),
      this.prisma.eventRegistration.count({
        where: {
          eventId,
          status: RegistrationStatus.ATTENDED,
          deletedAt: null,
        },
      }),
    ]);

    return {
      totalRegistrations: total,
      checkedIn,
      pending: total - checkedIn,
      checkInRate: total > 0 ? Math.round((checkedIn / total) * 100) : 0,
    };
  }

  /**
   * Get recent check-ins for scan history
   */
  async getRecentCheckIns(
    eventId: string,
    limit = 20,
  ): Promise<Array<{
    registrationId: string;
    attendeeName: string;
    ticketType: string;
    checkInTime: Date;
    checkInMethod: string;
  }>> {
    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        checkInTime: { not: null },
      },
      orderBy: { checkInTime: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            profile: {
              select: { fullName: true },
            },
          },
        },
        ticket: {
          select: {
            name: true,
          },
        },
      },
    });

    return registrations.map((r) => ({
      registrationId: r.id,
      attendeeName: r.user.profile?.fullName || 'Unknown',
      ticketType: r.ticket.name,
      checkInTime: r.checkInTime!,
      checkInMethod: r.checkInMethod || 'QR_SCAN',
    }));
  }

  /**
   * Sign a payload with HMAC
   */
  private signPayload(payload: string): string {
    return createHmac('sha256', this.QR_SECRET)
      .update(payload)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Lookup registration by user email or name (for manual check-in search)
   */
  async searchAttendees(
    eventId: string,
    query: string,
    limit = 10,
  ): Promise<Array<{
    registrationId: string;
    userId: string;
    fullName: string;
    email: string;
    ticketType: string;
    status: RegistrationStatus;
    checkedIn: boolean;
  }>> {
    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        eventId,
        status: { in: [RegistrationStatus.CONFIRMED, RegistrationStatus.ATTENDED] },
        deletedAt: null,
        user: {
          OR: [
            { profile: { fullName: { contains: query, mode: 'insensitive' } } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
      take: limit,
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
          },
        },
      },
    });

    return registrations.map((r) => ({
      registrationId: r.id,
      userId: r.user.id,
      fullName: r.user.profile?.fullName || 'Unknown',
      email: r.user.email || '',
      ticketType: r.ticket.name,
      status: r.status,
      checkedIn: r.qrUsed,
    }));
  }
}
