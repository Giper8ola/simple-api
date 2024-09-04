import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller()
export class AppController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('auth/login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }

    @Post('auth/signup')
    async signUp(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }
}
