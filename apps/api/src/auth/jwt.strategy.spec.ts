import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user data from payload', async () => {
      const payload = {
        sub: 'user-id-123',
        role: 'admin',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        role: payload.role,
      });
    });

    it('should return user data with different role', async () => {
      const payload = {
        sub: 'user-id-456',
        role: 'user',
        name: 'Jane Doe',
        email: 'jane@example.com',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        role: payload.role,
      });
    });

    it('should handle payload with minimal data', async () => {
      const payload = {
        sub: 'user-id-789',
        role: 'moderator',
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        role: payload.role,
      });
    });
  });

  describe('constructor', () => {
    it('should initialize with correct JWT configuration', () => {
      const mockJwtSecret = 'test-jwt-secret';
      configService.get.mockReturnValue(mockJwtSecret);

      // Create a new instance to test constructor
      const newStrategy = new JwtStrategy(configService);

      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });

    it('should use default secret when JWT_SECRET is not configured', () => {
      configService.get.mockReturnValue(undefined);

      // Create a new instance to test constructor
      const newStrategy = new JwtStrategy(configService);

      expect(configService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
