import { Module } from '@nestjs/common';
import { SubjectRoleService } from './subject_role.service';
import { SubjectRoleController } from './subject_role.controller';

@Module({
  controllers: [SubjectRoleController],
  providers: [SubjectRoleService],
})
export class SubjectRoleModule {}
