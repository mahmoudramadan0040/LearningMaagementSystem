
import {
  Column,
  Default,
  DataType,
  ForeignKey,
  Table,
  PrimaryKey,
  BelongsTo,
  Model
} from 'sequelize-typescript';
import { ExamSession } from 'src/exam_session/entities/exam_session.entity';
import { Subject } from 'src/subject/entities/subject.entity';

// exam-session-subject.entity.ts
@Table({ tableName: 'exam_session_subjects', timestamps: false })
export class ExamSessionSubject extends Model<ExamSessionSubject> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // ✅ auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  declare id: string; // string instead of number

  @ForeignKey(() => ExamSession)
  @Column({
    type: DataType.UUID,
  })
  examSessionId: string;

  @ForeignKey(() => Subject)
  @Column({
    type: DataType.UUID,
  })
  subjectId: string;

  @BelongsTo(() => Subject)
  subject: Subject;

  @BelongsTo(() => ExamSession)
  exam_session: ExamSession;
}
