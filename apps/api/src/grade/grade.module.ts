import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeController } from './grade.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Grade } from './entities/grade.entity';

@Module({
  imports:[SequelizeModule.forFeature([Grade])],
  controllers: [GradeController],
  providers: [GradeService],
})
export class GradeModule {}
