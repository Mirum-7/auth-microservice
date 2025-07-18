import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UsersService } from '../users';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Регистрация нового пользователя.
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createOne(createUserDto);

    return user;
  }

  /**
   * Аутентификация пользователя.
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

    return user;
  }
}
