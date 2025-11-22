import { IsString, IsOptional, IsArray } from 'class-validator';

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
}
