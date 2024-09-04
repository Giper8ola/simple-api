import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { USER_REPOSITORY } from '../core/constants';

@Module({
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: USER_REPOSITORY,
            useValue: User
        }
    ]
})
export class UsersModule {}
