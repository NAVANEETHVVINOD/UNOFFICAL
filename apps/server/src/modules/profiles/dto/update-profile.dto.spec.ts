import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateProfileDto } from './update-profile.dto';
import { UserType } from '@prisma/client';

describe('UpdateProfileDto - UserType Validation', () => {
  it('should accept valid UserType STUDENT', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: UserType.STUDENT,
      fullName: 'Test User',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept valid UserType PROFESSIONAL', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: UserType.PROFESSIONAL,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept valid UserType ORGANIZER', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: UserType.ORGANIZER,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept valid UserType TEACHER', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: UserType.TEACHER,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should reject invalid userType value', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: 'INVALID_TYPE',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    
    const userTypeError = errors.find(error => error.property === 'userType');
    expect(userTypeError).toBeDefined();
    expect(userTypeError?.constraints?.isEnum).toContain('userType must be one of: STUDENT, PROFESSIONAL, ORGANIZER, TEACHER');
  });

  it('should accept undefined userType (optional field)', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      fullName: 'Test User',
      bio: 'Test bio',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should accept null userType', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: null,
      fullName: 'Test User',
    });

    const errors = await validate(dto);
    // null should be accepted since the field is optional
    expect(errors.length).toBe(0);
  });

  it('should validate userType along with other fields', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: UserType.ORGANIZER,
      fullName: 'Event Organizer',
      bio: 'I organize events',
      avatarUrl: 'https://example.com/avatar.jpg',
      githubUrl: 'https://github.com/organizer',
      instagram: 'organizer_insta',
      interests: ['events', 'networking'],
      isOnboarded: true,
      collegeId: 'college-123',
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
    expect(dto.userType).toBe(UserType.ORGANIZER);
  });

  it('should reject when userType is a number', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: 123,
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    
    const userTypeError = errors.find(error => error.property === 'userType');
    expect(userTypeError).toBeDefined();
  });

  it('should reject when userType is an object', async () => {
    const dto = plainToInstance(UpdateProfileDto, {
      userType: { type: 'STUDENT' },
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    
    const userTypeError = errors.find(error => error.property === 'userType');
    expect(userTypeError).toBeDefined();
  });

  it('should accept all four valid UserType enum values', async () => {
    const validTypes = [
      UserType.STUDENT,
      UserType.PROFESSIONAL,
      UserType.ORGANIZER,
      UserType.TEACHER,
    ];

    for (const userType of validTypes) {
      const dto = plainToInstance(UpdateProfileDto, { userType });
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });
});
