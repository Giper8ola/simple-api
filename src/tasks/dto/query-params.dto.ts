import { ApiProperty } from '@nestjs/swagger';
import { sortFindAllUserEnum } from '../../users/dto/query-params.dto';

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

    @ApiProperty({ type: Boolean, required: false, default: false })
    isCompleted: boolean;
}
