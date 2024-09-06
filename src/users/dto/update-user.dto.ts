import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/mapped-types';
import { RolesEnum } from '../../core/enums/role';
import { IsEnum } from 'class-validator';

class AdditionalUserInfo {
    avatar: string;
    taskAmount: number;

    @IsEnum(RolesEnum)
    role: RolesEnum;
}

export class UpdateUserDto extends PartialType(
    IntersectionType(
        AdditionalUserInfo,
        OmitType(CreateUserDto, ['password'] as const)
    )
) {}
