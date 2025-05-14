import { Column, DataType, Model, Table } from "sequelize-typescript";


interface IBotCreationAttr{
    user_id: number;
    first_name: string;
    username: string;
    language_code: string;
    role: string
}

@Table({tableName: 'bot'})
export class Bot extends Model<Bot, IBotCreationAttr>{
    @Column({
        type: DataType.BIGINT,
        primaryKey: true
    })
    declare user_id: number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare first_name: string

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare username: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare language_code: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare role: string
}