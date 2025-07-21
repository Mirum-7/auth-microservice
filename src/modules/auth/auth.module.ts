import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users';
import { AppConfigModule, AppConfigService } from '../../shared/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    AppConfigModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
      }),
      inject: [AppConfigService],
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
