import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubjectRoleService } from './subject_role.service';
import { CreateSubjectRoleDto } from './dto/create-subject_role.dto';
import { UpdateSubjectRoleDto } from './dto/update-subject_role.dto';

@Controller('subject-role')
export class SubjectRoleController {
  constructor(private readonly subjectRoleService: SubjectRoleService) {}

  @Post()
  create(@Body() createSubjectRoleDto: CreateSubjectRoleDto) {
    return this.subjectRoleService.create(createSubjectRoleDto);
  }

  @Get()
  findAll() {
    return this.subjectRoleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectRoleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectRoleDto: UpdateSubjectRoleDto) {
    return this.subjectRoleService.update(+id, updateSubjectRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectRoleService.remove(+id);
  }
}
