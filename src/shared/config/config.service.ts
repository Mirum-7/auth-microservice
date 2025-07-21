import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'default-secret-for-development');
  }

  get domain(): string {
    return this.configService.get<string>('DOMAIN', '.mirum7.dev');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get cookieSecret(): string {
    return this.configService.get<string>('COOKIE_SECRET', 'default-cookie-secret');
  }
}