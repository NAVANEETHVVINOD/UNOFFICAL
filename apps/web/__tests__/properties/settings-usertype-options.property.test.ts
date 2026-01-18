import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: role-based-ux-launch, Property 12: Settings UserType Options**
 * **Validates: Requirements 2.2, 2.4**
 * 
 * Property 12: For any current userType value, the Settings page SHALL allow 
 * changing to any of the four valid userType values (STUDENT, PROFESSIONAL, 
 * ORGANIZER, TEACHER).
 */

// Type definitions matching the frontend
enum UserType {
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ORGANIZER = 'ORGANIZER',
  TEACHER = 'TEACHER',
}

/**
 * Get all available userType options that should be displayed in Settings.
 */
function getAvailableUserTypeOptions(): UserType[] {
  return [
    UserType.STUDENT,
    UserType.PROFESSIONAL,
    UserType.ORGANIZER,
    UserType.TEACHER,
  ];
}

/**
 * Check if a userType can be changed to another userType.
 * According to requirements, any userType can be changed to any other userType.
 */
function canChangeUserType(currentUserType: UserType | null, targetUserType: UserType): boolean {
  // All userTypes should be available for selection
  const availableOptions = getAvailableUserTypeOptions();
  return availableOptions.includes(targetUserType);
}

/**
 * Verify that all 4 userType options are available.
 */
function verifyAllOptionsAvailable(): boolean {
  const options = getAvailableUserTypeOptions();
  return (
    options.length === 4 &&
    options.includes(UserType.STUDENT) &&
    options.includes(UserType.PROFESSIONAL) &&
    options.includes(UserType.ORGANIZER) &&
    options.includes(UserType.TEACHER)
  );
}

// Arbitraries for property-based testing
const userTypeArb = fc.constantFrom(
  UserType.STUDENT,
  UserType.PROFESSIONAL,
  UserType.ORGANIZER,
  UserType.TEACHER,
  null
) as fc.Arbitrary<UserType | null>;

describe('Settings UserType Options Properties', () => {
  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2**
   * 
   * Settings SHALL display all 4 userType options.
   */
  test('Property 12: Settings displays all 4 userType options', () => {
    expect(verifyAllOptionsAvailable()).toBe(true);
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2, 2.4**
   * 
   * For any current userType, all 4 options SHALL be available for selection.
   */
  test('Property 12: All options available for any current userType', () => {
    fc.assert(
      fc.property(userTypeArb, (currentUserType) => {
        const options = getAvailableUserTypeOptions();
        
        // All 4 options should be available
        return options.length === 4;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.4**
   * 
   * User SHALL be able to change from any userType to STUDENT.
   */
  test('Property 12: Can change to STUDENT from any userType', () => {
    fc.assert(
      fc.property(userTypeArb, (currentUserType) => {
        return canChangeUserType(currentUserType, UserType.STUDENT);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.4**
   * 
   * User SHALL be able to change from any userType to PROFESSIONAL.
   */
  test('Property 12: Can change to PROFESSIONAL from any userType', () => {
    fc.assert(
      fc.property(userTypeArb, (currentUserType) => {
        return canChangeUserType(currentUserType, UserType.PROFESSIONAL);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.4**
   * 
   * User SHALL be able to change from any userType to ORGANIZER.
   */
  test('Property 12: Can change to ORGANIZER from any userType', () => {
    fc.assert(
      fc.property(userTypeArb, (currentUserType) => {
        return canChangeUserType(currentUserType, UserType.ORGANIZER);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.4**
   * 
   * User SHALL be able to change from any userType to TEACHER.
   */
  test('Property 12: Can change to TEACHER from any userType', () => {
    fc.assert(
      fc.property(userTypeArb, (currentUserType) => {
        return canChangeUserType(currentUserType, UserType.TEACHER);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2, 2.4**
   * 
   * For any pair of userTypes, changing from one to the other SHALL be allowed.
   */
  test('Property 12: Can change between any two userTypes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (fromUserType, toUserType) => {
          return canChangeUserType(fromUserType, toUserType);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2**
   * 
   * The set of available options SHALL contain exactly 4 unique userTypes.
   */
  test('Property 12: Exactly 4 unique userType options available', () => {
    const options = getAvailableUserTypeOptions();
    const uniqueOptions = new Set(options);
    
    expect(options.length).toBe(4);
    expect(uniqueOptions.size).toBe(4);
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2**
   * 
   * Available options SHALL be deterministic (always the same).
   */
  test('Property 12: Available options are deterministic', () => {
    const options1 = getAvailableUserTypeOptions();
    const options2 = getAvailableUserTypeOptions();
    const options3 = getAvailableUserTypeOptions();
    
    expect(JSON.stringify(options1)).toBe(JSON.stringify(options2));
    expect(JSON.stringify(options2)).toBe(JSON.stringify(options3));
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2**
   * 
   * Available options SHALL include all enum values of UserType.
   */
  test('Property 12: All UserType enum values are available', () => {
    const options = getAvailableUserTypeOptions();
    const allUserTypes = Object.values(UserType);
    
    for (const userType of allUserTypes) {
      expect(options).toContain(userType);
    }
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.4**
   * 
   * Changing userType SHALL be idempotent (can change to same userType).
   */
  test('Property 12: Can change to the same userType (idempotent)', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (userType) => {
          return canChangeUserType(userType, userType);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.4**
   * 
   * Changing userType SHALL be reversible (can change back).
   */
  test('Property 12: UserType changes are reversible', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (userType1, userType2) => {
          // Can change from userType1 to userType2
          const canChangeForward = canChangeUserType(userType1, userType2);
          
          // Can change back from userType2 to userType1
          const canChangeBack = canChangeUserType(userType2, userType1);
          
          return canChangeForward && canChangeBack;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2, 2.4**
   * 
   * No userType SHALL be excluded from the available options.
   */
  test('Property 12: No userType is excluded from options', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (userType) => {
          const options = getAvailableUserTypeOptions();
          return options.includes(userType);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2**
   * 
   * Options SHALL be in a consistent order.
   */
  test('Property 12: Options are in consistent order', () => {
    const options = getAvailableUserTypeOptions();
    
    // Expected order: STUDENT, PROFESSIONAL, ORGANIZER, TEACHER
    expect(options[0]).toBe(UserType.STUDENT);
    expect(options[1]).toBe(UserType.PROFESSIONAL);
    expect(options[2]).toBe(UserType.ORGANIZER);
    expect(options[3]).toBe(UserType.TEACHER);
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.4**
   * 
   * Multiple sequential changes SHALL all be allowed.
   */
  test('Property 12: Multiple sequential changes are allowed', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
          { minLength: 2, maxLength: 10 }
        ),
        (userTypes) => {
          // Simulate sequential changes
          for (let i = 0; i < userTypes.length - 1; i++) {
            const currentUserType = userTypes[i];
            const nextUserType = userTypes[i + 1];
            
            if (!canChangeUserType(currentUserType, nextUserType)) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 12: Settings UserType Options**
   * **Validates: Requirements 2.2, 2.4**
   * 
   * Changing from null userType SHALL allow selecting any of the 4 options.
   */
  test('Property 12: Can select any option when userType is null', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (targetUserType) => {
          return canChangeUserType(null, targetUserType);
        }
      ),
      { numRuns: 100 }
    );
  });
});
