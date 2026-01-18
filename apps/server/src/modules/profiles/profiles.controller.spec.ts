import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { UserType } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  const mockProfilesService = {
    findOne: jest.fn(),
    update: jest.fn(),
    addEducation: jest.fn(),
    removeEducation: jest.fn(),
    addExperience: jest.fn(),
    removeExperience: jest.fn(),
    addProject: jest.fn(),
    removeProject: jest.fn(),
    addVolunteering: jest.fn(),
    removeVolunteering: jest.fn(),
    getLeaderboard: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilesController],
      providers: [
        {
          provide: ProfilesService,
          useValue: mockProfilesService,
        },
      ],
    }).compile();

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('updateProfile with userType', () => {
    it('should update profile with valid userType STUDENT', async () => {
      const userId = 'user-123';
      const req = { user: { userId } };
      const updateDto: UpdateProfileDto = {
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

      mockProfilesService.update.mockResolvedValue(expectedProfile);

      const result = await controller.updateProfile(req, updateDto);

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBe(UserType.STUDENT);
      expect(mockProfilesService.update).toHaveBeenCalledWith({
        where: { userId },
        data: updateDto,
      });
    });

    it('should update profile with valid userType PROFESSIONAL', async () => {
      const userId = 'user-123';
      const req = { user: { userId } };
      const updateDto: UpdateProfileDto = {
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

      mockProfilesService.update.mockResolvedValue(expectedProfile);

      const result = await controller.updateProfile(req, updateDto);

      expect(result.userType).toBe(UserType.PROFESSIONAL);
    });

    it('should update profile with valid userType ORGANIZER', async () => {
      const userId = 'user-123';
      const req = { user: { userId } };
      const updateDto: UpdateProfileDto = {
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

      mockProfilesService.update.mockResolvedValue(expectedProfile);

      const result = await controller.updateProfile(req, updateDto);

      expect(result.userType).toBe(UserType.ORGANIZER);
    });

    it('should update profile with valid userType TEACHER', async () => {
      const userId = 'user-123';
      const req = { user: { userId } };
      const updateDto: UpdateProfileDto = {
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

      mockProfilesService.update.mockResolvedValue(expectedProfile);

      const result = await controller.updateProfile(req, updateDto);

      expect(result.userType).toBe(UserType.TEACHER);
    });

    it('should update profile without userType field', async () => {
      const userId = 'user-123';
      const req = { user: { userId } };
      const updateDto: UpdateProfileDto = {
        fullName: 'Updated Name',
        bio: 'Updated bio',
      };

      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: UserType.STUDENT, // Existing value unchanged
        fullName: 'Updated Name',
        bio: 'Updated bio',
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

      mockProfilesService.update.mockResolvedValue(expectedProfile);

      const result = await controller.updateProfile(req, updateDto);

      expect(result.fullName).toBe('Updated Name');
      expect(result.bio).toBe('Updated bio');
    });
  });

  describe('getMyProfile with userType', () => {
    it('should return profile with userType field', async () => {
      const userId = 'user-123';
      const req = { user: { userId } };

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
      };

      mockProfilesService.findOne.mockResolvedValue(expectedProfile);

      const result = await controller.getMyProfile(req);

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBe(UserType.ORGANIZER);
      expect(mockProfilesService.findOne).toHaveBeenCalledWith({ userId });
    });

    it('should return profile with null userType if not set', async () => {
      const userId = 'user-123';
      const req = { user: { userId } };

      const expectedProfile = {
        id: 'profile-123',
        userId,
        userType: null,
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

      mockProfilesService.findOne.mockResolvedValue(expectedProfile);

      const result = await controller.getMyProfile(req);

      expect(result).toEqual(expectedProfile);
      expect(result.userType).toBeNull();
    });
  });
});
