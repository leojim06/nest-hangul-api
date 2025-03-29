import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(new RateLimitGuard(10, 60 * 1000))
  async login(
    @Body() body: { username: string; password: string },
    @Req() req: Request,
  ) {
    return this.authService.login(
      await this.authService.validateUser(
        body.username,
        body.password,
        req.url,
        req.ip || 'unknown',
      ),
    );
  }
}
