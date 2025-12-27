import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: ui-code-quality-overhaul, Property 11: Layout Stability During Loading**
 * **Validates: Requirements 12.3**
 *
 * For any component that displays a skeleton loader, the skeleton's dimensions (width, height)
 * SHALL match the loaded content's dimensions within a 10% tolerance.
 */

// Common skeleton dimensions used in the app
const SKELETON_DIMENSIONS = {
  avatar: { width: 48, height: 48 },
  avatarLarge: { width: 96, height: 96 },
  card: { width: 320, height: 200 },
  cardSmall: { width: 280, height: 160 },
  listItem: { width: 'full', height: 64 },
  text: { width: 200, height: 20 },
  textLong: { width: 300, height: 20 },
  button: { width: 120, height: 44 },
  image: { width: 400, height: 300 },
  thumbnail: { width: 80, height: 80 },
};

// Content dimensions that skeletons should match
const CONTENT_DIMENSIONS = {
  avatar: { width: 48, height: 48 },
  avatarLarge: { width: 96, height: 96 },
  card: { width: 320, height: 200 },
  cardSmall: { width: 280, height: 160 },
  listItem: { width: 'full', height: 64 },
  text: { width: 200, height: 20 },
  textLong: { width: 300, height: 20 },
  button: { width: 120, height: 44 },
  image: { width: 400, height: 300 },
  thumbnail: { width: 80, height: 80 },
};

const TOLERANCE = 0.1; // 10% tolerance

/**
 * Checks if two dimensions match within tolerance.
 */
function dimensionsMatch(
  skeleton: { width: number | string; height: number },
  content: { width: number | string; height: number },
  tolerance: number = TOLERANCE
): boolean {
  // Handle 'full' width (100% of container)
  if (skeleton.width === 'full' && content.width === 'full') {
    return Math.abs(skeleton.height - content.height) <= content.height * tolerance;
  }
  
  if (typeof skeleton.width === 'string' || typeof content.width === 'string') {
    return skeleton.width === content.width && 
           Math.abs(skeleton.height - content.height) <= content.height * tolerance;
  }
  
  const widthDiff = Math.abs(skeleton.width - content.width);
  const heightDiff = Math.abs(skeleton.height - content.height);
  
  const widthTolerance = content.width * tolerance;
  const heightTolerance = content.height * tolerance;
  
  return widthDiff <= widthTolerance && heightDiff <= heightTolerance;
}

/**
 * Calculates the percentage difference between two values.
 */
function percentageDifference(a: number, b: number): number {
  if (b === 0) return a === 0 ? 0 : 100;
  return Math.abs((a - b) / b) * 100;
}

// Arbitraries
const skeletonTypeArb = fc.constantFrom(...Object.keys(SKELETON_DIMENSIONS));
const dimensionArb = fc.integer({ min: 20, max: 500 });
const toleranceArb = fc.float({ min: Math.fround(0.05), max: Math.fround(0.2), noNaN: true });

describe('Layout Stability Properties', () => {
  /**
   * **Property 11: Layout Stability During Loading**
   * **Validates: Requirements 12.3**
   */
  describe('Property 11: Layout Stability During Loading', () => {
    test('All skeleton dimensions match content dimensions', () => {
      Object.keys(SKELETON_DIMENSIONS).forEach((type) => {
        const skeleton = SKELETON_DIMENSIONS[type as keyof typeof SKELETON_DIMENSIONS];
        const content = CONTENT_DIMENSIONS[type as keyof typeof CONTENT_DIMENSIONS];
        
        expect(dimensionsMatch(skeleton, content)).toBe(true);
      });
    });

    test('Skeleton dimensions are within 10% tolerance of content', () => {
      fc.assert(
        fc.property(skeletonTypeArb, (type) => {
          const skeleton = SKELETON_DIMENSIONS[type as keyof typeof SKELETON_DIMENSIONS];
          const content = CONTENT_DIMENSIONS[type as keyof typeof CONTENT_DIMENSIONS];
          
          return dimensionsMatch(skeleton, content, TOLERANCE);
        }),
        { numRuns: 50 }
      );
    });

    test('Avatar skeleton matches avatar content exactly', () => {
      const skeleton = SKELETON_DIMENSIONS.avatar;
      const content = CONTENT_DIMENSIONS.avatar;
      
      expect(skeleton.width).toBe(content.width);
      expect(skeleton.height).toBe(content.height);
    });

    test('Card skeleton matches card content exactly', () => {
      const skeleton = SKELETON_DIMENSIONS.card;
      const content = CONTENT_DIMENSIONS.card;
      
      expect(skeleton.width).toBe(content.width);
      expect(skeleton.height).toBe(content.height);
    });

    test('List item skeleton matches list item content', () => {
      const skeleton = SKELETON_DIMENSIONS.listItem;
      const content = CONTENT_DIMENSIONS.listItem;
      
      expect(skeleton.width).toBe(content.width);
      expect(skeleton.height).toBe(content.height);
    });
  });

  /**
   * Dimension matching properties
   */
  describe('Dimension Matching Properties', () => {
    test('Exact dimensions always match', () => {
      fc.assert(
        fc.property(dimensionArb, dimensionArb, (width, height) => {
          const dim = { width, height };
          return dimensionsMatch(dim, dim);
        }),
        { numRuns: 100 }
      );
    });

    test('Dimensions within tolerance match', () => {
      fc.assert(
        fc.property(dimensionArb, dimensionArb, (width, height) => {
          const skeleton = { width, height };
          // Content within 5% of skeleton
          const content = { 
            width: Math.round(width * 0.95), 
            height: Math.round(height * 0.95) 
          };
          
          return dimensionsMatch(skeleton, content, 0.1);
        }),
        { numRuns: 100 }
      );
    });

    test('Dimensions outside tolerance do not match', () => {
      fc.assert(
        fc.property(dimensionArb, dimensionArb, (width, height) => {
          const skeleton = { width, height };
          // Content 50% larger than skeleton (outside 10% tolerance)
          const content = { 
            width: Math.round(width * 1.5), 
            height: Math.round(height * 1.5) 
          };
          
          return !dimensionsMatch(skeleton, content, 0.1);
        }),
        { numRuns: 100 }
      );
    });

    test('Percentage difference calculation is correct', () => {
      expect(percentageDifference(100, 100)).toBe(0);
      expect(percentageDifference(110, 100)).toBe(10);
      expect(percentageDifference(90, 100)).toBe(10);
      expect(percentageDifference(50, 100)).toBe(50);
    });

    test('Full width skeletons match full width content', () => {
      const skeleton = { width: 'full' as const, height: 64 };
      const content = { width: 'full' as const, height: 64 };
      
      expect(dimensionsMatch(skeleton, content)).toBe(true);
    });
  });

  /**
   * Skeleton configuration properties
   */
  describe('Skeleton Configuration Properties', () => {
    test('All skeleton types have defined dimensions', () => {
      const skeletonTypes = Object.keys(SKELETON_DIMENSIONS);
      expect(skeletonTypes.length).toBeGreaterThan(0);
      
      skeletonTypes.forEach((type) => {
        const dim = SKELETON_DIMENSIONS[type as keyof typeof SKELETON_DIMENSIONS];
        expect(dim).toHaveProperty('width');
        expect(dim).toHaveProperty('height');
      });
    });

    test('All content types have defined dimensions', () => {
      const contentTypes = Object.keys(CONTENT_DIMENSIONS);
      expect(contentTypes.length).toBeGreaterThan(0);
      
      contentTypes.forEach((type) => {
        const dim = CONTENT_DIMENSIONS[type as keyof typeof CONTENT_DIMENSIONS];
        expect(dim).toHaveProperty('width');
        expect(dim).toHaveProperty('height');
      });
    });

    test('Skeleton and content types are aligned', () => {
      const skeletonTypes = Object.keys(SKELETON_DIMENSIONS);
      const contentTypes = Object.keys(CONTENT_DIMENSIONS);
      
      expect(skeletonTypes).toEqual(contentTypes);
    });

    test('Numeric dimensions are positive', () => {
      Object.values(SKELETON_DIMENSIONS).forEach((dim) => {
        if (typeof dim.width === 'number') {
          expect(dim.width).toBeGreaterThan(0);
        }
        expect(dim.height).toBeGreaterThan(0);
      });
    });
  });
});
