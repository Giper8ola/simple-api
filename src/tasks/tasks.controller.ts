import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
    @Get('find/all')
    async findAll(@Query() queryParams: QueryFindAllDto) {
        return await this.tasksService.findAll(queryParams);
    }

    @AuthWithRole(RolesEnum.USER)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateTaskDto: UpdateTaskDto
    ) {
        return await this.tasksService.update(+id, updateTaskDto);
    }

    @AuthWithRole(RolesEnum.USER)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.tasksService.remove(+id);
    }
}
