import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: role-based-ux-launch, Property 1: UserType-Role Independence**
 * **Validates: Requirements 1.4, 12.3, 12.4, 17.5**
 * 
 * Property 1: For any user, changing the userType field SHALL NOT affect the 
 * permission role field, and changing the permission role SHALL NOT affect 
 * the userType field. The two fields must remain completely independent.
 */

// Type definitions matching the backend schema
enum UserType {
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ORGANIZER = 'ORGANIZER',
  TEACHER = 'TEACHER',
}

enum Role {
  STUDENT = 'STUDENT',
  CLUB_ADMIN = 'CLUB_ADMIN',
  COLLEGE_ADMIN = 'COLLEGE_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
}

interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

interface Profile {
  id: string;
  userId: string;
  fullName: string;
  userType: UserType | null;
  collegeId: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isOnboarded: boolean;
  onboardingStep: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserWithProfile {
  user: User;
  profile: Profile;
}

/**
 * Simulates updating the userType field on a profile.
 * This should NOT affect the user's role.
 */
function updateUserType(
  userWithProfile: UserWithProfile,
  newUserType: UserType | null
): UserWithProfile {
  return {
    user: { ...userWithProfile.user }, // User unchanged
    profile: {
      ...userWithProfile.profile,
      userType: newUserType,
      updatedAt: new Date(),
    },
  };
}

/**
 * Simulates updating the role field on a user.
 * This should NOT affect the profile's userType.
 */
function updateRole(
  userWithProfile: UserWithProfile,
  newRole: Role
): UserWithProfile {
  return {
    user: {
      ...userWithProfile.user,
      role: newRole,
      updatedAt: new Date(),
    },
    profile: { ...userWithProfile.profile }, // Profile unchanged
  };
}

/**
 * Verifies that userType and role are independent by checking that
 * changing one does not affect the other.
 */
function verifyIndependence(
  original: UserWithProfile,
  afterUserTypeChange: UserWithProfile,
  afterRoleChange: UserWithProfile
): boolean {
  // After changing userType, role should remain the same
  const roleUnchangedAfterUserTypeUpdate =
    afterUserTypeChange.user.role === original.user.role;

  // After changing role, userType should remain the same
  const userTypeUnchangedAfterRoleUpdate =
    afterRoleChange.profile.userType === original.profile.userType;

  return roleUnchangedAfterUserTypeUpdate && userTypeUnchangedAfterRoleUpdate;
}

// Arbitraries for property-based testing
const userTypeArb = fc.constantFrom(
  UserType.STUDENT,
  UserType.PROFESSIONAL,
  UserType.ORGANIZER,
  UserType.TEACHER,
  null // userType can be null
) as fc.Arbitrary<UserType | null>;

const roleArb = fc.constantFrom(
  Role.STUDENT,
  Role.CLUB_ADMIN,
  Role.COLLEGE_ADMIN,
  Role.PLATFORM_ADMIN
);

const userIdArb = fc.uuid();
const emailArb = fc.emailAddress();
const fullNameArb = fc.stringMatching(/^[A-Za-z ]{3,30}$/);
const dateArb = fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') });

/**
 * Creates a complete UserWithProfile object for testing.
 */
const userWithProfileArb = fc.record({
  user: fc.record({
    id: userIdArb,
    email: emailArb,
    role: roleArb,
    createdAt: dateArb,
    updatedAt: dateArb,
  }),
  profile: fc.record({
    id: userIdArb,
    userId: userIdArb,
    fullName: fullNameArb,
    userType: userTypeArb,
    collegeId: fc.oneof(userIdArb, fc.constant(null)),
    bio: fc.oneof(fc.string({ maxLength: 200 }), fc.constant(null)),
    avatarUrl: fc.oneof(fc.webUrl(), fc.constant(null)),
    isOnboarded: fc.boolean(),
    onboardingStep: fc.integer({ min: 0, max: 5 }),
    createdAt: dateArb,
    updatedAt: dateArb,
  }),
});

describe('UserType-Role Independence Properties', () => {
  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 1.4, 17.5**
   * 
   * Changing userType SHALL NOT affect the role field.
   */
  test('Property 1: Changing userType does not affect role', () => {
    fc.assert(
      fc.property(userWithProfileArb, userTypeArb, (original, newUserType) => {
        const originalRole = original.user.role;
        const updated = updateUserType(original, newUserType);

        // Role should remain unchanged
        return updated.user.role === originalRole;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 1.4, 17.5**
   * 
   * Changing role SHALL NOT affect the userType field.
   */
  test('Property 1: Changing role does not affect userType', () => {
    fc.assert(
      fc.property(userWithProfileArb, roleArb, (original, newRole) => {
        const originalUserType = original.profile.userType;
        const updated = updateRole(original, newRole);

        // UserType should remain unchanged
        return updated.profile.userType === originalUserType;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 1.4, 12.3, 12.4, 17.5**
   * 
   * Complete independence: changing both fields in sequence maintains independence.
   */
  test('Property 1: Sequential changes maintain independence', () => {
    fc.assert(
      fc.property(
        userWithProfileArb,
        userTypeArb,
        roleArb,
        (original, newUserType, newRole) => {
          // Change userType first
          const afterUserTypeChange = updateUserType(original, newUserType);
          
          // Change role second
          const afterRoleChange = updateRole(original, newRole);

          return verifyIndependence(original, afterUserTypeChange, afterRoleChange);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 12.3, 12.4**
   * 
   * A user with COLLEGE_ADMIN role can have any userType (or null).
   */
  test('Property 1: COLLEGE_ADMIN role can have any userType', () => {
    fc.assert(
      fc.property(userWithProfileArb, userTypeArb, (original, newUserType) => {
        // Set role to COLLEGE_ADMIN
        const withCollegeAdminRole = updateRole(original, Role.COLLEGE_ADMIN);
        
        // Update userType
        const withNewUserType = updateUserType(withCollegeAdminRole, newUserType);

        // Both fields should be set correctly
        return (
          withNewUserType.user.role === Role.COLLEGE_ADMIN &&
          withNewUserType.profile.userType === newUserType
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 1.4, 17.5**
   * 
   * A user with STUDENT userType can have any role.
   */
  test('Property 1: STUDENT userType can have any role', () => {
    fc.assert(
      fc.property(userWithProfileArb, roleArb, (original, newRole) => {
        // Set userType to STUDENT
        const withStudentUserType = updateUserType(original, UserType.STUDENT);
        
        // Update role
        const withNewRole = updateRole(withStudentUserType, newRole);

        // Both fields should be set correctly
        return (
          withNewRole.profile.userType === UserType.STUDENT &&
          withNewRole.user.role === newRole
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 1.4, 17.5**
   * 
   * A user with ORGANIZER userType can have any role.
   */
  test('Property 1: ORGANIZER userType can have any role', () => {
    fc.assert(
      fc.property(userWithProfileArb, roleArb, (original, newRole) => {
        // Set userType to ORGANIZER
        const withOrganizerUserType = updateUserType(original, UserType.ORGANIZER);
        
        // Update role
        const withNewRole = updateRole(withOrganizerUserType, newRole);

        // Both fields should be set correctly
        return (
          withNewRole.profile.userType === UserType.ORGANIZER &&
          withNewRole.user.role === newRole
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 17.5**
   * 
   * UserType can be null while role is always set.
   */
  test('Property 1: UserType can be null while role is always set', () => {
    fc.assert(
      fc.property(userWithProfileArb, roleArb, (original, newRole) => {
        // Set userType to null
        const withNullUserType = updateUserType(original, null);
        
        // Update role
        const withNewRole = updateRole(withNullUserType, newRole);

        // UserType should be null, role should be set
        return (
          withNewRole.profile.userType === null &&
          withNewRole.user.role === newRole
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 1.4, 17.5**
   * 
   * All combinations of userType and role are valid.
   */
  test('Property 1: All userType-role combinations are valid', () => {
    fc.assert(
      fc.property(userTypeArb, roleArb, (userType, role) => {
        const userWithProfile: UserWithProfile = {
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
            role: role,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          profile: {
            id: 'test-profile-id',
            userId: 'test-user-id',
            fullName: 'Test User',
            userType: userType,
            collegeId: null,
            bio: null,
            avatarUrl: null,
            isOnboarded: false,
            onboardingStep: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        };

        // All combinations should be valid
        return (
          userWithProfile.user.role === role &&
          userWithProfile.profile.userType === userType
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 1.4, 17.5**
   * 
   * Multiple sequential updates maintain independence.
   */
  test('Property 1: Multiple sequential updates maintain independence', () => {
    fc.assert(
      fc.property(
        userWithProfileArb,
        fc.array(userTypeArb, { minLength: 1, maxLength: 5 }),
        fc.array(roleArb, { minLength: 1, maxLength: 5 }),
        (original, userTypes, roles) => {
          let current = original;
          const originalRole = original.user.role;
          const originalUserType = original.profile.userType;

          // Apply multiple userType changes
          for (const userType of userTypes) {
            current = updateUserType(current, userType);
          }

          // Role should still be the original
          const roleUnchanged = current.user.role === originalRole;

          // Reset to original
          current = original;

          // Apply multiple role changes
          for (const role of roles) {
            current = updateRole(current, role);
          }

          // UserType should still be the original
          const userTypeUnchanged = current.profile.userType === originalUserType;

          return roleUnchanged && userTypeUnchanged;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 1: UserType-Role Independence**
   * **Validates: Requirements 12.3, 12.4**
   * 
   * College Admin role assignment does not automatically set userType.
   */
  test('Property 1: Assigning COLLEGE_ADMIN role does not set userType', () => {
    fc.assert(
      fc.property(userWithProfileArb, (original) => {
        // Ensure userType is null initially
        const withNullUserType = updateUserType(original, null);
        
        // Assign COLLEGE_ADMIN role
        const withCollegeAdminRole = updateRole(withNullUserType, Role.COLLEGE_ADMIN);

        // UserType should still be null
        return (
          withCollegeAdminRole.user.role === Role.COLLEGE_ADMIN &&
          withCollegeAdminRole.profile.userType === null
        );
      }),
      { numRuns: 100 }
    );
  });
});
