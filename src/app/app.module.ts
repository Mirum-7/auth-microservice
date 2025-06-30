import { PrismaModule } from '@/modules/prisma';
import { UsersModule } from '@/modules/users';
import { Module } from '@nestjs/common';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
