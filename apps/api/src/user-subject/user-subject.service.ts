import { Injectable } from '@nestjs/common';
import { CreateUserSubjectDto } from './dto/create-user-subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user-subject.dto';

@Injectable()
export class UserSubjectService {
  create(createUserSubjectDto: CreateUserSubjectDto) {
    return 'This action adds a new userSubject';
  }

  findAll() {
    return `This action returns all userSubject`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSubject`;
  }

  update(id: number, updateUserSubjectDto: UpdateUserSubjectDto) {
    return `This action updates a #${id} userSubject`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSubject`;
  }
}
