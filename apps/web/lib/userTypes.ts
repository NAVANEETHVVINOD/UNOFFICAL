/**
 * User Type Configuration
 * 
 * This module defines the UserType enum and configuration for UX personalization.
 * UserType is separate from permission roles - it controls dashboard layout and
 * feature visibility, not access permissions.
 * 
 * Requirements: 13.1, 13.2, 10.1
 */

export enum UserType {
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ORGANIZER = 'ORGANIZER',
  TEACHER = 'TEACHER',
}

export interface UserTypeConfig {
  type: UserType;
  icon: string;
  label: string;
  description: string;
  dashboardComponent: string;
  defaultEventsTab: string;
  showFAB: boolean;
  enabledFeatures: string[];
}

/**
 * Configuration for each user type
 * Defines icons, labels, descriptions, and enabled features per user type
 */
export const USER_TYPE_CONFIGS: Record<UserType, UserTypeConfig> = {
  [UserType.STUDENT]: {
    type: UserType.STUDENT,
    icon: '🎓',
    label: 'Student',
    description: 'Discover and attend campus events',
    dashboardComponent: 'StudentDashboard',
    defaultEventsTab: 'campus',
    showFAB: false,
    enabledFeatures: ['eventsView', 'rsvp', 'qrCheckin', 'certificates', 'chat'],
  },
  [UserType.PROFESSIONAL]: {
    type: UserType.PROFESSIONAL,
    icon: '🧑‍💼',
    label: 'Working Professional',
    description: 'Attend events and network globally',
    dashboardComponent: 'ProfessionalDashboard',
    defaultEventsTab: 'all',
    showFAB: false,
    enabledFeatures: ['eventsView', 'rsvp', 'qrCheckin', 'certificates', 'chat'],
  },
  [UserType.ORGANIZER]: {
    type: UserType.ORGANIZER,
    icon: '🎤',
    label: 'I want to host events',
    description: 'Create and manage campus or public events',
    dashboardComponent: 'OrganizerDashboard',
    defaultEventsTab: 'myEvents',
    showFAB: true,
    enabledFeatures: ['eventsView', 'eventsCreate', 'rsvp', 'qrCheckin', 'certificates', 'chat', 'analytics'],
  },
  [UserType.TEACHER]: {
    type: UserType.TEACHER,
    icon: '👨‍🏫',
    label: 'Teacher / Faculty',
    description: 'Manage classrooms and verify attendance',
    dashboardComponent: 'TeacherDashboard',
    defaultEventsTab: 'verified',
    showFAB: false,
    enabledFeatures: ['eventsView', 'rsvp', 'qrCheckin', 'certificates', 'chat', 'classroom'],
  },
};

/**
 * Helper function to get configuration for a user type
 */
export function getUserTypeConfig(userType: UserType | null): UserTypeConfig | null {
  if (!userType) return null;
  return USER_TYPE_CONFIGS[userType] || null;
}

/**
 * Helper function to check if a feature is enabled for a user type
 */
export function isFeatureEnabledForUserType(
  feature: string,
  userType: UserType | null
): boolean {
  if (!userType) return false;
  const config = USER_TYPE_CONFIGS[userType];
  return config ? config.enabledFeatures.includes(feature) : false;
}

/**
 * Validate if a string is a valid UserType
 */
export function isValidUserType(value: string | null | undefined): value is UserType {
  if (!value) return false;
  return Object.values(UserType).includes(value as UserType);
}

/**
 * Safely parse a user type value, defaulting to STUDENT if invalid
 */
export function parseUserType(value: string | null | undefined): UserType {
  if (isValidUserType(value)) {
    return value as UserType;
  }
  console.warn(`Invalid userType: ${value}, defaulting to STUDENT`);
  return UserType.STUDENT;
}
