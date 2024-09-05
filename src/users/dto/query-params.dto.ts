import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum sortFindAllUserEnum {
    createdAtDown = 'createdAt|DESC',
    createdAtUp = 'createdAt|ASC'
}

export class QueryFindAllDto {
    @ApiProperty({ default: 1, required: false })
    page: number = 1;

    @ApiProperty({ default: 5, required: false })
    limit: number = 5;

    @ApiProperty({
        enum: sortFindAllUserEnum,
        default: sortFindAllUserEnum.createdAtDown,
        required: false
    })
    sortBy: string = sortFindAllUserEnum.createdAtDown;

    @IsOptional()
    @IsString()
    @ApiProperty({ default: '', required: false })
    taskFilter: string;
}
