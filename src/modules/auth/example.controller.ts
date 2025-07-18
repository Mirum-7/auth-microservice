import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { Private } from '@/shared/decorators';
import { AuthGuard } from '@/shared/guards';

@Controller('example')
@UseGuards(AuthGuard)
export class ExampleController {
  /**
   * Public endpoint - no authentication required
   */
  @Get('public')
  getPublicData() {
    return { message: 'This is public data' };
  }

  /**
   * Private endpoint - requires JWT authentication
   */
  @Get('private')
  @Private()
  getPrivateData(@Req() request: Request) {
    return {
      message: 'This is private data',
      user: request.user,
    };
  }

  /**
   * User profile endpoint - requires JWT authentication
   */
  @Get('profile')
  @Private()
  getUserProfile(@Req() request: Request) {
    return {
      userId: request.user?.userId,
      role: request.user?.role,
      message: 'User profile data',
    };
  }
}