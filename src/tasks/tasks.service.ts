import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TASK_REPOSITORY } from '../core/constants';
import { Task } from './entities/task.entity';
import { QueryFindAllDto } from './dto/query-params.dto';
import { col, fn, Op } from 'sequelize';

@Injectable()
export class TasksService {
    constructor(
        @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task
    ) {}

    async create(createTaskDto: CreateTaskDto) {
        return await this.taskRepository.create(createTaskDto);
    }

    async findAll(query: QueryFindAllDto) {
        const { page, limit, sortBy, titleLength } = query;

        const offset = (page - 1) * limit;

        const whereObject = {
            [Op.and]: [fn('CHAR_LENGTH', col('title')), {}]
        };

        const regex = /^(>=|<=|>|<|==)\d+$/;

        if (titleLength && regex.test(titleLength)) {
            const [symbol] = titleLength.match(/\d+/g);
            const [number] = titleLength.match(/>=|<=|>|<|==/g);

            switch (symbol) {
                case '>=':
                    whereObject[Op.and][1] = { [Op.gte]: Number(number) };
                    break;
                case '<=':
                    whereObject[Op.and][1] = { [Op.lte]: Number(number) };
                    break;
                case '>':
                    whereObject[Op.and][1] = { [Op.gt]: Number(number) };
                    break;
                case '<':
                    whereObject[Op.and][1] = { [Op.lt]: Number(number) };
                    break;
                case '==':
                    whereObject[Op.and][1] = { [Op.eq]: Number(number) };
                    break;
            }
        }

        return await this.taskRepository.findAndCountAll({
            where: whereObject,
            attributes: ['title', 'description', 'userId'],
            limit: limit,
            offset: offset,
            order: [[sortBy, 'DESC']]
        });
    }

    async findAllByUserId(id: number) {
        return await this.taskRepository.findAll({
            where: {
                userId: id
            }
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
