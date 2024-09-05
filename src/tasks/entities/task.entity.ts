import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';

@Table
export class Task extends Model<Task> {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title: string;

    @Column({
        type: DataType.STRING,
        defaultValue: ''
    })
    description: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    completed: boolean;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;
}
