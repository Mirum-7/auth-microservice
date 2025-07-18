import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DecodedJwtPayload, JwtPayload } from './types';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Создание токена для пользователя
   */
  createToken(userId: string, username: string, email: string): string {
    const payload: JwtPayload = {
      userId,
      username,
      email,
      type: 'access',
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Проверка и декодирование JWT токена
   */
  async verifyToken(token: string): Promise<DecodedJwtPayload> {
    try {
      return await this.jwtService.verifyAsync<DecodedJwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}