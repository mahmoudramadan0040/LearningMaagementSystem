import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectRoleDto } from './dto/create-subject_role.dto';
import { UpdateSubjectRoleDto } from './dto/update-subject_role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SubjectRole } from './entities/subject_role.entity';

@Injectable()
export class SubjectRoleService {
  constructor(
    @InjectModel(SubjectRole)
    private subjectRoleModel: typeof SubjectRole,
  ) {}

  async create(dto: CreateSubjectRoleDto) {
    return this.subjectRoleModel.create(dto as any);
  }

  async findAllRole(id:string) {
    const roles = await this.subjectRoleModel.findAll({ where: {subjectId:id}, include: { all: true } });
    if(!roles){
      throw new NotFoundException('roles not exists');
    }
    return roles;
  }

  async findOne(id: string) {
    const role = await this.subjectRoleModel.findByPk(id, { include: { all: true } });
    if(!role){
      throw new NotFoundException('roles not exists');
    }
    return role;
  }

  async update(id: string, dto: Partial<CreateSubjectRoleDto>) {
    return this.subjectRoleModel.update(dto as any, { where: { id } });
  }

  async remove(id: string) {
    return this.subjectRoleModel.destroy({ where: { id } });
  }
}
