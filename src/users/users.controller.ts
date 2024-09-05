import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryFindAllDto } from './dto/query-params.dto';
import { AuthWithRole } from '../core/decorators/AuthWithRole.decorator';
import { RolesEnum } from '../core/enums/role';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiQuery,
    ApiTags
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/file-upload.dto';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseInterceptors(
        FileInterceptor('file', {
            dest: 'uploads'
        })
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        type: FileUploadDto
    })
    @AuthWithRole(RolesEnum.USER)
    @Post('upload/avatar')
    async uploadAvatar(
        @Req() req: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        await this.usersService.update(req.user.id, {
            avatar: file.path
        });
    }

    @AuthWithRole(RolesEnum.ADMIN)
    @Post('create')
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @AuthWithRole(RolesEnum.ADMIN)
    @ApiQuery({ type: QueryFindAllDto })
    @Get('find/all')
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 5,
        @Query('sortBy') sortBy,
        @Query('taskFilter') taskFilter
    ) {
        return await this.usersService.findAll({
            page,
            limit,
            sortBy,
            taskFilter
        });
    }

    @AuthWithRole(RolesEnum.ADMIN)
    @Get('find/one')
    async findOneById(@Query('id') id: number) {
        return await this.usersService.findOneById(id);
    }

    @AuthWithRole(RolesEnum.USER)
    @Patch('update')
    async update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
        return await this.usersService.update(+req.user.id, updateUserDto);
    }

    @AuthWithRole(RolesEnum.ADMIN)
    @Delete('delete:id')
    async remove(@Param('id') id: string) {
        return await this.usersService.remove(+id);
    }
}
