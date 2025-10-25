import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    phone: '1234567890',
    role: 'user',
    password: 'hashedPassword',
    dataValues: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      phone: '1234567890',
      role: 'user',
      password: 'hashedPassword',
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            FindbyUserNameOrEmail: jest.fn(),
            findOne: jest.fn(),
            updateRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const identifier = 'john@example.com';
      const password = 'password123';

      usersService.FindbyUserNameOrEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser(identifier, password);

      expect(usersService.FindbyUserNameOrEmail).toHaveBeenCalledWith(
        identifier,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.dataValues.password,
      );
      expect(result).toEqual(mockUser.dataValues);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const identifier = 'nonexistent@example.com';
      const password = 'password123';

      usersService.FindbyUserNameOrEmail.mockResolvedValue(null);

      await expect(service.validateUser(identifier, password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(usersService.FindbyUserNameOrEmail).toHaveBeenCalledWith(
        identifier,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const identifier = 'john@example.com';
      const password = 'wrongpassword';

      usersService.FindbyUserNameOrEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.validateUser(identifier, password)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(usersService.FindbyUserNameOrEmail).toHaveBeenCalledWith(
        identifier,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.dataValues.password,
      );
    });
  });

  describe('login', () => {
    it('should return access token, refresh token and payload', async () => {
      const user = mockUser.dataValues;
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';
      const hashedRefreshToken = 'hashed-refresh-token';

      jwtService.sign
        .mockReturnValueOnce(accessToken)
        .mockReturnValueOnce(refreshToken);

      configService.get.mockReturnValue('refresh-secret');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedRefreshToken as never);
      usersService.updateRefreshToken.mockResolvedValue(undefined as any);

      const result = await service.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
      });

      expect(jwtService.sign).toHaveBeenCalledWith(
        {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          username: user.username,
          role: user.role,
        },
        {
          secret: 'refresh-secret',
        },
      );

      expect(bcrypt.hash).toHaveBeenCalledWith(refreshToken, 10);
      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        user.id,
        hashedRefreshToken,
      );

      expect(result).toEqual({
        payload: {
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          username: user.username,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new access token when refresh token is valid', async () => {
      const userId = '1';
      const refreshToken = 'valid-refresh-token';
      const newAccessToken = 'new-access-token';
      const hashedRefreshToken = 'hashed-refresh-token';

      const userWithRefreshToken = {
        ...mockUser,
        refreshToken: hashedRefreshToken,
      };

      usersService.findOne.mockResolvedValue(userWithRefreshToken);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue(newAccessToken);

      const result = await service.refreshToken(userId, refreshToken);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        refreshToken,
        hashedRefreshToken,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userId,
        role: userWithRefreshToken.role,
      });
      expect(result).toEqual({ accessToken: newAccessToken });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      const userId = '999';
      const refreshToken = 'valid-refresh-token';

      usersService.findOne.mockResolvedValue(null);

      await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw UnauthorizedException when user has no refresh token', async () => {
      const userId = '1';
      const refreshToken = 'valid-refresh-token';

      usersService.findOne.mockResolvedValue({
        ...mockUser,
        refreshToken: null,
      });

      await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(
        'No refresh token found for user',
      );
    });

    it('should throw UnauthorizedException when user has empty refresh token', async () => {
      const userId = '1';
      const refreshToken = 'valid-refresh-token';

      usersService.findOne.mockResolvedValue({
        ...mockUser,
        refreshToken: '',
      });

      await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(
        'No refresh token found for user',
      );
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      const userId = '1';
      const refreshToken = 'invalid-refresh-token';
      const hashedRefreshToken = 'hashed-refresh-token';

      usersService.findOne.mockResolvedValue({
        ...mockUser,
        refreshToken: hashedRefreshToken,
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.refreshToken(userId, refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('logout', () => {
    it('should clear user refresh token', async () => {
      const userId = '1';

      usersService.updateRefreshToken.mockResolvedValue(undefined as any);

      await service.logout(userId);

      expect(usersService.updateRefreshToken).toHaveBeenCalledWith(
        userId,
        null,
      );
    });
  });
});
