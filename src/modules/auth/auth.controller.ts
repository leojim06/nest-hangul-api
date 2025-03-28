import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(new RateLimitGuard(10, 60 * 1000))
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(
      await this.authService.validateUser(body.username, body.password),
    );
  }
}
