import { Module } from '@nestjs/common';
import { ExamSessionService } from './exam_session.service';
import { ExamSessionController } from './exam_session.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ExamSession } from './entities/exam_session.entity';

@Module({
  imports: [SequelizeModule.forFeature([ExamSession])],
  controllers: [ExamSessionController],
  providers: [ExamSessionService],
})
export class ExamSessionModule {}
