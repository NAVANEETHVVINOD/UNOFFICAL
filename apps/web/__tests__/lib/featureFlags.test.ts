/**
 * Unit tests for featureFlags module
 * Tests feature flag functions with userType and role-based access
 * 
 * Task: 4.2 Write unit tests for feature flag functions
 * Requirements: 15.4
 */

import { describe, it, expect } from 'vitest';
import {
  isFeatureEnabled,
  isFeatureEnabledForUserType,
  hasAdminAccess,
  getFeatureFlags,
  ADMIN_ROLES,
  ADMIN_OVERRIDE_FEATURES,
  DEFAULT_FEATURE_FLAGS,
  type FeatureFlags,
} from '../../lib/featureFlags';
import { UserType } from '../../lib/userTypes';

describe('getFeatureFlags', () => {
  it('should return default feature flags', () => {
    const flags = getFeatureFlags();
    expect(flags).toBeDefined();
    expect(flags).toEqual(DEFAULT_FEATURE_FLAGS);
  });

  it('should return an object with all required feature flags', () => {
    const flags = getFeatureFlags();
    expect(flags).toHaveProperty('feed');
    expect(flags).toHaveProperty('eventsView');
    expect(flags).toHaveProperty('eventsCreate');
    expect(flags).toHaveProperty('chat');
    expect(flags).toHaveProperty('marketplace');
    expect(flags).toHaveProperty('communities');
    expect(flags).toHaveProperty('classroom');
    expect(flags).toHaveProperty('collab');
    expect(flags).toHaveProperty('feedComposer');
    expect(flags).toHaveProperty('socialFeed');
    expect(flags).toHaveProperty('eventCreation');
    expect(flags).toHaveProperty('marketplaceWrite');
    expect(flags).toHaveProperty('notesWrite');
  });
});

describe('hasAdminAccess', () => {
  it('should return true for admin roles', () => {
    expect(hasAdminAccess('eventsCreate', 'COLLEGE_ADMIN')).toBe(true);
    expect(hasAdminAccess('eventsCreate', 'PLATFORM_ADMIN')).toBe(true);
    expect(hasAdminAccess('eventsCreate', 'CLUB_ADMIN')).toBe(true);
  });

  it('should return false for non-admin roles', () => {
    expect(hasAdminAccess('eventsCreate', 'STUDENT')).toBe(false);
    expect(hasAdminAccess('eventsCreate', 'USER')).toBe(false);
    expect(hasAdminAccess('eventsCreate', 'MEMBER')).toBe(false);
  });

  it('should return false for undefined role', () => {
    expect(hasAdminAccess('eventsCreate', undefined)).toBe(false);
  });

  it('should return false for empty string role', () => {
    expect(hasAdminAccess('eventsCreate', '')).toBe(false);
  });

  it('should work for all admin roles in ADMIN_ROLES array', () => {
    ADMIN_ROLES.forEach((role) => {
      expect(hasAdminAccess('eventsCreate', role)).toBe(true);
    });
  });
});

describe('isFeatureEnabled', () => {
  const mockFlags: FeatureFlags = {
    feed: true,
    eventsView: true,
    eventsCreate: false,
    chat: true,
    marketplace: true,
    communities: false,
    classroom: false,
    collab: false,
    polls: true,
    crtMode: true,
    newFeed: true,
    feedComposer: false,
    socialFeed: false,
    eventCreation: false,
    marketplaceWrite: false,
    notesWrite: false,
  };

  it('should return true for enabled features', () => {
    expect(isFeatureEnabled(mockFlags, 'feed', false)).toBe(true);
    expect(isFeatureEnabled(mockFlags, 'eventsView', false)).toBe(true);
    expect(isFeatureEnabled(mockFlags, 'chat', false)).toBe(true);
  });

  it('should return false for disabled features', () => {
    expect(isFeatureEnabled(mockFlags, 'eventsCreate', false)).toBe(false);
    expect(isFeatureEnabled(mockFlags, 'communities', false)).toBe(false);
    expect(isFeatureEnabled(mockFlags, 'classroom', false)).toBe(false);
  });

  it('should override with admin access for admin override features', () => {
    // eventsCreate is in ADMIN_OVERRIDE_FEATURES
    expect(isFeatureEnabled(mockFlags, 'eventsCreate', true)).toBe(true);
    expect(isFeatureEnabled(mockFlags, 'communities', true)).toBe(true);
    expect(isFeatureEnabled(mockFlags, 'classroom', true)).toBe(true);
  });

  it('should not override for non-admin override features', () => {
    // feedComposer is not in ADMIN_OVERRIDE_FEATURES
    expect(isFeatureEnabled(mockFlags, 'feedComposer', true)).toBe(false);
    expect(isFeatureEnabled(mockFlags, 'socialFeed', true)).toBe(false);
  });

  it('should respect all features in ADMIN_OVERRIDE_FEATURES', () => {
    ADMIN_OVERRIDE_FEATURES.forEach((feature) => {
      expect(isFeatureEnabled(mockFlags, feature, true)).toBe(true);
    });
  });
});

describe('isFeatureEnabledForUserType - Basic functionality', () => {
  it('should return correct values for universal features (Requirement 10.1)', () => {
    const universalFeatures = ['eventsView', 'rsvp', 'qrCheckin', 'certificates', 'chat'];
    
    universalFeatures.forEach((feature) => {
      expect(isFeatureEnabledForUserType(feature, UserType.STUDENT)).toBe(true);
      expect(isFeatureEnabledForUserType(feature, UserType.PROFESSIONAL)).toBe(true);
      expect(isFeatureEnabledForUserType(feature, UserType.ORGANIZER)).toBe(true);
      expect(isFeatureEnabledForUserType(feature, UserType.TEACHER)).toBe(true);
    });
  });

  it('should handle null userType correctly', () => {
    // For features in USER_TYPE_CONFIGS (like 'rsvp', 'qrCheckin'), null userType returns false
    expect(isFeatureEnabledForUserType('rsvp', null)).toBe(false);
    expect(isFeatureEnabledForUserType('qrCheckin', null)).toBe(false);
    expect(isFeatureEnabledForUserType('analytics', null)).toBe(false);
    
    // For features in DEFAULT_FEATURE_FLAGS, it falls back to the default flag value
    // This maintains backward compatibility (Requirement 15.4)
    expect(isFeatureEnabledForUserType('eventsView', null)).toBe(true); // enabled by default
    expect(isFeatureEnabledForUserType('chat', null)).toBe(true); // enabled by default
    expect(isFeatureEnabledForUserType('eventsCreate', null)).toBe(false); // handled by switch case
  });

  it('should return false for unknown features', () => {
    expect(isFeatureEnabledForUserType('unknownFeature', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('nonExistent', UserType.ORGANIZER)).toBe(false);
  });
});

describe('isFeatureEnabledForUserType - Event creation (Requirement 10.2)', () => {
  it('should enable eventCreation only for ORGANIZER userType', () => {
    expect(isFeatureEnabledForUserType('eventCreation', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('eventCreation', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('eventCreation', UserType.ORGANIZER)).toBe(true);
    expect(isFeatureEnabledForUserType('eventCreation', UserType.TEACHER)).toBe(false);
  });

  it('should enable eventsCreate only for ORGANIZER userType', () => {
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.ORGANIZER)).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.TEACHER)).toBe(false);
  });

  it('should allow admins to override eventCreation restriction', () => {
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.STUDENT, 'COLLEGE_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.PROFESSIONAL, 'PLATFORM_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.TEACHER, 'CLUB_ADMIN')).toBe(true);
  });
});

describe('isFeatureEnabledForUserType - Feed features (Requirement 10.3)', () => {
  it('should disable feedComposer for STUDENT userType', () => {
    expect(isFeatureEnabledForUserType('feedComposer', UserType.STUDENT)).toBe(false);
  });

  it('should disable feedComposer for PROFESSIONAL userType', () => {
    expect(isFeatureEnabledForUserType('feedComposer', UserType.PROFESSIONAL)).toBe(false);
  });

  it('should enable feedComposer for ORGANIZER userType', () => {
    expect(isFeatureEnabledForUserType('feedComposer', UserType.ORGANIZER)).toBe(true);
  });

  it('should enable feedComposer for TEACHER userType', () => {
    expect(isFeatureEnabledForUserType('feedComposer', UserType.TEACHER)).toBe(true);
  });

  it('should disable socialFeed for STUDENT userType', () => {
    expect(isFeatureEnabledForUserType('socialFeed', UserType.STUDENT)).toBe(false);
  });

  it('should disable socialFeed for PROFESSIONAL userType', () => {
    expect(isFeatureEnabledForUserType('socialFeed', UserType.PROFESSIONAL)).toBe(false);
  });

  it('should enable socialFeed for ORGANIZER userType', () => {
    expect(isFeatureEnabledForUserType('socialFeed', UserType.ORGANIZER)).toBe(true);
  });

  it('should enable socialFeed for TEACHER userType', () => {
    expect(isFeatureEnabledForUserType('socialFeed', UserType.TEACHER)).toBe(true);
  });

  it('should not allow admin override for feedComposer', () => {
    // feedComposer is not in ADMIN_OVERRIDE_FEATURES
    expect(isFeatureEnabledForUserType('feedComposer', UserType.STUDENT, 'COLLEGE_ADMIN')).toBe(false);
    expect(isFeatureEnabledForUserType('feedComposer', UserType.PROFESSIONAL, 'PLATFORM_ADMIN')).toBe(false);
  });
});

describe('isFeatureEnabledForUserType - Disabled features at launch', () => {
  it('should disable communities for all userTypes (Requirement 10.4)', () => {
    expect(isFeatureEnabledForUserType('communities', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('communities', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('communities', UserType.ORGANIZER)).toBe(false);
    expect(isFeatureEnabledForUserType('communities', UserType.TEACHER)).toBe(false);
  });

  it('should disable collab for all userTypes (Requirement 10.5)', () => {
    expect(isFeatureEnabledForUserType('collab', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('collab', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('collab', UserType.ORGANIZER)).toBe(false);
    expect(isFeatureEnabledForUserType('collab', UserType.TEACHER)).toBe(false);
  });

  it('should disable marketplaceWrite for all userTypes (Requirement 10.6)', () => {
    expect(isFeatureEnabledForUserType('marketplaceWrite', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('marketplaceWrite', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('marketplaceWrite', UserType.ORGANIZER)).toBe(false);
    expect(isFeatureEnabledForUserType('marketplaceWrite', UserType.TEACHER)).toBe(false);
  });

  it('should disable notesWrite for all userTypes (Requirement 10.7)', () => {
    expect(isFeatureEnabledForUserType('notesWrite', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('notesWrite', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('notesWrite', UserType.ORGANIZER)).toBe(false);
    expect(isFeatureEnabledForUserType('notesWrite', UserType.TEACHER)).toBe(false);
  });

  it('should allow admin override for communities', () => {
    expect(isFeatureEnabledForUserType('communities', UserType.STUDENT, 'COLLEGE_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('communities', UserType.ORGANIZER, 'PLATFORM_ADMIN')).toBe(true);
  });

  it('should not allow admin override for write features', () => {
    // marketplaceWrite and notesWrite are not in ADMIN_OVERRIDE_FEATURES
    expect(isFeatureEnabledForUserType('marketplaceWrite', UserType.ORGANIZER, 'COLLEGE_ADMIN')).toBe(false);
    expect(isFeatureEnabledForUserType('notesWrite', UserType.TEACHER, 'PLATFORM_ADMIN')).toBe(false);
  });
});

describe('isFeatureEnabledForUserType - Classroom feature', () => {
  it('should enable classroom only for TEACHER userType', () => {
    expect(isFeatureEnabledForUserType('classroom', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('classroom', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('classroom', UserType.ORGANIZER)).toBe(false);
    expect(isFeatureEnabledForUserType('classroom', UserType.TEACHER)).toBe(true);
  });

  it('should allow admin override for classroom', () => {
    expect(isFeatureEnabledForUserType('classroom', UserType.STUDENT, 'COLLEGE_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('classroom', UserType.ORGANIZER, 'PLATFORM_ADMIN')).toBe(true);
  });
});

describe('isFeatureEnabledForUserType - Analytics feature', () => {
  it('should enable analytics only for ORGANIZER userType', () => {
    expect(isFeatureEnabledForUserType('analytics', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('analytics', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('analytics', UserType.ORGANIZER)).toBe(true);
    expect(isFeatureEnabledForUserType('analytics', UserType.TEACHER)).toBe(false);
  });
});

describe('isFeatureEnabledForUserType - Backward compatibility (Requirement 15.4)', () => {
  it('should work without role parameter', () => {
    // Should not throw error when called without role parameter
    expect(() => isFeatureEnabledForUserType('eventsView', UserType.STUDENT)).not.toThrow();
    expect(() => isFeatureEnabledForUserType('eventsCreate', UserType.ORGANIZER)).not.toThrow();
  });

  it('should return boolean when called without role parameter', () => {
    const result1 = isFeatureEnabledForUserType('eventsView', UserType.STUDENT);
    const result2 = isFeatureEnabledForUserType('eventsCreate', UserType.ORGANIZER);
    
    expect(typeof result1).toBe('boolean');
    expect(typeof result2).toBe('boolean');
  });

  it('should handle undefined role parameter', () => {
    expect(isFeatureEnabledForUserType('eventsView', UserType.STUDENT, undefined)).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.STUDENT, undefined)).toBe(false);
  });

  it('should fall back to default flags for features in FeatureFlags', () => {
    // For features that exist in DEFAULT_FEATURE_FLAGS but not handled by switch
    const flags = getFeatureFlags();
    
    // Test with a feature that should fall through to default behavior
    // polls is in FeatureFlags and enabled by default
    const result = isFeatureEnabledForUserType('polls', UserType.STUDENT);
    expect(typeof result).toBe('boolean');
  });
});

describe('isFeatureEnabledForUserType - Admin override with null userType', () => {
  it('should allow admin override even with null userType for admin features', () => {
    expect(isFeatureEnabledForUserType('eventsCreate', null, 'COLLEGE_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('communities', null, 'PLATFORM_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('classroom', null, 'CLUB_ADMIN')).toBe(true);
  });

  it('should not enable non-admin features with null userType even for admins', () => {
    expect(isFeatureEnabledForUserType('feedComposer', null, 'COLLEGE_ADMIN')).toBe(false);
    expect(isFeatureEnabledForUserType('socialFeed', null, 'PLATFORM_ADMIN')).toBe(false);
    expect(isFeatureEnabledForUserType('marketplaceWrite', null, 'CLUB_ADMIN')).toBe(false);
  });
});

describe('isFeatureEnabledForUserType - Edge cases', () => {
  it('should handle empty string feature', () => {
    expect(isFeatureEnabledForUserType('', UserType.STUDENT)).toBe(false);
  });

  it('should handle case-sensitive feature names', () => {
    // Feature names are case-sensitive
    expect(isFeatureEnabledForUserType('EventsCreate', UserType.ORGANIZER)).toBe(false);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.ORGANIZER)).toBe(true);
  });

  it('should be consistent across multiple calls', () => {
    const feature = 'eventsCreate';
    const userType = UserType.ORGANIZER;
    
    const result1 = isFeatureEnabledForUserType(feature, userType);
    const result2 = isFeatureEnabledForUserType(feature, userType);
    const result3 = isFeatureEnabledForUserType(feature, userType);
    
    expect(result1).toBe(result2);
    expect(result2).toBe(result3);
  });

  it('should handle all admin roles consistently', () => {
    const feature = 'eventsCreate';
    const userType = UserType.STUDENT;
    
    ADMIN_ROLES.forEach((role) => {
      expect(isFeatureEnabledForUserType(feature, userType, role)).toBe(true);
    });
  });
});

describe('isFeatureEnabledForUserType - Feature combinations', () => {
  it('should correctly handle STUDENT userType feature set', () => {
    // Enabled for STUDENT
    expect(isFeatureEnabledForUserType('eventsView', UserType.STUDENT)).toBe(true);
    expect(isFeatureEnabledForUserType('rsvp', UserType.STUDENT)).toBe(true);
    expect(isFeatureEnabledForUserType('chat', UserType.STUDENT)).toBe(true);
    
    // Disabled for STUDENT
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('feedComposer', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('classroom', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('analytics', UserType.STUDENT)).toBe(false);
  });

  it('should correctly handle PROFESSIONAL userType feature set', () => {
    // Enabled for PROFESSIONAL
    expect(isFeatureEnabledForUserType('eventsView', UserType.PROFESSIONAL)).toBe(true);
    expect(isFeatureEnabledForUserType('rsvp', UserType.PROFESSIONAL)).toBe(true);
    expect(isFeatureEnabledForUserType('chat', UserType.PROFESSIONAL)).toBe(true);
    
    // Disabled for PROFESSIONAL
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('feedComposer', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('classroom', UserType.PROFESSIONAL)).toBe(false);
    expect(isFeatureEnabledForUserType('analytics', UserType.PROFESSIONAL)).toBe(false);
  });

  it('should correctly handle ORGANIZER userType feature set', () => {
    // Enabled for ORGANIZER
    expect(isFeatureEnabledForUserType('eventsView', UserType.ORGANIZER)).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.ORGANIZER)).toBe(true);
    expect(isFeatureEnabledForUserType('feedComposer', UserType.ORGANIZER)).toBe(true);
    expect(isFeatureEnabledForUserType('analytics', UserType.ORGANIZER)).toBe(true);
    
    // Disabled for ORGANIZER
    expect(isFeatureEnabledForUserType('classroom', UserType.ORGANIZER)).toBe(false);
    expect(isFeatureEnabledForUserType('communities', UserType.ORGANIZER)).toBe(false);
  });

  it('should correctly handle TEACHER userType feature set', () => {
    // Enabled for TEACHER
    expect(isFeatureEnabledForUserType('eventsView', UserType.TEACHER)).toBe(true);
    expect(isFeatureEnabledForUserType('classroom', UserType.TEACHER)).toBe(true);
    expect(isFeatureEnabledForUserType('feedComposer', UserType.TEACHER)).toBe(true);
    
    // Disabled for TEACHER
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.TEACHER)).toBe(false);
    expect(isFeatureEnabledForUserType('analytics', UserType.TEACHER)).toBe(false);
    expect(isFeatureEnabledForUserType('communities', UserType.TEACHER)).toBe(false);
  });
});

describe('isFeatureEnabledForUserType - Role and userType interaction', () => {
  it('should prioritize admin override over userType restrictions', () => {
    // Admin can access eventsCreate regardless of userType
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.STUDENT, 'COLLEGE_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.PROFESSIONAL, 'PLATFORM_ADMIN')).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.TEACHER, 'CLUB_ADMIN')).toBe(true);
  });

  it('should respect userType restrictions for non-override features even with admin role', () => {
    // feedComposer respects userType even for admins
    expect(isFeatureEnabledForUserType('feedComposer', UserType.STUDENT, 'COLLEGE_ADMIN')).toBe(false);
    expect(isFeatureEnabledForUserType('socialFeed', UserType.PROFESSIONAL, 'PLATFORM_ADMIN')).toBe(false);
  });

  it('should allow ORGANIZER to create events without admin role', () => {
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.ORGANIZER, 'STUDENT')).toBe(true);
    expect(isFeatureEnabledForUserType('eventCreation', UserType.ORGANIZER, 'USER')).toBe(true);
  });

  it('should allow TEACHER to access classroom without admin role', () => {
    expect(isFeatureEnabledForUserType('classroom', UserType.TEACHER, 'STUDENT')).toBe(true);
    expect(isFeatureEnabledForUserType('classroom', UserType.TEACHER, 'USER')).toBe(true);
  });
});
