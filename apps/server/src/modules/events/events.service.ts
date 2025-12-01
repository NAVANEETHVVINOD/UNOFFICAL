import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';
import { QrService } from './qr.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private qrService: QrService,
  ) {}

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
    const { qrCodeDataUrl, token } =
      await this.qrService.generateQrCode(eventId);

    // Store the token in the event
    await this.prisma.event.update({
      where: { id: eventId },
      data: { qrToken: token },
    });

    return { qrCodeDataUrl, token };
  }

  async checkIn(userId: string, eventId: string, token: string) {
    // Verify token
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new BadRequestException('Event not found');
    }

    if (event.qrToken !== token) {
      throw new BadRequestException('Invalid QR Token');
    }

    // Mark attendance
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
        status: 'GOING', // Confirm they are going if they check in
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
