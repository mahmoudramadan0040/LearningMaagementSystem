import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Table({ tableName: 'grades', timestamps: true })
export class Grade extends Model<Grade> {
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
  grade_session: string;

  @Column({ type: DataType.JSON, allowNull: false })
  score: number | string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  grade: string;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Subject)
  @Column
  subjectId: string;

  @BelongsTo(() => Subject)
  subject: Subject;
}
