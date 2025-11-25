import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ClubsService } from './clubs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  async findAll(@Query('college') collegeSlug?: string) {
    const where: Prisma.ClubWhereInput = collegeSlug
      ? { college: { slug: collegeSlug } }
      : {};
    return this.clubsService.findAll({ where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.clubsService.findOne({ id });
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

  @UseGuards(JwtAuthGuard)
  @Post(':id/members/:userId')
  async updateMemberRole(
    @Param('id') clubId: string,
    @Param('userId') userId: string,
    @Body() body: { role: 'MEMBER' | 'LEAD' | 'STAFF'; displayRole?: string },
  ) {
    // TODO: Add check if requester is Club Admin
    return this.clubsService.updateMemberRole(
      userId,
      clubId,
      body.role,
      body.displayRole,
    );
  }
}
