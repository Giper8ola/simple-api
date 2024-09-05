import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesEnum } from '../enums/role';
import { RolesGuard } from '../guards/Role.guard';
import { Roles } from './Role.decorator';
import { AuthGuard } from '../guards/Auth.guard';
export function AuthWithRole(role: RolesEnum) {
    return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}
