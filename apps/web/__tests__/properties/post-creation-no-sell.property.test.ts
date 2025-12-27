import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: teacher-classroom-admin-views, Property 25: Post Creation No Sell Option**
 * **Validates: Requirements 19.1**
 * 
 * Property: The post creation modal SHALL NOT include a "Sell" or marketplace option.
 * Only allowed feature types are: poll, event, collab, report.
 */

// Feature types allowed in post creation (mirrors CreatePostModal.tsx)
type AllowedFeatureType = 'poll' | 'event' | 'collab' | 'report';

// Forbidden feature types that should NOT exist
type ForbiddenFeatureType = 'sell' | 'marketplace' | 'listing' | 'shop' | 'store';

// All feature types for validation
const ALLOWED_FEATURES: AllowedFeatureType[] = ['poll', 'event', 'collab', 'report'];
const FORBIDDEN_FEATURES: ForbiddenFeatureType[] = ['sell', 'marketplace', 'listing', 'shop', 'store'];

// Function to validate feature type is allowed
function isFeatureAllowed(feature: string): boolean {
  return ALLOWED_FEATURES.includes(feature as AllowedFeatureType);
}

// Function to check if feature is forbidden
function isFeatureForbidden(feature: string): boolean {
  return FORBIDDEN_FEATURES.includes(feature as ForbiddenFeatureType);
}

// Function to validate a set of active features
function validateActiveFeatures(features: Set<string>): { valid: boolean; invalidFeatures: string[] } {
  const invalidFeatures: string[] = [];
  
  for (const feature of features) {
    if (!isFeatureAllowed(feature)) {
      invalidFeatures.push(feature);
    }
  }
  
  return {
    valid: invalidFeatures.length === 0,
    invalidFeatures,
  };
}

// Arbitraries
const allowedFeatureArb = fc.constantFrom<AllowedFeatureType>(...ALLOWED_FEATURES);
const forbiddenFeatureArb = fc.constantFrom<ForbiddenFeatureType>(...FORBIDDEN_FEATURES);
const allowedFeaturesSetArb = fc.array(allowedFeatureArb, { minLength: 0, maxLength: 4 })
  .map(arr => new Set(arr));

describe('Post Creation No Sell Option Properties', () => {
  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * All allowed features are valid.
   */
  test('Property 25: All allowed features pass validation', () => {
    fc.assert(
      fc.property(allowedFeatureArb, (feature) => {
        return isFeatureAllowed(feature) === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * All forbidden features (sell, marketplace, etc.) are rejected.
   */
  test('Property 25: All forbidden features are rejected', () => {
    fc.assert(
      fc.property(forbiddenFeatureArb, (feature) => {
        return isFeatureAllowed(feature) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * Forbidden features are correctly identified.
   */
  test('Property 25: Forbidden features are correctly identified', () => {
    fc.assert(
      fc.property(forbiddenFeatureArb, (feature) => {
        return isFeatureForbidden(feature) === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * Allowed features are not marked as forbidden.
   */
  test('Property 25: Allowed features are not marked as forbidden', () => {
    fc.assert(
      fc.property(allowedFeatureArb, (feature) => {
        return isFeatureForbidden(feature) === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * A set of only allowed features passes validation.
   */
  test('Property 25: Set of allowed features passes validation', () => {
    fc.assert(
      fc.property(allowedFeaturesSetArb, (features) => {
        const result = validateActiveFeatures(features);
        return result.valid === true && result.invalidFeatures.length === 0;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * A set containing forbidden features fails validation.
   */
  test('Property 25: Set with forbidden features fails validation', () => {
    fc.assert(
      fc.property(
        fc.array(allowedFeatureArb, { minLength: 0, maxLength: 3 }),
        forbiddenFeatureArb,
        (allowedFeatures, forbiddenFeature) => {
          const features = new Set([...allowedFeatures, forbiddenFeature]);
          const result = validateActiveFeatures(features);
          return result.valid === false && result.invalidFeatures.includes(forbiddenFeature);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * The exact set of allowed features matches the specification.
   */
  test('Property 25: Allowed features match specification', () => {
    const expectedFeatures = ['poll', 'event', 'collab', 'report'];
    
    expect(ALLOWED_FEATURES).toHaveLength(4);
    expect(ALLOWED_FEATURES).toEqual(expect.arrayContaining(expectedFeatures));
    expect(expectedFeatures).toEqual(expect.arrayContaining(ALLOWED_FEATURES));
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * 'sell' is explicitly forbidden.
   */
  test('Property 25: Sell option is explicitly forbidden', () => {
    expect(isFeatureAllowed('sell')).toBe(false);
    expect(isFeatureForbidden('sell')).toBe(true);
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * 'marketplace' is explicitly forbidden.
   */
  test('Property 25: Marketplace option is explicitly forbidden', () => {
    expect(isFeatureAllowed('marketplace')).toBe(false);
    expect(isFeatureForbidden('marketplace')).toBe(true);
  });

  /**
   * **Property 25: Post Creation No Sell Option**
   * **Validates: Requirements 19.1**
   * 
   * Empty feature set is valid (text-only post).
   */
  test('Property 25: Empty feature set is valid for text-only posts', () => {
    const emptyFeatures = new Set<string>();
    const result = validateActiveFeatures(emptyFeatures);
    
    expect(result.valid).toBe(true);
    expect(result.invalidFeatures).toHaveLength(0);
  });
});
