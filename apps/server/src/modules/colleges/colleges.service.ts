import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { College, Prisma } from '@prisma/client';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<College[]> {
    return this.prisma.college.findMany();
  }

  async findOne(
    collegeWhereUniqueInput: Prisma.CollegeWhereUniqueInput,
  ): Promise<College | null> {
    return this.prisma.college.findUnique({
      where: collegeWhereUniqueInput,
      include: { clubs: true },
    });
  }

  async getStats(slug: string) {
    const college = await this.prisma.college.findUnique({
      where: { slug },
    });

    if (!college) {
      throw new Error('College not found');
    }

    const [totalClubs, totalEvents, totalMarketplacePosts, totalNotes, totalMembers] = await Promise.all([
      this.prisma.club.count({ where: { collegeId: college.id } }),
      this.prisma.event.count({ where: { collegeId: college.id } }),
      this.prisma.marketplaceListing.count({ where: { collegeId: college.id } }),
      this.prisma.note.count({ where: { collegeId: college.id } }),
      this.prisma.profile.count({ where: { collegeId: college.id } }),
    ]);

    return {
      totalClubs,
      totalEvents,
      totalMarketplacePosts,
      totalNotes,
      totalMembers,
    };
  }
}
