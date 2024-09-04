import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from '../core/constants';
import { User } from './entities/user.entity';
import { RolesEnum } from '../core/enums/role';

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

    async findAll() {
        return await this.userRepository.findAll();
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
