import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from '../users/user.schema';
import { AuthenticatedRequest } from './auth.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // Si no se definió un rol, permite el acceso
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user; // El usuario viene del JWT

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a esta ruta',
      );
    }

    return true;
  }
}
