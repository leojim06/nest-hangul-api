import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from './auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret)
      throw new Error(
        'JWT_SECRET no está definido en las variables de entorno',
      );
    console.log('Secret: ', jwtSecret);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: UserPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
