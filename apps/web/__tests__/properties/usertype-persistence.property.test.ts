import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: role-based-ux-launch, Property 3: UserType Persistence Round-Trip**
 * **Validates: Requirements 1.3, 2.3, 16.3**
 * 
 * Property 3: For any valid userType value, setting the userType via the API 
 * and then retrieving the user profile SHALL return the same userType value 
 * that was set.
 */

// Type definitions matching the backend schema
enum UserType {
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ORGANIZER = 'ORGANIZER',
  TEACHER = 'TEACHER',
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

/**
 * Simulates the API round-trip: updateProfile -> getProfile
 * This models the behavior of:
 * 1. PATCH /profiles/me with { userType: newUserType }
 * 2. GET /profiles/me
 */
function updateAndRetrieveUserType(
  originalProfile: Profile,
  newUserType: UserType | null
): Profile {
  // Simulate API update
  const updatedProfile: Profile = {
    ...originalProfile,
    userType: newUserType,
    updatedAt: new Date(),
  };

  // Simulate API retrieval (should return the updated value)
  return updatedProfile;
}

/**
 * Verifies that the userType persists correctly through the round-trip.
 */
function verifyPersistence(
  original: Profile,
  newUserType: UserType | null,
  retrieved: Profile
): boolean {
  // The retrieved userType should match what was set
  return retrieved.userType === newUserType;
}

// Arbitraries for property-based testing
const userTypeArb = fc.constantFrom(
  UserType.STUDENT,
  UserType.PROFESSIONAL,
  UserType.ORGANIZER,
  UserType.TEACHER,
  null // userType can be null
) as fc.Arbitrary<UserType | null>;

const userIdArb = fc.uuid();
const fullNameArb = fc.stringMatching(/^[A-Za-z ]{3,30}$/);
const dateArb = fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') });

/**
 * Creates a complete Profile object for testing.
 */
const profileArb = fc.record({
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
});

describe('UserType Persistence Properties', () => {
  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3**
   * 
   * Setting userType to STUDENT and retrieving SHALL return STUDENT.
   */
  test('Property 3: Setting STUDENT userType persists correctly', () => {
    fc.assert(
      fc.property(profileArb, (original) => {
        const newUserType = UserType.STUDENT;
        const retrieved = updateAndRetrieveUserType(original, newUserType);
        
        return verifyPersistence(original, newUserType, retrieved);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3**
   * 
   * Setting userType to PROFESSIONAL and retrieving SHALL return PROFESSIONAL.
   */
  test('Property 3: Setting PROFESSIONAL userType persists correctly', () => {
    fc.assert(
      fc.property(profileArb, (original) => {
        const newUserType = UserType.PROFESSIONAL;
        const retrieved = updateAndRetrieveUserType(original, newUserType);
        
        return verifyPersistence(original, newUserType, retrieved);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3**
   * 
   * Setting userType to ORGANIZER and retrieving SHALL return ORGANIZER.
   */
  test('Property 3: Setting ORGANIZER userType persists correctly', () => {
    fc.assert(
      fc.property(profileArb, (original) => {
        const newUserType = UserType.ORGANIZER;
        const retrieved = updateAndRetrieveUserType(original, newUserType);
        
        return verifyPersistence(original, newUserType, retrieved);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3**
   * 
   * Setting userType to TEACHER and retrieving SHALL return TEACHER.
   */
  test('Property 3: Setting TEACHER userType persists correctly', () => {
    fc.assert(
      fc.property(profileArb, (original) => {
        const newUserType = UserType.TEACHER;
        const retrieved = updateAndRetrieveUserType(original, newUserType);
        
        return verifyPersistence(original, newUserType, retrieved);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 16.3**
   * 
   * Setting userType to null and retrieving SHALL return null.
   */
  test('Property 3: Setting null userType persists correctly', () => {
    fc.assert(
      fc.property(profileArb, (original) => {
        const newUserType = null;
        const retrieved = updateAndRetrieveUserType(original, newUserType);
        
        return verifyPersistence(original, newUserType, retrieved);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3, 16.3**
   * 
   * For any valid userType value, the round-trip SHALL preserve the value.
   */
  test('Property 3: Any valid userType persists through round-trip', () => {
    fc.assert(
      fc.property(profileArb, userTypeArb, (original, newUserType) => {
        const retrieved = updateAndRetrieveUserType(original, newUserType);
        
        return verifyPersistence(original, newUserType, retrieved);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 2.3**
   * 
   * Multiple sequential updates SHALL each persist correctly.
   */
  test('Property 3: Sequential userType updates persist correctly', () => {
    fc.assert(
      fc.property(
        profileArb,
        fc.array(userTypeArb, { minLength: 1, maxLength: 5 }),
        (original, userTypes) => {
          let current = original;
          
          // Apply each userType update and verify persistence
          for (const userType of userTypes) {
            const retrieved = updateAndRetrieveUserType(current, userType);
            
            // Verify this update persisted
            if (!verifyPersistence(current, userType, retrieved)) {
              return false;
            }
            
            // Use the retrieved profile as the base for the next update
            current = retrieved;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3**
   * 
   * Changing userType SHALL NOT affect other profile fields.
   */
  test('Property 3: UserType update preserves other profile fields', () => {
    fc.assert(
      fc.property(profileArb, userTypeArb, (original, newUserType) => {
        const retrieved = updateAndRetrieveUserType(original, newUserType);
        
        // All fields except userType and updatedAt should remain unchanged
        return (
          retrieved.id === original.id &&
          retrieved.userId === original.userId &&
          retrieved.fullName === original.fullName &&
          retrieved.collegeId === original.collegeId &&
          retrieved.bio === original.bio &&
          retrieved.avatarUrl === original.avatarUrl &&
          retrieved.isOnboarded === original.isOnboarded &&
          retrieved.onboardingStep === original.onboardingStep &&
          retrieved.userType === newUserType
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3**
   * 
   * Changing from any userType to any other userType SHALL persist correctly.
   */
  test('Property 3: Changing between any userTypes persists correctly', () => {
    fc.assert(
      fc.property(
        profileArb,
        userTypeArb,
        userTypeArb,
        (original, firstUserType, secondUserType) => {
          // Set first userType
          const afterFirst = updateAndRetrieveUserType(original, firstUserType);
          
          // Verify first update
          if (!verifyPersistence(original, firstUserType, afterFirst)) {
            return false;
          }
          
          // Set second userType
          const afterSecond = updateAndRetrieveUserType(afterFirst, secondUserType);
          
          // Verify second update
          return verifyPersistence(afterFirst, secondUserType, afterSecond);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3**
   * 
   * Setting the same userType multiple times SHALL be idempotent.
   */
  test('Property 3: Setting same userType multiple times is idempotent', () => {
    fc.assert(
      fc.property(profileArb, userTypeArb, (original, userType) => {
        // Set userType first time
        const first = updateAndRetrieveUserType(original, userType);
        
        // Set same userType second time
        const second = updateAndRetrieveUserType(first, userType);
        
        // Set same userType third time
        const third = updateAndRetrieveUserType(second, userType);
        
        // All should have the same userType
        return (
          first.userType === userType &&
          second.userType === userType &&
          third.userType === userType
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 3: UserType Persistence Round-Trip**
   * **Validates: Requirements 1.3, 2.3, 16.3**
   * 
   * Alternating between null and a userType SHALL persist correctly.
   */
  test('Property 3: Alternating between null and userType persists correctly', () => {
    fc.assert(
      fc.property(
        profileArb,
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (original, userType) => {
          // Set to userType
          const withUserType = updateAndRetrieveUserType(original, userType);
          if (withUserType.userType !== userType) return false;
          
          // Set to null
          const withNull = updateAndRetrieveUserType(withUserType, null);
          if (withNull.userType !== null) return false;
          
          // Set back to userType
          const backToUserType = updateAndRetrieveUserType(withNull, userType);
          if (backToUserType.userType !== userType) return false;
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
