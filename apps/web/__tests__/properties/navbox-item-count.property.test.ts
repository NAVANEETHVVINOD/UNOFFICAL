/**
 * Property Test: NavBox Item Count by Context
 * Feature: navigation-explore-redesign, Property 2: NavBox Item Count by Context
 * Validates: Requirements 1.1.1, 1.2.1
 * 
 * For any NavBox rendered with variant 'global', it SHALL contain exactly 4 navigation items.
 * For any NavBox rendered with variant 'college', it SHALL contain exactly 3 navigation items.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  getGlobalCategoryIds, 
  getCollegeCategoryIds,
  getGlobalCategoryCount,
  getCollegeCategoryCount,
  getCategoryIdsForVariant,
  type NavBoxVariant
} from '../../lib/navbox-categories';

describe('Feature: navigation-explore-redesign, Property 2: NavBox Item Count by Context', () => {
  
  it('global variant should always have exactly 4 items', () => {
    fc.assert(
      fc.property(
        fc.constant('global' as NavBoxVariant),
        (variant) => {
          const categories = getGlobalCategoryIds();
          expect(categories).toHaveLength(4);
          expect(categories).toContain('home');
          expect(categories).toContain('explore');
          expect(categories).toContain('chat');
          expect(categories).toContain('college');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('college variant should always have exactly 3 items', () => {
    fc.assert(
      fc.property(
        fc.constant('college' as NavBoxVariant),
        (variant) => {
          const categories = getCollegeCategoryIds();
          expect(categories).toHaveLength(3);
          expect(categories).toContain('home');
          expect(categories).toContain('college');
          expect(categories).toContain('clubs');
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('for any variant, item count should match specification', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('global' as NavBoxVariant), 
          fc.constant('college' as NavBoxVariant)
        ),
        (variant) => {
          const categories = getCategoryIdsForVariant(variant);
          if (variant === 'global') {
            return categories.length === 4;
          } else {
            return categories.length === 3;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('global and college variants should have different item counts', () => {
    const globalCount = getGlobalCategoryCount();
    const collegeCount = getCollegeCategoryCount();
    
    expect(globalCount).not.toBe(collegeCount);
    expect(globalCount).toBe(4);
    expect(collegeCount).toBe(3);
  });

  it('both variants should include home and college items', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('global' as NavBoxVariant), 
          fc.constant('college' as NavBoxVariant)
        ),
        (variant) => {
          const categories = getCategoryIdsForVariant(variant);
          return categories.includes('home') && categories.includes('college');
        }
      ),
      { numRuns: 100 }
    );
  });
});
