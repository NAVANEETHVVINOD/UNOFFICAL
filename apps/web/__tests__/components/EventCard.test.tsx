/**
 * Unit tests for EventCard component
 * Tests both attendee and organizer modes
 * 
 * Task: 8.1 Create or update EventCard component
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EventCard, {
  AttendeeEvent,
  OrganizerEvent,
  EventTicket,
} from '../../app/components/events/EventCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('EventCard Component', () => {
  // Sample event data
  // Use a date far in the future to ensure it's not past
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);
  const futureStartDate = futureDate.toISOString();
  const futureEndDate = new Date(futureDate.getTime() + 8 * 60 * 60 * 1000).toISOString();

  const baseEventData = {
    id: 'event-123',
    title: 'Tech Conference 2024',
    description: 'A great tech conference',
    coverUrl: 'https://example.com/cover.jpg',
    startsAt: futureStartDate,
    endsAt: futureEndDate,
    venue: 'Convention Center',
    category: 'TECHNOLOGY',
    scope: 'GLOBAL' as const,
    visibility: 'PUBLIC' as const,
    status: 'PUBLISHED',
    createdBy: {
      id: 'user-123',
      profile: {
        fullName: 'John Doe',
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    },
    tickets: [
      {
        id: 'ticket-1',
        name: 'General Admission',
        price: 50000, // ₹500 in paise
        quantity: 100,
        quantitySold: 25,
      },
    ] as EventTicket[],
    _count: {
      registrations: 25,
      checkIns: 20,
    },
    college: {
      name: 'Test College',
      slug: 'test-college',
    },
  };

  const attendeeEvent: AttendeeEvent = {
    ...baseEventData,
    isSaved: false,
  };

  const organizerEvent: OrganizerEvent = {
    ...baseEventData,
    registrations: 25,
    attendancePercentage: 80,
    revenue: 1250000, // ₹12,500 in paise
    displayStatus: 'LIVE',
  };

  describe('Attendee Mode', () => {
    const mockToggleSave = vi.fn();
    const mockShare = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should render event card in attendee mode (Requirement 19.2)', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
      expect(screen.getByText('Convention Center')).toBeInTheDocument();
      expect(screen.getByText('by John Doe')).toBeInTheDocument();
    });

    it('should display RSVP/Register button (Requirement 19.3)', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      const registerButton = screen.getByText('Register');
      expect(registerButton).toBeInTheDocument();
    });

    it('should display Save button (Requirement 19.3)', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      const saveButton = screen.getByTitle('Save');
      expect(saveButton).toBeInTheDocument();
    });

    it('should display Share button (Requirement 19.3)', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      const shareButton = screen.getByTitle('Share');
      expect(shareButton).toBeInTheDocument();
    });

    it('should call onToggleSave when Save button is clicked', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      const saveButton = screen.getByTitle('Save');
      fireEvent.click(saveButton);

      expect(mockToggleSave).toHaveBeenCalledWith(
        'event-123',
        expect.any(Object)
      );
    });

    it('should call onShare when Share button is clicked', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      const shareButton = screen.getByTitle('Share');
      fireEvent.click(shareButton);

      expect(mockShare).toHaveBeenCalledWith(
        attendeeEvent,
        expect.any(Object)
      );
    });

    it('should show saved state when isSaved is true', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={true}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      const unsaveButton = screen.getByTitle('Unsave');
      expect(unsaveButton).toBeInTheDocument();
    });

    it('should display attendee count when available', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.getByText('25 attending')).toBeInTheDocument();
    });

    it('should display FREE badge for free events', () => {
      const freeEvent = {
        ...attendeeEvent,
        tickets: [
          {
            id: 'ticket-1',
            name: 'Free Ticket',
            price: 0,
            quantity: 100,
            quantitySold: 25,
          },
        ] as EventTicket[],
      };

      render(
        <EventCard
          mode="attendee"
          event={freeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.getByText('FREE')).toBeInTheDocument();
    });

    it('should display price badge for paid events', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.getByText('₹500')).toBeInTheDocument();
    });

    it('should display Campus badge for college events', () => {
      const campusEvent = {
        ...attendeeEvent,
        scope: 'COLLEGE' as const,
      };

      render(
        <EventCard
          mode="attendee"
          event={campusEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.getByText('Campus')).toBeInTheDocument();
    });

    it('should display Global badge for global events', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.getByText('Global')).toBeInTheDocument();
    });

    it('should display category badge when available', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.getByText('TECHNOLOGY')).toBeInTheDocument();
    });

    it('should link to event details page (Requirement 19.3)', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/events/event-123');
    });

    it('should not display Register button for past events', () => {
      const pastEvent = {
        ...attendeeEvent,
        startsAt: '2020-01-01T10:00:00Z',
      };

      render(
        <EventCard
          mode="attendee"
          event={pastEvent}
          isSaved={false}
          onToggleSave={mockToggleSave}
          onShare={mockShare}
        />
      );

      expect(screen.queryByText('Register')).not.toBeInTheDocument();
    });
  });

  describe('Organizer Mode', () => {
    it('should render event card in organizer mode (Requirement 19.2)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();
      expect(screen.getByText('Convention Center')).toBeInTheDocument();
    });

    it('should display registrations count (Requirement 19.4)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      expect(screen.getByText('Registrations')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('should display attendance percentage (Requirement 19.4)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      expect(screen.getByText('Attendance')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should display revenue for paid events (Requirement 19.4)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('₹12500')).toBeInTheDocument();
    });

    it('should not display revenue for free events', () => {
      const freeOrganizerEvent = {
        ...organizerEvent,
        tickets: [
          {
            id: 'ticket-1',
            name: 'Free Ticket',
            price: 0,
            quantity: 100,
            quantitySold: 25,
          },
        ] as EventTicket[],
        revenue: null,
      };

      render(<EventCard mode="organizer" event={freeOrganizerEvent} />);

      expect(screen.queryByText('Revenue')).not.toBeInTheDocument();
    });

    it('should display LIVE status badge (Requirement 19.4)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      expect(screen.getByText('LIVE')).toBeInTheDocument();
    });

    it('should display DRAFT status badge', () => {
      const draftEvent = {
        ...organizerEvent,
        displayStatus: 'DRAFT' as const,
      };

      render(<EventCard mode="organizer" event={draftEvent} />);

      expect(screen.getByText('DRAFT')).toBeInTheDocument();
    });

    it('should display ENDED status badge', () => {
      const endedEvent = {
        ...organizerEvent,
        displayStatus: 'ENDED' as const,
      };

      render(<EventCard mode="organizer" event={endedEvent} />);

      expect(screen.getByText('ENDED')).toBeInTheDocument();
    });

    it('should display QR Scanner quick action (Requirement 19.4)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      const scannerButton = screen.getByTitle('QR Scanner');
      expect(scannerButton).toBeInTheDocument();
      expect(scannerButton.closest('a')).toHaveAttribute(
        'href',
        '/events/event-123/checkin'
      );
    });

    it('should display Analytics quick action (Requirement 19.4)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      const analyticsButton = screen.getByTitle('Analytics');
      expect(analyticsButton).toBeInTheDocument();
      expect(analyticsButton.closest('a')).toHaveAttribute(
        'href',
        '/events/event-123/analytics'
      );
    });

    it('should display Attendees quick action (Requirement 19.4)', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      const attendeesButton = screen.getByTitle('Attendee List');
      expect(attendeesButton).toBeInTheDocument();
      expect(attendeesButton.closest('a')).toHaveAttribute(
        'href',
        '/events/event-123/attendees'
      );
    });

    it('should display Edit button for non-ended events', () => {
      render(<EventCard mode="organizer" event={organizerEvent} />);

      const editButton = screen.getByText('Edit Event');
      expect(editButton).toBeInTheDocument();
      expect(editButton.closest('a')).toHaveAttribute(
        'href',
        '/events/event-123/edit'
      );
    });

    it('should display View Details button for ended events', () => {
      const endedEvent = {
        ...organizerEvent,
        displayStatus: 'ENDED' as const,
      };

      render(<EventCard mode="organizer" event={endedEvent} />);

      const viewButton = screen.getByText('View Details');
      expect(viewButton).toBeInTheDocument();
      expect(viewButton.closest('a')).toHaveAttribute(
        'href',
        '/events/event-123'
      );
    });

    it('should not display Edit button for ended events', () => {
      const endedEvent = {
        ...organizerEvent,
        displayStatus: 'ENDED' as const,
      };

      render(<EventCard mode="organizer" event={endedEvent} />);

      expect(screen.queryByText('Edit Event')).not.toBeInTheDocument();
    });
  });

  describe('Common Features', () => {
    it('should display event cover image when available', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      const coverImage = screen.getByAltText('Tech Conference 2024');
      expect(coverImage).toBeInTheDocument();
      expect(coverImage).toHaveAttribute('src', 'https://example.com/cover.jpg');
    });

    it('should display placeholder when no cover image', () => {
      const eventWithoutCover = {
        ...attendeeEvent,
        coverUrl: null,
      };

      const { container } = render(
        <EventCard
          mode="attendee"
          event={eventWithoutCover}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      // Check for Calendar icon as placeholder
      const calendarIcon = container.querySelector('svg');
      expect(calendarIcon).toBeInTheDocument();
    });

    it('should display event date in correct format', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      // Date should be formatted (check for month and year pattern)
      const datePattern = /\w{3}\s+\d{1,2},\s+\d{4}/; // e.g., "Dec 25, 2024"
      const dateElements = screen.getAllByText(datePattern);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it('should display event time', () => {
      render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      // Time should be displayed (format may vary by locale)
      const timeElements = screen.getAllByText(/\d{1,2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });

    it('should display "Online" when venue is null', () => {
      const onlineEvent = {
        ...attendeeEvent,
        venue: null,
      };

      render(
        <EventCard
          mode="attendee"
          event={onlineEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      expect(screen.getByText('Online')).toBeInTheDocument();
    });
  });

  describe('Dark Mode Support (Requirement 19.5)', () => {
    it('should apply dark mode classes', () => {
      const { container } = render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      // Check for dark mode classes
      const card = container.querySelector('.dark\\:bg-dark-surface');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Reusability (Requirement 19.1)', () => {
    it('should be reusable across different contexts', () => {
      // Test that the component can be rendered multiple times with different data
      const { rerender } = render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      expect(screen.getByText('Tech Conference 2024')).toBeInTheDocument();

      // Rerender with different event
      const differentEvent = {
        ...attendeeEvent,
        id: 'event-456',
        title: 'Music Festival',
      };

      rerender(
        <EventCard
          mode="attendee"
          event={differentEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      expect(screen.getByText('Music Festival')).toBeInTheDocument();
      expect(screen.queryByText('Tech Conference 2024')).not.toBeInTheDocument();
    });

    it('should switch between modes correctly', () => {
      const { rerender } = render(
        <EventCard
          mode="attendee"
          event={attendeeEvent}
          isSaved={false}
          onToggleSave={vi.fn()}
          onShare={vi.fn()}
        />
      );

      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.queryByText('Registrations')).not.toBeInTheDocument();

      // Rerender in organizer mode
      rerender(<EventCard mode="organizer" event={organizerEvent} />);

      expect(screen.queryByText('Register')).not.toBeInTheDocument();
      expect(screen.getByText('Registrations')).toBeInTheDocument();
    });
  });
});
