import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createUserDto as any);
  }

  async findAll(page: number = 1, limit: number = 10){
    const offset = (page - 1) * limit;

    const { rows, count } = await this.userRepository.findAndCountAll({
      include: { all: true },
      limit,
      offset,
    });

    return {
      data:rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<User | null > {
    return await this.userRepository.findByPk(id, {
      include: { all: true },
    });
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User | any> {
    const user = await this.findOne(id);
    return user!.update(updateUserDto);
  }
  async remove(id: string): Promise<boolean> {
    const user = await this.findOne(id);
    if (!user) return false;
    await user!.destroy();
    return true;
  }
}
