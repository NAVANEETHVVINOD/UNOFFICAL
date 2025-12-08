import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PostType {
  TEXT = 'TEXT',
  POLL = 'POLL',
  COLLAB = 'COLLAB',
  MEDIA = 'MEDIA',
}

class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @IsString({ each: true })
  options: string[];
}

export class CreatePostDto {
  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  title?: string; // For Collab

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePollDto)
  poll?: CreatePollDto;

  @IsString()
  @IsOptional()
  clubId?: string;
}
