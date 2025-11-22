import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

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
            include: { club: true, college: true, participants: true },
        });
    }

    async create(data: Prisma.EventCreateInput): Promise<Event> {
        return this.prisma.event.create({
            data,
        });
    }

    async rsvp(userId: string, eventId: string, status: 'GOING' | 'INTERESTED' | 'NOT_GOING') {
        return this.prisma.eventParticipant.upsert({
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
}
