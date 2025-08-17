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
} from 'sequelize-typescript';
import { Department } from 'src/department/entities/department.entity';
import { UserSubject } from 'src/user-subject/entities/user-subject.entity';
import { User } from 'src/users/entities/user.entity';

export enum GradeType {
  NORMAL = 'normal', // مواد ليها تقديرات (مقبول / جيد / ممتاز...)
  PASS_FAIL = 'pass_fail', // مواد النجاح/الرسوب فقط
}
@Table({
  tableName: 'subjects',
  timestamps: true,
})
export class Subject extends Model<Subject> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subject_code: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  level: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  MaxScore: Number;
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  MinScore: Number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  IsAddedToTotal: Boolean;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  final_min_score: Number;
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  final_max_score: Number;
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  course_work_score: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  summer_final_min_score: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  Summer_final_max_score: Number;

  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
  summer_course_work_score: Number;

  @Column({
    type: DataType.ENUM(...Object.values(GradeType)), // enum
    allowNull: false,
    defaultValue: GradeType.NORMAL,
  })
  grade_type: GradeType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  pass_percentage: number;


  // relation between user and department 
  // Foreign key
  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
  })
  departmentId: string;


  // Relation
  @BelongsTo(() => Department)
  department: Department;
  
  // Many-to-Many relation with User
  @BelongsToMany(() => User, () => UserSubject)
  users: User[];
}
