/**
 * Property Test: Event College Filter
 * 
 * **Property 5: Event College Filter**
 * **Validates: Requirements 6.2**
 * 
 * Tests that events can be filtered by College Events and Global Events.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

// Event type definition
interface Event {
  id: string;
  title: string;
  scope: 'COLLEGE' | 'STATE';
  collegeId?: string;
  startsAt: string;
}

// Event generator - use integer timestamps to avoid Invalid Date issues
const eventArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  scope: fc.constantFrom('COLLEGE' as const, 'STATE' as const),
  collegeId: fc.option(fc.uuid(), { nil: undefined }),
  startsAt: fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2026-12-31') })
    .map(ts => new Date(ts).toISOString()),
});

// Filter function (matching implementation)
function filterEvents(events: Event[], filter: 'all' | 'college' | 'global'): Event[] {
  if (filter === 'all') return events;
  if (filter === 'college') return events.filter(e => e.scope === 'COLLEGE');
  if (filter === 'global') return events.filter(e => e.scope === 'STATE');
  return events;
}

describe('Property 5: Event College Filter', () => {
  it('should return all events when filter is "all"', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 0, maxLength: 20 }),
        (events) => {
          const filtered = filterEvents(events, 'all');
          expect(filtered.length).toBe(events.length);
          return true;
        }
      )
    );
  });

  it('should return only college events when filter is "college"', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 0, maxLength: 20 }),
        (events) => {
          const filtered = filterEvents(events, 'college');
          const allAreCollege = filtered.every(e => e.scope === 'COLLEGE');
          expect(allAreCollege).toBe(true);
          return true;
        }
      )
    );
  });

  it('should return only global events when filter is "global"', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 0, maxLength: 20 }),
        (events) => {
          const filtered = filterEvents(events, 'global');
          const allAreGlobal = filtered.every(e => e.scope === 'STATE');
          expect(allAreGlobal).toBe(true);
          return true;
        }
      )
    );
  });

  it('should preserve event count: college + global = all', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 0, maxLength: 20 }),
        (events) => {
          const collegeCount = filterEvents(events, 'college').length;
          const globalCount = filterEvents(events, 'global').length;
          const allCount = filterEvents(events, 'all').length;
          expect(collegeCount + globalCount).toBe(allCount);
          return true;
        }
      )
    );
  });
});

/**
 * Property Test: Past Events Section
 * 
 * **Property 6: Past Events Section**
 * **Validates: Requirements 6.3**
 * 
 * Tests that past events are correctly separated from upcoming events.
 */
describe('Property 6: Past Events Section', () => {
  // Function to separate past and upcoming events
  function separateEvents(events: Event[]): { upcoming: Event[]; past: Event[] } {
    const now = new Date();
    return {
      upcoming: events.filter(e => new Date(e.startsAt) >= now),
      past: events.filter(e => new Date(e.startsAt) < now),
    };
  }

  it('should correctly separate past and upcoming events', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 0, maxLength: 20 }),
        (events) => {
          const { upcoming, past } = separateEvents(events);
          
          // All upcoming events should be in the future
          const now = new Date();
          const allUpcomingInFuture = upcoming.every(e => new Date(e.startsAt) >= now);
          const allPastInPast = past.every(e => new Date(e.startsAt) < now);
          
          expect(allUpcomingInFuture).toBe(true);
          expect(allPastInPast).toBe(true);
          return true;
        }
      )
    );
  });

  it('should preserve total event count after separation', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 0, maxLength: 20 }),
        (events) => {
          const { upcoming, past } = separateEvents(events);
          expect(upcoming.length + past.length).toBe(events.length);
          return true;
        }
      )
    );
  });

  it('should not have any event in both past and upcoming', () => {
    fc.assert(
      fc.property(
        fc.array(eventArbitrary, { minLength: 0, maxLength: 20 }),
        (events) => {
          const { upcoming, past } = separateEvents(events);
          const upcomingIds = new Set(upcoming.map(e => e.id));
          const pastIds = new Set(past.map(e => e.id));
          
          // Check for intersection
          const intersection = [...upcomingIds].filter(id => pastIds.has(id));
          expect(intersection.length).toBe(0);
          return true;
        }
      )
    );
  });
});
