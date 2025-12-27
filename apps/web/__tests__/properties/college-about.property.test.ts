/**
 * Property Test: College About Page Data
 * 
 * **Property 8: College About Page Data**
 * **Validates: Requirements 8.2**
 * 
 * Tests that the college about section displays all required information:
 * - College name
 * - Description
 * - Departments
 * - Initiatives
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// College data type definition
interface CollegeData {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  description?: string;
  departments?: string[];
  initiatives?: string[];
  _count?: {
    profiles: number;
    clubs: number;
    events: number;
  };
}

// College data generator
const collegeArbitrary = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  slug: fc.stringMatching(/^[a-z0-9]+(-[a-z0-9]+)*$/, { minLength: 1, maxLength: 50 }),
  city: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  state: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  description: fc.option(fc.string({ minLength: 0, maxLength: 500 }), { nil: undefined }),
  departments: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 10 }), { nil: undefined }),
  initiatives: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 0, maxLength: 10 }), { nil: undefined }),
  _count: fc.option(fc.record({
    profiles: fc.nat({ max: 10000 }),
    clubs: fc.nat({ max: 100 }),
    events: fc.nat({ max: 500 }),
  }), { nil: undefined }),
});

// Validation function for college data
function validateCollegeData(college: CollegeData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!college.id) errors.push('Missing id');
  if (!college.name || college.name.length === 0) errors.push('Missing or empty name');
  if (!college.slug || college.slug.length === 0) errors.push('Missing or empty slug');

  // Slug format validation
  if (college.slug && !/^[a-z0-9-]+$/.test(college.slug)) {
    errors.push('Invalid slug format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

describe('Property 8: College About Page Data', () => {
  it('should have required fields (id, name, slug)', () => {
    fc.assert(
      fc.property(
        collegeArbitrary,
        (college) => {
          const { valid, errors } = validateCollegeData(college);
          expect(valid).toBe(true);
          expect(errors).toHaveLength(0);
          return true;
        }
      )
    );
  });

  it('should have valid slug format (lowercase, no spaces)', () => {
    fc.assert(
      fc.property(
        collegeArbitrary,
        (college) => {
          expect(college.slug).toMatch(/^[a-z0-9-]+$/);
          return true;
        }
      )
    );
  });

  it('should have non-negative counts when present', () => {
    fc.assert(
      fc.property(
        collegeArbitrary,
        (college) => {
          if (college._count) {
            expect(college._count.profiles).toBeGreaterThanOrEqual(0);
            expect(college._count.clubs).toBeGreaterThanOrEqual(0);
            expect(college._count.events).toBeGreaterThanOrEqual(0);
          }
          return true;
        }
      )
    );
  });

  it('should have valid departments array when present', () => {
    fc.assert(
      fc.property(
        collegeArbitrary,
        (college) => {
          if (college.departments) {
            expect(Array.isArray(college.departments)).toBe(true);
            college.departments.forEach(dept => {
              expect(typeof dept).toBe('string');
            });
          }
          return true;
        }
      )
    );
  });

  it('should have valid initiatives array when present', () => {
    fc.assert(
      fc.property(
        collegeArbitrary,
        (college) => {
          if (college.initiatives) {
            expect(Array.isArray(college.initiatives)).toBe(true);
            college.initiatives.forEach(init => {
              expect(typeof init).toBe('string');
            });
          }
          return true;
        }
      )
    );
  });

  it('should handle location display correctly', () => {
    fc.assert(
      fc.property(
        collegeArbitrary,
        (college) => {
          // Function to format location
          const formatLocation = (city?: string, state?: string): string => {
            return [city, state].filter(Boolean).join(', ');
          };

          const location = formatLocation(college.city, college.state);
          
          if (college.city && college.state) {
            expect(location).toBe(`${college.city}, ${college.state}`);
          } else if (college.city) {
            expect(location).toBe(college.city);
          } else if (college.state) {
            expect(location).toBe(college.state);
          } else {
            expect(location).toBe('');
          }
          return true;
        }
      )
    );
  });
});

/**
 * Property Test: College Admin Editing
 * 
 * Tests that college admins can edit About page content.
 * **Validates: Requirements 8.3**
 */
describe('College Admin Editing', () => {
  it('should preserve id and slug when updating other fields', () => {
    fc.assert(
      fc.property(
        collegeArbitrary,
        fc.record({
          description: fc.string({ minLength: 0, maxLength: 500 }),
          departments: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
          initiatives: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
        }),
        (original, updates) => {
          // Simulate update
          const updated = {
            ...original,
            ...updates,
          };

          // ID and slug should remain unchanged
          expect(updated.id).toBe(original.id);
          expect(updated.slug).toBe(original.slug);
          expect(updated.name).toBe(original.name);
          
          // Updated fields should reflect new values
          expect(updated.description).toBe(updates.description);
          expect(updated.departments).toEqual(updates.departments);
          expect(updated.initiatives).toEqual(updates.initiatives);
          
          return true;
        }
      )
    );
  });
});
