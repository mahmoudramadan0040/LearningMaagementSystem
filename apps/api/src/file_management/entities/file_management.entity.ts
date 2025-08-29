import { Column, DataType, PrimaryKey, Default, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';

@Table({
  tableName: 'file-managment',
  timestamps: true,
})
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

  // make relationship between user and files 
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;

}
