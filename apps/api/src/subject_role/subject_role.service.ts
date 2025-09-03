import { Injectable } from '@nestjs/common';
import { CreateSubjectRoleDto } from './dto/create-subject_role.dto';
import { UpdateSubjectRoleDto } from './dto/update-subject_role.dto';

@Injectable()
export class SubjectRoleService {
  create(createSubjectRoleDto: CreateSubjectRoleDto) {
    return 'This action adds a new subjectRole';
  }

  findAll() {
    return `This action returns all subjectRole`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subjectRole`;
  }

  update(id: number, updateSubjectRoleDto: UpdateSubjectRoleDto) {
    return `This action updates a #${id} subjectRole`;
  }

  remove(id: number) {
    return `This action removes a #${id} subjectRole`;
  }
}
