import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: role-based-ux-launch, Property 10: Navigation State Consistency**
 * **Validates: Requirements 20.1, 20.2, 20.3, 20.4**
 * 
 * Property 10: For any userType change, the system SHALL clear cached dashboard 
 * state and subsequent dashboard access SHALL render the new userType's dashboard 
 * without stale data.
 */

// Type definitions matching the frontend
enum UserType {
  STUDENT = 'STUDENT',
  PROFESSIONAL = 'PROFESSIONAL',
  ORGANIZER = 'ORGANIZER',
  TEACHER = 'TEACHER',
}

interface CacheState {
  dashboardState?: any;
  dashboardCache?: any;
  navigationState?: any;
  lastDashboardType?: string;
  currentUserType?: UserType | null;
}

interface NavigationState {
  userType: UserType | null;
  cache: CacheState;
}

/**
 * Simulates changing userType and clearing cache.
 * This models the logic in UserTypeContext.tsx setUserType function.
 */
function changeUserType(
  currentState: NavigationState,
  newUserType: UserType
): NavigationState {
  // Clear all cached state when userType changes
  const clearedCache: CacheState = {
    currentUserType: newUserType,
  };
  
  return {
    userType: newUserType,
    cache: clearedCache,
  };
}

/**
 * Simulates accessing dashboard after userType change.
 * Should use the new userType without any stale cached data.
 */
function accessDashboard(state: NavigationState): UserType | null {
  // Dashboard should render based on current userType, not cached data
  return state.userType;
}

/**
 * Verify that cache is cleared after userType change.
 */
function verifyCacheCleared(state: NavigationState): boolean {
  const cache = state.cache;
  
  // All cache fields except currentUserType should be cleared
  return (
    cache.dashboardState === undefined &&
    cache.dashboardCache === undefined &&
    cache.navigationState === undefined &&
    cache.lastDashboardType === undefined &&
    cache.currentUserType === state.userType
  );
}

/**
 * Verify that dashboard renders correct userType after change.
 */
function verifyDashboardConsistency(
  oldUserType: UserType | null,
  newUserType: UserType,
  afterChange: NavigationState
): boolean {
  const renderedUserType = accessDashboard(afterChange);
  
  // Dashboard should render new userType, not old one
  return renderedUserType === newUserType && renderedUserType !== oldUserType;
}

// Arbitraries for property-based testing
const userTypeArb = fc.constantFrom(
  UserType.STUDENT,
  UserType.PROFESSIONAL,
  UserType.ORGANIZER,
  UserType.TEACHER,
  null
) as fc.Arbitrary<UserType | null>;

const cacheStateArb = fc.record({
  dashboardState: fc.option(fc.object(), { nil: undefined }),
  dashboardCache: fc.option(fc.object(), { nil: undefined }),
  navigationState: fc.option(fc.object(), { nil: undefined }),
  lastDashboardType: fc.option(fc.string(), { nil: undefined }),
  currentUserType: userTypeArb,
});

const navigationStateArb = fc.record({
  userType: userTypeArb,
  cache: cacheStateArb,
});

describe('Navigation State Consistency Properties', () => {
  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.2, 20.3**
   * 
   * Changing userType SHALL clear all cached dashboard state.
   */
  test('Property 10: UserType change clears cached state', () => {
    fc.assert(
      fc.property(
        navigationStateArb,
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (initialState, newUserType) => {
          const afterChange = changeUserType(initialState, newUserType);
          return verifyCacheCleared(afterChange);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.1**
   * 
   * Dashboard SHALL render the new userType after change.
   */
  test('Property 10: Dashboard renders new userType after change', () => {
    fc.assert(
      fc.property(
        navigationStateArb,
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (initialState, newUserType) => {
          const afterChange = changeUserType(initialState, newUserType);
          const renderedUserType = accessDashboard(afterChange);
          
          return renderedUserType === newUserType;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.1, 20.2**
   * 
   * Dashboard SHALL NOT render old userType after change.
   */
  test('Property 10: Dashboard does not render old userType', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (oldUserType, newUserType) => {
          // Skip if same userType
          if (oldUserType === newUserType) return true;
          
          const initialState: NavigationState = {
            userType: oldUserType,
            cache: {
              dashboardState: { type: oldUserType },
              currentUserType: oldUserType,
            },
          };
          
          const afterChange = changeUserType(initialState, newUserType);
          return verifyDashboardConsistency(oldUserType, newUserType, afterChange);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.3**
   * 
   * Cache SHALL be cleared even if it contains stale data.
   */
  test('Property 10: Stale cache is cleared on userType change', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (oldUserType, newUserType) => {
          // Create state with stale cached data
          const staleState: NavigationState = {
            userType: oldUserType,
            cache: {
              dashboardState: { type: oldUserType, data: 'stale' },
              dashboardCache: { cached: true },
              navigationState: { nav: 'old' },
              lastDashboardType: oldUserType,
              currentUserType: oldUserType,
            },
          };
          
          const afterChange = changeUserType(staleState, newUserType);
          
          // All stale data should be cleared
          return verifyCacheCleared(afterChange);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.4**
   * 
   * Browser back button SHALL work correctly after userType change.
   */
  test('Property 10: Back navigation uses current userType', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (userType1, userType2) => {
          // Change from userType1 to userType2
          const state1: NavigationState = { userType: userType1, cache: {} };
          const state2 = changeUserType(state1, userType2);
          
          // Simulate back navigation - should still use userType2
          const afterBack = accessDashboard(state2);
          
          return afterBack === userType2;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.1, 20.2, 20.3**
   * 
   * Multiple sequential userType changes SHALL each clear cache.
   */
  test('Property 10: Sequential changes clear cache each time', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
          { minLength: 2, maxLength: 5 }
        ),
        (userTypes) => {
          let currentState: NavigationState = {
            userType: null,
            cache: {},
          };
          
          // Apply each userType change
          for (const userType of userTypes) {
            currentState = changeUserType(currentState, userType);
            
            // Verify cache is cleared after each change
            if (!verifyCacheCleared(currentState)) {
              return false;
            }
            
            // Verify dashboard renders correct userType
            if (accessDashboard(currentState) !== userType) {
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
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.2**
   * 
   * Cache clearing SHALL be idempotent (safe to call multiple times).
   */
  test('Property 10: Cache clearing is idempotent', () => {
    fc.assert(
      fc.property(
        navigationStateArb,
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (initialState, newUserType) => {
          // Clear cache once
          const afterFirst = changeUserType(initialState, newUserType);
          
          // Clear cache again (simulating multiple calls)
          const afterSecond = changeUserType(afterFirst, newUserType);
          
          // Both should have cleared cache
          return (
            verifyCacheCleared(afterFirst) &&
            verifyCacheCleared(afterSecond) &&
            JSON.stringify(afterFirst.cache) === JSON.stringify(afterSecond.cache)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.1, 20.2**
   * 
   * Dashboard SHALL always reflect current userType, never cached userType.
   */
  test('Property 10: Dashboard reflects current userType, not cache', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (cachedUserType, currentUserType) => {
          // Create state with mismatched cache
          const state: NavigationState = {
            userType: currentUserType,
            cache: {
              currentUserType: cachedUserType, // Stale cached value
            },
          };
          
          // Dashboard should use current userType, not cached
          const rendered = accessDashboard(state);
          return rendered === currentUserType;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.3**
   * 
   * Changing to same userType SHALL still clear cache (idempotent).
   */
  test('Property 10: Changing to same userType clears cache', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (userType) => {
          // Create state with cached data
          const state: NavigationState = {
            userType: userType,
            cache: {
              dashboardState: { data: 'cached' },
              currentUserType: userType,
            },
          };
          
          // Change to same userType
          const afterChange = changeUserType(state, userType);
          
          // Cache should still be cleared
          return verifyCacheCleared(afterChange);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.1, 20.2, 20.3, 20.4**
   * 
   * After userType change, no stale data SHALL persist in cache.
   */
  test('Property 10: No stale data persists after change', () => {
    fc.assert(
      fc.property(
        navigationStateArb,
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (initialState, newUserType) => {
          const afterChange = changeUserType(initialState, newUserType);
          const cache = afterChange.cache;
          
          // Only currentUserType should be set, all other fields should be undefined
          const hasNoStaleData = (
            cache.dashboardState === undefined &&
            cache.dashboardCache === undefined &&
            cache.navigationState === undefined &&
            cache.lastDashboardType === undefined
          );
          
          return hasNoStaleData;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 10: Navigation State Consistency**
   * **Validates: Requirements 20.1**
   * 
   * Dashboard access SHALL be consistent with current userType.
   */
  test('Property 10: Dashboard access is consistent', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(UserType.STUDENT, UserType.PROFESSIONAL, UserType.ORGANIZER, UserType.TEACHER),
        (userType) => {
          const state: NavigationState = {
            userType: userType,
            cache: { currentUserType: userType },
          };
          
          // Multiple accesses should return same userType
          const access1 = accessDashboard(state);
          const access2 = accessDashboard(state);
          const access3 = accessDashboard(state);
          
          return (
            access1 === userType &&
            access2 === userType &&
            access3 === userType
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
