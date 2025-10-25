import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(identifier: string, password: string) {
    const user = await this.usersService.FindbyUserNameOrEmail(identifier);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    return user.dataValues;
  }

  async login(user: any) {
    const payload = {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      username: user.username,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET') || 'secret',
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET') || 'refreshsecret',
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    // Store hashed refresh token in DB for security
    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      parseInt(this.config.get<string>('SALT') as string) || 10,
      
    );

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      payload,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    console.log(user);
    if (!user) throw new UnauthorizedException('User not found');

    if (!user.dataValues.refreshToken || user.dataValues.refreshToken.trim() === '') {
      throw new UnauthorizedException('No refresh token found for user');
    }

    const isValid = await bcrypt.compare(refreshToken, user.dataValues.refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');


    // 2️⃣ Verify JWT validity (signature + expiry)
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });

    // 3️⃣ Issue new access token
    const newAccessToken = this.jwtService.sign(
      { userId: payload.userId, role: payload.role },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );

    // const newAccessToken = this.jwtService.sign(payload);
    return { accessToken: newAccessToken };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
