import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '../core/constants';
import { TasksModule } from '../tasks/tasks.module';

@Module({
    controllers: [UsersController],
    exports: [UsersService],
    providers: [
        UsersService,
        {
            provide: USER_REPOSITORY,
            useValue: User
        }
    ],
    imports: [TasksModule]
})
export class UsersModule {}
