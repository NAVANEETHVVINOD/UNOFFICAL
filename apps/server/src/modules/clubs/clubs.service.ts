import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Club, Prisma } from '@prisma/client';

@Injectable()
export class ClubsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClubWhereUniqueInput;
    where?: Prisma.ClubWhereInput;
    orderBy?: Prisma.ClubOrderByWithRelationInput;
  }): Promise<Club[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.club.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(
    clubWhereUniqueInput: Prisma.ClubWhereUniqueInput,
  ): Promise<Club | null> {
    return this.prisma.club.findUnique({
      where: clubWhereUniqueInput,
      include: { members: true, events: true },
    });
  }

  async create(data: Prisma.ClubCreateInput): Promise<Club> {
    return this.prisma.club.create({
      data,
    });
  }

  async joinClub(userId: string, clubId: string) {
    return this.prisma.clubMember.create({
      data: {
        userId,
        clubId,
      },
    });
  }

  async leaveClub(userId: string, clubId: string) {
    return this.prisma.clubMember.deleteMany({
      where: {
        userId,
        clubId,
      },
    });
  }

  async updateMemberRole(
    userId: string,
    clubId: string,
    role: 'MEMBER' | 'LEAD' | 'STAFF',
    displayRole?: string,
  ) {
    return this.prisma.clubMember.update({
      where: {
        userId_clubId: {
          userId,
          clubId,
        },
      },
      data: {
        role,
        displayRole,
      },
    });
  }
}
