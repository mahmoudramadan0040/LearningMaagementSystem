import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  BeforeCreate,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
  AllowNull,
  HasOne,
} from 'sequelize-typescript';
import { Department } from 'src/department/entities/department.entity';
import { FileManagement } from 'src/file_management/entities/file_management.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { UserSubject } from 'src/user-subject/entities/user-subject.entity';
import { Exclude } from 'class-transformer';
export enum UserRole {
  STUDENT = 'Student',
  TEACHING_ASSISTANT = 'Teaching_Assistant',
  DOCTOR='Doctor',
  ADMIN = "Admin",
  MANAGER='Manager',
  STUDENT_AFFAIRS_OFFICER='Student_Affairs_Officer'
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
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
  email: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })

  password: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  student_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  class_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  national_id: string;

  @Default(UserRole.STUDENT)
  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role: UserRole;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  refreshToken?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  level_status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  level: Number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  Graduated: boolean;

  // generate unique id for pay in the future
  @Column({
    type: DataType.STRING(9),
    unique: true,
    allowNull: true,
  })
  unique_id: string;

  
  // relation between user and department
  // Foreign key
  @ForeignKey(() => Department)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  departmentId: string;

  // Relation
  @BelongsTo(() => Department)
  department: Department;

  @BelongsToMany(() => Subject, () => UserSubject)
  subjects: Subject[];

  @Column({ type: DataType.STRING, allowNull: true })
  profileImage: string | null;


}
