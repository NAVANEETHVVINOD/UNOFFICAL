import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, Prisma } from '@prisma/client';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput,
  ): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: profileWhereUniqueInput,
      include: { user: true, college: true },
    });
  }

  async update(params: {
    where: Prisma.ProfileWhereUniqueInput;
    data: Prisma.ProfileUpdateInput;
  }): Promise<Profile> {
    const { where, data } = params;

    // Validation: College is required to complete onboarding
    const updateData = data as any;
    if (updateData.isOnboarded === true) {
      // Check if collegeId is being set OR already exists
      if (!updateData.collegeId) {
        const existingProfile = await this.prisma.profile.findUnique({ where });
        if (!existingProfile?.collegeId) {
          throw new BadRequestException(
            'College is required to complete onboarding',
          );
        }
      }
    }

    return this.prisma.profile.update({
      data,
      where,
    });
  }
}
