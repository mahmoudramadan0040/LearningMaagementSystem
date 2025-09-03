import { Test, TestingModule } from '@nestjs/testing';
import { SubjectRoleService } from './subject_role.service';

describe('SubjectRoleService', () => {
  let service: SubjectRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubjectRoleService],
    }).compile();

    service = module.get<SubjectRoleService>(SubjectRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
