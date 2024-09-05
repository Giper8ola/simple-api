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
    Req
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryFindAllDto } from './dto/query-params.dto';
import { AuthWithRole } from '../core/decorators/AuthWithRole.decorator';
import { RolesEnum } from '../core/enums/role';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @AuthWithRole(RolesEnum.USER)
    @Post('create')
    async create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
        return await this.tasksService.create({
            ...createTaskDto,
            userId: req.user.id
        });
    }

    @AuthWithRole(RolesEnum.USER)
    @ApiQuery({ type: QueryFindAllDto })
    @Get('find/all')
    async findAll(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 5,
        @Query('sortBy') sortBy,
        @Query('isCompleted') isCompleted
    ) {
        return await this.tasksService.findAll({
            page,
            limit,
            sortBy,
            isCompleted
        });
    }

    @AuthWithRole(RolesEnum.USER)
    @Patch('update:id')
    async update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        return await this.tasksService.update(+id, updateTaskDto);
    }

    @AuthWithRole(RolesEnum.USER)
    @Delete('delete:id')
    async remove(@Req() req: any, @Param('id') id: string) {
        return await this.tasksService.remove(+id, req.user.id);
    }
}
