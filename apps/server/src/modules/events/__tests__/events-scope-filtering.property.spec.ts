/**
 * Property Test: Event Scope Filtering
 * 
 * Property 1: Event Scope Filtering
 * *For any* set of events and any user with a college, filtering by "campus" scope 
 * SHALL return only events where event.collegeId equals user.collegeId, and filtering 
 * by "global" scope SHALL return all events with visibility "public".
 * 
 * **Validates: Requirements 1.2, 1.3**
 * 
 * Feature: events-system-redesign, Property 1: Event Scope Filtering
 */

import * as fc from 'fast-check';

// Types for testing
interface Event {
  id: string;
  title: string;
  collegeId: string | null;
  visibility: 'PUBLIC' | 'INVITE_ONLY';
  status: 'DRAFT' | 'PUBLISHED' | 'REGISTRATION_CLOSED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
  deletedAt: Date | null;
}

interface User {
  id: string;
  collegeId: string | null;
}

// Pure function that implements scope filtering logic
function filterEventsByScope(
  events: Event[],
  scope: 'campus' | 'global',
  userCollegeId: string | null,
): Event[] {
  // First filter out non-visible events (deleted, draft, cancelled, archived)
  const visibleEvents = events.filter(
    (e) =>
      e.deletedAt === null &&
      ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status),
  );

  if (scope === 'campus' && userCollegeId) {
    // Campus scope: only events from user's college
    return visibleEvents.filter((e) => e.collegeId === userCollegeId);
  } else if (scope === 'global') {
    // Global scope: only public events
    return visibleEvents.filter((e) => e.visibility === 'PUBLIC');
  }

  return visibleEvents;
}

// Generators
const eventIdArb = fc.uuid();
const collegeIdArb = fc.oneof(fc.uuid(), fc.constant(null));
const visibilityArb = fc.constantFrom('PUBLIC', 'INVITE_ONLY') as fc.Arbitrary<'PUBLIC' | 'INVITE_ONLY'>;
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
  collegeId: collegeIdArb,
  visibility: visibilityArb,
  status: statusArb,
  deletedAt: fc.oneof(fc.constant(null), fc.date()),
});

const userArb = fc.record({
  id: fc.uuid(),
  collegeId: collegeIdArb,
});

const eventsListArb = fc.array(eventArb, { minLength: 0, maxLength: 50 });

describe('Event Scope Filtering Properties', () => {
  /**
   * Property 1a: Campus scope returns only events from user's college
   */
  it('campus scope returns only events from user college', () => {
    fc.assert(
      fc.property(eventsListArb, userArb, (events, user) => {
        // Skip if user has no college
        if (!user.collegeId) return true;

        const filtered = filterEventsByScope(events, 'campus', user.collegeId);

        // All returned events must be from user's college
        return filtered.every((e) => e.collegeId === user.collegeId);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 1b: Campus scope includes all visible events from user's college
   */
  it('campus scope includes all visible events from user college', () => {
    fc.assert(
      fc.property(eventsListArb, userArb, (events, user) => {
        if (!user.collegeId) return true;

        const filtered = filterEventsByScope(events, 'campus', user.collegeId);

        // All visible events from user's college should be included
        const expectedEvents = events.filter(
          (e) =>
            e.collegeId === user.collegeId &&
            e.deletedAt === null &&
            ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status),
        );

        return (
          filtered.length === expectedEvents.length &&
          expectedEvents.every((expected) =>
            filtered.some((f) => f.id === expected.id),
          )
        );
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 1c: Global scope returns only public events
   */
  it('global scope returns only public events', () => {
    fc.assert(
      fc.property(eventsListArb, (events) => {
        const filtered = filterEventsByScope(events, 'global', null);

        // All returned events must be public
        return filtered.every((e) => e.visibility === 'PUBLIC');
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 1d: Global scope includes all visible public events
   */
  it('global scope includes all visible public events', () => {
    fc.assert(
      fc.property(eventsListArb, (events) => {
        const filtered = filterEventsByScope(events, 'global', null);

        // All visible public events should be included
        const expectedEvents = events.filter(
          (e) =>
            e.visibility === 'PUBLIC' &&
            e.deletedAt === null &&
            ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'].includes(e.status),
        );

        return (
          filtered.length === expectedEvents.length &&
          expectedEvents.every((expected) =>
            filtered.some((f) => f.id === expected.id),
          )
        );
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 1e: Deleted events are never returned
   */
  it('deleted events are never returned regardless of scope', () => {
    fc.assert(
      fc.property(
        eventsListArb,
        userArb,
        fc.constantFrom('campus', 'global') as fc.Arbitrary<'campus' | 'global'>,
        (events, user, scope) => {
          const filtered = filterEventsByScope(events, scope, user.collegeId);

          // No deleted events should be returned
          return filtered.every((e) => e.deletedAt === null);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 1f: Draft, cancelled, and archived events are never returned
   */
  it('non-visible status events are never returned', () => {
    fc.assert(
      fc.property(
        eventsListArb,
        userArb,
        fc.constantFrom('campus', 'global') as fc.Arbitrary<'campus' | 'global'>,
        (events, user, scope) => {
          const filtered = filterEventsByScope(events, scope, user.collegeId);

          // Only visible statuses should be returned
          const visibleStatuses = ['PUBLISHED', 'REGISTRATION_CLOSED', 'ONGOING', 'COMPLETED'];
          return filtered.every((e) => visibleStatuses.includes(e.status));
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 1g: Campus and global scopes are mutually exclusive for private events
   */
  it('private events only appear in campus scope, not global', () => {
    fc.assert(
      fc.property(eventsListArb, userArb, (events, user) => {
        if (!user.collegeId) return true;

        const campusFiltered = filterEventsByScope(events, 'campus', user.collegeId);
        const globalFiltered = filterEventsByScope(events, 'global', user.collegeId);

        // Private events from user's college should be in campus but not global
        const privateEventsInCampus = campusFiltered.filter(
          (e) => e.visibility === 'INVITE_ONLY',
        );

        // None of these should appear in global
        return privateEventsInCampus.every(
          (pe) => !globalFiltered.some((ge) => ge.id === pe.id),
        );
      }),
      { numRuns: 100 },
    );
  });
});
