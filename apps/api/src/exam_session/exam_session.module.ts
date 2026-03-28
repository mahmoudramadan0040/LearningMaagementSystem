import { Module } from '@nestjs/common';
import { ExamSessionService } from './exam_session.service';
import { ExamSessionController } from './exam_session.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExamSession } from './entities/exam_session.entity';
import { ExamSessionSubject } from 'src/exam_session_subject/entities/exam_session_subject.entity';
import { Subject } from 'src/subject/entities/subject.entity';

@Module({
  imports: [SequelizeModule.forFeature([ExamSession,ExamSessionSubject,Subject])],
  controllers: [ExamSessionController],
  providers: [ExamSessionService],
})
export class ExamSessionModule {}
