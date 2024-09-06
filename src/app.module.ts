import {
    MiddlewareConsumer,
    Module,
    NestModule,
    OnModuleInit
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersService } from './users/users.service';
import { LoggerMiddleware } from './core/middleware/logger.middleware';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true
        }),
        UsersModule,
        AuthModule,
        TasksModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule implements OnModuleInit, NestModule {
    constructor(private readonly userService: UsersService) {}
    async onModuleInit() {
        await this.userService.createAdminIfNotExists();
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
