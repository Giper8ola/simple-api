import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('create')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Get()
    async findAll() {
        return await this.usersService.findAll();
    }

    @Get()
    async findOne(@Query('name') name: string) {
        return await this.usersService.findOne(name);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return await this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.usersService.remove(+id);
    }
}
