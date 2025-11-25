import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

@Injectable()
export class CollegeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const collegeId =
      request.params.collegeId ||
      request.body.collegeId ||
      request.query.collegeId;

    if (!user) {
      return false;
    }

    // Platform Admin can access everything
    if (user.role === Role.PLATFORM_ADMIN) {
      return true;
    }

    // If no collegeId context, skip (or handle differently)
    if (!collegeId) {
      return true;
    }

    // Check if user belongs to the college
    // Assuming user.profile.collegeId is populated in the request.user object
    // You might need to ensure the JwtStrategy populates the profile/collegeId
    if (user.profile?.collegeId === collegeId) {
      return true;
    }

    throw new ForbiddenException('You do not have access to this college');
  }
}
