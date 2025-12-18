import { Controller, Get, UseGuards, Request, Query, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findOne({ id: req.user.userId });
  }

  @Get('search')
  async searchUsers(@Query('q') query: string, @Request() req) {
    const currentUserId = req.user?.userId;
    return this.usersService.search(query, currentUserId);
  }

  @Get(':id')
  async getUserById(@Param('id') userId: string) {
    const user = await this.usersService.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Remove sensitive data
    const { password, hashedRefreshToken, ...safeUser } = user as any;
    return safeUser;
  }

  @Get(':id/clubs')
  async getUserClubs(@Param('id') userId: string) {
    return this.usersService.getUserClubs(userId);
  }

  @Get(':id/events')
  async getUserEvents(@Param('id') userId: string) {
    return this.usersService.getUserEvents(userId);
  }

  @Get(':id/posts')
  async getUserPosts(@Param('id') userId: string) {
    return this.usersService.getUserPosts(userId);
  }
}
