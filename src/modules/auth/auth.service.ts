import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UsersService } from '../users';
import { JwtTokenService } from '../jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createOne(createUserDto);

    // Создание JWT токена
    const token = this.jwtTokenService.createToken(user.id, user.username, user.email);

    // Возврат пользователя без пароля и токена
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

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
    const token = this.jwtTokenService.createToken(user.id, user.username, user.email);

    // Возврат пользователя без пароля и токена
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Выход пользователя
   */
  async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }
}
