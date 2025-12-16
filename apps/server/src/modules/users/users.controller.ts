import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
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
}
