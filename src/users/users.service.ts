import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TASK_REPOSITORY, USER_REPOSITORY } from '../core/constants';
import { User } from './entities/user.entity';
import { RolesEnum } from '../core/enums/role';
import { QueryFindAllDto } from './dto/query-params.dto';
import { Task } from '../tasks/entities/task.entity';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
        @Inject(TASK_REPOSITORY) private readonly taskRepository: typeof Task
    ) {}

    async create(createUserDto: CreateUserDto) {
        return await this.userRepository.create({
            ...createUserDto,
            role: RolesEnum.USER
        });
    }

    async findAll(query: QueryFindAllDto) {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            taskFilter = ''
        } = query;

        const offset = (page - 1) * limit;

        let whereObject = {};
        const regex = /^(>=|<=|>|<|==)\d+$/;

        if (taskFilter && regex.test(taskFilter)) {
            const [symbol] = taskFilter.match(/\d+/g);
            const [number] = taskFilter.match(/>=|<=|>|<|==/g);

            switch (symbol) {
                case '>=':
                    {
                        whereObject = {
                            taskAmount: {
                                [Op.gte]: Number(number)
                            }
                        };
                    }
                    break;
                case '<=':
                    {
                        whereObject = {
                            taskAmount: {
                                [Op.lte]: Number(number)
                            }
                        };
                    }
                    break;
                case '>':
                    {
                        whereObject = {
                            taskAmount: {
                                [Op.gt]: Number(number)
                            }
                        };
                    }
                    break;
                case '<':
                    {
                        whereObject = {
                            taskAmount: {
                                [Op.lt]: Number(number)
                            }
                        };
                    }
                    break;
                case '==':
                    {
                        whereObject = {
                            taskAmount: {
                                [Op.eq]: Number(number)
                            }
                        };
                    }
                    break;
            }
        }
        return await this.userRepository.findAndCountAll({
            where: whereObject,
            attributes: ['id', 'name', 'email'],
            limit: limit,
            offset: offset,
            order: [[sortBy, 'DESC']]
        });
    }

    async findOne(username: string) {
        return await this.userRepository.findOne({
            where: {
                name: username
            }
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return await this.userRepository.update(updateUserDto, {
            where: {
                id: id
            }
        });
    }

    async remove(id: number) {
        return await this.userRepository.destroy({
            where: {
                id: id
            }
        });
    }
}
