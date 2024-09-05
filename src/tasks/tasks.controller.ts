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

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @AuthWithRole(RolesEnum.USER)
    @Post('create')
    create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create({
            ...createTaskDto,
            userId: req.user.id
        });
    }
    @AuthWithRole(RolesEnum.USER)
    @Get('find/all')
    findAll(@Query() queryParams: QueryFindAllDto) {
        return this.tasksService.findAll(queryParams);
    }
    @AuthWithRole(RolesEnum.USER)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(+id, updateTaskDto);
    }
    @AuthWithRole(RolesEnum.USER)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(+id);
    }
}
