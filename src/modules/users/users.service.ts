import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateUserDto, FindUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private hashPassword(password: string) {
    return Bun.password.hash(password);
  }

  public verifyPassword(password: string, hash: string) {
    return Bun.password.verify(password, hash);
  }

  async createOne(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    const hash = await this.hashPassword(password);

    return await this.prisma.user.create({
      data: { password: hash, ...rest },
    });
  }

  async createMany(createUserDtos: CreateUserDto[]) {
    const createUserDtosWithHashedPassword = await Promise.all(
      createUserDtos.map(async (dto) => {
        const { password, ...rest } = dto;
        return { ...rest, password: await this.hashPassword(password) };
      }),
    );

    return await this.prisma.user.createManyAndReturn({
      data: createUserDtosWithHashedPassword,
    });
  }

  findOne(data: FindUserDto) {
    return this.prisma.user.findFirstOrThrow({
      where: data,
    });
  }

  findMany(ids: string[], take?: number, skip?: number) {
    return this.prisma.user.findMany({
      where: { id: { in: ids } },
      take,
      skip,
    });
  }

  getAll(take?: number, skip?: number) {
    return this.prisma.user.findMany({
      take,
      skip,
    });
  }

  updateOne(id: string, data: UpdateUserDto) {
    return this.prisma.user.updateManyAndReturn({
      where: { id },
      data,
    });
  }

  updateMany(ids: string[], data: UpdateUserDto) {
    return this.prisma.user.updateManyAndReturn({
      where: { id: { in: ids } },
      data,
    });
  }

  deleteOne(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  deleteMany(ids: string[]) {
    return this.prisma.user.deleteMany({
      where: { id: { in: ids } },
    });
  }
}
