import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum EventScopeDto {
  COLLEGE = 'COLLEGE',
  GLOBAL = 'GLOBAL',
}

export enum EventVisibilityDto {
  PUBLIC = 'PUBLIC',
  INVITE_ONLY = 'INVITE_ONLY',
}

export enum AttendanceModeDto {
  SINGLE_SCAN = 'SINGLE_SCAN',
  ENTRY_EXIT = 'ENTRY_EXIT',
}

export class CreateTicketTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  price?: number; // In paise (0 for free)

  @IsOptional()
  quantity?: number; // null = unlimited

  @IsOptional()
  perUserLimit?: number;

  @IsOptional()
  @IsDateString()
  salesStart?: string;

  @IsOptional()
  @IsDateString()
  salesEnd?: string;
}

export class CreateAgendaBlockDto {
  day: number;

  @IsDateString()
  date: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateEventDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  venue?: string;

  @IsOptional()
  @IsString()
  onlineLink?: string;

  @IsOptional()
  @IsString()
  clubId?: string;

  @IsOptional()
  @IsString()
  collegeId?: string;

  @IsOptional()
  @IsString()
  collegeSlug?: string;

  @IsOptional()
  @IsEnum(EventScopeDto)
  scope?: EventScopeDto;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(EventVisibilityDto)
  visibility?: EventVisibilityDto;

  @IsOptional()
  @IsBoolean()
  waitlistEnabled?: boolean;

  @IsOptional()
  @IsEnum(AttendanceModeDto)
  attendanceMode?: AttendanceModeDto;

  @IsOptional()
  @IsBoolean()
  certificateEnabled?: boolean;

  @IsOptional()
  @IsString()
  certificateTemplateId?: string;

  @IsOptional()
  @IsBoolean()
  autoIssueCertificate?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTypeDto)
  tickets?: CreateTicketTypeDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAgendaBlockDto)
  agendaBlocks?: CreateAgendaBlockDto[];
}
