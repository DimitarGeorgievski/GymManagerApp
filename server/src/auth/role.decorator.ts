import { SetMetadata } from '@nestjs/common';
import { roleType } from 'src/users/enum/user.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: roleType[]) => SetMetadata(ROLES_KEY, roles);
