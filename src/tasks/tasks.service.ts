import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TASK_REPOSITORY } from '../core/constants';
import { Task } from './entities/task.entity';
import { QueryFindAllDto } from './dto/query-params.dto';

@Injectable()
export class TasksService {
    constructor(
        @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task
    ) {}

    async create(createTaskDto: CreateTaskDto) {
        return await this.taskRepository.create(createTaskDto);
    }

    async findAll(query: QueryFindAllDto) {
        const { page, limit, sortBy, isCompleted } = query;

        const offset = (page - 1) * limit;

        return await this.taskRepository.findAndCountAll({
            where: {
                completed: isCompleted
            },
            attributes: ['title', 'description', 'userId'],
            limit: limit,
            offset: offset,
            order: [[sortBy, 'DESC']]
        });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        return await this.taskRepository.update(updateTaskDto, {
            where: {
                id: id
            }
        });
    }

    async remove(id: number) {
        return await this.taskRepository.destroy({
            where: {
                id: id
            }
        });
    }
}
