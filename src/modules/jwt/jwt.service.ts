import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { DecodedJwtPayload, JwtPayload, JwtTokens } from './types';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generate access and refresh tokens for a user
   */
  async generateTokens(userId: string, role?: string): Promise<JwtTokens> {
    const accessPayload: JwtPayload = {
      userId,
      role,
      type: 'access',
    };

    const refreshPayload: JwtPayload = {
      userId,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        subject: userId,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(refreshPayload, {
        subject: userId,
        expiresIn: '30d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify and decode a JWT token
   */
  async verifyToken(token: string): Promise<DecodedJwtPayload> {
    try {
      return await this.jwtService.verifyAsync<DecodedJwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  /**
   * Set JWT tokens as httpOnly cookies
   */
  setTokenCookies(response: Response, tokens: JwtTokens): void {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      domain: process.env.DOMAIN || undefined,
    };

    // Set access token cookie (15 minutes)
    response.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    // Set refresh token cookie (30 days)
    response.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
  }

  /**
   * Clear JWT cookies
   */
  clearTokenCookies(response: Response): void {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      domain: process.env.DOMAIN || undefined,
    };

    response.clearCookie('accessToken', cookieOptions);
    response.clearCookie('refreshToken', cookieOptions);
  }

  /**
   * Extract token from cookies
   */
  extractTokenFromCookies(cookies: Record<string, string>, tokenType: 'accessToken' | 'refreshToken'): string | null {
    return cookies[tokenType] || null;
  }
}