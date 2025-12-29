import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Request,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
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

  /**
   * Get all saved items for the authenticated user.
   * Supports filtering by type (POST, EVENT, LISTING, NOTE).
   * 
   * **Validates: Requirements 27.4**
   */
  @UseGuards(JwtAuthGuard)
  @Get('me/saved')
  async getSavedItems(
    @Request() req,
    @Query('type') type?: 'POST' | 'EVENT' | 'LISTING' | 'NOTE',
  ) {
    return this.usersService.getSavedItems(req.user.userId, type);
  }

  /**
   * Get blocked users for the authenticated user.
   * Returns empty array as blocking feature is not yet implemented.
   */
  @UseGuards(JwtAuthGuard)
  @Get('blocked')
  async getBlockedUsers(@Request() req) {
    // TODO: Implement blocking feature
    return [];
  }

  /**
   * Delete the authenticated user's account.
   * This permanently removes the user and all associated data.
   */
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteAccount(@Request() req) {
    const userId = req.user.userId;
    await this.usersService.remove({ id: userId });
    return { success: true, message: 'Account deleted successfully' };
  }

  /**
   * Search users by name or email.
   * 
   * **Validates: Requirements 29.1**
   */
  @UseGuards(JwtAuthGuard)
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
