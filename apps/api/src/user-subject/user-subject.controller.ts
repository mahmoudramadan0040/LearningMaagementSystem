import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSubjectService } from './user-subject.service';
import { CreateUserSubjectDto } from './dto/create-user-subject.dto';
import { UpdateUserSubjectDto } from './dto/update-user-subject.dto';

@Controller('user-subject')
export class UserSubjectController {
  constructor(private readonly userSubjectService: UserSubjectService) {}

  @Post()
  create(@Body() createUserSubjectDto: CreateUserSubjectDto) {
    return this.userSubjectService.create(createUserSubjectDto);
  }

  @Get()
  findAll() {
    return this.userSubjectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSubjectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSubjectDto: UpdateUserSubjectDto) {
    return this.userSubjectService.update(+id, updateUserSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSubjectService.remove(+id);
  }
}
