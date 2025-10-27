import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { User_Roles } from './roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  const mockExecutionContext = (user: any, roles?: User_Roles[]) => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as unknown as ExecutionContext;

    if (roles) {
      reflector.getAllAndOverride.mockReturnValue(roles);
    } else {
      reflector.getAllAndOverride.mockReturnValue(undefined);
    }

    return context;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      const context = mockExecutionContext({ roles: ['Student'] });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should return true when user has required role', () => {
      const user = { roles: ['Student', 'Teaching_Assistant'] };
      const context = mockExecutionContext(user, [User_Roles.STUDENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return true when user has multiple roles and one matches', () => {
      const user = { roles: ['Student', 'Teaching_Assistant'] };
      const context = mockExecutionContext(user, [
        User_Roles.ADMIN,
        User_Roles.TEACHING_ASSISTANT,
      ]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      const user = { roles: ['Student'] };
      const context = mockExecutionContext(user, [User_Roles.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user has no roles', () => {
      const user = { roles: [] };
      const context = mockExecutionContext(user, [User_Roles.STUDENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user object is null', () => {
      const user = null;
      const context = mockExecutionContext(user, [User_Roles.STUDENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should return false when user object is undefined', () => {
      const user = undefined;
      const context = mockExecutionContext(user, [User_Roles.STUDENT]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should handle case sensitivity correctly', () => {
      const user = { roles: ['student'] }; // lowercase
      const context = mockExecutionContext(user, [User_Roles.STUDENT]); // uppercase

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should work with all role types', () => {
      const testCases = [
        {
          userRoles: ['Student'],
          requiredRole: User_Roles.STUDENT,
          expected: true,
        },
        {
          userRoles: ['Teaching_Assistant'],
          requiredRole: User_Roles.TEACHING_ASSISTANT,
          expected: true,
        },
        {
          userRoles: ['Admin'],
          requiredRole: User_Roles.ADMIN,
          expected: true,
        },
        {
          userRoles: ['Manager'],
          requiredRole: User_Roles.MANAGER,
          expected: true,
        },
        {
          userRoles: ['Student'],
          requiredRole: User_Roles.ADMIN,
          expected: false,
        },
      ];

      testCases.forEach(({ userRoles, requiredRole, expected }) => {
        const user = { roles: userRoles };
        const context = mockExecutionContext(user, [requiredRole]);

        const result = guard.canActivate(context);
        expect(result).toBe(expected);
      });
    });

    it('should handle multiple required roles with OR logic', () => {
      const user = { roles: ['Student'] };
      const context = mockExecutionContext(user, [
        User_Roles.ADMIN,
        User_Roles.STUDENT,
        User_Roles.TEACHING_ASSISTANT,
      ]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should return false when user has none of the required roles', () => {
      const user = { roles: ['Student'] };
      const context = mockExecutionContext(user, [
        User_Roles.ADMIN,
        User_Roles.TEACHING_ASSISTANT,
      ]);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
