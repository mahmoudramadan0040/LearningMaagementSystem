import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
  Default,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
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
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUID,
  })
  subjectId: string;

  // Relations
  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Subject)
  subject: Subject;
}
