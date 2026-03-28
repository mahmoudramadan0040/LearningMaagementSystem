import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Subject } from './entities/subject.entity';
import { ExamSession } from 'src/exam_session/entities/exam_session.entity';
import { ExamSessionSubject } from 'src/exam_session_subject/entities/exam_session_subject.entity';

@Module({
  imports:[SequelizeModule.forFeature([Subject])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
