import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RolesEnum } from '../../core/enums/role';
import {
    IsEmailAddress,
    IsPassword
} from '../../core/decorators/utils/Validations';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsEmailAddress()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsPassword()
    password: string;

    @IsNotEmpty()
    @IsEnum(RolesEnum)
    role: RolesEnum;
}
