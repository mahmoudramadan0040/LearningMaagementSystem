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
} from 'sequelize-typescript';
import { Department } from 'src/department/entities/department.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { UserSubject } from 'src/user-subject/entities/user-subject.entity';

export enum UserRole {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  ADMIN = 'Admin',
}

@Table({
  tableName: 'users',
  timestamps:true
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

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role: UserRole;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  level_status: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  level:Number;

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
  @BeforeCreate
  static async generateUniqueId(instance: User) {
    instance.unique_id = await User.generateTimeBasedId();
  }
  private static async generateTimeBasedId(): Promise<string> {
    let id: string;
    let exists: User | null;

    do {
      // Get current time in seconds (10 digits)
      const timestamp = Date.now().toString().slice(-7); // last 7 digits of timestamp
      const randomPart = Math.floor(10 + Math.random() * 89).toString(); // 2 digits random
      id = timestamp + randomPart; // total 9 digits

      // Ensure uniqueness in DB
      exists = await User.findOne({ where: { unique_id: id } });
    } while (exists);

    return id;
  }



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
}
