import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TASK_REPOSITORY } from '../core/constants';
import { Task } from './entities/task.entity';
import { QueryFindAllDto } from './dto/query-params.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
    constructor(
        @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task,
        private readonly usersService: UsersService
    ) {}

    async create(createTaskDto: CreateTaskDto) {
        const { userId } = createTaskDto;
        const user = await this.usersService.findOneById(userId);
        await this.usersService.update(userId, {
            taskAmount: user.taskAmount + 1
        });
        return await this.taskRepository.create(createTaskDto);
    }

    async findAll(query: QueryFindAllDto) {
        const { page = 1, limit = 5, sortBy, isCompleted } = query;

        const offset = (page - 1) * limit;

        const sortRegex = /^createdAt\|(ASC|DESC)$/;

        let sortedData;

        if (sortRegex.test(sortBy)) {
            sortedData = sortBy.split('|');
        }

        return await this.taskRepository.findAndCountAll({
            where: {
                completed: isCompleted
            },
            attributes: ['title', 'description', 'userId', 'completed'],
            limit: limit,
            offset: offset,
            order: sortRegex.test(sortBy)
                ? [[sortedData[0], sortedData[1]]]
                : []
        });
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        return await this.taskRepository.update(updateTaskDto, {
            where: {
                id: id
            }
        });
    }

    async remove(id: number, userId: number) {
        const task = await this.taskRepository.findOne({
            where: {
                id: id
            }
        });

        if (!(task.userId === userId))
            throw new BadRequestException('Вы не можете удалить данный таск');

        const user = await this.usersService.findOneById(userId);
        await this.usersService.update(userId, {
            taskAmount: user.taskAmount - 1
        });

        return await this.taskRepository.destroy({
            where: {
                id: id
            }
        });
    }
}
