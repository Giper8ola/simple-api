import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { User } from './entities/user.entity';
import { RolesEnum } from '../core/enums/role';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryFindAllDto } from './dto/query-params.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Замените на ваши DTO

describe('UsersService', () => {
    let service: UsersService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let userRepository: typeof User;

    const mockUserRepository = {
        create: jest.fn(),
        findOne: jest.fn(),
        findAndCountAll: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getModelToken(User), useValue: mockUserRepository },
                { provide: 'USER_REPOSITORY', useValue: mockUserRepository }
            ]
        }).compile();

        service = module.get<UsersService>(UsersService);
        userRepository = module.get<typeof User>(getModelToken(User));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user with role USER', async () => {
            const createUserDto: CreateUserDto = {
                name: 'John',
                email: 'john@example.com',
                password: 'password'
            };
            const createdUser = { ...createUserDto, role: RolesEnum.USER };

            mockUserRepository.create.mockResolvedValue(createdUser);

            const result = await service.create(createUserDto);

            expect(result).toEqual(createdUser);
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...createUserDto,
                role: RolesEnum.USER
            });
        });
    });

    describe('createAdminIfNotExists', () => {
        it('should create an admin if none exists', async () => {
            mockUserRepository.create.mockResolvedValue({
                name: 'admin',
                email: 'mail@mail.ru',
                password: 'admin',
                role: RolesEnum.ADMIN
            });

            await service.createAdminIfNotExists();

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { role: 'admin' }
            });
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                name: 'admin',
                email: 'mail@mail.ru',
                password: 'admin',
                role: RolesEnum.ADMIN
            });
            expect(mockUserRepository.create).toBeCalledTimes(2);
        });

        it('should not create an admin if one already exists', async () => {
            mockUserRepository.findOne.mockResolvedValue({
                name: 'admin',
                email: 'mail@mail.ru',
                password: 'admin',
                role: RolesEnum.ADMIN
            });

            await service.createAdminIfNotExists();

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { role: 'admin' }
            });
            expect(mockUserRepository.create).not.toBeCalledTimes(1);
        });
    });

    describe('findAll', () => {
        it('should return users with pagination, sorting, and filtering', async () => {
            const query: QueryFindAllDto = {
                page: 1,
                limit: 5,
                sortBy: 'createdAt|ASC',
                taskFilter: '>=5'
            };
            const users = { rows: [], count: 0 };

            mockUserRepository.findAndCountAll.mockResolvedValue(users);

            const result = await service.findAll(query);

            expect(result).toEqual(users);
            expect(mockUserRepository.findAndCountAll).toHaveBeenCalledWith({
                where: {
                    taskAmount: { [Op.gte]: 5 }
                },
                attributes: ['id', 'name', 'email', 'taskAmount'],
                limit: query.limit,
                offset: (query.page - 1) * query.limit,
                order: [['createdAt', 'ASC']]
            });
        });
    });

    describe('findOne', () => {
        it('should return a user by username', async () => {
            const username = 'John';
            const user = { name: username, email: 'john@example.com' };

            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.findOne(username);

            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { name: username }
            });
        });
    });

    describe('findOneById', () => {
        it('should return a user by id', async () => {
            const id = 1;
            const user = { id, name: 'John', email: 'john@example.com' };

            mockUserRepository.findOne.mockResolvedValue(user);

            const result = await service.findOneById(id);

            expect(result).toEqual(user);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { id }
            });
        });
    });

    describe('update', () => {
        it('should update a user', async () => {
            const id = 1;
            const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

            mockUserRepository.update.mockResolvedValue([1]);

            const result = await service.update(id, updateUserDto);

            expect(result).toEqual([1]);
            expect(mockUserRepository.update).toHaveBeenCalledWith(
                updateUserDto,
                { where: { id } }
            );
        });
    });

    describe('remove', () => {
        it('should remove a user', async () => {
            const id = 1;

            mockUserRepository.destroy.mockResolvedValue(1);

            const result = await service.remove(id);

            expect(result).toEqual(1);
            expect(mockUserRepository.destroy).toHaveBeenCalledWith({
                where: { id }
            });
        });
    });
});
