import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { PRIVATE_KEY } from '@/shared/decorators';
import { JwtTokenService } from './jwt.service';
import { DecodedJwtPayload } from './types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as private
    const isPrivate = this.reflector.getAllAndOverride<boolean>(PRIVATE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If route is not private, allow access
    if (!isPrivate) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    // Extract access token from cookies
    const accessToken = this.jwtTokenService.extractTokenFromCookies(
      request.cookies,
      'accessToken',
    );

    // Try to validate access token
    if (accessToken) {
      try {
        const payload = await this.jwtTokenService.verifyToken(accessToken);
        
        // Ensure it's an access token
        if (payload.type !== 'access') {
          throw new UnauthorizedException('Invalid token type');
        }

        // Attach user info to request
        request.user = {
          userId: payload.userId,
          role: payload.role,
        };

        return true;
      } catch (error) {
        // Access token is invalid or expired, try refresh
      }
    }

    // Try to refresh token if access token is invalid/missing
    const refreshToken = this.jwtTokenService.extractTokenFromCookies(
      request.cookies,
      'refreshToken',
    );

    if (!refreshToken) {
      throw new UnauthorizedException('No valid tokens found');
    }

    try {
      const refreshPayload = await this.jwtTokenService.verifyToken(refreshToken);
      
      // Ensure it's a refresh token
      if (refreshPayload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token type');
      }

      // Generate new tokens
      const tokens = await this.jwtTokenService.generateTokens(
        refreshPayload.userId,
        refreshPayload.role,
      );

      // Set new cookies
      this.jwtTokenService.setTokenCookies(response, tokens);

      // Verify the new access token to get user info
      const newAccessPayload = await this.jwtTokenService.verifyToken(tokens.accessToken);
      
      // Attach user info to request
      request.user = {
        userId: newAccessPayload.userId,
        role: newAccessPayload.role,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role?: string;
      };
    }
  }
}