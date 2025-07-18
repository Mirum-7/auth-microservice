import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto, UsersService } from '../users';
import { JwtTokenService, JwtTokens } from '../jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(createUserDto: CreateUserDto, response: Response) {
    const user = await this.usersService.createOne(createUserDto);

    // Generate JWT tokens
    const tokens = await this.jwtTokenService.generateTokens(user.id);
    
    // Set cookies
    this.jwtTokenService.setTokenCookies(response, tokens);

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(username: string, password: string, response: Response) {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid password or username');
    }

    const isValid = await this.usersService.verifyPassword(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid password or username');
    }

    // Generate JWT tokens
    const tokens = await this.jwtTokenService.generateTokens(user.id);
    
    // Set cookies
    this.jwtTokenService.setTokenCookies(response, tokens);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Refresh access token using refresh token from cookies
   */
  async refreshTokens(refreshToken: string, response: Response): Promise<{ message: string }> {
    const payload = await this.jwtTokenService.verifyToken(refreshToken);
    
    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token type');
    }

    // Generate new tokens
    const tokens = await this.jwtTokenService.generateTokens(payload.userId);
    
    // Set new cookies
    this.jwtTokenService.setTokenCookies(response, tokens);

    return { message: 'Tokens refreshed successfully' };
  }

  /**
   * Logout user by clearing JWT cookies
   */
  async logout(response: Response): Promise<{ message: string }> {
    this.jwtTokenService.clearTokenCookies(response);
    return { message: 'Logged out successfully' };
  }
}
