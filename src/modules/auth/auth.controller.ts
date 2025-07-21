import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from '../users';
import { AppConfigService } from '../../shared/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * Регистрация нового пользователя
   */
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, token } = await this.authService.register(createUserDto);

    response.cookie('jwt', token, {
      httpOnly: true,
      domain: this.configService.domain,
    });

    return user;
  }

  /**
   * Авторизация пользователя
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const { user, token } = await this.authService.login(loginDto.username, loginDto.password);

    response.cookie('jwt', token, {
      httpOnly: true,
      domain: this.configService.domain,
    });

    return user;
  }

  /**
   * Выход пользователя
   */
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt', {
      httpOnly: true,
      domain: this.configService.domain,
    });
  }
}
