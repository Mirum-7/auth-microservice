import { Module } from '@nestjs/common';
import { UsersModule } from '../users';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [UsersModule],
})
export class AuthModule {}
