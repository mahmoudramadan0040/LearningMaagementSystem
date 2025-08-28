import { Column, DataType, PrimaryKey, Default, Model } from 'sequelize-typescript';

export class FileManagement  extends Model<FileManagement> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // ✅ auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  declare id: string; // string instead of number

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  originalName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  filename: string;

  @Column({
    type: DataType.STRING,
     allowNull: true,
  })
  type: string;

  @Column({
    type: DataType.STRING,
     allowNull: true,
  })
  url: string;
}
