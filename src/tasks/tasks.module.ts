import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TASK_REPOSITORY } from '../core/constants';
import { Task } from './entities/task.entity';

@Module({
    controllers: [TasksController],
    providers: [
        TasksService,
        {
            provide: TASK_REPOSITORY,
            useValue: Task
        }
    ]
})
export class TasksModule {}
