import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { JwtTokenModule } from '../jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, JwtTokenModule],
  exports: [AuthService],
})
export class AuthModule {}
