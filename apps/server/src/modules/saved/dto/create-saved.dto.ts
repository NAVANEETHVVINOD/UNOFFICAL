import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export enum SavedType {
  POST = 'POST',
  EVENT = 'EVENT',
  LISTING = 'LISTING',
  NOTE = 'NOTE',
}

export class CreateSavedDto {
  @IsEnum(SavedType)
  @IsNotEmpty()
  type: SavedType;

  @IsString()
  @IsOptional()
  postId?: string;

  @IsString()
  @IsOptional()
  eventId?: string;

  @IsString()
  @IsOptional()
  listingId?: string;

  @IsString()
  @IsOptional()
  noteId?: string;
}
