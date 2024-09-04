import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { RolesEnum } from '../../core/enums/role';

@Table
export class User extends Model<User> {
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    name: string;

    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;

    @Column({
        type: DataType.ENUM(...Object.values(RolesEnum)),
        allowNull: false
    })
    role: RolesEnum;
}
