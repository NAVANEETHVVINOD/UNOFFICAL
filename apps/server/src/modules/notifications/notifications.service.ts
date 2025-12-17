import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actor?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all notifications for a user
   * Requirements: 33.4
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    // Since we don't have a Notification model in the schema yet,
    // we'll generate notifications from user activity
    const notifications: Notification[] = [];

    // Get recent likes on user's posts
    const recentLikes = await this.prisma.postLike.findMany({
      where: {
        post: {
          authorId: userId,
          isAnonymous: false,
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        post: true,
      },
      orderBy: {
        id: 'desc',
      },
      take: 20,
    });

    for (const like of recentLikes) {
      if (like.user && like.user.profile) {
        notifications.push({
          id: `like-${like.id}`,
          type: 'LIKE',
          title: 'New Like',
          message: `${like.user.profile.fullName} liked your post`,
          read: false,
          createdAt: new Date(),
          actionUrl: `/feed?post=${like.postId}`,
          actor: {
            id: like.user.id,
            name: like.user.profile.fullName,
            avatarUrl: like.user.profile.avatarUrl || undefined,
          },
        });
      }
    }

    // Get recent comments on user's posts
    const recentComments = await this.prisma.comment.findMany({
      where: {
        post: {
          authorId: userId,
          isAnonymous: false,
        },
        authorId: {
          not: userId, // Don't notify for own comments
        },
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        post: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    for (const comment of recentComments) {
      if (comment.author && comment.author.profile) {
        notifications.push({
          id: `comment-${comment.id}`,
          type: 'COMMENT',
          title: 'New Comment',
          message: `${comment.author.profile.fullName} commented on your post`,
          read: false,
          createdAt: comment.createdAt,
          actionUrl: `/feed?post=${comment.postId}`,
          actor: {
            id: comment.author.id,
            name: comment.author.profile.fullName,
            avatarUrl: comment.author.profile.avatarUrl || undefined,
          },
        });
      }
    }

    // Get upcoming events the user is attending
    const upcomingEvents = await this.prisma.eventAttendance.findMany({
      where: {
        userId,
        status: 'GOING',
        event: {
          startsAt: {
            gte: new Date(),
            lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
          },
        },
      },
      include: {
        event: {
          include: {
            club: true,
          },
        },
      },
      take: 5,
    });

    for (const attendance of upcomingEvents) {
      notifications.push({
        id: `event-reminder-${attendance.id}`,
        type: 'EVENT_REMINDER',
        title: 'Event Reminder',
        message: `${attendance.event.title} is starting soon`,
        read: false,
        createdAt: new Date(),
        actionUrl: `/events/${attendance.event.id}`,
      });
    }

    // Sort by createdAt descending
    notifications.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    return notifications;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    // Since notifications are generated dynamically, we would need to store
    // read status separately. For now, this is a placeholder.
    // In a full implementation, you'd have a NotificationRead table
    // or store read notification IDs in user preferences
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    // Placeholder for marking all notifications as read
  }
}
