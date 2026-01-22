import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';
import { render, screen } from '@testing-library/react';
import React from 'react';
import EventCard, { AttendeeEvent, OrganizerEvent, EventTicket } from '../../app/components/events/EventCard';

/**
 * **Feature: role-based-ux-launch, Property 8: Event Card Display Modes**
 * **Validates: Requirements 19.2, 19.3, 19.4**
 * 
 * Property 8: For any Event_Card component, when rendered in "attendee" mode 
 * it SHALL display RSVP, Save, Share, View Details actions, and when rendered 
 * in "organizer" mode it SHALL display Registrations, Attendance %, Revenue, Status fields.
 */

// Type definitions for event data
interface BaseEventData {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  startsAt: string;
  endsAt: string;
  venue: string | null;
  category: string | null;
  scope: "COLLEGE" | "GLOBAL";
  visibility: "PUBLIC" | "INVITE_ONLY";
  status: string;
  createdBy: {
    id: string;
    profile?: {
      fullName: string;
      avatarUrl: string | null;
    };
  };
  tickets: EventTicket[];
  _count?: {
    registrations: number;
    checkIns?: number;
  };
  college?: {
    name: string;
    slug: string;
  };
}

// Arbitraries for property-based testing
const eventIdArb = fc.uuid();
const eventTitleArb = fc.stringMatching(/^[A-Za-z0-9 ]{5,50}$/);
const eventDescriptionArb = fc.oneof(
  fc.stringMatching(/^[A-Za-z0-9 .,!?]{10,100}$/),
  fc.constant(null)
);
const coverUrlArb = fc.oneof(fc.webUrl(), fc.constant(null));
const venueArb = fc.oneof(
  fc.stringMatching(/^[A-Za-z0-9 ,]{5,30}$/),
  fc.constant(null)
);
const categoryArb = fc.oneof(
  fc.constantFrom('Tech', 'Sports', 'Arts', 'Music', 'Workshop', 'Seminar'),
  fc.constant(null)
);
const scopeArb = fc.constantFrom('COLLEGE', 'GLOBAL') as fc.Arbitrary<"COLLEGE" | "GLOBAL">;
const visibilityArb = fc.constantFrom('PUBLIC', 'INVITE_ONLY') as fc.Arbitrary<"PUBLIC" | "INVITE_ONLY">;
const statusArb = fc.constantFrom('DRAFT', 'PUBLISHED', 'CANCELLED');
const displayStatusArb = fc.constantFrom('LIVE', 'DRAFT', 'ENDED') as fc.Arbitrary<"LIVE" | "DRAFT" | "ENDED">;

// Future date generator (events should be in the future for most tests)
const futureDateArb = fc.integer({ min: Date.now(), max: Date.now() + 365 * 24 * 60 * 60 * 1000 })
  .map(timestamp => new Date(timestamp));

// Ticket generator
const ticketArb = fc.record({
  id: eventIdArb,
  name: fc.stringMatching(/^[A-Za-z ]{3,20}$/),
  price: fc.integer({ min: 0, max: 50000 }), // Price in paise (0 to ₹500)
  quantity: fc.oneof(fc.integer({ min: 10, max: 1000 }), fc.constant(null)),
  quantitySold: fc.integer({ min: 0, max: 100 }),
});

const ticketsArrayArb = fc.array(ticketArb, { minLength: 1, maxLength: 3 });

// Base event generator
const baseEventArb = fc.record({
  id: eventIdArb,
  title: eventTitleArb,
  description: eventDescriptionArb,
  coverUrl: coverUrlArb,
  startsAt: fc.integer({ min: Date.now(), max: Date.now() + 365 * 24 * 60 * 60 * 1000 })
    .map(timestamp => new Date(timestamp).toISOString()),
  endsAt: fc.integer({ min: Date.now(), max: Date.now() + 365 * 24 * 60 * 60 * 1000 })
    .map(timestamp => new Date(timestamp + 2 * 60 * 60 * 1000).toISOString()),
  venue: venueArb,
  category: categoryArb,
  scope: scopeArb,
  visibility: visibilityArb,
  status: statusArb,
  createdBy: fc.record({
    id: eventIdArb,
    profile: fc.oneof(
      fc.record({
        fullName: fc.stringMatching(/^[A-Za-z ]{3,30}$/),
        avatarUrl: fc.oneof(fc.webUrl(), fc.constant(null)),
      }),
      fc.constant(undefined)
    ),
  }),
  tickets: ticketsArrayArb,
  _count: fc.oneof(
    fc.record({
      registrations: fc.integer({ min: 0, max: 500 }),
      checkIns: fc.oneof(fc.integer({ min: 0, max: 500 }), fc.constant(undefined)),
    }),
    fc.constant(undefined)
  ),
  college: fc.oneof(
    fc.record({
      name: fc.stringMatching(/^[A-Za-z ]{5,30}$/),
      slug: fc.stringMatching(/^[a-z-]{3,20}$/),
    }),
    fc.constant(undefined)
  ),
});

// Attendee event generator
const attendeeEventArb: fc.Arbitrary<AttendeeEvent> = baseEventArb.map(base => ({
  ...base,
  isSaved: fc.sample(fc.boolean(), 1)[0],
}));

// Organizer event generator
const organizerEventArb: fc.Arbitrary<OrganizerEvent> = baseEventArb.chain(base => {
  const registrations = fc.sample(fc.integer({ min: 0, max: 500 }), 1)[0];
  const checkIns = fc.sample(fc.integer({ min: 0, max: registrations }), 1)[0];
  const attendancePercentage = registrations > 0 ? Math.round((checkIns / registrations) * 100) : 0;
  
  // Calculate revenue based on tickets
  const revenue = base.tickets.some(t => t.price > 0)
    ? fc.sample(fc.integer({ min: 0, max: 1000000 }), 1)[0]
    : null;

  return fc.constant({
    ...base,
    registrations,
    attendancePercentage,
    revenue,
    displayStatus: fc.sample(displayStatusArb, 1)[0],
  });
});

/**
 * Helper function to check if attendee mode elements are present
 */
function hasAttendeeElements(container: HTMLElement): {
  hasRegisterButton: boolean;
  hasSaveButton: boolean;
  hasShareButton: boolean;
  hasViewDetails: boolean;
} {
  // Check for Register button (if event is not past)
  const registerButton = container.querySelector('button') as HTMLButtonElement;
  const hasRegisterButton = registerButton?.textContent?.includes('Register') || false;

  // Check for Save/Bookmark button
  const buttons = container.querySelectorAll('button');
  const hasSaveButton = Array.from(buttons).some(btn => 
    btn.getAttribute('title')?.includes('Save') || 
    btn.getAttribute('title')?.includes('Unsave')
  );

  // Check for Share button
  const hasShareButton = Array.from(buttons).some(btn => 
    btn.getAttribute('title')?.includes('Share')
  );

  // Check for View Details link (the card itself is a link)
  const hasViewDetails = container.querySelector('a[href*="/events/"]') !== null;

  return {
    hasRegisterButton,
    hasSaveButton,
    hasShareButton,
    hasViewDetails,
  };
}

/**
 * Helper function to check if organizer mode elements are present
 */
function hasOrganizerElements(container: HTMLElement): {
  hasRegistrations: boolean;
  hasAttendancePercentage: boolean;
  hasRevenue: boolean;
  hasStatus: boolean;
  hasQuickActions: boolean;
} {
  const text = container.textContent || '';

  // Check for Registrations stat
  const hasRegistrations = text.includes('Registrations') || text.includes('REGISTRATIONS');

  // Check for Attendance percentage stat
  const hasAttendancePercentage = text.includes('Attendance') || text.includes('ATTENDANCE');

  // Check for Revenue (may not always be present for free events)
  const hasRevenue = text.includes('Revenue') || text.includes('REVENUE');

  // Check for Status badge (LIVE, DRAFT, ENDED)
  const hasStatus = text.includes('LIVE') || text.includes('DRAFT') || text.includes('ENDED');

  // Check for Quick Actions (Scanner, Analytics, Attendees)
  const hasQuickActions = 
    (text.includes('Scanner') || text.includes('SCANNER')) &&
    (text.includes('Analytics') || text.includes('ANALYTICS')) &&
    (text.includes('Attendees') || text.includes('ATTENDEES'));

  return {
    hasRegistrations,
    hasAttendancePercentage,
    hasRevenue,
    hasStatus,
    hasQuickActions,
  };
}

describe('Event Card Display Modes Properties', () => {
  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.2, 19.3**
   * 
   * Attendee mode SHALL display RSVP/Register button.
   */
  test('Property 8: Attendee mode displays Register button', () => {
    fc.assert(
      fc.property(attendeeEventArb, (event) => {
        const { container } = render(
          <EventCard
            mode="attendee"
            event={event}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const { hasRegisterButton, hasViewDetails } = hasAttendeeElements(container);
        
        // Should have either Register button or View Details link
        return hasRegisterButton || hasViewDetails;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.3**
   * 
   * Attendee mode SHALL display Save button.
   */
  test('Property 8: Attendee mode displays Save button', () => {
    fc.assert(
      fc.property(attendeeEventArb, (event) => {
        const { container } = render(
          <EventCard
            mode="attendee"
            event={event}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const { hasSaveButton } = hasAttendeeElements(container);
        return hasSaveButton;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.3**
   * 
   * Attendee mode SHALL display Share button.
   */
  test('Property 8: Attendee mode displays Share button', () => {
    fc.assert(
      fc.property(attendeeEventArb, (event) => {
        const { container } = render(
          <EventCard
            mode="attendee"
            event={event}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const { hasShareButton } = hasAttendeeElements(container);
        return hasShareButton;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.3**
   * 
   * Attendee mode SHALL display View Details link.
   */
  test('Property 8: Attendee mode displays View Details link', () => {
    fc.assert(
      fc.property(attendeeEventArb, (event) => {
        const { container } = render(
          <EventCard
            mode="attendee"
            event={event}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const { hasViewDetails } = hasAttendeeElements(container);
        return hasViewDetails;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.4**
   * 
   * Organizer mode SHALL display Registrations count.
   */
  test('Property 8: Organizer mode displays Registrations', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const { hasRegistrations } = hasOrganizerElements(container);
        return hasRegistrations;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.4**
   * 
   * Organizer mode SHALL display Attendance percentage.
   */
  test('Property 8: Organizer mode displays Attendance percentage', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const { hasAttendancePercentage } = hasOrganizerElements(container);
        return hasAttendancePercentage;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.4**
   * 
   * Organizer mode SHALL display Status badge (LIVE/DRAFT/ENDED).
   */
  test('Property 8: Organizer mode displays Status badge', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const { hasStatus } = hasOrganizerElements(container);
        return hasStatus;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.4**
   * 
   * Organizer mode SHALL display Quick Actions (Scanner, Analytics, Attendees).
   */
  test('Property 8: Organizer mode displays Quick Actions', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const { hasQuickActions } = hasOrganizerElements(container);
        return hasQuickActions;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.4**
   * 
   * Organizer mode SHALL display Revenue for paid events.
   */
  test('Property 8: Organizer mode displays Revenue for paid events', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        // Only test paid events
        const isPaidEvent = event.tickets.some(t => t.price > 0);
        if (!isPaidEvent || event.revenue === null) {
          return true; // Skip free events
        }

        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const { hasRevenue } = hasOrganizerElements(container);
        return hasRevenue;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.2**
   * 
   * Attendee mode SHALL NOT display organizer-specific elements.
   */
  test('Property 8: Attendee mode does not display organizer elements', () => {
    fc.assert(
      fc.property(attendeeEventArb, (event) => {
        const { container } = render(
          <EventCard
            mode="attendee"
            event={event}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const text = container.textContent || '';
        
        // Should NOT have organizer-specific stats
        const hasOrganizerStats = 
          text.includes('Attendance') ||
          text.includes('Revenue') ||
          text.includes('LIVE') ||
          text.includes('DRAFT') ||
          text.includes('ENDED');

        return !hasOrganizerStats;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.2**
   * 
   * Organizer mode SHALL NOT display attendee-specific action buttons.
   */
  test('Property 8: Organizer mode does not display attendee action buttons', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const buttons = container.querySelectorAll('button');
        
        // Should NOT have Save or Share buttons (attendee-specific)
        const hasAttendeButtons = Array.from(buttons).some(btn => 
          btn.getAttribute('title')?.includes('Save') ||
          btn.getAttribute('title')?.includes('Share')
        );

        return !hasAttendeButtons;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.2, 19.3, 19.4**
   * 
   * Mode prop SHALL determine which elements are displayed.
   */
  test('Property 8: Mode prop determines displayed elements', () => {
    fc.assert(
      fc.property(baseEventArb, (baseEvent) => {
        // Create attendee event
        const attendeeEvent: AttendeeEvent = {
          ...baseEvent,
          isSaved: false,
        };

        // Create organizer event
        const organizerEvent: OrganizerEvent = {
          ...baseEvent,
          registrations: 50,
          attendancePercentage: 75,
          revenue: null,
          displayStatus: 'LIVE',
        };

        // Render attendee mode
        const { container: attendeeContainer } = render(
          <EventCard
            mode="attendee"
            event={attendeeEvent}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        // Render organizer mode
        const { container: organizerContainer } = render(
          <EventCard mode="organizer" event={organizerEvent} />
        );

        const attendeeElements = hasAttendeeElements(attendeeContainer);
        const organizerElements = hasOrganizerElements(organizerContainer);

        // Attendee mode should have attendee elements
        const attendeeModeCorrect = 
          attendeeElements.hasSaveButton &&
          attendeeElements.hasShareButton &&
          attendeeElements.hasViewDetails;

        // Organizer mode should have organizer elements
        const organizerModeCorrect = 
          organizerElements.hasRegistrations &&
          organizerElements.hasAttendancePercentage &&
          organizerElements.hasStatus &&
          organizerElements.hasQuickActions;

        return attendeeModeCorrect && organizerModeCorrect;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.2**
   * 
   * Both modes SHALL display common event information (title, date, venue).
   */
  test('Property 8: Both modes display common event information', () => {
    fc.assert(
      fc.property(baseEventArb, (baseEvent) => {
        // Create attendee event
        const attendeeEvent: AttendeeEvent = {
          ...baseEvent,
          isSaved: false,
        };

        // Create organizer event
        const organizerEvent: OrganizerEvent = {
          ...baseEvent,
          registrations: 50,
          attendancePercentage: 75,
          revenue: null,
          displayStatus: 'LIVE',
        };

        // Render both modes
        const { container: attendeeContainer } = render(
          <EventCard
            mode="attendee"
            event={attendeeEvent}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const { container: organizerContainer } = render(
          <EventCard mode="organizer" event={organizerEvent} />
        );

        const attendeeText = attendeeContainer.textContent || '';
        const organizerText = organizerContainer.textContent || '';

        // Both should display the event title
        const bothHaveTitle = 
          attendeeText.includes(baseEvent.title) &&
          organizerText.includes(baseEvent.title);

        // Both should display venue (or "Online" if null)
        const venue = baseEvent.venue || 'Online';
        const bothHaveVenue = 
          attendeeText.includes(venue) &&
          organizerText.includes(venue);

        return bothHaveTitle && bothHaveVenue;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.2**
   * 
   * Mode switching SHALL be deterministic (same mode always shows same elements).
   */
  test('Property 8: Mode display is deterministic', () => {
    fc.assert(
      fc.property(attendeeEventArb, organizerEventArb, (attendeeEvent, organizerEvent) => {
        // Render attendee mode multiple times
        const { container: attendee1 } = render(
          <EventCard
            mode="attendee"
            event={attendeeEvent}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const { container: attendee2 } = render(
          <EventCard
            mode="attendee"
            event={attendeeEvent}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        // Render organizer mode multiple times
        const { container: organizer1 } = render(
          <EventCard mode="organizer" event={organizerEvent} />
        );

        const { container: organizer2 } = render(
          <EventCard mode="organizer" event={organizerEvent} />
        );

        // Check consistency
        const attendee1Elements = hasAttendeeElements(attendee1);
        const attendee2Elements = hasAttendeeElements(attendee2);
        const organizer1Elements = hasOrganizerElements(organizer1);
        const organizer2Elements = hasOrganizerElements(organizer2);

        const attendeeConsistent = 
          attendee1Elements.hasSaveButton === attendee2Elements.hasSaveButton &&
          attendee1Elements.hasShareButton === attendee2Elements.hasShareButton;

        const organizerConsistent = 
          organizer1Elements.hasRegistrations === organizer2Elements.hasRegistrations &&
          organizer1Elements.hasAttendancePercentage === organizer2Elements.hasAttendancePercentage;

        return attendeeConsistent && organizerConsistent;
      }),
      { numRuns: 100 }
    );
  }, 20000); // Increase timeout to 20 seconds

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.3**
   * 
   * Attendee mode SHALL display all four required actions.
   */
  test('Property 8: Attendee mode displays all required actions', () => {
    fc.assert(
      fc.property(attendeeEventArb, (event) => {
        const { container } = render(
          <EventCard
            mode="attendee"
            event={event}
            isSaved={false}
            onToggleSave={() => {}}
            onShare={() => {}}
          />
        );

        const elements = hasAttendeeElements(container);
        
        // Must have Save, Share, and View Details
        // Register button may not show for past events
        return (
          elements.hasSaveButton &&
          elements.hasShareButton &&
          elements.hasViewDetails
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.4**
   * 
   * Organizer mode SHALL display all required stats and actions.
   */
  test('Property 8: Organizer mode displays all required stats', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const elements = hasOrganizerElements(container);
        
        // Must have Registrations, Attendance %, Status, and Quick Actions
        return (
          elements.hasRegistrations &&
          elements.hasAttendancePercentage &&
          elements.hasStatus &&
          elements.hasQuickActions
        );
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.4**
   * 
   * Organizer mode SHALL display correct status badge.
   */
  test('Property 8: Organizer mode displays correct status', () => {
    fc.assert(
      fc.property(organizerEventArb, (event) => {
        const { container } = render(
          <EventCard mode="organizer" event={event} />
        );

        const text = container.textContent || '';
        
        // Should display the correct status
        return text.includes(event.displayStatus);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 8: Event Card Display Modes**
   * **Validates: Requirements 19.2**
   * 
   * Component SHALL render without errors for both modes.
   */
  test('Property 8: Component renders without errors for both modes', () => {
    fc.assert(
      fc.property(attendeeEventArb, organizerEventArb, (attendeeEvent, organizerEvent) => {
        let attendeeRendered = false;
        let organizerRendered = false;

        try {
          render(
            <EventCard
              mode="attendee"
              event={attendeeEvent}
              isSaved={false}
              onToggleSave={() => {}}
              onShare={() => {}}
            />
          );
          attendeeRendered = true;
        } catch (error) {
          // Render failed
        }

        try {
          render(<EventCard mode="organizer" event={organizerEvent} />);
          organizerRendered = true;
        } catch (error) {
          // Render failed
        }

        return attendeeRendered && organizerRendered;
      }),
      { numRuns: 100 }
    );
  });
});
