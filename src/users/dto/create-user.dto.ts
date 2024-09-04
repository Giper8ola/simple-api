import { IsEmail, IsEnum, IsString } from 'class-validator';
import { RolesEnum } from '../../core/enums/role';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(RolesEnum)
    role: RolesEnum;
}
