import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsUrl,
  Matches,
} from 'class-validator';

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
}
