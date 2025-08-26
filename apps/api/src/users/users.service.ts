import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BatchUpdateUserDto } from './dto/batch-update-users.dto';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    private sequelize: Sequelize,
  ) {}

  // create
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        [Op.or]: [
          { email: createUserDto.email },
          { username: createUserDto.username },
        ],
      },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password as string,
      10,
    );
    return this.userRepository.create(createUserDto as any);
  }
  // get all users
  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const { rows, count } = await this.userRepository.findAndCountAll({
      include: { all: true },
      limit,
      offset,
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
  // retrive one user
  async findOne(id: string): Promise<User | null> {
    const user = await this.userRepository.findByPk(id, {
      include: { all: true },
    });
    if (!user) throw new NotFoundException(`User with Id "${id}" not found !`);
    return user;
  }
  // update signle user
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | any> {
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundException(`User with Id "${id}" not found !`);
    return user.update(updateUserDto);
  }

  // remove one user
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException(`User with Id "${id}" not found !`);
    await user.destroy();
  }
  // import all user
  // update multiple user in same time
  async batchUpdate(batchUpdateUserDto: BatchUpdateUserDto) {
    const ids = batchUpdateUserDto.updates.map((u) => u.id);

    // ✅ Fetch all users in one query
    const users = await this.userRepository.findAll({
      where: { id: ids },
    });

    const foundIds = users.map((u) => u.id);
    const missingIds = ids.filter((id) => !foundIds.includes(id));

    if (missingIds.length) {
      // ✅ Log missing IDs
      console.warn('Batch update: Some IDs not found:', missingIds);
    }

    return this.sequelize.transaction(async (transaction) => {
      const updatedUsers: User[] = [];

      for (const updateItem of batchUpdateUserDto.updates) {
        const user = users.find((u) => u.id === updateItem.id);
        if (!user) continue; // skip missing IDs
        await user.update(updateItem.data, { transaction });
        updatedUsers.push(user);
      }

      return {
        updatedCount: updatedUsers.length,
        failedCount: missingIds.length,
        failedIds: missingIds,
        updatedUsers,
      };
    });
  }

  /**
   * ✅ Update hashed refresh token for the user
   */
  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    const user = await this.userRepository.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');
    await user.update({ refreshToken: hashedRefreshToken as any });
  }

  async FindbyUserNameOrEmail(identifier: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { [Op.or]: [{ email: identifier }, { username: identifier }] },
    });
    return user;
  }
}
