import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleType } from 'src/users/enum/user.enum';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const classRoles =
      this.reflector.get<roleType[]>(ROLES_KEY, context.getClass()) || [];
    const methodRoles =
      this.reflector.get<roleType[]>(ROLES_KEY, context.getHandler()) || [];
    const requiredRoles = [...classRoles, ...methodRoles];
    if (!requiredRoles.length) return true;
    const userRole = req?.user?.role as roleType;
    return requiredRoles.includes(userRole);
  }
}