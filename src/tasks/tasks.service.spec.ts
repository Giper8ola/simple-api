import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException } from '@nestjs/common';
import { Task } from './entities/task.entity';

describe('TasksService', () => {
    let service: TasksService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let usersService: UsersService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let taskRepository: typeof Task;

    const mockTaskRepository = {
        create: jest.fn(),
        findAndCountAll: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
        destroy: jest.fn()
    };

    const mockUsersService = {
        findOneById: jest.fn(),
        update: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: getModelToken(Task), useValue: mockTaskRepository },
                { provide: 'TASK_REPOSITORY', useValue: mockTaskRepository }
            ]
        }).compile();

        service = module.get<TasksService>(TasksService);
        usersService = module.get<UsersService>(UsersService);
        taskRepository = module.get<typeof Task>(getModelToken(Task));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a task and update user task amount', async () => {
            const createTaskDto = {
                userId: 1,
                title: 'Test Task',
                description: 'Test Description'
            };
            const user = { id: 1, taskAmount: 5 };
            const createdTask = { ...createTaskDto, id: 1 };

            mockUsersService.findOneById.mockResolvedValue(user);
            mockUsersService.update.mockResolvedValue(user);
            mockTaskRepository.create.mockResolvedValue(createdTask);

            const result = await service.create(createTaskDto);

            expect(result).toEqual(createdTask);
            expect(mockUsersService.findOneById).toHaveBeenCalledWith(
                createTaskDto.userId
            );
            expect(mockUsersService.update).toHaveBeenCalledWith(
                createTaskDto.userId,
                { taskAmount: user.taskAmount + 1 }
            );
            expect(mockTaskRepository.create).toHaveBeenCalledWith(
                createTaskDto
            );
        });
    });

    describe('findAll', () => {
        it('should return tasks with pagination and sorting', async () => {
            const query = {
                page: 1,
                limit: 5,
                sortBy: 'createdAt|ASC',
                isCompleted: false
            };
            const tasks = { rows: [], count: 0 };

            mockTaskRepository.findAndCountAll.mockResolvedValue(tasks);

            const result = await service.findAll(query);

            expect(result).toEqual(tasks);
            expect(mockTaskRepository.findAndCountAll).toHaveBeenCalledWith({
                where: { completed: query.isCompleted },
                attributes: ['title', 'description', 'userId', 'completed'],
                limit: query.limit,
                offset: (query.page - 1) * query.limit,
                order: [['createdAt', 'ASC']]
            });
        });
    });

    describe('update', () => {
        it('should update a task', async () => {
            const updateTaskDto = { title: 'Updated Title' };
            const id = 1;

            mockTaskRepository.update.mockResolvedValue([1]);

            const result = await service.update(id, updateTaskDto);

            expect(result).toEqual([1]);
            expect(mockTaskRepository.update).toHaveBeenCalledWith(
                updateTaskDto,
                { where: { id } }
            );
        });
    });

    describe('remove', () => {
        it('should remove a task and update user task amount', async () => {
            const id = 1;
            const userId = 1;
            const task = { id, userId };
            const user = { id: 1, taskAmount: 5 };

            mockTaskRepository.findOne.mockResolvedValue(task);
            mockUsersService.findOneById.mockResolvedValue(user);
            mockUsersService.update.mockResolvedValue(user);
            mockTaskRepository.destroy.mockResolvedValue(1);

            const result = await service.remove(id, userId);

            expect(result).toEqual(1);
            expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
                where: { id }
            });
            expect(mockUsersService.findOneById).toHaveBeenCalledWith(userId);
            expect(mockUsersService.update).toHaveBeenCalledWith(userId, {
                taskAmount: user.taskAmount - 1
            });
            expect(mockTaskRepository.destroy).toHaveBeenCalledWith({
                where: { id }
            });
        });

        it('should throw BadRequestException if userId does not match', async () => {
            const id = 1;
            const userId = 2;
            const task = { id, userId: 1 };

            mockTaskRepository.findOne.mockResolvedValue(task);

            await expect(service.remove(id, userId)).rejects.toThrow(
                BadRequestException
            );
        });
    });
});
