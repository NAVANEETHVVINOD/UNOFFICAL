import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { UserType, USER_TYPE_CONFIGS, isFeatureEnabledForUserType } from '../../lib/userTypes';
import { isFeatureEnabledForUserType as isFeatureEnabledForUserTypeWithRole, ADMIN_ROLES } from '../../lib/featureFlags';

/**
 * **Feature: role-based-ux-launch, Property 4: Feature Flag UserType Gating**
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 15.2, 15.3**
 * 
 * Property 4: For any userType and feature combination, the isFeatureEnabledForUserType 
 * function SHALL return the correct enabled/disabled state according to the 
 * USER_TYPE_CONFIGS mapping. Specifically:
 * - eventsCreate: true only for ORGANIZER
 * - feedComposer: false for STUDENT and PROFESSIONAL
 * - communities: false for all userTypes
 * - collaboration: false for all userTypes
 */

// Feature definitions based on requirements
const UNIVERSAL_FEATURES = ['eventsView', 'rsvp', 'qrCheckin', 'certificates', 'chat'];
const ORGANIZER_ONLY_FEATURES = ['eventsCreate', 'analytics'];
const TEACHER_ONLY_FEATURES = ['classroom'];
const DISABLED_FOR_ALL_FEATURES = ['communities', 'collaboration', 'marketplaceWrite', 'notesWrite', 'feedComposer', 'socialFeed'];

// All possible features in the system
const ALL_FEATURES = [
  ...UNIVERSAL_FEATURES,
  ...ORGANIZER_ONLY_FEATURES,
  ...TEACHER_ONLY_FEATURES,
  ...DISABLED_FOR_ALL_FEATURES,
];

// Arbitraries for property-based testing
const userTypeArb = fc.constantFrom(
  UserType.STUDENT,
  UserType.PROFESSIONAL,
  UserType.ORGANIZER,
  UserType.TEACHER
);

const featureArb = fc.constantFrom(...ALL_FEATURES);

/**
 * Helper function to determine if a feature should be enabled for a user type
 * based on the requirements specification.
 */
function shouldFeatureBeEnabled(feature: string, userType: UserType): boolean {
  // Universal features enabled for all user types
  if (UNIVERSAL_FEATURES.includes(feature)) {
    return true;
  }

  // Features disabled for all user types
  if (DISABLED_FOR_ALL_FEATURES.includes(feature)) {
    return false;
  }

  // Organizer-only features
  if (ORGANIZER_ONLY_FEATURES.includes(feature)) {
    return userType === UserType.ORGANIZER;
  }

  // Teacher-only features
  if (TEACHER_ONLY_FEATURES.includes(feature)) {
    return userType === UserType.TEACHER;
  }

  // Unknown feature defaults to disabled
  return false;
}

describe('Feature Flag UserType Gating Properties', () => {
  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.1**
   * 
   * Universal features (eventsView, rsvp, qrCheckin, certificates, chat) 
   * SHALL be enabled for all user types.
   */
  test('Property 4: Universal features enabled for all user types', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        return UNIVERSAL_FEATURES.every(feature => 
          isFeatureEnabledForUserType(feature, userType) === true
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.2**
   * 
   * Event creation SHALL be enabled only for ORGANIZER user type.
   */
  test('Property 4: eventsCreate enabled only for ORGANIZER', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const isEnabled = isFeatureEnabledForUserType('eventsCreate', userType);
        const shouldBeEnabled = userType === UserType.ORGANIZER;
        return isEnabled === shouldBeEnabled;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.3**
   * 
   * Social feed and post creation SHALL be hidden for STUDENT user type.
   */
  test('Property 4: feedComposer disabled for STUDENT', () => {
    const isEnabled = isFeatureEnabledForUserType('feedComposer', UserType.STUDENT);
    expect(isEnabled).toBe(false);
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.3**
   * 
   * Social feed and post creation SHALL be hidden for PROFESSIONAL user type.
   */
  test('Property 4: feedComposer disabled for PROFESSIONAL', () => {
    const isEnabled = isFeatureEnabledForUserType('feedComposer', UserType.PROFESSIONAL);
    expect(isEnabled).toBe(false);
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.3**
   * 
   * Social feed SHALL be hidden for all user types at launch.
   */
  test('Property 4: socialFeed disabled for all user types', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        return isFeatureEnabledForUserType('socialFeed', userType) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.4**
   * 
   * Communities SHALL be hidden for all user types at launch.
   */
  test('Property 4: communities disabled for all user types', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        return isFeatureEnabledForUserType('communities', userType) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.5**
   * 
   * Collaboration SHALL be hidden for all user types at launch.
   */
  test('Property 4: collaboration disabled for all user types', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        return isFeatureEnabledForUserType('collaboration', userType) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.6**
   * 
   * Marketplace SHALL be read-only for all user types at launch.
   */
  test('Property 4: marketplaceWrite disabled for all user types', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        return isFeatureEnabledForUserType('marketplaceWrite', userType) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.7**
   * 
   * Notes SHALL be read-only for all user types at launch.
   */
  test('Property 4: notesWrite disabled for all user types', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        return isFeatureEnabledForUserType('notesWrite', userType) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.2, 15.3**
   * 
   * For any userType and feature combination, isFeatureEnabledForUserType 
   * SHALL return the correct state according to USER_TYPE_CONFIGS.
   */
  test('Property 4: Feature gating matches USER_TYPE_CONFIGS', () => {
    fc.assert(
      fc.property(userTypeArb, featureArb, (userType, feature) => {
        const actualEnabled = isFeatureEnabledForUserType(feature, userType);
        const expectedEnabled = shouldFeatureBeEnabled(feature, userType);
        return actualEnabled === expectedEnabled;
      }),
      { numRuns: 200 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.2**
   * 
   * The enabledFeatures array in USER_TYPE_CONFIGS SHALL match the 
   * expected features for each user type.
   */
  test('Property 4: USER_TYPE_CONFIGS contains correct enabled features', () => {
    // STUDENT should have universal features only
    const studentConfig = USER_TYPE_CONFIGS[UserType.STUDENT];
    expect(studentConfig.enabledFeatures).toEqual(
      expect.arrayContaining(UNIVERSAL_FEATURES)
    );
    expect(studentConfig.enabledFeatures).not.toContain('eventsCreate');
    expect(studentConfig.enabledFeatures).not.toContain('feedComposer');

    // PROFESSIONAL should have universal features only
    const professionalConfig = USER_TYPE_CONFIGS[UserType.PROFESSIONAL];
    expect(professionalConfig.enabledFeatures).toEqual(
      expect.arrayContaining(UNIVERSAL_FEATURES)
    );
    expect(professionalConfig.enabledFeatures).not.toContain('eventsCreate');
    expect(professionalConfig.enabledFeatures).not.toContain('feedComposer');

    // ORGANIZER should have universal + organizer-only features
    const organizerConfig = USER_TYPE_CONFIGS[UserType.ORGANIZER];
    expect(organizerConfig.enabledFeatures).toEqual(
      expect.arrayContaining([...UNIVERSAL_FEATURES, ...ORGANIZER_ONLY_FEATURES])
    );

    // TEACHER should have universal + teacher-only features
    const teacherConfig = USER_TYPE_CONFIGS[UserType.TEACHER];
    expect(teacherConfig.enabledFeatures).toEqual(
      expect.arrayContaining([...UNIVERSAL_FEATURES, ...TEACHER_ONLY_FEATURES])
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.2**
   * 
   * Null userType SHALL return false for all features.
   */
  test('Property 4: Null userType disables all features', () => {
    fc.assert(
      fc.property(featureArb, (feature) => {
        return isFeatureEnabledForUserType(feature, null) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.2**
   * 
   * Analytics feature SHALL be enabled only for ORGANIZER.
   */
  test('Property 4: analytics enabled only for ORGANIZER', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const isEnabled = isFeatureEnabledForUserType('analytics', userType);
        const shouldBeEnabled = userType === UserType.ORGANIZER;
        return isEnabled === shouldBeEnabled;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.1**
   * 
   * Classroom feature SHALL be enabled only for TEACHER.
   */
  test('Property 4: classroom enabled only for TEACHER', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const isEnabled = isFeatureEnabledForUserType('classroom', userType);
        const shouldBeEnabled = userType === UserType.TEACHER;
        return isEnabled === shouldBeEnabled;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.3**
   * 
   * Feature flag checks SHALL be consistent across multiple calls.
   */
  test('Property 4: Feature flag checks are idempotent', () => {
    fc.assert(
      fc.property(userTypeArb, featureArb, (userType, feature) => {
        const firstCheck = isFeatureEnabledForUserType(feature, userType);
        const secondCheck = isFeatureEnabledForUserType(feature, userType);
        const thirdCheck = isFeatureEnabledForUserType(feature, userType);
        
        return firstCheck === secondCheck && secondCheck === thirdCheck;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.1, 10.2, 10.3**
   * 
   * Each user type SHALL have a non-empty set of enabled features.
   */
  test('Property 4: All user types have at least one enabled feature', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const config = USER_TYPE_CONFIGS[userType];
        return config.enabledFeatures.length > 0;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.1**
   * 
   * All user types SHALL have the universal features enabled.
   */
  test('Property 4: All user types include universal features', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const config = USER_TYPE_CONFIGS[userType];
        return UNIVERSAL_FEATURES.every(feature => 
          config.enabledFeatures.includes(feature)
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.4, 10.5, 10.6, 10.7**
   * 
   * No user type SHALL have disabled features in their enabled list.
   */
  test('Property 4: No user type enables globally disabled features', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const config = USER_TYPE_CONFIGS[userType];
        return DISABLED_FOR_ALL_FEATURES.every(feature => 
          !config.enabledFeatures.includes(feature)
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.3**
   * 
   * feedComposer SHALL be disabled for all user types at launch.
   */
  test('Property 4: feedComposer disabled for all user types', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        return isFeatureEnabledForUserType('feedComposer', userType) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.2**
   * 
   * Feature check with undefined userType SHALL return false.
   */
  test('Property 4: Undefined userType disables all features', () => {
    fc.assert(
      fc.property(featureArb, (feature) => {
        return isFeatureEnabledForUserType(feature, undefined as any) === false;
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * Tests for isFeatureEnabledForUserType with role-based admin overrides
 * This tests the enhanced function from featureFlags.ts that includes
 * permission role checks and admin overrides.
 */
describe('Feature Flag UserType Gating with Role Support', () => {
  const adminRoleArb = fc.constantFrom(...ADMIN_ROLES);
  const nonAdminRoleArb = fc.constantFrom('STUDENT', 'USER', 'MEMBER');

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.4**
   * 
   * Admin roles SHALL override userType restrictions for admin-override features.
   */
  test('Property 4: Admin roles override userType restrictions for eventsCreate', () => {
    fc.assert(
      fc.property(userTypeArb, adminRoleArb, (userType, adminRole) => {
        // Even if userType is not ORGANIZER, admins should be able to create events
        const isEnabled = isFeatureEnabledForUserTypeWithRole('eventsCreate', userType, adminRole);
        return isEnabled === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.4**
   * 
   * Non-admin roles SHALL respect userType restrictions.
   */
  test('Property 4: Non-admin roles respect userType restrictions for eventsCreate', () => {
    fc.assert(
      fc.property(userTypeArb, nonAdminRoleArb, (userType, nonAdminRole) => {
        const isEnabled = isFeatureEnabledForUserTypeWithRole('eventsCreate', userType, nonAdminRole);
        const shouldBeEnabled = userType === UserType.ORGANIZER;
        return isEnabled === shouldBeEnabled;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.4**
   * 
   * Admin override SHALL work for communities feature.
   */
  test('Property 4: Admin roles can access communities despite launch restrictions', () => {
    fc.assert(
      fc.property(userTypeArb, adminRoleArb, (userType, adminRole) => {
        const isEnabled = isFeatureEnabledForUserTypeWithRole('communities', userType, adminRole);
        return isEnabled === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.4**
   * 
   * Admin override SHALL work for classroom feature.
   */
  test('Property 4: Admin roles can access classroom', () => {
    fc.assert(
      fc.property(userTypeArb, adminRoleArb, (userType, adminRole) => {
        const isEnabled = isFeatureEnabledForUserTypeWithRole('classroom', userType, adminRole);
        return isEnabled === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.3**
   * 
   * feedComposer SHALL be disabled for STUDENT and PROFESSIONAL regardless of role.
   */
  test('Property 4: feedComposer disabled for STUDENT even with admin role', () => {
    fc.assert(
      fc.property(adminRoleArb, (adminRole) => {
        // feedComposer is not in ADMIN_OVERRIDE_FEATURES, so it respects userType
        const isEnabled = isFeatureEnabledForUserTypeWithRole('feedComposer', UserType.STUDENT, adminRole);
        return isEnabled === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.3**
   * 
   * socialFeed SHALL be disabled for STUDENT and PROFESSIONAL regardless of role.
   */
  test('Property 4: socialFeed disabled for PROFESSIONAL even with admin role', () => {
    fc.assert(
      fc.property(adminRoleArb, (adminRole) => {
        const isEnabled = isFeatureEnabledForUserTypeWithRole('socialFeed', UserType.PROFESSIONAL, adminRole);
        return isEnabled === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.2, 15.3**
   * 
   * Function SHALL handle null/undefined userType gracefully.
   */
  test('Property 4: Null userType with admin role still respects admin overrides', () => {
    fc.assert(
      fc.property(adminRoleArb, (adminRole) => {
        // Admin override features should work even with null userType
        const eventsCreateEnabled = isFeatureEnabledForUserTypeWithRole('eventsCreate', null, adminRole);
        const communitiesEnabled = isFeatureEnabledForUserTypeWithRole('communities', null, adminRole);
        const classroomEnabled = isFeatureEnabledForUserTypeWithRole('classroom', null, adminRole);
        
        return eventsCreateEnabled === true && 
               communitiesEnabled === true && 
               classroomEnabled === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.4**
   * 
   * Backward compatibility: function without role parameter should work.
   */
  test('Property 4: Function works without role parameter (backward compatibility)', () => {
    fc.assert(
      fc.property(userTypeArb, featureArb, (userType, feature) => {
        // Should not throw error when called without role parameter
        const result = isFeatureEnabledForUserTypeWithRole(feature, userType);
        return typeof result === 'boolean';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.6, 10.7**
   * 
   * Write features SHALL be disabled for all users at launch.
   */
  test('Property 4: Write features disabled for all users including admins', () => {
    fc.assert(
      fc.property(userTypeArb, adminRoleArb, (userType, adminRole) => {
        // marketplaceWrite and notesWrite are not in ADMIN_OVERRIDE_FEATURES
        const marketplaceWrite = isFeatureEnabledForUserTypeWithRole('marketplaceWrite', userType, adminRole);
        const notesWrite = isFeatureEnabledForUserTypeWithRole('notesWrite', userType, adminRole);
        
        return marketplaceWrite === false && notesWrite === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.3**
   * 
   * Feature checks with role SHALL be idempotent.
   */
  test('Property 4: Feature checks with role are idempotent', () => {
    fc.assert(
      fc.property(userTypeArb, featureArb, adminRoleArb, (userType, feature, role) => {
        const firstCheck = isFeatureEnabledForUserTypeWithRole(feature, userType, role);
        const secondCheck = isFeatureEnabledForUserTypeWithRole(feature, userType, role);
        const thirdCheck = isFeatureEnabledForUserTypeWithRole(feature, userType, role);
        
        return firstCheck === secondCheck && secondCheck === thirdCheck;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.2**
   * 
   * ORGANIZER userType SHALL enable eventCreation without needing admin role.
   */
  test('Property 4: ORGANIZER can create events without admin role', () => {
    fc.assert(
      fc.property(nonAdminRoleArb, (nonAdminRole) => {
        const isEnabled = isFeatureEnabledForUserTypeWithRole('eventCreation', UserType.ORGANIZER, nonAdminRole);
        return isEnabled === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 10.1**
   * 
   * TEACHER userType SHALL enable classroom without needing admin role.
   */
  test('Property 4: TEACHER can access classroom without admin role', () => {
    fc.assert(
      fc.property(nonAdminRoleArb, (nonAdminRole) => {
        const isEnabled = isFeatureEnabledForUserTypeWithRole('classroom', UserType.TEACHER, nonAdminRole);
        return isEnabled === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 4: Feature Flag UserType Gating**
   * **Validates: Requirements 15.2**
   * 
   * Default features SHALL work for all userTypes regardless of role.
   */
  test('Property 4: Universal features work for all userTypes with any role', () => {
    fc.assert(
      fc.property(userTypeArb, nonAdminRoleArb, (userType, role) => {
        return UNIVERSAL_FEATURES.every(feature => {
          const isEnabled = isFeatureEnabledForUserTypeWithRole(feature, userType, role);
          return isEnabled === true;
        });
      }),
      { numRuns: 100 }
    );
  });
});
