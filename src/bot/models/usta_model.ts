import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IMasterCreationAttr {
  user_id: number | undefined;
  last_state: string;
}

@Table({ tableName: "master" })
export class Master extends Model<Master, IMasterCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
  })
  declare name: string;
  @Column({
    type: DataType.STRING,
  })
  declare telefon_number: string;
  @Column({
    type: DataType.STRING,
  })
  declare ustaxona_nomi: string;
  @Column({
    type: DataType.STRING,
  })
  declare address: string;
  @Column({
    type: DataType.STRING,
  })
  declare landmark: string;
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
  declare time: string;
  @Column({
    type: DataType.STRING,
  })
  declare last_state: string;

  @Column({
    type: DataType.STRING,
  })
  declare specialization: string;

  @Column({
    type: DataType.BIGINT,
  })
  declare user_id: number;

  @Column({
    type: DataType.BOOLEAN,
  })
  declare is_active: boolean;
}
