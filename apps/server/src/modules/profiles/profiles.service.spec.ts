import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserType } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    profile: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    college: {
      findUnique: jest.fn(),
    },
    education: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    experience: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    project: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    volunteering: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfilesService>(ProfilesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('update profile with userType', () => {
    it('should update profile with valid userType STUDENT', async () => {
      const userId = 'user-123';
      const updateData = {
        userType: UserType.STUDENT,
        fullName: 'John Doe',
      };

      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: UserType.STUDENT,
        fullName: 'John Doe',
        bio: null,
        avatarUrl: null,
        collegeId: null,
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: false,
        onboardingStep: 0,
        linkedin: null,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.update.mockResolvedValue(expectedProfile);

      const result = await service.update({
        where: { userId },
        data: updateData,
      });

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBe(UserType.STUDENT);
      expect(mockPrismaService.profile.update).toHaveBeenCalledWith({
        where: { userId },
        data: updateData,
      });
    });

    it('should update profile with valid userType PROFESSIONAL', async () => {
      const userId = 'user-123';
      const updateData = {
        userType: UserType.PROFESSIONAL,
      };

      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: UserType.PROFESSIONAL,
        fullName: 'Jane Doe',
        bio: null,
        avatarUrl: null,
        collegeId: null,
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: false,
        onboardingStep: 0,
        linkedin: null,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.update.mockResolvedValue(expectedProfile);

      const result = await service.update({
        where: { userId },
        data: updateData,
      });

      expect(result.userType).toBe(UserType.PROFESSIONAL);
    });

    it('should update profile with valid userType ORGANIZER', async () => {
      const userId = 'user-123';
      const updateData = {
        userType: UserType.ORGANIZER,
      };

      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: UserType.ORGANIZER,
        fullName: 'Bob Smith',
        bio: null,
        avatarUrl: null,
        collegeId: null,
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: false,
        onboardingStep: 0,
        linkedin: null,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.update.mockResolvedValue(expectedProfile);

      const result = await service.update({
        where: { userId },
        data: updateData,
      });

      expect(result.userType).toBe(UserType.ORGANIZER);
    });

    it('should update profile with valid userType TEACHER', async () => {
      const userId = 'user-123';
      const updateData = {
        userType: UserType.TEACHER,
      };

      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: UserType.TEACHER,
        fullName: 'Dr. Smith',
        bio: null,
        avatarUrl: null,
        collegeId: null,
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: false,
        onboardingStep: 0,
        linkedin: null,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.update.mockResolvedValue(expectedProfile);

      const result = await service.update({
        where: { userId },
        data: updateData,
      });

      expect(result.userType).toBe(UserType.TEACHER);
    });

    it('should update profile without changing userType if not provided', async () => {
      const userId = 'user-123';
      const updateData = {
        fullName: 'Updated Name',
      };

      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: UserType.STUDENT, // Existing userType unchanged
        fullName: 'Updated Name',
        bio: null,
        avatarUrl: null,
        collegeId: null,
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: false,
        onboardingStep: 0,
        linkedin: null,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.update.mockResolvedValue(expectedProfile);

      const result = await service.update({
        where: { userId },
        data: updateData,
      });

      expect(result.fullName).toBe('Updated Name');
      expect(result.userType).toBe(UserType.STUDENT);
    });
  });

  describe('findOne with userType', () => {
    it('should return profile with userType field', async () => {
      const userId = 'user-123';
      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: UserType.ORGANIZER,
        fullName: 'John Doe',
        bio: 'Test bio',
        avatarUrl: null,
        collegeId: 'college-123',
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: true,
        onboardingStep: 3,
        linkedin: null,
        points: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
          role: 'STUDENT',
        },
        college: {
          id: 'college-123',
          name: 'Test College',
        },
        education: [],
        experience: [],
        projects: [],
        volunteering: [],
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(expectedProfile);

      const result = await service.findOne({ userId });

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBe(UserType.ORGANIZER);
      expect(mockPrismaService.profile.findUnique).toHaveBeenCalledWith({
        where: { userId },
        include: {
          user: true,
          college: true,
          education: { orderBy: { startDate: 'desc' } },
          experience: { orderBy: { startDate: 'desc' } },
          projects: { orderBy: { startDate: 'desc' } },
          volunteering: { orderBy: { startDate: 'desc' } },
        },
      });
    });

    it('should return profile with null userType if not set', async () => {
      const userId = 'user-123';
      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: null, // Not set yet
        fullName: 'John Doe',
        bio: null,
        avatarUrl: null,
        collegeId: null,
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: false,
        onboardingStep: 0,
        linkedin: null,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: userId,
          email: 'test@example.com',
          role: 'STUDENT',
        },
        college: null,
        education: [],
        experience: [],
        projects: [],
        volunteering: [],
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(expectedProfile);

      const result = await service.findOne({ userId });

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBeNull();
    });
  });
});
