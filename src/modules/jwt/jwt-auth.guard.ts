import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { PRIVATE_KEY } from '@/shared/decorators';
import { JwtTokenService } from './jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Проверка, является ли маршрут приватным
    const isPrivate = this.reflector.getAllAndOverride<boolean>(PRIVATE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Если маршрут не приватный, разрешить доступ
    if (!isPrivate) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Извлечение токена из cookies
    const token = request.cookies?.jwt;

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const payload = await this.jwtTokenService.verifyToken(token);
      
      // Убедиться, что это access токен
      if (payload.type !== 'access') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Прикрепить информацию о пользователе к запросу
      request.user = {
        userId: payload.userId,
        username: payload.username,
        email: payload.email,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

// Расширение Express Request интерфейса для включения пользователя
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        email: string;
      };
    }
  }
}