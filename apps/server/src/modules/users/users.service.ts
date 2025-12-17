import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      include: {
        profile: {
          include: {
            college: true,
          },
        },
      },
    });
  }

  async search(query: string, currentUserId?: string): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          {
            profile: {
              fullName: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
          {
            email: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        profile: {
          include: {
            college: true,
          },
        },
      },
      take: 10,
    });

    // Calculate mutual connections if currentUserId is provided
    // For now, we return a placeholder count (this can be enhanced with actual connection logic)
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      profile: user.profile,
      mutualConnections: 0, // Placeholder - can be calculated based on shared clubs/events
    }));
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  /**
   * Get all clubs that a user has joined
   * Requirements: 33.1
   */
  async getUserClubs(userId: string) {
    const memberships = await this.prisma.clubMember.findMany({
      where: { userId },
      include: {
        club: {
          include: {
            college: true,
            _count: {
              select: { members: true },
            },
          },
        },
      },
    });

    return memberships.map((membership) => ({
      id: membership.club.id,
      name: membership.club.name,
      slug: membership.club.slug,
      description: membership.club.description,
      college: membership.club.college,
      memberCount: membership.club._count.members,
      role: membership.role,
      displayRole: membership.displayRole,
      joinedAt: membership.joinedAt,
    }));
  }

  /**
   * Get all events that a user has attended or RSVP'd to
   * Requirements: 33.2
   */
  async getUserEvents(userId: string) {
    const attendances = await this.prisma.eventAttendance.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            club: true,
            college: true,
            _count: {
              select: { attendees: true },
            },
          },
        },
      },
      orderBy: {
        event: {
          startsAt: 'desc',
        },
      },
    });

    return attendances.map((attendance) => ({
      id: attendance.event.id,
      title: attendance.event.title,
      description: attendance.event.description,
      startsAt: attendance.event.startsAt,
      endsAt: attendance.event.endsAt,
      venue: attendance.event.venue,
      club: attendance.event.club,
      college: attendance.event.college,
      participantCount: attendance.event._count.attendees,
      status: attendance.status,
      role: attendance.role,
      checkedIn: attendance.checkInTime !== null,
      checkInTime: attendance.checkInTime,
    }));
  }

  /**
   * Get all non-anonymous posts created by a user
   * Requirements: 33.3
   */
  async getUserPosts(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: {
        authorId: userId,
        isAnonymous: false,
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
        club: true,
        college: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      id: post.id,
      type: post.type,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      author: post.author
        ? {
            id: post.author.id,
            profile: post.author.profile,
          }
        : null,
      club: post.club,
      college: post.college,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }
}
