import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { College, Prisma } from '@prisma/client';

@Injectable()
export class CollegesService {
  constructor(private prisma: PrismaService) {}

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
}
