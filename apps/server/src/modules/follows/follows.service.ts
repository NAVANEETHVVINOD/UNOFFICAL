import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class FollowsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Check if user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });
    if (!targetUser) throw new BadRequestException('User not found');

    // Check if already following
    const existing = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existing) return existing;

    const follow = await this.prisma.follows.create({
      data: {
        followerId,
        followingId,
      },
      include: {
        User_Follows_followerIdToUser: {
          include: { Profile: true },
        },
      },
    });

    // Send follow notification
    const followerName = follow.User_Follows_followerIdToUser.Profile?.fullName || 'Someone';
    await this.notificationsService.createNotification({
      userId: followingId,
      type: NotificationType.FOLLOW,
      title: 'New Follower',
      message: `${followerName} started following you`,
      actionUrl: `/profile/${followerId}`,
      actorId: followerId,
    });

    return follow;
  }

  async unfollow(followerId: string, followingId: string) {
    // Check if following
    const existing = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existing) return { message: 'Not following' };

    return this.prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  async getFollowers(userId: string) {
    return this.prisma.follows.findMany({
      where: { followingId: userId },
      include: {
        User_Follows_followerIdToUser: {
          include: { Profile: true },
        },
      },
    });
  }

  async getFollowing(userId: string) {
    return this.prisma.follows.findMany({
      where: { followerId: userId },
      include: {
        User_Follows_followingIdToUser: {
          include: { Profile: true },
        },
      },
    });
  }

  async getStatus(followerId: string, followingId: string) {
    const follow = await this.prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
    return { isFollowing: !!follow };
  }

  /**
   * Get follower and following counts for a user.
   * 
   * **Validates: Requirements 28.3, 28.4**
   */
  async getCounts(userId: string) {
    const [followerCount, followingCount] = await Promise.all([
      this.prisma.follows.count({ where: { followingId: userId } }),
      this.prisma.follows.count({ where: { followerId: userId } }),
    ]);
    return { followerCount, followingCount };
  }
}
