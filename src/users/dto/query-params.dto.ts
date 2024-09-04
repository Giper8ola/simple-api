import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min
} from 'class-validator';

export enum SortOrder {
    TASKS = 'TASKS'
}

export class QueryFindAllDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    sortBy?: string = 'createdAt';

    @IsOptional()
    @IsEnum(SortOrder)
    filter?: SortOrder = SortOrder.TASKS;
}
