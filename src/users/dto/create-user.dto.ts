import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RolesEnum } from '../../core/enums/role';
import {
    IsEmailAddress,
    IsPassword
} from '../../core/decorators/utils/Validations';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @IsEmailAddress()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsPassword()
    @ApiProperty()
    password: string;

    @IsNotEmpty()
    @IsEnum(RolesEnum)
    role: RolesEnum;
}
