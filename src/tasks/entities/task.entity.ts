import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
}
