import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto, UsersService } from '../users';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Регистрация нового пользователя
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createOne(createUserDto);

    // Создание JWT токена
    const token = this.createUserToken(user);

    // Возврат пользователя без пароля и токена
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Авторизация пользователя
   */
  async login(username: string, password: string) {
    const user = await this.usersService.findOne({ username });

    if (!user) {
      throw new UnauthorizedException('Invalid password or username');
    }

    const isValid = await this.usersService.verifyPassword(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid password or username');
    }

    // Создание JWT токена
    const token = this.createUserToken(user);

    // Возврат пользователя без пароля и токена
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Создание JWT токена для пользователя
   */
  private createUserToken(user: User) {
    return this.jwtService.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }
}
