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
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET') || 'refreshsecret',
    });

    // Store hashed refresh token in DB for security
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      payload,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) throw new UnauthorizedException('Invalid refresh token');

    const payload = { sub: user.id, role: user.role };
    const newAccessToken = this.jwtService.sign(payload);
    return { accessToken: newAccessToken };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }
}
