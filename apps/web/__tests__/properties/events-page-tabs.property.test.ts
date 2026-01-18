import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: role-based-ux-launch, Property 5: Events Page Tab Configuration**
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
 * 
 * Property 5: For any userType, the Events page SHALL display the correct tab 
 * configuration:
 * - STUDENT: [Campus, Open Events, My RSVPs]
 * - PROFESSIONAL: [All Events, My RSVPs]
 * - ORGANIZER: [My Events, All Events]
 * - TEACHER: [Verified Events, Campus Events, My RSVPs]
 * 
 * And the default selected tab SHALL be the first tab in each configuration.
 */

// Type definitions matching the frontend
enum UserType {
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ORGANIZER = 'ORGANIZER',
  TEACHER = 'TEACHER',
}

type EventTab = 'campus' | 'open' | 'myRsvps' | 'all' | 'myEvents' | 'verified';

interface TabConfig {
  id: EventTab;
  label: string;
}

/**
 * Get tabs configuration for a given userType.
 * This models the logic in EventsClient.tsx.
 */
function getTabsForUserType(userType: UserType | null): TabConfig[] {
  switch (userType) {
    case UserType.STUDENT:
      return [
        { id: 'campus', label: 'Campus' },
        { id: 'open', label: 'Open Events' },
        { id: 'myRsvps', label: 'My RSVPs' },
      ];
    case UserType.PROFESSIONAL:
      return [
        { id: 'all', label: 'All Events' },
        { id: 'myRsvps', label: 'My RSVPs' },
      ];
    case UserType.ORGANIZER:
      return [
        { id: 'myEvents', label: 'My Events' },
        { id: 'all', label: 'All Events' },
      ];
    case UserType.TEACHER:
      return [
        { id: 'verified', label: 'Verified Events' },
        { id: 'campus', label: 'Campus Events' },
        { id: 'myRsvps', label: 'My RSVPs' },
      ];
    default:
      // Default to STUDENT tabs if userType not set
      return [
        { id: 'campus', label: 'Campus' },
        { id: 'open', label: 'Open Events' },
        { id: 'myRsvps', label: 'My RSVPs' },
      ];
  }
}

/**
 * Get the default tab (first tab) for a given userType.
 */
function getDefaultTab(userType: UserType | null): EventTab {
  const tabs = getTabsForUserType(userType);
  return tabs[0]?.id || 'campus';
}

/**
 * Verify that tabs configuration matches expected configuration.
 */
function verifyTabsConfiguration(
  userType: UserType | null,
  expectedTabs: TabConfig[]
): boolean {
  const actualTabs = getTabsForUserType(userType);
  
  if (actualTabs.length !== expectedTabs.length) {
    return false;
  }
  
  for (let i = 0; i < actualTabs.length; i++) {
    if (actualTabs[i].id !== expectedTabs[i].id || actualTabs[i].label !== expectedTabs[i].label) {
      return false;
    }
  }
  
  return true;
}

// Arbitraries for property-based testing
const userTypeArb = fc.constantFrom(
  UserType.STUDENT,
  UserType.PROFESSIONAL,
  UserType.ORGANIZER,
  UserType.TEACHER,
  null
) as fc.Arbitrary<UserType | null>;

describe('Events Page Tab Configuration Properties', () => {
  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.1**
   * 
   * STUDENT userType SHALL display tabs: Campus, Open Events, My RSVPs.
   */
  test('Property 5: STUDENT userType has correct tabs', () => {
    fc.assert(
      fc.property(fc.constant(UserType.STUDENT), (userType) => {
        const tabs = getTabsForUserType(userType);
        
        return (
          tabs.length === 3 &&
          tabs[0].id === 'campus' &&
          tabs[0].label === 'Campus' &&
          tabs[1].id === 'open' &&
          tabs[1].label === 'Open Events' &&
          tabs[2].id === 'myRsvps' &&
          tabs[2].label === 'My RSVPs'
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.2**
   * 
   * PROFESSIONAL userType SHALL display tabs: All Events, My RSVPs.
   */
  test('Property 5: PROFESSIONAL userType has correct tabs', () => {
    fc.assert(
      fc.property(fc.constant(UserType.PROFESSIONAL), (userType) => {
        const tabs = getTabsForUserType(userType);
        
        return (
          tabs.length === 2 &&
          tabs[0].id === 'all' &&
          tabs[0].label === 'All Events' &&
          tabs[1].id === 'myRsvps' &&
          tabs[1].label === 'My RSVPs'
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.3**
   * 
   * ORGANIZER userType SHALL display tabs: My Events, All Events.
   */
  test('Property 5: ORGANIZER userType has correct tabs', () => {
    fc.assert(
      fc.property(fc.constant(UserType.ORGANIZER), (userType) => {
        const tabs = getTabsForUserType(userType);
        
        return (
          tabs.length === 2 &&
          tabs[0].id === 'myEvents' &&
          tabs[0].label === 'My Events' &&
          tabs[1].id === 'all' &&
          tabs[1].label === 'All Events'
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.4**
   * 
   * TEACHER userType SHALL display tabs: Verified Events, Campus Events, My RSVPs.
   */
  test('Property 5: TEACHER userType has correct tabs', () => {
    fc.assert(
      fc.property(fc.constant(UserType.TEACHER), (userType) => {
        const tabs = getTabsForUserType(userType);
        
        return (
          tabs.length === 3 &&
          tabs[0].id === 'verified' &&
          tabs[0].label === 'Verified Events' &&
          tabs[1].id === 'campus' &&
          tabs[1].label === 'Campus Events' &&
          tabs[2].id === 'myRsvps' &&
          tabs[2].label === 'My RSVPs'
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.5**
   * 
   * The default selected tab SHALL be the first tab for each userType.
   */
  test('Property 5: Default tab is the first tab for any userType', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const tabs = getTabsForUserType(userType);
        const defaultTab = getDefaultTab(userType);
        
        return tabs.length > 0 && defaultTab === tabs[0].id;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
   * 
   * Each userType SHALL have a unique tab configuration.
   */
  test('Property 5: Each userType has unique tab configuration', () => {
    const studentTabs = getTabsForUserType(UserType.STUDENT);
    const professionalTabs = getTabsForUserType(UserType.PROFESSIONAL);
    const organizerTabs = getTabsForUserType(UserType.ORGANIZER);
    const teacherTabs = getTabsForUserType(UserType.TEACHER);
    
    // Convert to strings for comparison
    const studentStr = JSON.stringify(studentTabs.map(t => t.id));
    const professionalStr = JSON.stringify(professionalTabs.map(t => t.id));
    const organizerStr = JSON.stringify(organizerTabs.map(t => t.id));
    const teacherStr = JSON.stringify(teacherTabs.map(t => t.id));
    
    // All should be different
    const allConfigs = [studentStr, professionalStr, organizerStr, teacherStr];
    const uniqueConfigs = new Set(allConfigs);
    
    expect(uniqueConfigs.size).toBe(4);
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
   * 
   * Tab configuration SHALL be deterministic for a given userType.
   */
  test('Property 5: Tab configuration is deterministic', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const tabs1 = getTabsForUserType(userType);
        const tabs2 = getTabsForUserType(userType);
        const tabs3 = getTabsForUserType(userType);
        
        return (
          JSON.stringify(tabs1) === JSON.stringify(tabs2) &&
          JSON.stringify(tabs2) === JSON.stringify(tabs3)
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
   * 
   * All userTypes SHALL have at least one tab.
   */
  test('Property 5: All userTypes have at least one tab', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const tabs = getTabsForUserType(userType);
        return tabs.length >= 1;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
   * 
   * All tabs SHALL have both id and label fields.
   */
  test('Property 5: All tabs have id and label', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const tabs = getTabsForUserType(userType);
        
        return tabs.every(tab => 
          tab.id !== undefined && 
          tab.id !== null && 
          tab.label !== undefined && 
          tab.label !== null &&
          tab.label.length > 0
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.5**
   * 
   * Changing userType SHALL change the default tab to the first tab of new configuration.
   */
  test('Property 5: Changing userType updates default tab', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (userType1, userType2) => {
          const defaultTab1 = getDefaultTab(userType1);
          const defaultTab2 = getDefaultTab(userType2);
          
          const tabs1 = getTabsForUserType(userType1);
          const tabs2 = getTabsForUserType(userType2);
          
          // Default tabs should match first tab of respective configurations
          return (
            defaultTab1 === tabs1[0].id &&
            defaultTab2 === tabs2[0].id
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
   * 
   * Tab IDs SHALL be unique within each userType's configuration.
   */
  test('Property 5: Tab IDs are unique within each configuration', () => {
    fc.assert(
      fc.property(userTypeArb, (userType) => {
        const tabs = getTabsForUserType(userType);
        const tabIds = tabs.map(t => t.id);
        const uniqueIds = new Set(tabIds);
        
        return tabIds.length === uniqueIds.size;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.1, 11.4**
   * 
   * STUDENT and TEACHER both have "My RSVPs" tab.
   */
  test('Property 5: STUDENT and TEACHER have My RSVPs tab', () => {
    const studentTabs = getTabsForUserType(UserType.STUDENT);
    const teacherTabs = getTabsForUserType(UserType.TEACHER);
    
    const studentHasRsvps = studentTabs.some(t => t.id === 'myRsvps');
    const teacherHasRsvps = teacherTabs.some(t => t.id === 'myRsvps');
    
    expect(studentHasRsvps).toBe(true);
    expect(teacherHasRsvps).toBe(true);
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.2**
   * 
   * PROFESSIONAL has "My RSVPs" tab.
   */
  test('Property 5: PROFESSIONAL has My RSVPs tab', () => {
    const tabs = getTabsForUserType(UserType.PROFESSIONAL);
    const hasRsvps = tabs.some(t => t.id === 'myRsvps');
    
    expect(hasRsvps).toBe(true);
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.3**
   * 
   * ORGANIZER does NOT have "My RSVPs" tab.
   */
  test('Property 5: ORGANIZER does not have My RSVPs tab', () => {
    const tabs = getTabsForUserType(UserType.ORGANIZER);
    const hasRsvps = tabs.some(t => t.id === 'myRsvps');
    
    expect(hasRsvps).toBe(false);
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.3**
   * 
   * Only ORGANIZER has "My Events" tab.
   */
  test('Property 5: Only ORGANIZER has My Events tab', () => {
    const studentTabs = getTabsForUserType(UserType.STUDENT);
    const professionalTabs = getTabsForUserType(UserType.PROFESSIONAL);
    const organizerTabs = getTabsForUserType(UserType.ORGANIZER);
    const teacherTabs = getTabsForUserType(UserType.TEACHER);
    
    const studentHasMyEvents = studentTabs.some(t => t.id === 'myEvents');
    const professionalHasMyEvents = professionalTabs.some(t => t.id === 'myEvents');
    const organizerHasMyEvents = organizerTabs.some(t => t.id === 'myEvents');
    const teacherHasMyEvents = teacherTabs.some(t => t.id === 'myEvents');
    
    expect(studentHasMyEvents).toBe(false);
    expect(professionalHasMyEvents).toBe(false);
    expect(organizerHasMyEvents).toBe(true);
    expect(teacherHasMyEvents).toBe(false);
  });

  /**
   * **Property 5: Events Page Tab Configuration**
   * **Validates: Requirements 11.4**
   * 
   * Only TEACHER has "Verified Events" tab.
   */
  test('Property 5: Only TEACHER has Verified Events tab', () => {
    const studentTabs = getTabsForUserType(UserType.STUDENT);
    const professionalTabs = getTabsForUserType(UserType.PROFESSIONAL);
    const organizerTabs = getTabsForUserType(UserType.ORGANIZER);
    const teacherTabs = getTabsForUserType(UserType.TEACHER);
    
    const studentHasVerified = studentTabs.some(t => t.id === 'verified');
    const professionalHasVerified = professionalTabs.some(t => t.id === 'verified');
    const organizerHasVerified = organizerTabs.some(t => t.id === 'verified');
    const teacherHasVerified = teacherTabs.some(t => t.id === 'verified');
    
    expect(studentHasVerified).toBe(false);
    expect(professionalHasVerified).toBe(false);
    expect(organizerHasVerified).toBe(false);
    expect(teacherHasVerified).toBe(true);
  });
});
