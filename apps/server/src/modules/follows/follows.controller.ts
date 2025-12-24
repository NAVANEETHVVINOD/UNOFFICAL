import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async followUser(@Request() req, @Param('id') id: string) {
    return this.followsService.follow(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async unfollowUser(@Request() req, @Param('id') id: string) {
    return this.followsService.unfollow(req.user.userId, id);
  }

  @Get(':id/followers')
  async getFollowers(@Param('id') id: string) {
    return this.followsService.getFollowers(id);
  }

  @Get(':id/following')
  async getFollowing(@Param('id') id: string) {
    return this.followsService.getFollowing(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/status')
  async getFollowStatus(@Request() req, @Param('id') id: string) {
    return this.followsService.getStatus(req.user.userId, id);
  }
}
