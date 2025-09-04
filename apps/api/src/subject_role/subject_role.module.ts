import { Module } from '@nestjs/common';
import { SubjectRoleService } from './subject_role.service';
import { SubjectRoleController } from './subject_role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubjectRole } from './entities/subject_role.entity';

@Module({
  imports:[SequelizeModule.forFeature([SubjectRole])],
  controllers: [SubjectRoleController],
  providers: [SubjectRoleService],
})
export class SubjectRoleModule {}
