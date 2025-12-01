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

    // Validate College Existence
    if (updateData.collegeId && typeof updateData.collegeId === 'string') {
      const collegeExists = await this.prisma.college.findUnique({
        where: { id: updateData.collegeId },
      });
      if (!collegeExists) {
        throw new BadRequestException('Invalid collegeId');
      }
    }

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

    // Validate Social URLs
    const validateUrl = (url: string, domain: string) => {
      if (!url) return;
      try {
        const parsed = new URL(url);
        if (!parsed.hostname.includes(domain)) {
          throw new Error();
        }
        // Basic XSS prevention
        if (parsed.protocol === 'javascript:') {
          throw new Error();
        }
      } catch {
        throw new BadRequestException(`Invalid ${domain} URL`);
      }
    };

    if (updateData.instagram)
      validateUrl(updateData.instagram, 'instagram.com');
    if (updateData.linkedin) validateUrl(updateData.linkedin, 'linkedin.com');
    if (updateData.githubUrl) validateUrl(updateData.githubUrl, 'github.com');

    return this.prisma.profile.update({
      data,
      where,
    });
  }
}
