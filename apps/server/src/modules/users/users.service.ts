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
}
