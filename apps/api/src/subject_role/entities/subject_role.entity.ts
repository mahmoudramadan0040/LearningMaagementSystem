import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Subject } from 'src/subject/entities/subject.entity';
@Table({ tableName: 'subject_roles', timestamps: true })
export class SubjectRole extends Model<SubjectRole> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  // relation between subject and subject_role [ one to many ]
  @ForeignKey(() => Subject)
  @Column({ type: DataType.UUID, allowNull: false })
  subjectId: string;

  @BelongsTo(() => Subject)
  subject: Subject;


  @Column({ type: DataType.STRING(10), allowNull: false })
  symbol: string; // e.g., A, A-, B+

  @Column({ type: DataType.DOUBLE, allowNull: false })
  minPercentage: number; // e.g., 85

  @Column({ type: DataType.DOUBLE, allowNull: false })
  maxPercentage: number; // e.g., 89

}
