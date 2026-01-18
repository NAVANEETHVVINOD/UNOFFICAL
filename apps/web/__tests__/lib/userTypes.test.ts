/**
 * Unit tests for userTypes module
 * Tests the UserType enum, configurations, and helper functions
 */

import { describe, it, expect } from 'vitest';
import {
  UserType,
  USER_TYPE_CONFIGS,
  getUserTypeConfig,
  isFeatureEnabledForUserType,
  isValidUserType,
  parseUserType,
} from '../../lib/userTypes';

describe('UserType enum', () => {
  it('should have exactly 4 user types', () => {
    const userTypes = Object.values(UserType);
    expect(userTypes).toHaveLength(4);
  });

  it('should have correct user type values', () => {
    expect(UserType.STUDENT).toBe('STUDENT');
    expect(UserType.PROFESSIONAL).toBe('PROFESSIONAL');
    expect(UserType.ORGANIZER).toBe('ORGANIZER');
    expect(UserType.TEACHER).toBe('TEACHER');
  });
});

describe('USER_TYPE_CONFIGS', () => {
  it('should have configuration for all user types', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT]).toBeDefined();
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL]).toBeDefined();
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER]).toBeDefined();
    expect(USER_TYPE_CONFIGS[UserType.TEACHER]).toBeDefined();
  });

  it('should have correct icons for each user type (Requirement 13.1)', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT].icon).toBe('🎓');
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].icon).toBe('🧑‍💼');
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER].icon).toBe('🎤');
    expect(USER_TYPE_CONFIGS[UserType.TEACHER].icon).toBe('👨‍🏫');
  });

  it('should have labels and descriptions for each user type (Requirement 13.2)', () => {
    Object.values(USER_TYPE_CONFIGS).forEach((config) => {
      expect(config.label).toBeTruthy();
      expect(config.description).toBeTruthy();
      expect(typeof config.label).toBe('string');
      expect(typeof config.description).toBe('string');
    });
  });

  it('should have correct FAB visibility settings', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT].showFAB).toBe(false);
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].showFAB).toBe(false);
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER].showFAB).toBe(true);
    expect(USER_TYPE_CONFIGS[UserType.TEACHER].showFAB).toBe(false);
  });

  it('should have correct default events tabs', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT].defaultEventsTab).toBe('campus');
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].defaultEventsTab).toBe('all');
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER].defaultEventsTab).toBe('myEvents');
    expect(USER_TYPE_CONFIGS[UserType.TEACHER].defaultEventsTab).toBe('verified');
  });

  it('should have correct dashboard components', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT].dashboardComponent).toBe('StudentDashboard');
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].dashboardComponent).toBe('ProfessionalDashboard');
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER].dashboardComponent).toBe('OrganizerDashboard');
    expect(USER_TYPE_CONFIGS[UserType.TEACHER].dashboardComponent).toBe('TeacherDashboard');
  });

  it('should enable core features for all user types (Requirement 10.1)', () => {
    const coreFeatures = ['eventsView', 'rsvp', 'qrCheckin', 'certificates', 'chat'];
    
    Object.values(USER_TYPE_CONFIGS).forEach((config) => {
      coreFeatures.forEach((feature) => {
        expect(config.enabledFeatures).toContain(feature);
      });
    });
  });

  it('should enable eventsCreate only for ORGANIZER (Requirement 10.2)', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT].enabledFeatures).not.toContain('eventsCreate');
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].enabledFeatures).not.toContain('eventsCreate');
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER].enabledFeatures).toContain('eventsCreate');
    expect(USER_TYPE_CONFIGS[UserType.TEACHER].enabledFeatures).not.toContain('eventsCreate');
  });

  it('should enable classroom only for TEACHER', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT].enabledFeatures).not.toContain('classroom');
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].enabledFeatures).not.toContain('classroom');
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER].enabledFeatures).not.toContain('classroom');
    expect(USER_TYPE_CONFIGS[UserType.TEACHER].enabledFeatures).toContain('classroom');
  });

  it('should enable analytics only for ORGANIZER', () => {
    expect(USER_TYPE_CONFIGS[UserType.STUDENT].enabledFeatures).not.toContain('analytics');
    expect(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].enabledFeatures).not.toContain('analytics');
    expect(USER_TYPE_CONFIGS[UserType.ORGANIZER].enabledFeatures).toContain('analytics');
    expect(USER_TYPE_CONFIGS[UserType.TEACHER].enabledFeatures).not.toContain('analytics');
  });
});

describe('getUserTypeConfig', () => {
  it('should return correct config for valid user type', () => {
    const config = getUserTypeConfig(UserType.STUDENT);
    expect(config).toBeDefined();
    expect(config?.type).toBe(UserType.STUDENT);
    expect(config?.icon).toBe('🎓');
  });

  it('should return null for null user type', () => {
    const config = getUserTypeConfig(null);
    expect(config).toBeNull();
  });
});

describe('isFeatureEnabledForUserType', () => {
  it('should return true for enabled features', () => {
    expect(isFeatureEnabledForUserType('eventsView', UserType.STUDENT)).toBe(true);
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.ORGANIZER)).toBe(true);
    expect(isFeatureEnabledForUserType('classroom', UserType.TEACHER)).toBe(true);
  });

  it('should return false for disabled features', () => {
    expect(isFeatureEnabledForUserType('eventsCreate', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('classroom', UserType.STUDENT)).toBe(false);
    expect(isFeatureEnabledForUserType('analytics', UserType.STUDENT)).toBe(false);
  });

  it('should return false for null user type', () => {
    expect(isFeatureEnabledForUserType('eventsView', null)).toBe(false);
  });

  it('should return false for non-existent features', () => {
    expect(isFeatureEnabledForUserType('nonExistentFeature', UserType.STUDENT)).toBe(false);
  });
});

describe('isValidUserType', () => {
  it('should return true for valid user types', () => {
    expect(isValidUserType('STUDENT')).toBe(true);
    expect(isValidUserType('PROFESSIONAL')).toBe(true);
    expect(isValidUserType('ORGANIZER')).toBe(true);
    expect(isValidUserType('TEACHER')).toBe(true);
  });

  it('should return false for invalid user types', () => {
    expect(isValidUserType('INVALID')).toBe(false);
    expect(isValidUserType('student')).toBe(false); // lowercase
    expect(isValidUserType('')).toBe(false);
  });

  it('should return false for null or undefined', () => {
    expect(isValidUserType(null)).toBe(false);
    expect(isValidUserType(undefined)).toBe(false);
  });
});

describe('parseUserType', () => {
  it('should return the user type for valid values', () => {
    expect(parseUserType('STUDENT')).toBe(UserType.STUDENT);
    expect(parseUserType('PROFESSIONAL')).toBe(UserType.PROFESSIONAL);
    expect(parseUserType('ORGANIZER')).toBe(UserType.ORGANIZER);
    expect(parseUserType('TEACHER')).toBe(UserType.TEACHER);
  });

  it('should default to STUDENT for invalid values', () => {
    expect(parseUserType('INVALID')).toBe(UserType.STUDENT);
    expect(parseUserType('student')).toBe(UserType.STUDENT);
    expect(parseUserType('')).toBe(UserType.STUDENT);
  });

  it('should default to STUDENT for null or undefined', () => {
    expect(parseUserType(null)).toBe(UserType.STUDENT);
    expect(parseUserType(undefined)).toBe(UserType.STUDENT);
  });
});
