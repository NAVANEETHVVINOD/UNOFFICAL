import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * GET /notifications
   * Get all notifications for the authenticated user
   * Requirements: 33.4
   */
  @Get()
  async getNotifications(@Request() req: { user: { userId: string } }) {
    return this.notificationsService.getNotifications(req.user.userId);
  }

  /**
   * POST /notifications/:id/read
   * Mark a specific notification as read
   */
  @Post(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    await this.notificationsService.markAsRead(id, req.user.userId);
    return { success: true };
  }

  /**
   * POST /notifications/read-all
   * Mark all notifications as read
   */
  @Post('read-all')
  async markAllAsRead(@Request() req: { user: { userId: string } }) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { success: true };
  }
}
