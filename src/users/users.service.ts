import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from '../core/constants';
import { User } from './entities/user.entity';
import { RolesEnum } from '../core/enums/role';
import { QueryFindAllDto } from './dto/query-params.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepository: typeof User
    ) {}

    async create(createUserDto: CreateUserDto) {
        return await this.userRepository.create({
            ...createUserDto,
            role: RolesEnum.USER
        });
    }

    async createAdminIfNotExists() {
        const admin = await this.userRepository.findOne({
            where: { role: 'admin' }
        });

        if (!admin) {
            await this.userRepository.create({
                name: 'admin',
                email: 'mail@mail.ru',
                password: 'admin',
                role: RolesEnum.ADMIN
            });
        }
    }

    async findAll(query: QueryFindAllDto) {
        const { page = 1, limit = 5, sortBy = '', taskFilter = '' } = query;

        const offset = (page - 1) * limit;

        let whereObject = {};
        const regex = /^(>=|<=|>|<|==)\d+$/;
        const sortRegex = /^createdAt\|(ASC|DESC)$/;

        let sortedData = [];

        if (sortRegex.test(sortBy)) {
            sortedData = sortBy.split('|');
        }

        if (taskFilter && regex.test(taskFilter)) {
            const [symbol] = taskFilter.match(/>=|<=|>|<|==/g);
            const [number] = taskFilter.match(/\d+/g);

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
            attributes: ['id', 'name', 'email', 'taskAmount'],
            limit: limit,
            offset: offset,
            order: sortRegex.test(sortBy)
                ? [[sortedData[0], sortedData[1]]]
                : []
        });
    }

    async findOne(username: string) {
        return await this.userRepository.findOne({
            where: {
                name: username
            }
        });
    }

    async findOneById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id: id
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
