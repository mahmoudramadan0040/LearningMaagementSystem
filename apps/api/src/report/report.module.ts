import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/entities/user.entity';
import { Subject } from 'src/subject/entities/subject.entity';
import { Grade } from 'src/grade/entities/grade.entity';
import { Department } from 'src/department/entities/department.entity';
import { ExamSession } from 'src/exam_session/entities/exam_session.entity';
import { SubjectRole } from 'src/subject_role/entities/subject_role.entity';
import { UserSubject } from 'src/user-subject/entities/user-subject.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Subject, Grade, Department,ExamSession,SubjectRole,UserSubject]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
