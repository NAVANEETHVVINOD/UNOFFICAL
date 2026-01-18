import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserType } from '@prisma/client';

describe('ProfilesController Integration - UserType', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    college: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH /profiles/me - Update userType', () => {
    it('should accept and update userType to STUDENT', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
      };

      const updateDto = {
        userType: UserType.STUDENT,
        fullName: 'Test User',
      };

      const expectedProfile = {
        id: 'profile-123',
        userId: 'user-123',
        userType: UserType.STUDENT,
        fullName: 'Test User',
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

      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBe(UserType.STUDENT);
      expect(mockPrismaService.profile.update).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
        data: updateDto,
      });
    });

    it('should accept and update userType to ORGANIZER', async () => {
      const mockRequest = {
        user: { userId: 'user-456' },
      };

      const updateDto = {
        userType: UserType.ORGANIZER,
      };

      const expectedProfile = {
        id: 'profile-456',
        userId: 'user-456',
        userType: UserType.ORGANIZER,
        fullName: 'Organizer User',
        bio: null,
        avatarUrl: null,
        collegeId: null,
        tags: [],
        githubUrl: null,
        instagram: null,
        socials: null,
        interests: [],
        isOnboarded: true,
        onboardingStep: 3,
        linkedin: null,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.profile.update.mockResolvedValue(expectedProfile);

      const result = await controller.updateProfile(mockRequest, updateDto);

      expect(result.userType).toBe(UserType.ORGANIZER);
    });

    it('should accept all valid UserType enum values', async () => {
      const mockRequest = {
        user: { userId: 'user-789' },
      };

      const userTypes = [
        UserType.STUDENT,
        UserType.PROFESSIONAL,
        UserType.ORGANIZER,
        UserType.TEACHER,
      ];

      for (const userType of userTypes) {
        const updateDto = { userType };
        const expectedProfile = {
          id: 'profile-789',
          userId: 'user-789',
          userType,
          fullName: 'Test User',
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

        const result = await controller.updateProfile(mockRequest, updateDto);

        expect(result.userType).toBe(userType);
      }

      // Should have been called 4 times (once for each userType)
      expect(mockPrismaService.profile.update).toHaveBeenCalledTimes(4);
    });
  });

  describe('GET /profiles/me - Retrieve profile with userType', () => {
    it('should return profile with userType field included', async () => {
      const mockRequest = {
        user: { userId: 'user-123' },
      };

      const expectedProfile = {
        id: 'profile-123',
        userId: 'user-123',
        userType: UserType.PROFESSIONAL,
        fullName: 'Professional User',
        bio: 'I am a professional',
        avatarUrl: 'https://example.com/avatar.jpg',
        collegeId: 'college-123',
        tags: ['tech', 'business'],
        githubUrl: 'https://github.com/user',
        instagram: 'user_insta',
        socials: null,
        interests: ['networking', 'events'],
        isOnboarded: true,
        onboardingStep: 3,
        linkedin: 'https://linkedin.com/in/user',
        points: 150,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-123',
          email: 'professional@example.com',
          role: 'STUDENT', // Permission role is separate from userType
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

      const result = await controller.getMyProfile(mockRequest);

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBe(UserType.PROFESSIONAL);
      expect(result.user.role).toBe('STUDENT'); // Verify role is separate
    });

    it('should return profile with null userType if not set', async () => {
      const mockRequest = {
        user: { userId: 'user-new' },
      };

      const expectedProfile = {
        id: 'profile-new',
        userId: 'user-new',
        userType: null, // Not set during onboarding yet
        fullName: 'New User',
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
          id: 'user-new',
          email: 'new@example.com',
          role: 'STUDENT',
        },
        college: null,
        education: [],
        experience: [],
        projects: [],
        volunteering: [],
      };

      mockPrismaService.profile.findUnique.mockResolvedValue(expectedProfile);

      const result = await controller.getMyProfile(mockRequest);

      expect(result.userType).toBeNull();
    });
  });
});
