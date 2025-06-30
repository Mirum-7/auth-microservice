import { PrismaService } from '../prisma';

export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Получить все права пользователя.
   */
  getUserPermissions(userId: string) {
    return this.prisma.permission.findMany({
      relationLoadStrategy: 'join',
      where: {
        RolePermissions: {
          some: {
            role: {
              UserRoles: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Получить все разрешения.
   */
  getAll(take?: number, skip?: number) {
    return this.prisma.permission.findMany({
      take,
      skip,
    });
  }

  /**
   * Добавить разрешения к роли.
   */
  addManyToRole(roleId: string, permissionsId: string[]) {
    const data = permissionsId.map((id) => ({
      roleId,
      permissionId: id,
    }));

    return this.prisma.rolePermission.createMany({
      skipDuplicates: true,
      data,
    });
  }

  /**
   * Удалить разрешения у роли.
   */
  removeManyFromRole(roleId: string, permissionsId: string[]) {
    return this.prisma.rolePermission.deleteMany({
      where: {
        permissionId: { in: permissionsId },
        roleId,
      },
    });
  }
}
