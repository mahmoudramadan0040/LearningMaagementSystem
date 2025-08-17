import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto as any);
  }

  findAll() {
    return this.userModel.findAll({include:{all:true}});
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findByPk(id, { include: { all: true } });
  }

  async update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User| any > {
    const user = await this.findOne(id);
    
    // return user.update(updateUserDto);
  }
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    // await user.destroy();
  }
}
