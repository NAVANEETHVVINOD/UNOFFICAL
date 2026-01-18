import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsUrl,
  Matches,
  IsDateString,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '@prisma/client';

export class CreateEducationDto {
  @IsString()
  school: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateExperienceDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class CreateVolunteeringDto {
  @IsString()
  role: string;

  @IsString()
  organization: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  link?: string;
}

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsOptional()
  // Matches either a full URL or a simple username (alphanumeric, dots, underscores)
  @Matches(/^(https?:\/\/[^\s]+)|(^[a-zA-Z0-9._]+$)/, {
    message: 'instagram must be a valid URL or username',
  })
  instagram?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsOptional()
  socials?: any;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsBoolean()
  @IsOptional()
  isOnboarded?: boolean;

  @IsInt()
  @IsOptional()
  onboardingStep?: number;

  @IsString()
  @IsOptional()
  collegeId?: string;

  @IsEnum(UserType, {
    message: 'userType must be one of: STUDENT, PROFESSIONAL, ORGANIZER, TEACHER',
  })
  @IsOptional()
  userType?: UserType;
}
