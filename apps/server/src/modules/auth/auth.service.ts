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
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('jwt.refreshSecret'),
      });
      const tokens = await this.generateTokens(
        decoded.sub,
        decoded.email,
        decoded.role,
      );
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('jwt.accessSecret'),
        expiresIn: this.config.get('jwt.accessExpires'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.get('jwt.refreshSecret'),
        expiresIn: this.config.get('jwt.refreshExpires'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private sanitizeUser(user: any) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
