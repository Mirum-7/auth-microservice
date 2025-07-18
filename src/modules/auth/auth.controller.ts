import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateUserDto } from '../users';
import { AuthService } from './auth.service';
import { JwtTokenService } from '../jwt';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  /**
   * Register a new user
   */
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.register(createUserDto, response);
  }

  /**
   * Login user
   */
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginDto.username, loginDto.password, response);
  }

  /**
   * Refresh access token using refresh token
   */
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = this.jwtTokenService.extractTokenFromCookies(
      request.cookies,
      'refreshToken',
    );

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    return this.authService.refreshTokens(refreshToken, response);
  }

  /**
   * Logout user
   */
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}