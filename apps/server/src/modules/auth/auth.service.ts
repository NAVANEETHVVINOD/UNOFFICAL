/**
 * AuthService
 *
 * Handles all authentication logic including:
 * - User registration (with college association)
 * - Login (email/password)
 * - JWT Token generation (Access & Refresh tokens)
 * - Password hashing (bcrypt)
 */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  async register(registerDto: RegisterDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Resolve collegeId if slug is provided
    let collegeId = registerDto.collegeId;
    if (registerDto.collegeSlug && !collegeId) {
      const college = await this.prisma.college.findUnique({
        where: { slug: registerDto.collegeSlug },
      });
      if (college) {
        collegeId = college.id;
      }
    }

    // Create user and profile
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          profile: {
            create: {
              fullName: registerDto.fullName,
              collegeId: collegeId || null,
            },
          },
        },
        include: { profile: true },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    if (!user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async loginWithUser(user: any) {
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async logout(userId: string) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: { hashedRefreshToken: null },
    });
  }

  async refreshToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('jwt.refreshSecret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        token,
        user.hashedRefreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.generateTokens(
        decoded.sub,
        decoded.email,
        decoded.role,
      );
      await this.updateRefreshToken(decoded.sub, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: hash },
    });
  }

  private async generateTokens(userId: string, email: string | null, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('jwt.accessSecret'),
        expiresIn: '15m', // Short-lived access token
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('jwt.refreshSecret'),
        expiresIn: '7d', // Long-lived refresh token
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateSupabaseUser(payload: any) {
    const { sub, email } = payload;

    // Check if internal user exists
    let user = await this.prisma.user.findUnique({
      where: { supabaseId: sub } as any,
      include: { profile: true },
    });

    if (!user) {
      // Create internal user
      if (email) {
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          // Link existing user to Supabase ID
          user = await this.prisma.user.update({
            where: { id: existingUser.id },
            data: { supabaseId: sub } as any,
            include: { profile: true },
          });
          return user;
        }
      }

      user = await this.prisma.user.create({
        data: {
          supabaseId: sub,
          email,
          role: 'STUDENT',
          profile: {
            create: {
              fullName: '', // Profile will be updated in onboarding
              onboardingStep: 0,
              isOnboarded: false,
            },
          },
        } as any,
        include: { profile: true },
      });
    }

    return user;
  }

  private sanitizeUser(user: any) {
    const { password, hashedRefreshToken, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
