import { Test, TestingModule } from '@nestjs/testing';
import { SubjectMaterialsService } from './subject_materials.service';

describe('SubjectMaterialsService', () => {
  let service: SubjectMaterialsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectMaterialsService],
    }).compile();

    service = module.get<SubjectMaterialsService>(SubjectMaterialsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
