import { Test, TestingModule } from '@nestjs/testing';
import { SubjectRoleController } from './subject_role.controller';
import { SubjectRoleService } from './subject_role.service';

describe('SubjectRoleController', () => {
  let controller: SubjectRoleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectRoleController],
      providers: [SubjectRoleService],
    }).compile();

    controller = module.get<SubjectRoleController>(SubjectRoleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
