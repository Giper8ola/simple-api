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
import { QueryFindAllDto } from './dto/query-params.dto';
import { AuthWithRole } from '../core/decorators/AuthWithRole.decorator';
import { RolesEnum } from '../core/enums/role';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @AuthWithRole(RolesEnum.ADMIN)
    @Post('create')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }
    @AuthWithRole(RolesEnum.ADMIN)
    @Get('find/all')
    async findAll(@Query() queryParams: QueryFindAllDto) {
        return await this.usersService.findAll(queryParams);
    }
    @AuthWithRole(RolesEnum.ADMIN)
    @Get('find/one')
    async findOne(@Query('name') name: string) {
        return await this.usersService.findOne(name);
    }
    @AuthWithRole(RolesEnum.USER)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return await this.usersService.update(+id, updateUserDto);
    }

    @AuthWithRole(RolesEnum.ADMIN)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.usersService.remove(+id);
    }
}
