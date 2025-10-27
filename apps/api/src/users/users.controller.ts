import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpCode,
  ParseUUIDPipe,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { BatchUpdateUserDto } from './dto/batch-update-users.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles, User_Roles } from 'src/auth/roles.decorator';
@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    description: 'Default request example',
    schema: {
      example: {
        name: 'Ahmed Hassan',
        student_id: 'STU20251021',
        password: 'Ahm3d@123',
        username: 'ahmed_hassan',
        email: 'ahmed.hassan@example.com',
        class_code: 'CSE301',
        phone: '+201023456789',
        address: '25 El Tahrir St, Cairo, Egypt',
        national_id: '29805121501234',
        role: 'Student',
        level_status: 'Active',
        level: 3,
        Graduated: false,
      },
    },
  })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, type: User })
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  // @ApiBearerAuth('access-token')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles(User_Roles.ADMIN, User_Roles.TEACHING_ASSISTANT)
  @Get()
  @ApiOperation({ summary: 'Get all users with relations' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users',
    schema: {
      example: {
        data: [
          { id: 'uuid', name: 'John Doe' },
          { id: 'uuid2', name: 'Jane Doe' },
        ],
        total: 20,
        page: 1,
        limit: 10,
        totalPages: 2,
      },
    },
  })
  @HttpCode(200)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @HttpCode(200)
  async findOne(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<User | any> {
    return await this.usersService.findOne(id);
  }

  // update one user
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(200)
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }
  // update multiple users
  @Patch('batch')
  @ApiOperation({ summary: 'Batch update multiple users' })
  @ApiResponse({ status: 200, description: 'Batch update result' })
  @ApiBody({ type: BatchUpdateUserDto })
  async batchUpdate(@Body() batchUpdateUserDto: BatchUpdateUserDto) {
    return this.usersService.batchUpdate(batchUpdateUserDto);
  }
  // delete user
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: String })
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.usersService.remove(id);
    return { message: ` User with ID ${id} deleted successfully` };
  }
}
