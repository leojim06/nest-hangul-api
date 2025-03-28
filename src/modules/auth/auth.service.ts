import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserType } from './auth.interface';
import { logger } from 'src/config/logger';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // if (user && pass === user.password) {
      const { password, ...result } = user;
      return result;
    }

    logger.warn(`Intento fallido de inicio de sesión para: ${username}`);
    throw new UnauthorizedException('Credenciales incorrectas');
  }

  login(user: UserType) {
    const payload = { username: user.username, sub: user._id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
