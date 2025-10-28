import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Grade } from 'src/grade/entities/grade.entity';

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
  academicYear: string; 

  @HasMany(() => Grade)
  grades: Grade[];

}
