import { PrismaModule } from '@/modules/prisma';
import { UsersModule } from '@/modules/users';
import { AuthModule } from '@/modules/auth';
import { AppConfigModule } from '@/shared/config';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule, UsersModule, PrismaModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
