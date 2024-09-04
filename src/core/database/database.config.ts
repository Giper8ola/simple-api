import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
    development: {
        username: process.env.USER,
        password: process.env.PASS,
        database: process.env.NAME_DEVELOPMENT,
        host: process.env.HOST,
        port: process.env.PORT,
        dialect: process.env.DIALECT
    },
    test: {
        username: process.env.USER,
        password: process.env.PASS,
        database: process.env.NAME_TEST,
        host: process.env.HOST,
        port: process.env.PORT,
        dialect: process.env.DIALECT
    },
    production: {
        username: process.env.USER,
        password: process.env.PASS,
        database: process.env.NAME_PRODUCTION,
        host: process.env.HOST,
        dialect: process.env.DIALECT
    }
};
