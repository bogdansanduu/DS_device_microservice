import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, Role } from '../constants/role';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
