import { applyDecorators, UseGuards } from '@nestjs/common';
import { RolesEnum } from '../enums/role';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/Role.guard';
import { Roles } from './Role.decorator';
export function AuthWithRole(role: RolesEnum) {
    return applyDecorators(
        Roles(role),
        UseGuards(AuthGuard('jwt'), RolesGuard)
    );
}
