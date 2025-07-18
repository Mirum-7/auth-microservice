import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from '../users';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  /**
   * Регистрация нового пользователя
   */
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(createUserDto);
    
    // Установка токена в httpOnly cookie
    response.cookie('jwt', result.token, {
      httpOnly: true,
      domain: import.meta.env.DOMAIN,
    });

    return result.user;
  }

  /**
   * Авторизация пользователя
   */
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(loginDto.username, loginDto.password);
    
    // Установка токена в httpOnly cookie
    response.cookie('jwt', result.token, {
      httpOnly: true,
      domain: import.meta.env.DOMAIN,
    });

    return result.user;
  }

  /**
   * Выход пользователя
   */
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // Очистка cookie
    response.clearCookie('jwt', {
      httpOnly: true,
      domain: import.meta.env.DOMAIN,
    });

    return this.authService.logout();
  }
}