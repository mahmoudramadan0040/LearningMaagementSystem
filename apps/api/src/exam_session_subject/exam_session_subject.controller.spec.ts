import { Test, TestingModule } from '@nestjs/testing';
import { ExamSessionSubjectController } from './exam_session_subject.controller';
import { ExamSessionSubjectService } from './exam_session_subject.service';

describe('ExamSessionSubjectController', () => {
  let controller: ExamSessionSubjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSessionSubjectController],
      providers: [ExamSessionSubjectService],
    }).compile();

    controller = module.get<ExamSessionSubjectController>(ExamSessionSubjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
