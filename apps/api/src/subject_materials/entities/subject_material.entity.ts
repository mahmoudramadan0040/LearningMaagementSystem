import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Subject } from 'src/subject/entities/subject.entity';
import { UploadedFile } from 'src/file_management/interface/UploadFile.interface';
@Table({
  tableName: 'subject_materials',
  timestamps: true,
})
export class SubjectMaterial extends Model<SubjectMaterial> {
  @PrimaryKey
  @Default(DataType.UUIDV4) // ✅ auto-generate UUID
  @Column({
    type: DataType.UUID,
  })
  declare id: string; // string instead of number

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  links: Record<string, string>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  documents: Record<string, UploadedFile>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  books: Record<string, UploadedFile>;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  Notes: Record<string, string>;


  // one to one relationship 
  @ForeignKey(() => Subject)
  @Column
  subjectId: number;

  @BelongsTo(() => Subject)
  subject: Subject;
}
