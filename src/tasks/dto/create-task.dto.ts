import { IsBoolean, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsBoolean()
    completed: boolean;
}
