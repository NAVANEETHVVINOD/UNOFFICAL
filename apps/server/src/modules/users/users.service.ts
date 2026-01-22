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
        Profile: {
          include: {
            College: true,
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
            Profile: {
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
        Profile: {
          include: {
            College: true,
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
      profile: user.Profile,
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
        Club: {
          include: {
            College: true,
            _count: {
              select: { ClubMember: true },
            },
          },
        },
      },
    });

    return memberships.map((membership) => ({
      id: membership.Club.id,
      name: membership.Club.name,
      slug: membership.Club.slug,
      description: membership.Club.description,
      college: membership.Club.College,
      memberCount: membership.Club._count.ClubMember,
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
        Event: {
          include: {
            Club: true,
            College: true,
            _count: {
              select: { EventAttendance: true },
            },
          },
        },
      },
      orderBy: {
        Event: {
          startsAt: 'desc',
        },
      },
    });

    return attendances.map((attendance) => ({
      id: attendance.Event.id,
      title: attendance.Event.title,
      description: attendance.Event.description,
      startsAt: attendance.Event.startsAt,
      endsAt: attendance.Event.endsAt,
      venue: attendance.Event.venue,
      club: attendance.Event.Club,
      college: attendance.Event.College,
      participantCount: attendance.Event._count.EventAttendance,
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
        User: {
          include: {
            Profile: true,
          },
        },
        Club: true,
        College: true,
        _count: {
          select: {
            PostLike: true,
            Comment: true,
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
      author: post.User
        ? {
            id: post.User.id,
            profile: post.User.Profile,
          }
        : null,
      club: post.Club,
      college: post.College,
      likeCount: post._count.PostLike,
      commentCount: post._count.Comment,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));
  }

  /**
   * Get all saved items for a user.
   * Supports filtering by type (POST, EVENT, LISTING, NOTE).
   * 
   * **Validates: Requirements 27.4**
   */
  async getSavedItems(userId: string, type?: 'POST' | 'EVENT' | 'LISTING' | 'NOTE') {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const savedItems = await this.prisma.savedItem.findMany({
      where,
      include: {
        Post: {
          include: {
            User: {
              include: {
                Profile: true,
              },
            },
            _count: {
              select: {
                PostLike: true,
                Comment: true,
              },
            },
          },
        },
        Event: {
          include: {
            Club: true,
            College: true,
            _count: {
              select: { EventAttendance: true },
            },
          },
        },
        MarketplaceListing: {
          include: {
            User: {
              include: {
                Profile: true,
              },
            },
            College: true,
          },
        },
        Note: {
          include: {
            User: {
              include: {
                Profile: true,
              },
            },
            College: true,
            _count: {
              select: { NoteLike: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return savedItems.map((item) => ({
      id: item.id,
      type: item.type,
      createdAt: item.createdAt,
      post: item.Post ? {
        id: item.Post.id,
        type: item.Post.type,
        content: item.Post.content,
        imageUrl: item.Post.imageUrl,
        author: item.Post.User ? {
          id: item.Post.User.id,
          profile: item.Post.User.Profile,
        } : null,
        likeCount: item.Post._count.PostLike,
        commentCount: item.Post._count.Comment,
        createdAt: item.Post.createdAt,
      } : null,
      event: item.Event ? {
        id: item.Event.id,
        title: item.Event.title,
        description: item.Event.description,
        startsAt: item.Event.startsAt,
        endsAt: item.Event.endsAt,
        venue: item.Event.venue,
        club: item.Event.Club,
        college: item.Event.College,
        attendeeCount: item.Event._count.EventAttendance,
      } : null,
      listing: item.MarketplaceListing ? {
        id: item.MarketplaceListing.id,
        title: item.MarketplaceListing.title,
        description: item.MarketplaceListing.description,
        price: item.MarketplaceListing.price,
        imageUrl: item.MarketplaceListing.imageUrl,
        status: item.MarketplaceListing.status,
        type: item.MarketplaceListing.type,
        owner: item.MarketplaceListing.User ? {
          id: item.MarketplaceListing.User.id,
          profile: item.MarketplaceListing.User.Profile,
        } : null,
        college: item.MarketplaceListing.College,
      } : null,
      note: item.Note ? {
        id: item.Note.id,
        title: item.Note.title,
        description: item.Note.description,
        subject: item.Note.subject,
        semester: item.Note.semester,
        fileUrl: item.Note.fileUrl,
        author: item.Note.User ? {
          id: item.Note.User.id,
          profile: item.Note.User.Profile,
        } : null,
        college: item.Note.College,
        likeCount: item.Note._count.NoteLike,
      } : null,
    }));
  }
}
