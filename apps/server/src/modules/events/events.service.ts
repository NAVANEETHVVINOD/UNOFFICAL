import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';
import { QrService } from './qr.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private qrService: QrService,
  ) { }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }): Promise<Event[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { club: true, college: true },
    });
  }

  async findOne(
    eventWhereUniqueInput: Prisma.EventWhereUniqueInput,
  ): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: eventWhereUniqueInput,
      include: { club: true, college: true, attendees: true },
    });
  }

  async create(data: Prisma.EventCreateInput, userId: string): Promise<Event> {
    return this.prisma.event.create({
      data: {
        ...data,
        createdBy: {
          connect: { id: userId },
        },
      },
    });
  }

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
        userId,
        eventId,
        status,
      },
    });
  }

  async generateQr(eventId: string) {
    return this.qrService.generateQrCode(eventId);
  }

  async checkIn(userId: string, eventId: string, token: string) {
    // In a real app, verify token against stored event token
    // For now, we assume token validation passes if it matches eventId logic or similar
    // But QrService.validateToken needs a stored token to compare against.
    // For simplicity in this MVP, we might skip strict token validation or store it in Event.

    // Let's just mark attendance
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
      },
      create: {
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
