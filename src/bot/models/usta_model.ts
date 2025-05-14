import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IUstaCreationAttr {
  user_id: number;
  last_state: string;
}

@Table({ tableName: "master" })
export class Master extends Model<Master, IUstaCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.BIGINT,
  })
  declare user_id: number;

  @Column({
    type: DataType.STRING
  })
  declare role: string;

  @Column({
    type: DataType.STRING,
  })
  declare first_name: string;

  @Column({
    type: DataType.STRING,
  })
  declare phone: string;

  @Column({
    type: DataType.STRING,
  })
  declare workshop_name: string;

  @Column({
    type: DataType.STRING,
  })
  declare address: string;

  @Column({
    type: DataType.STRING,
  })
  declare target: string;

  @Column({
    type: DataType.STRING,
  })
  declare location: string;

  @Column({
    type: DataType.STRING,
  })
  declare start_time: string;

  @Column({
    type: DataType.STRING,
  })
  declare end_time: string;

  @Column({
    type: DataType.STRING,
  })
  declare customer_time: string;

  @Column({
    type: DataType.STRING,
  })
  declare last_state: string;
}
