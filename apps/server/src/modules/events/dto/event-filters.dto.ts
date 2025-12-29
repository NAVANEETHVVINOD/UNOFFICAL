import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum EventScopeFilter {
  COLLEGE = 'campus',
  GLOBAL = 'global',
}

export enum DateRangeFilter {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  ALL = 'all',
}

export enum PriceTypeFilter {
  FREE = 'free',
  PAID = 'paid',
  ALL = 'all',
}

export class EventFiltersDto {
  @IsOptional()
  @IsEnum(EventScopeFilter)
  scope?: EventScopeFilter;

  @IsOptional()
  @IsEnum(DateRangeFilter)
  dateRange?: DateRangeFilter;

  @IsOptional()
  @IsEnum(PriceTypeFilter)
  priceType?: PriceTypeFilter;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  collegeId?: string;

  @IsOptional()
  @IsString()
  collegeSlug?: string;

  @IsOptional()
  cursor?: string;

  @IsOptional()
  limit?: string;
}
