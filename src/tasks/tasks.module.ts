import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TASK_REPOSITORY } from '../core/constants';
import { Task } from './entities/task.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
    exports: [TasksService],
    controllers: [TasksController],
    providers: [
        TasksService,
        {
            provide: TASK_REPOSITORY,
            useValue: Task
        }
    ],
    imports: [JwtModule, UsersModule]
})
export class TasksModule {}
