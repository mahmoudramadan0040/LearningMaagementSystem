import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Department') 
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  async findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id',new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id',new ParseUUIDPipe({ version: '4' })) id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  async remove(@Param('id',new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.departmentService.remove(id);
  }
}
