import { Test, TestingModule } from '@nestjs/testing';
import { ExamSessionSubjectService } from './exam_session_subject.service';

describe('ExamSessionSubjectService', () => {
  let service: ExamSessionSubjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamSessionSubjectService],
    }).compile();

    service = module.get<ExamSessionSubjectService>(ExamSessionSubjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
