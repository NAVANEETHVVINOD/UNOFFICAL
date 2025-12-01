import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') token: string) {
    return this.authService.refreshToken(token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.authService.loginWithUser(
      req.user,
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontendUrl}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth(@Req() req) {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = await this.authService.loginWithUser(
      req.user,
    );
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontendUrl}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`,
    );
  }
}
