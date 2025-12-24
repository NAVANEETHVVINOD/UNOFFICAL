import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, Prisma } from '@prisma/client';
import {
  CreateEducationDto,
  CreateExperienceDto,
  CreateProjectDto,
  CreateVolunteeringDto,
} from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findOne(
    profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput,
  ): Promise<Profile | null> {
    return this.prisma.profile.findUnique({
      where: profileWhereUniqueInput,
      include: {
        user: true,
        college: true,
        education: { orderBy: { startDate: 'desc' } },
        experience: { orderBy: { startDate: 'desc' } },
        projects: { orderBy: { startDate: 'desc' } },
        volunteering: { orderBy: { startDate: 'desc' } },
      },
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

  async addEducation(userId: string, dto: CreateEducationDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    return this.prisma.education.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async removeEducation(userId: string, educationId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    // Check ownership
    const edu = await this.prisma.education.findUnique({
      where: { id: educationId },
    });
    if (!edu || edu.profileId !== profile.id)
      throw new BadRequestException('Item not found');

    return this.prisma.education.delete({ where: { id: educationId } });
  }

  async addExperience(userId: string, dto: CreateExperienceDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    return this.prisma.experience.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async removeExperience(userId: string, experienceId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    const exp = await this.prisma.experience.findUnique({
      where: { id: experienceId },
    });
    if (!exp || exp.profileId !== profile.id)
      throw new BadRequestException('Item not found');

    return this.prisma.experience.delete({ where: { id: experienceId } });
  }

  async addProject(userId: string, dto: CreateProjectDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    return this.prisma.project.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async removeProject(userId: string, projectId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    const proj = await this.prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!proj || proj.profileId !== profile.id)
      throw new BadRequestException('Item not found');

    return this.prisma.project.delete({ where: { id: projectId } });
  }

  async addVolunteering(userId: string, dto: CreateVolunteeringDto) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    return this.prisma.volunteering.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async removeVolunteering(userId: string, volunteeringId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new BadRequestException('Profile not found');

    const vol = await this.prisma.volunteering.findUnique({
      where: { id: volunteeringId },
    });
    if (!vol || vol.profileId !== profile.id)
      throw new BadRequestException('Item not found');

    return this.prisma.volunteering.delete({ where: { id: volunteeringId } });
  }

  async getLeaderboard(limit = 10) {
    return this.prisma.profile.findMany({
      orderBy: { points: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });
  }
}
