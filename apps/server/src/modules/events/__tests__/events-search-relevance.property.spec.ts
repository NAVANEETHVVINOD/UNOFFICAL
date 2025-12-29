/**
 * Property Test: Search Result Relevance
 * 
 * Property 8: Search Result Relevance
 * *For any* search query, all returned events SHALL contain the query string 
 * (case-insensitive) in at least one of: title, description, or venue.
 * 
 * **Validates: Requirements 1.6**
 * 
 * Feature: events-system-redesign, Property 8: Search Result Relevance
 */

import * as fc from 'fast-check';

// Types for testing
interface Event {
  id: string;
  title: string;
  description: string | null;
  venue: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'REGISTRATION_CLOSED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
  deletedAt: Date | null;
}

// Pure function that implements search filtering logic
function filterEventsBySearch(events: Event[], searchQuery: string): Event[] {
  // First filter out non-visible events
  const visibleEvents = events.filter(
    (e) =>
      e.deletedAt === null &&
      ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status),
  );

  if (!searchQuery || searchQuery.trim() === '') {
    return visibleEvents;
  }

  const query = searchQuery.toLowerCase().trim();

  return visibleEvents.filter((e) => {
    const titleMatch = e.title.toLowerCase().includes(query);
    const descriptionMatch = e.description?.toLowerCase().includes(query) || false;
    const venueMatch = e.venue?.toLowerCase().includes(query) || false;

    return titleMatch || descriptionMatch || venueMatch;
  });
}

// Check if a string contains the query (case-insensitive)
function containsQuery(text: string | null, query: string): boolean {
  if (!text) return false;
  return text.toLowerCase().includes(query.toLowerCase());
}

// Generators
const eventIdArb = fc.uuid();
const statusArb = fc.constantFrom(
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_CLOSED',
  'ONGOING',
  'COMPLETED',
  'CANCELLED',
  'ARCHIVED',
) as fc.Arbitrary<Event['status']>;

const eventArb = fc.record({
  id: eventIdArb,
  title: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.oneof(fc.constant(null), fc.string({ minLength: 0, maxLength: 500 })),
  venue: fc.oneof(fc.constant(null), fc.string({ minLength: 0, maxLength: 100 })),
  status: statusArb,
  deletedAt: fc.oneof(fc.constant(null), fc.date()),
});

const eventsListArb = fc.array(eventArb, { minLength: 0, maxLength: 50 });

// Generate search queries that might match event fields
const searchQueryArb = fc.oneof(
  fc.string({ minLength: 1, maxLength: 20 }),
  fc.constant(''),
  fc.constant('   '), // whitespace only
);

describe('Event Search Result Relevance Properties', () => {
  /**
   * Property 8a: All search results contain the query in title, description, or venue
   */
  it('all search results contain query in at least one searchable field', () => {
    fc.assert(
      fc.property(eventsListArb, searchQueryArb, (events, query) => {
        const filtered = filterEventsBySearch(events, query);

        // If query is empty or whitespace, all visible events should be returned
        if (!query || query.trim() === '') {
          return true;
        }

        // All returned events must contain the query in at least one field
        return filtered.every(
          (e) =>
            containsQuery(e.title, query) ||
            containsQuery(e.description, query) ||
            containsQuery(e.venue, query),
        );
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 8b: Search is case-insensitive
   */
  it('search is case-insensitive', () => {
    fc.assert(
      fc.property(eventsListArb, fc.string({ minLength: 1, maxLength: 10 }), (events, query) => {
        const lowerResults = filterEventsBySearch(events, query.toLowerCase());
        const upperResults = filterEventsBySearch(events, query.toUpperCase());
        const mixedResults = filterEventsBySearch(events, query);

        // All case variations should return the same results
        const lowerIds = new Set(lowerResults.map((e) => e.id));
        const upperIds = new Set(upperResults.map((e) => e.id));
        const mixedIds = new Set(mixedResults.map((e) => e.id));

        return (
          lowerIds.size === upperIds.size &&
          lowerIds.size === mixedIds.size &&
          [...lowerIds].every((id) => upperIds.has(id) && mixedIds.has(id))
        );
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 8c: Events matching the query are included in results
   */
  it('events with matching title are included in results', () => {
    fc.assert(
      fc.property(
        eventsListArb,
        fc.string({ minLength: 2, maxLength: 10 }),
        (events, searchTerm) => {
          // Find events that should match (have searchTerm in title)
          const expectedMatches = events.filter(
            (e) =>
              e.deletedAt === null &&
              ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status) &&
              e.title.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          const results = filterEventsBySearch(events, searchTerm);

          // All expected matches should be in results
          return expectedMatches.every((expected) =>
            results.some((r) => r.id === expected.id),
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 8d: Events with matching description are included
   */
  it('events with matching description are included in results', () => {
    fc.assert(
      fc.property(
        eventsListArb,
        fc.string({ minLength: 2, maxLength: 10 }),
        (events, searchTerm) => {
          const expectedMatches = events.filter(
            (e) =>
              e.deletedAt === null &&
              ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status) &&
              e.description?.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          const results = filterEventsBySearch(events, searchTerm);

          return expectedMatches.every((expected) =>
            results.some((r) => r.id === expected.id),
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 8e: Events with matching venue are included
   */
  it('events with matching venue are included in results', () => {
    fc.assert(
      fc.property(
        eventsListArb,
        fc.string({ minLength: 2, maxLength: 10 }),
        (events, searchTerm) => {
          const expectedMatches = events.filter(
            (e) =>
              e.deletedAt === null &&
              ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status) &&
              e.venue?.toLowerCase().includes(searchTerm.toLowerCase()),
          );

          const results = filterEventsBySearch(events, searchTerm);

          return expectedMatches.every((expected) =>
            results.some((r) => r.id === expected.id),
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 8f: Empty search returns all visible events
   */
  it('empty search returns all visible events', () => {
    fc.assert(
      fc.property(eventsListArb, (events) => {
        const emptyResults = filterEventsBySearch(events, '');
        const whitespaceResults = filterEventsBySearch(events, '   ');

        const visibleEvents = events.filter(
          (e) =>
            e.deletedAt === null &&
            ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status),
        );

        return (
          emptyResults.length === visibleEvents.length &&
          whitespaceResults.length === visibleEvents.length
        );
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 8g: Deleted events are never in search results
   */
  it('deleted events are never in search results', () => {
    fc.assert(
      fc.property(eventsListArb, searchQueryArb, (events, query) => {
        const results = filterEventsBySearch(events, query);

        return results.every((e) => e.deletedAt === null);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 8h: Non-visible status events are never in search results
   */
  it('non-visible status events are never in search results', () => {
    fc.assert(
      fc.property(eventsListArb, searchQueryArb, (events, query) => {
        const results = filterEventsBySearch(events, query);
        const visibleStatuses = ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'];

        return results.every((e) => visibleStatuses.includes(e.status));
      }),
      { numRuns: 100 },
    );
  });
});
