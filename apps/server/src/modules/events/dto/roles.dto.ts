import { IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { EventRoleType } from '@prisma/client';

export class AssignRoleDto {
  @IsString()
  userId: string;

  @IsEnum(EventRoleType)
  role: EventRoleType;
}

export class RemoveRoleDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class TransferOwnershipDto {
  @IsString()
  newOwnerId: string;
}

export class SearchUsersDto {
  @IsString()
  @MinLength(2)
  query: string;
}
