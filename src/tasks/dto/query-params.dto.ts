import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min
} from 'class-validator';

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
    @IsBoolean()
    isCompleted?: boolean;
}
