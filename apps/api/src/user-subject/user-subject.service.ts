import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserSubject } from './entities/user-subject.entity';
import { User } from '../users/entities/user.entity';
import { Subject } from '../subject/entities/subject.entity';
import { Department } from '../department/entities/department.entity';
import { CreateUserSubjectDto } from './dto/create-user-subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user-subject.dto';
import { EnrollSubjectDto } from './dto/enroll-subject.dto';
import { UnenrollSubjectDto } from './dto/unenroll-subject.dto';

@Injectable()
export class UserSubjectService {
  constructor(
    @InjectModel(UserSubject)
    private userSubjectModel: typeof UserSubject,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
  ) {}

  // Enroll a user in a subject
  async enrollUserInSubject(
    userId: string,
    enrollSubjectDto: EnrollSubjectDto,
  ) {
    const { subjectId } = enrollSubjectDto;

    // Check if user exists
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if subject exists
    const subject = await this.subjectModel.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    // Check if user is already enrolled in this subject
    const existingEnrollment = await this.userSubjectModel.findOne({
      where: { userId, subjectId },
    });

    if (existingEnrollment) {
      throw new ConflictException('User is already enrolled in this subject');
    }

    // Create enrollment
    const enrollment = await this.userSubjectModel.create({
      userId,
      subjectId,
    } as any);

    return {
      message: 'Successfully enrolled in subject',
      enrollment,
      subject: {
        id: subject.id,
        name: subject.name,
        subject_code: subject.subject_code,
        level: subject.level,
      },
    };
  }

  // Get all subjects a user is enrolled in
  async getUserEnrolledSubjects(userId: string) {
    // Check if user exists
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const enrollments = await this.userSubjectModel.findAll({
      where: { userId },
      include: [
        {
          model: Subject,
          as: 'subject',
          include: [
            {
              model: Department,
              as: 'department',
            },
          ],
        },
      ],
    });

    return {
      userId,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      enrolledSubjects: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        subject: {
          id: enrollment.subject.id,
          name: enrollment.subject.name,
          subject_code: enrollment.subject.subject_code,
          level: enrollment.subject.level,
          MaxScore: enrollment.subject.MaxScore,
          MinScore: enrollment.subject.MinScore,
          grade_type: enrollment.subject.grade_type,
          department: enrollment.subject.department,
        },
        enrolledAt: enrollment.createdAt,
      })),
      totalSubjects: enrollments.length,
    };
  }

  // Unenroll a user from a subject
  async unenrollUserFromSubject(
    userId: string,
    unenrollSubjectDto: UnenrollSubjectDto,
  ) {
    const { subjectId } = unenrollSubjectDto;

    // Check if user exists
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if subject exists
    const subject = await this.subjectModel.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    // Find the enrollment
    const enrollment = await this.userSubjectModel.findOne({
      where: { userId, subjectId },
    });

    if (!enrollment) {
      throw new NotFoundException('User is not enrolled in this subject');
    }

    // Remove enrollment
    await enrollment.destroy();

    return {
      message: 'Successfully unenrolled from subject',
      subject: {
        id: subject.id,
        name: subject.name,
        subject_code: subject.subject_code,
      },
    };
  }

  // Get all users enrolled in a specific subject
  async getSubjectEnrolledUsers(subjectId: string) {
    // Check if subject exists
    const subject = await this.subjectModel.findByPk(subjectId);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${subjectId} not found`);
    }

    const enrollments = await this.userSubjectModel.findAll({
      where: { subjectId },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });

    return {
      subjectId,
      subject: {
        id: subject.id,
        name: subject.name,
        subject_code: subject.subject_code,
        level: subject.level,
      },
      enrolledUsers: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        user: {
          id: enrollment.user.id,
          name: enrollment.user.name,
          email: enrollment.user.email,
          username: enrollment.user.username,
          student_id: enrollment.user.student_id,
          class_code: enrollment.user.class_code,
        },
        enrolledAt: enrollment.createdAt,
      })),
      totalUsers: enrollments.length,
    };
  }

  // Check if user is enrolled in a specific subject
  async isUserEnrolledInSubject(userId: string, subjectId: string) {
    const enrollment = await this.userSubjectModel.findOne({
      where: { userId, subjectId },
    });

    return {
      isEnrolled: !!enrollment,
      enrollment: enrollment || null,
    };
  }

  // Get enrollment statistics
  async getEnrollmentStats() {
    const totalEnrollments = await this.userSubjectModel.count();
    const totalUsers = await this.userModel.count();
    const totalSubjects = await this.subjectModel.count();

    return {
      totalEnrollments,
      totalUsers,
      totalSubjects,
      averageSubjectsPerUser:
        totalUsers > 0 ? (totalEnrollments / totalUsers).toFixed(2) : 0,
      averageUsersPerSubject:
        totalSubjects > 0 ? (totalEnrollments / totalSubjects).toFixed(2) : 0,
    };
  }

  // Legacy methods for backward compatibility
  async create(createUserSubjectDto: CreateUserSubjectDto) {
    return this.enrollUserInSubject(createUserSubjectDto.userId, {
      subjectId: createUserSubjectDto.subjectId,
    });
  }

  async findAll() {
    const enrollments = await this.userSubjectModel.findAll({
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });

    return {
      enrollments: enrollments.map((enrollment) => ({
        id: enrollment.id,
        user: {
          id: enrollment.user.id,
          name: enrollment.user.name,
          email: enrollment.user.email,
        },
        subject: {
          id: enrollment.subject.id,
          name: enrollment.subject.name,
          subject_code: enrollment.subject.subject_code,
        },
        enrolledAt: enrollment.createdAt,
      })),
      total: enrollments.length,
    };
  }

  async findOne(id: string) {
    const enrollment = await this.userSubjectModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async update(id: string, updateUserSubjectDto: UpdateUserSubjectDto) {
    const enrollment = await this.userSubjectModel.findByPk(id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    await enrollment.update(updateUserSubjectDto);
    return enrollment;
  }

  async remove(id: string) {
    const enrollment = await this.userSubjectModel.findByPk(id);
    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    await enrollment.destroy();
    return { message: 'Enrollment deleted successfully' };
  }
}
