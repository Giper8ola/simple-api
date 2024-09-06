import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

class AdditionalTaskUpdate {
    completed: boolean;
}

export class UpdateTaskDto extends PartialType(
    IntersectionType(AdditionalTaskUpdate, CreateTaskDto)
) {}
