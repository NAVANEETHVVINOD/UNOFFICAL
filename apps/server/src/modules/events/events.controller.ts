import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    async findAll(@Query('college') collegeSlug?: string) {
        const where: Prisma.EventWhereInput = collegeSlug
            ? { college: { slug: collegeSlug } }
            : {};
        return this.eventsService.findAll({ where });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.eventsService.findOne({ id });
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createEventDto: Prisma.EventCreateInput) {
        return this.eventsService.create(createEventDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/rsvp')
    async rsvp(
        @Request() req,
        @Param('id') eventId: string,
        @Body('status') status: 'GOING' | 'INTERESTED' | 'NOT_GOING',
    ) {
        return this.eventsService.rsvp(req.user.userId, eventId, status);
    }
}
