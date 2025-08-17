import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Subject } from 'src/subject/entities/subject.entity';
import { User } from 'src/users/entities/user.entity';
@Table({ tableName: 'departments',timestamps:true })
export class Department extends Model<Department> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull:false,
  })
  Faculty:string;


  // Department has many Users
  @HasMany(() => User)
  users: User[];
  // Department has many Users
  @HasMany(() => Subject)
  subjects: Subject[];


}
