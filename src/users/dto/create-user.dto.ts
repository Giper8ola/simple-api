import { IsEmail, IsString } from 'class-validator';

export class UserDto {
    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
