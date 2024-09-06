import { IsNotEmpty, IsString } from 'class-validator';
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
}
