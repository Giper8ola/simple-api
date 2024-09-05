import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { SignupUserDto } from './users/dto/signup-user.dto';
import { RolesEnum } from './core/enums/role';
import { LoginUserDto } from './users/dto/login-user.dto';

@ApiTags('auth')
@Controller()
export class AppController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService
    ) {}

    @UseGuards(AuthGuard('local'))
    @Post('auth/login')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(@Req() req: any, @Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(req.user);
    }

    @Post('auth/signup')
    async signUp(@Body() signupUserDto: SignupUserDto) {
        return await this.userService.create({
            ...signupUserDto,
            role: RolesEnum.USER
        });
    }
}
