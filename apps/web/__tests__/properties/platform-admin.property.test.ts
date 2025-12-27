/**
 * Property Test: Platform Admin User Management
 * 
 * **Property 20: Platform Admin User Management**
 * **Validates: Requirements 14.3**
 * 
 * Tests that platform admins can perform role changes, bans, and account management.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

type UserRole = 'STUDENT' | 'FACULTY' | 'CLUB_ADMIN' | 'COLLEGE_ADMIN' | 'PLATFORM_ADMIN';

interface User {
  id: string;
  email: string;
  role: UserRole;
  isBanned: boolean;
  banReason?: string;
  bannedAt?: string;
}

// Generators
const userRoleArbitrary = fc.constantFrom<UserRole>(
  'STUDENT', 'FACULTY', 'CLUB_ADMIN', 'COLLEGE_ADMIN', 'PLATFORM_ADMIN'
);

const userArbitrary = fc.record({
  id: fc.uuid(),
  email: fc.emailAddress(),
  role: userRoleArbitrary,
  isBanned: fc.boolean(),
  banReason: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
  bannedAt: fc.option(
    fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2025-12-31') })
      .map(ts => new Date(ts).toISOString()),
    { nil: undefined }
  ),
});

// User management functions
function changeUserRole(
  user: User,
  newRole: UserRole,
  adminRole: UserRole
): { success: boolean; user: User; error?: string } {
  // Only platform admins can change roles
  if (adminRole !== 'PLATFORM_ADMIN') {
    return { success: false, user, error: 'Only platform admins can change roles' };
  }

  // Cannot change own role (safety measure)
  // This would need the admin's user ID in a real implementation

  // Cannot demote another platform admin (safety measure)
  if (user.role === 'PLATFORM_ADMIN' && newRole !== 'PLATFORM_ADMIN') {
    return { success: false, user, error: 'Cannot demote platform admins' };
  }

  return {
    success: true,
    user: { ...user, role: newRole },
  };
}

function banUser(
  user: User,
  reason: string,
  adminRole: UserRole
): { success: boolean; user: User; error?: string } {
  // Only platform admins can ban users
  if (adminRole !== 'PLATFORM_ADMIN') {
    return { success: false, user, error: 'Only platform admins can ban users' };
  }

  // Cannot ban platform admins
  if (user.role === 'PLATFORM_ADMIN') {
    return { success: false, user, error: 'Cannot ban platform admins' };
  }

  // Already banned
  if (user.isBanned) {
    return { success: false, user, error: 'User is already banned' };
  }

  return {
    success: true,
    user: {
      ...user,
      isBanned: true,
      banReason: reason,
      bannedAt: new Date().toISOString(),
    },
  };
}

function unbanUser(
  user: User,
  adminRole: UserRole
): { success: boolean; user: User; error?: string } {
  // Only platform admins can unban users
  if (adminRole !== 'PLATFORM_ADMIN') {
    return { success: false, user, error: 'Only platform admins can unban users' };
  }

  // Not banned
  if (!user.isBanned) {
    return { success: false, user, error: 'User is not banned' };
  }

  return {
    success: true,
    user: {
      ...user,
      isBanned: false,
      banReason: undefined,
      bannedAt: undefined,
    },
  };
}

// Role hierarchy for validation
const ROLE_HIERARCHY: Record<UserRole, number> = {
  'STUDENT': 1,
  'FACULTY': 2,
  'CLUB_ADMIN': 3,
  'COLLEGE_ADMIN': 4,
  'PLATFORM_ADMIN': 5,
};

describe('Property 20: Platform Admin User Management', () => {
  describe('Role Changes', () => {
    it('should allow platform admin to change user roles', () => {
      fc.assert(
        fc.property(
          userArbitrary,
          userRoleArbitrary,
          (user, newRole) => {
            // Skip if user is platform admin (protected)
            if (user.role === 'PLATFORM_ADMIN') return true;
            
            const result = changeUserRole(user, newRole, 'PLATFORM_ADMIN');
            expect(result.success).toBe(true);
            expect(result.user.role).toBe(newRole);
            return true;
          }
        )
      );
    });

    it('should not allow non-platform admins to change roles', () => {
      fc.assert(
        fc.property(
          userArbitrary,
          userRoleArbitrary,
          fc.constantFrom<UserRole>('STUDENT', 'FACULTY', 'CLUB_ADMIN', 'COLLEGE_ADMIN'),
          (user, newRole, adminRole) => {
            const result = changeUserRole(user, newRole, adminRole);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Only platform admins can change roles');
            expect(result.user.role).toBe(user.role); // Role unchanged
            return true;
          }
        )
      );
    });

    it('should not demote platform admins', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<UserRole>('STUDENT', 'FACULTY', 'CLUB_ADMIN', 'COLLEGE_ADMIN'),
          (newRole) => {
            const platformAdmin: User = {
              id: '1',
              email: 'admin@test.com',
              role: 'PLATFORM_ADMIN',
              isBanned: false,
            };

            const result = changeUserRole(platformAdmin, newRole, 'PLATFORM_ADMIN');
            expect(result.success).toBe(false);
            expect(result.error).toBe('Cannot demote platform admins');
            return true;
          }
        )
      );
    });

    it('should preserve user data after role change', () => {
      fc.assert(
        fc.property(
          userArbitrary,
          userRoleArbitrary,
          (user, newRole) => {
            if (user.role === 'PLATFORM_ADMIN') return true;
            
            const result = changeUserRole(user, newRole, 'PLATFORM_ADMIN');
            expect(result.user.id).toBe(user.id);
            expect(result.user.email).toBe(user.email);
            expect(result.user.isBanned).toBe(user.isBanned);
            return true;
          }
        )
      );
    });
  });

  describe('User Banning', () => {
    it('should allow platform admin to ban non-admin users', () => {
      fc.assert(
        fc.property(
          userArbitrary,
          fc.string({ minLength: 1, maxLength: 200 }),
          (user, reason) => {
            // Skip if already banned or is platform admin
            if (user.isBanned || user.role === 'PLATFORM_ADMIN') return true;
            
            const result = banUser(user, reason, 'PLATFORM_ADMIN');
            expect(result.success).toBe(true);
            expect(result.user.isBanned).toBe(true);
            expect(result.user.banReason).toBe(reason);
            expect(result.user.bannedAt).toBeDefined();
            return true;
          }
        )
      );
    });

    it('should not allow banning platform admins', () => {
      const platformAdmin: User = {
        id: '1',
        email: 'admin@test.com',
        role: 'PLATFORM_ADMIN',
        isBanned: false,
      };

      const result = banUser(platformAdmin, 'test reason', 'PLATFORM_ADMIN');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Cannot ban platform admins');
    });

    it('should not allow non-platform admins to ban users', () => {
      fc.assert(
        fc.property(
          userArbitrary,
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.constantFrom<UserRole>('STUDENT', 'FACULTY', 'CLUB_ADMIN', 'COLLEGE_ADMIN'),
          (user, reason, adminRole) => {
            const result = banUser(user, reason, adminRole);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Only platform admins can ban users');
            return true;
          }
        )
      );
    });

    it('should not ban already banned users', () => {
      const bannedUser: User = {
        id: '1',
        email: 'user@test.com',
        role: 'STUDENT',
        isBanned: true,
        banReason: 'Previous ban',
        bannedAt: new Date().toISOString(),
      };

      const result = banUser(bannedUser, 'new reason', 'PLATFORM_ADMIN');
      expect(result.success).toBe(false);
      expect(result.error).toBe('User is already banned');
    });
  });

  describe('User Unbanning', () => {
    it('should allow platform admin to unban users', () => {
      fc.assert(
        fc.property(
          userArbitrary,
          (user) => {
            // Only test with banned users
            if (!user.isBanned) return true;
            
            const result = unbanUser(user, 'PLATFORM_ADMIN');
            expect(result.success).toBe(true);
            expect(result.user.isBanned).toBe(false);
            expect(result.user.banReason).toBeUndefined();
            expect(result.user.bannedAt).toBeUndefined();
            return true;
          }
        )
      );
    });

    it('should not unban non-banned users', () => {
      const activeUser: User = {
        id: '1',
        email: 'user@test.com',
        role: 'STUDENT',
        isBanned: false,
      };

      const result = unbanUser(activeUser, 'PLATFORM_ADMIN');
      expect(result.success).toBe(false);
      expect(result.error).toBe('User is not banned');
    });

    it('should not allow non-platform admins to unban users', () => {
      fc.assert(
        fc.property(
          fc.constantFrom<UserRole>('STUDENT', 'FACULTY', 'CLUB_ADMIN', 'COLLEGE_ADMIN'),
          (adminRole) => {
            const bannedUser: User = {
              id: '1',
              email: 'user@test.com',
              role: 'STUDENT',
              isBanned: true,
              banReason: 'Test',
            };

            const result = unbanUser(bannedUser, adminRole);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Only platform admins can unban users');
            return true;
          }
        )
      );
    });
  });

  describe('Role Hierarchy', () => {
    it('should have valid role hierarchy values', () => {
      const roles: UserRole[] = ['STUDENT', 'FACULTY', 'CLUB_ADMIN', 'COLLEGE_ADMIN', 'PLATFORM_ADMIN'];
      
      for (const role of roles) {
        expect(ROLE_HIERARCHY[role]).toBeDefined();
        expect(ROLE_HIERARCHY[role]).toBeGreaterThan(0);
      }
    });

    it('should have PLATFORM_ADMIN as highest role', () => {
      const maxLevel = Math.max(...Object.values(ROLE_HIERARCHY));
      expect(ROLE_HIERARCHY['PLATFORM_ADMIN']).toBe(maxLevel);
    });

    it('should have STUDENT as lowest role', () => {
      const minLevel = Math.min(...Object.values(ROLE_HIERARCHY));
      expect(ROLE_HIERARCHY['STUDENT']).toBe(minLevel);
    });
  });
});
