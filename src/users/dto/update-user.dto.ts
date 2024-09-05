import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/mapped-types';

class AdditionalUserInfo {
    avatar: string;
}

export class UpdateUserDto extends PartialType(
    IntersectionType(
        AdditionalUserInfo,
        OmitType(CreateUserDto, ['password'] as const)
    )
) {}
