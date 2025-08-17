import { Table, Column, Model, ForeignKey, PrimaryKey, Default, DataType } from 'sequelize-typescript';
import { User } from '../../users/entities/user.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Table({ tableName: 'user_subjects' })
export class UserSubject extends Model<UserSubject> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // ✅ auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  declare id: string; // string instead of number

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => Subject)
  @Column
  subjectId: number;
}
