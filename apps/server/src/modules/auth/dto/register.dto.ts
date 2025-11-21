import { IsEmail, IsString, MinLength, IsEnum, IsInt, Min, Max } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  studentId: string;

  @IsString()
  fullName: string;

  @IsString()
  department: string;

  @IsInt()
  @Min(1)
  @Max(6)
  year: number;
}