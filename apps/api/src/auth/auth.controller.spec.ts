import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from 'src/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService>;

  const mockUser = {
    name: 'mahmoud',
    student_id: '2018005',
    password: 'moon2016',
    username: 'mahmoud0020',
    email: 'mahmoudramadan0020@gmail.com',
    class_code: '1',
    phone: '01017392148',
    address: 'string',
    national_id: '30001062102838',
    role: 'Student',
    level_status: 'string',
    level: 0,
    Graduated: false,
  };

  const mockLoginResponse = {
    payload: mockUser,
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const mockCreateUserResponse = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    phone: '1234567890',
    role: 'user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response when credentials are valid', async () => {
      const loginDto: LoginDto = {
        identifier: 'john@example.com',
        password: 'password123',
      };

      authService.validateUser.mockResolvedValue(mockUser as any);
      authService.login.mockResolvedValue(mockLoginResponse as any);

      const result = await controller.login(loginDto);

      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.identifier,
        loginDto.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should throw error when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        identifier: 'invalid@example.com',
        password: 'wrongpassword',
      };

      authService.validateUser.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(authService.validateUser).toHaveBeenCalledWith(
        loginDto.identifier,
        loginDto.password,
      );
      expect(authService.login).not.toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('should return new access token when refresh token is valid', async () => {
      const refreshBody = {
        userId: '1',
        refreshToken: 'valid-refresh-token',
      };
      const refreshResponse = {
        accessToken: 'new-access-token',
      };

      authService.refreshToken.mockResolvedValue(refreshResponse);

      const result = await controller.refresh(refreshBody);

      expect(authService.refreshToken).toHaveBeenCalledWith(
        refreshBody.userId,
        refreshBody.refreshToken,
      );
      expect(result).toEqual(refreshResponse);
    });

    it('should throw error when refresh token is invalid', async () => {
      const refreshBody = {
        userId: '1',
        refreshToken: 'invalid-refresh-token',
      };

      authService.refreshToken.mockRejectedValue(
        new Error('Invalid refresh token'),
      );

      await expect(controller.refresh(refreshBody)).rejects.toThrow(
        'Invalid refresh token',
      );
      expect(authService.refreshToken).toHaveBeenCalledWith(
        refreshBody.userId,
        refreshBody.refreshToken,
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      const logoutBody = {
        userId: '1',
      };

      authService.logout.mockResolvedValue(undefined);

      const result = await controller.logout(logoutBody);

      expect(authService.logout).toHaveBeenCalledWith(logoutBody.userId);
      expect(result).toBeUndefined();
    });

    it('should handle logout errors', async () => {
      const logoutBody = {
        userId: '1',
      };

      authService.logout.mockRejectedValue(new Error('Logout failed'));

      await expect(controller.logout(logoutBody)).rejects.toThrow(
        'Logout failed',
      );
      expect(authService.logout).toHaveBeenCalledWith(logoutBody.userId);
    });
  });

  describe('register', () => {
    it('should create new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        phone: '1234567890',
        password: 'password123',
        role: UserRole.STUDENT,
      };

      usersService.create.mockResolvedValue(mockCreateUserResponse as any);

      const result = await controller.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockCreateUserResponse);
    });

    it('should handle user creation errors', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        username: 'johndoe',
        phone: '1234567890',
        password: 'password123',
        role: UserRole.STUDENT,
      };

      usersService.create.mockRejectedValue(new Error('User creation failed'));

      await expect(controller.register(createUserDto)).rejects.toThrow(
        'User creation failed',
      );
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});
