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
import { ExamSession } from 'src/exam_session/entities/exam_session.entity';

@Table({
  tableName: 'grades',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'subjectId', 'examSessionId'],
    },
  ],
})
export class Grade extends Model<Grade> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({ type: DataType.JSON, allowNull: true })
  total_score: number | string;

  @Column({ type: DataType.JSON, allowNull: true })
  semester_work_score: number | string;

  @Column({ type: DataType.JSON, allowNull: true })
  final_exam_score: number | string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  grade: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  grade_ar: string;
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Subject)
  @Column(DataType.UUID)
  subjectId: string;

  @BelongsTo(() => Subject)
  subject: Subject;

  // ✅ NEW: Foreign Key to ExamSession
  @ForeignKey(() => ExamSession)
  @Column(DataType.UUID)
  examSessionId: string;

  @BelongsTo(() => ExamSession)
  examSession: ExamSession;
}
