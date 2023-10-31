import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../types/Role';
import { ROLES_KEY } from '../constants/role';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRoles: Role[] = request['user']?.roles;

    if (!userRoles) {
      return false;
    }

    const userRolesNames = userRoles.map((userRole) => userRole.name);

    return requiredRoles.some((role) => userRolesNames.includes(role));
  }
}
