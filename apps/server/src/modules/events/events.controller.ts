import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Prisma, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(
    @Query('collegeSlug') collegeSlug?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const take = limit ? parseInt(limit) : 10;
    const where: Prisma.EventWhereInput = collegeSlug
      ? { college: { slug: collegeSlug } }
      : {};

    return this.eventsService.findAll({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy: { startsAt: 'asc' }, // Or createdAt desc
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLUB_ADMIN, Role.COLLEGE_ADMIN)
  @Post()
  async create(
    @Request() req,
    @Body() createEventDto: Prisma.EventCreateInput & { collegeSlug?: string },
  ) {
    const { collegeSlug, ...rest } = createEventDto;
    return this.eventsService.create(
      {
        ...rest,
        ...(collegeSlug ? { college: { connect: { slug: collegeSlug } } } : {}),
      },
      req.user.userId,
    );
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLUB_ADMIN, Role.COLLEGE_ADMIN)
  @Post(':id/qr')
  async generateQr(@Param('id') eventId: string) {
    return this.eventsService.generateQr(eventId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/check-in')
  async checkIn(
    @Request() req,
    @Param('id') eventId: string,
    @Body('token') token: string,
  ) {
    return this.eventsService.checkIn(req.user.userId, eventId, token);
  }
}
