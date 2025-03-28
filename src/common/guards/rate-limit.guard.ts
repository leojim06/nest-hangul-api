import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private limiter;

  constructor(maxRequests: number, windowMs: number) {
    this.limiter = rateLimit({ windowMs, max: maxRequests });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    return new Promise((resolve) => {
      this.limiter(req, req.res, () => resolve(true));
    });
  }
}
