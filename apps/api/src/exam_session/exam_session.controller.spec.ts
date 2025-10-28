import { Test, TestingModule } from '@nestjs/testing';
import { ExamSessionController } from './exam_session.controller';
import { ExamSessionService } from './exam_session.service';

describe('ExamSessionController', () => {
  let controller: ExamSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSessionController],
      providers: [ExamSessionService],
    }).compile();

    controller = module.get<ExamSessionController>(ExamSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
