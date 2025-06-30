import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить все роли пользователя.
   */
  getUserRoles(userId: string) {
    return this.prisma.role.findMany({
      relationLoadStrategy: 'join',
      where: {
        UserRoles: {
          some: {
            userId,
          },
        },
      },
    });
  }

  /**
   * Получить все роли.
   */
  getAllRoles(take?: number, skip?: number) {
    return this.prisma.role.findMany({
      take,
      skip,
    });
  }

  /**
   * Создать роль.
   */
  createOne(data: CreateRoleDto) {
    return this.prisma.role.create({
      data,
    });
  }

  /**
   * Удалить роль.
   */
  removeOne(id: string) {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  /**
   * Удалить несколько ролей.
   */
  removeMany(ids: string[]) {
    return this.prisma.role.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
