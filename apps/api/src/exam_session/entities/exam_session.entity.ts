import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { ExamSessionSubject } from 'src/exam_session_subject/entities/exam_session_subject.entity';
import { Grade } from 'src/grade/entities/grade.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Table({
  tableName: 'ExamSession',
  timestamps: true,
})
export class ExamSession extends Model<ExamSession> {
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
  name: string; // يناير، مايو، سبتمبر...
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  ar_name: string; // يناير، مايو، سبتمبر...

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  academicYear: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  IsChangeStateOfStudent: boolean;

  @HasMany(() => Grade)
  grades: Grade[];

  @BelongsToMany(() => Subject, () => ExamSessionSubject)
  subjects: Subject[];
}
