import { IsBoolean, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsBoolean()
    completed: boolean;

    @IsString()
    @Transform(({ value }) => Number(value))
    userId: number;
}
