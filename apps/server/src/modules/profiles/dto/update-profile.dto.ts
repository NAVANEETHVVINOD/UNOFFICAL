import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  githubUrl?: string;

  @IsString()
  @IsOptional()
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
}
