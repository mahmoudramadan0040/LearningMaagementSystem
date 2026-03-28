import { Module } from '@nestjs/common';
import { ExamSessionSubjectService } from './exam_session_subject.service';
import { ExamSessionSubjectController } from './exam_session_subject.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExamSession } from 'src/exam_session/entities/exam_session.entity';
import { ExamSessionSubject } from './entities/exam_session_subject.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Module({
  imports:[SequelizeModule.forFeature([Subject,ExamSession,ExamSessionSubject])],
  controllers: [ExamSessionSubjectController],
  providers: [ExamSessionSubjectService],
})
export class ExamSessionSubjectModule {}
