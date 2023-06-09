import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

export const ROLES_KEY = 'role';
export const Role = (roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
