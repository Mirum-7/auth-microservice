import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class PrismaService extends PrismaClient implements OnModuleDestroy, OnModuleInit {
  onModuleDestroy() {}

  onModuleInit() {}
}
