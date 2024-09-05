import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/Role.decorator';
import { RolesEnum } from '../enums/role';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<RolesEnum[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!roles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        if (!user) {
            throw new UnauthorizedException('Не авторизован');
        }

        const hasRole = () => roles.includes(user.role);
        if (!hasRole()) {
            throw new ForbiddenException('Недостаточно прав');
        }

        return true;
    }
}
