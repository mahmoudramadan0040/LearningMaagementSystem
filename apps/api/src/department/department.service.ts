import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { InjectModel } from '@nestjs/sequelize';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel(Department)
    private readonly DepartmentRepo: typeof Department,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    return this.DepartmentRepo.create(createDepartmentDto as any);
  }

  async findAll() {
    return this.DepartmentRepo.findAll();
  }

  async findOne(id: string) {
    return this.DepartmentRepo.findByPk(id);
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.DepartmentRepo.findByPk(id);
    if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found!`);
    }
    return await department.update(updateDepartmentDto);
  }

  async remove(id: string) {
    const department = await this.DepartmentRepo.findByPk(id);
     if (!department) {
      throw new NotFoundException(`Department with ID "${id}" not found!`);
    }

    return await department.destroy();
  }
}
