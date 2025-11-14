import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubjectRoleDto } from './dto/create-subject_role.dto';
import { UpdateSubjectRoleDto } from './dto/update-subject_role.dto';
import { InjectModel } from '@nestjs/sequelize';
import { SubjectRole } from './entities/subject_role.entity';
import Op from 'sequelize/lib/operators';

@Injectable()
export class SubjectRoleService {
  constructor(
    @InjectModel(SubjectRole)
    private subjectRoleModel: typeof SubjectRole,
  ) {}

  async create(dto: CreateSubjectRoleDto) {
    // ✅ 1. Check for duplicate symbol in the same subject
    const duplicate = await this.subjectRoleModel.findOne({
      where: {
        subjectId: dto.subjectId,
        symbol: dto.symbol,
      },
    });

    if (duplicate) {
      throw new ConflictException(
        `Grade symbol '${dto.symbol}' already exists for this subject.`,
      );
    }

    // Special rules do NOT use percentage, skip overlap check
    if (dto.ruleType === 'excuse' || dto.ruleType === 'cheat') {
      return this.subjectRoleModel.create(dto as any);
    }

    // Check overlap for total/exam types
    const overlap = await this.subjectRoleModel.findOne({
      where: {
        subjectId: dto.subjectId,
        ruleType: dto.ruleType, // only compare same type
        minPercentage: { [Op.lte]: dto.maxPercentage },
        maxPercentage: { [Op.gte]: dto.minPercentage },
      },
    });
    if (overlap) {
      throw new HttpException(
        'This percentage range overlaps an existing rule.',
        HttpStatus.CONFLICT,
      );
    }

    // ✅ 2. Optional sanity check: ensure min < max
    if (dto.minPercentage >= dto.maxPercentage) {
      throw new BadRequestException(
        `minPercentage (${dto.minPercentage}) must be less than maxPercentage (${dto.maxPercentage}).`,
      );
    }

    // ✅ 3. Create record
    return this.subjectRoleModel.create(dto as any);
  }

  async findAllRole(id: string) {
    const roles = await this.subjectRoleModel.findAll({
      where: { subjectId: id },
      include: { all: true },
    });
    if (!roles) {
      throw new NotFoundException('roles not exists');
    }
    return roles;
  }

  async findOne(id: string) {
    const role = await this.subjectRoleModel.findByPk(id, {
      include: { all: true },
    });
    if (!role) {
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
