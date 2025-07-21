import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: import.meta.env.JWT_SECRET || 'default-secret-for-development',
      signOptions: {
        issuer: 'auth-microservice',
        audience: 'mirum7-app',
      },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
