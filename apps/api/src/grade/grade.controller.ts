import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Grade')
@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  // ---------------------------------------
  // ⭐ CREATE
  // ---------------------------------------
  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple grades at once' })
  @ApiOperation({ summary: 'Bulk create grades' })
  @ApiBody({
    description: 'List of grades to create',
    type: CreateGradeDto,
    isArray: true,
    examples: {
      bulkExample: {
        summary: 'Bulk grade creation example',
        value: [
          {
            userId: '5f1c2e3d-1234-4abc-9f70-111111111111',
            subjectId: '7d9b22c4-9876-4ab5-8888-222222222222',
            examSessionId: '8a2c22d4-9999-4bd5-7777-333333333333',
            semester_work_score: 20,
            final_exam_score: 50,
          },
          {
            userId: '5f1c2e3d-1234-4abc-9f70-444444444444',
            subjectId: '7d9b22c4-9876-4ab5-8888-222222222222',
            examSessionId: '8a2c22d4-9999-4bd5-7777-333333333333',
            semester_work_score: 18,
            final_exam_score: 45,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Grades created successfully',
  })
  bulkCreate(@Body() dtoList: CreateGradeDto[]) {
    return this.gradeService.bulkCreate(dtoList);
  }

  // ---------------------------------------
  // ⭐ FIND ALL (Pagination + Filters)
  // ---------------------------------------
  @Get()
  @ApiOperation({
    summary: 'Get all grades with pagination & filters',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'subjectId', required: false })
  @ApiQuery({ name: 'examSessionId', required: false })
  @ApiResponse({
    status: 200,
    description: 'List of paginated grades',
  })
  findAll(@Query() query: any) {
    return this.gradeService.findAll(query);
  }

  // ---------------------------------------
  // ⭐ FIND ONE
  // ---------------------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get grade by ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the grade record',
    example: 'e56f6673-739a-47ea-ae89-61b4860e5b23',
  })
  @ApiResponse({ status: 200, description: 'Grade found' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  findOne(@Param('id') id: string) {
    return this.gradeService.findOne(id);
  }

  // ---------------------------------------
  // ⭐ UPDATE
  // ---------------------------------------
  @Put()
  @ApiOperation({ summary: 'Update a grade by ID' })
  @ApiBody({
    description: 'Grade update payload',
    type: CreateGradeDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Grade updated successfully',
  })
  update(@Body() dto: CreateGradeDto[]) {
    return this.gradeService.bulkUpsert(dto);
  }

  // ---------------------------------------
  // ⭐ DELETE
  // ---------------------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a grade by ID' })
  @ApiParam({
    name: 'id',
    example: 'e56f6673-739a-47ea-ae89-61b4860e5b23',
  })
  @ApiResponse({
    status: 200,
    description: 'Grade deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.gradeService.remove(id);
  }
}
