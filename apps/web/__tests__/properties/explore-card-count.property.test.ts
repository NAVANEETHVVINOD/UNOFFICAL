/**
 * Property Test: Explore Page Card Count
 * Feature: navigation-explore-redesign, Property 4: Explore Page Card Count
 * Validates: Requirements 4.1
 * 
 * For any rendering of the Explore page, it SHALL display exactly 4 feature cards.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getExploreCardIds, getExploreCardCount } from '../../lib/explore-cards';

describe('Feature: navigation-explore-redesign, Property 4: Explore Page Card Count', () => {
  
  it('explore page should always have exactly 4 cards', () => {
    fc.assert(
      fc.property(
        fc.constant(true), // Just need to run the check
        () => {
          const count = getExploreCardCount();
          expect(count).toBe(4);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('explore cards should include events, marketplace, collabo, and resources', () => {
    const cardIds = getExploreCardIds();
    
    expect(cardIds).toContain('events');
    expect(cardIds).toContain('marketplace');
    expect(cardIds).toContain('collabo');
    expect(cardIds).toContain('resources');
  });

  it('explore cards should NOT include clubs or colleges', () => {
    const cardIds = getExploreCardIds();
    
    expect(cardIds).not.toContain('clubs');
    expect(cardIds).not.toContain('colleges');
  });

  it('for any number of renders, card count remains constant at 4', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }), // Simulate multiple renders
        (renderCount) => {
          // Each "render" should return the same count
          for (let i = 0; i < renderCount; i++) {
            const count = getExploreCardCount();
            if (count !== 4) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('card IDs should be unique', () => {
    const cardIds = getExploreCardIds();
    const uniqueIds = new Set(cardIds);
    
    expect(uniqueIds.size).toBe(cardIds.length);
    expect(uniqueIds.size).toBe(4);
  });
});
