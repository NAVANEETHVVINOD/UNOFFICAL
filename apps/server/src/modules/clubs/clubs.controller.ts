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
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Prisma, Role } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) { }

  @Get()
  async findAll(
    @Query('collegeSlug') collegeSlug?: string,
    @Query('search') search?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const take = limit ? parseInt(limit) : 10;
    const where: Prisma.ClubWhereInput = {
      ...(collegeSlug ? { college: { slug: collegeSlug } } : {}),
      ...(search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
        : {}),
    };

    return this.clubsService.findAll({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clubsService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COLLEGE_ADMIN' as Role, 'PLATFORM_ADMIN' as Role)
  @Post()
  async create(
    @Request() req,
    @Body() createClubDto: Prisma.ClubCreateInput & { collegeSlug?: string },
  ) {
    const { collegeSlug, ...rest } = createClubDto;
    return this.clubsService.create({
      ...rest,
      ...(collegeSlug ? { college: { connect: { slug: collegeSlug } } } : {}),
      // Add the creator as the first member/admin
      members: {
        create: {
          userId: req.user.userId,
          role: 'LEAD',
          displayRole: 'Founder',
        },
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinClub(@Request() req, @Param('id') clubId: string) {
    return this.clubsService.joinClub(req.user.userId, clubId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/leave')
  async leaveClub(@Request() req, @Param('id') clubId: string) {
    return this.clubsService.leaveClub(req.user.userId, clubId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN' as Role, 'COLLEGE_ADMIN' as Role, 'PLATFORM_ADMIN' as Role)
  @Post(':id/members/:userId')
  async updateMemberRole(
    @Param('id') clubId: string,
    @Param('userId') userId: string,
    @Body() body: { role: 'MEMBER' | 'LEAD' | 'STAFF'; displayRole?: string },
  ) {
    return this.clubsService.updateMemberRole(
      userId,
      clubId,
      body.role,
      body.displayRole,
    );
  }
}
