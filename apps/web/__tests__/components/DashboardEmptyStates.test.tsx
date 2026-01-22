/**
 * Unit tests for Dashboard Empty States
 * 
 * Task 6.6: Create Empty State UX for all dashboards (CRITICAL FOR LAUNCH)
 * 
 * Tests verify that all four dashboard components render appropriate empty states
 * with correct illustrations, messages, and CTA buttons.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StudentDashboard from '../../app/components/dashboard/StudentDashboard';
import ProfessionalDashboard from '../../app/components/dashboard/ProfessionalDashboard';
import OrganizerDashboard from '../../app/components/dashboard/OrganizerDashboard';
import TeacherDashboard from '../../app/components/dashboard/TeacherDashboard';
import { NotificationProvider } from '../../app/context/NotificationContext';
import { RetroToastProvider } from '../../app/context/ToastContext';
import { SocketProvider } from '../../app/context/SocketContext';

// Mock AuthContext
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  profile: {
    id: 'test-profile-id',
    fullName: 'Test User',
    collegeId: null, // No college linked for empty state
  },
};

vi.mock('../../app/context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    loading: false,
  }),
}));

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: false,
  })),
}));

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock API - Return empty arrays immediately
vi.mock('../../../lib/api', () => ({
  api: {
    getEvents: vi.fn().mockImplementation(() => Promise.resolve({ events: [] })),
    getUserEvents: vi.fn().mockImplementation(() => Promise.resolve({ events: [] })),
    getClassrooms: vi.fn().mockImplementation(() => Promise.resolve([])),
    getVerifiedEvents: vi.fn().mockImplementation(() => Promise.resolve([])),
    getAttendanceRequests: vi.fn().mockImplementation(() => Promise.resolve([])),
  },
  API_URL: 'http://localhost:3001',
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock GlobalSearch component
vi.mock('../../app/components/GlobalSearch', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return isOpen ? <div data-testid="global-search">Global Search</div> : null;
  },
}));

// Mock QRCodeModal component
vi.mock('../../app/components/QRCodeModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return isOpen ? <div data-testid="qr-modal">QR Code Modal</div> : null;
  },
}));

// Mock Navbar component
vi.mock('../../app/components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

// Mock DashboardLayout
vi.mock('../../app/components/layouts/DashboardLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock ProfileSidebar
vi.mock('../../app/components/dashboard/ProfileSidebar', () => ({
  default: () => <div data-testid="profile-sidebar">Profile Sidebar</div>,
}));

// Mock UpcomingEventsWidget
vi.mock('../../app/components/dashboard/UpcomingEventsWidget', () => ({
  default: () => <div data-testid="upcoming-events">Upcoming Events</div>,
}));

// Mock Skeleton components
vi.mock('../../app/components/ui/Skeleton', () => ({
  FeedSkeleton: () => <div data-testid="feed-skeleton">Loading...</div>,
  ProfileSkeleton: () => <div data-testid="profile-skeleton">Loading...</div>,
}));

// Helper to wrap components with all required providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <SocketProvider>
      <RetroToastProvider>
        <NotificationProvider>
          {component}
        </NotificationProvider>
      </RetroToastProvider>
    </SocketProvider>
  );
};

describe('Dashboard Empty States', () => {
  describe('StudentDashboard', () => {
    it('should render empty state with calendar illustration', async () => {
      renderWithProviders(<StudentDashboard />);
      
      // Wait for loading to complete and empty state to appear
      await waitFor(() => {
        expect(screen.queryByText(/No events yet — explore what's happening around you/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Check for illustration
      const illustration = screen.getByAltText('Calendar illustration');
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute('src', '/doodles/calendar.svg');
      
      // Check for message
      expect(screen.getByText(/No events yet — explore what's happening around you/i)).toBeInTheDocument();
      
      // Check for CTA button
      const ctaButton = screen.getByRole('button', { name: /Browse Events/i });
      expect(ctaButton).toBeInTheDocument();
      
      // Check button links to /events
      const link = ctaButton.closest('a');
      expect(link).toHaveAttribute('href', '/events');
    });
  });

  describe('ProfessionalDashboard', () => {
    it('should render empty state with globe/network illustration', async () => {
      renderWithProviders(<ProfessionalDashboard />);
      
      // Wait for loading to complete and empty state to appear
      await waitFor(() => {
        expect(screen.queryByText(/No events in your area yet — discover global opportunities/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Check for illustration
      const illustration = screen.getByAltText('Globe and network illustration');
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute('src', '/doodles/group.svg');
      
      // Check for message
      expect(screen.getByText(/No events in your area yet — discover global opportunities/i)).toBeInTheDocument();
      
      // Check for CTA button
      const ctaButton = screen.getByRole('button', { name: /Explore Events/i });
      expect(ctaButton).toBeInTheDocument();
      
      // Check button links to /events
      const link = ctaButton.closest('a');
      expect(link).toHaveAttribute('href', '/events');
    });
  });

  describe('OrganizerDashboard', () => {
    it('should render empty state with megaphone illustration', async () => {
      renderWithProviders(<OrganizerDashboard />);
      
      // Wait for component to load
      await screen.findByText(/You haven't hosted any events yet/i);
      
      // Check for illustration
      const illustration = screen.getByAltText('Megaphone illustration');
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute('src', '/doodles/megaphone.svg');
      
      // Check for message
      expect(screen.getByText(/You haven't hosted any events yet/i)).toBeInTheDocument();
      
      // Check for CTA button
      const ctaButton = screen.getByRole('button', { name: /Create Your First Event/i });
      expect(ctaButton).toBeInTheDocument();
      
      // Check button links to /events/create
      const link = ctaButton.closest('a');
      expect(link).toHaveAttribute('href', '/events/create');
    });
  });

  describe('TeacherDashboard', () => {
    it('should render empty state with classroom illustration', async () => {
      renderWithProviders(<TeacherDashboard />);
      
      // Wait for component to load
      await screen.findByText(/No classrooms created yet/i);
      
      // Check for illustration
      const illustration = screen.getByAltText('Classroom illustration');
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveAttribute('src', '/doodles/book.svg');
      
      // Check for message
      expect(screen.getByText(/No classrooms created yet/i)).toBeInTheDocument();
      
      // Check for CTA button
      const ctaButton = screen.getByRole('button', { name: /Create Classroom/i });
      expect(ctaButton).toBeInTheDocument();
      
      // Check button links to /classrooms/create
      const link = ctaButton.closest('a');
      expect(link).toHaveAttribute('href', '/classrooms/create');
    });
  });

  describe('Empty State Styling', () => {
    it('should use neo-brutalist styling with dashed borders', async () => {
      const { container } = renderWithProviders(<StudentDashboard />);
      
      // Wait for loading to complete and empty state to appear
      await waitFor(() => {
        expect(screen.queryByText(/No events yet — explore what's happening around you/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      
      // Check for neo-brutalist styling classes
      const emptyStateContainer = container.querySelector('.border-dashed');
      expect(emptyStateContainer).toBeInTheDocument();
      expect(emptyStateContainer).toHaveClass('rounded-card-lg');
    });

    it('should have proper button styling', async () => {
      renderWithProviders(<StudentDashboard />);
      
      // Wait for loading to complete and empty state to appear
      await waitFor(() => {
        expect(screen.queryByText(/No events yet — explore what's happening around you/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      
      const ctaButton = screen.getByRole('button', { name: /Browse Events/i });
      expect(ctaButton).toHaveClass('btn-neo', 'btn-primary');
    });
  });

  describe('Empty State Messages', () => {
    it('should have unique messages for each dashboard type', async () => {
      // Student message
      const { unmount: unmountStudent } = renderWithProviders(<StudentDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/No events yet — explore what's happening around you/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      unmountStudent();

      // Professional message
      const { unmount: unmountProfessional } = renderWithProviders(<ProfessionalDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/No events in your area yet — discover global opportunities/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      unmountProfessional();

      // Organizer message
      const { unmount: unmountOrganizer } = renderWithProviders(<OrganizerDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/You haven't hosted any events yet/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      unmountOrganizer();

      // Teacher message
      renderWithProviders(<TeacherDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/No classrooms created yet/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('CTA Button Navigation', () => {
    it('should have correct navigation targets for each dashboard', async () => {
      // Student - Browse Events
      const { unmount: unmountStudent } = renderWithProviders(<StudentDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/Browse Events/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      let link = screen.getByRole('button', { name: /Browse Events/i }).closest('a');
      expect(link).toHaveAttribute('href', '/events');
      unmountStudent();

      // Professional - Explore Events
      const { unmount: unmountProfessional } = renderWithProviders(<ProfessionalDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/Explore Events/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      link = screen.getByRole('button', { name: /Explore Events/i }).closest('a');
      expect(link).toHaveAttribute('href', '/events');
      unmountProfessional();

      // Organizer - Create Your First Event
      const { unmount: unmountOrganizer } = renderWithProviders(<OrganizerDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/Create Your First Event/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      link = screen.getByRole('button', { name: /Create Your First Event/i }).closest('a');
      expect(link).toHaveAttribute('href', '/events/create');
      unmountOrganizer();

      // Teacher - Create Classroom
      renderWithProviders(<TeacherDashboard />);
      await waitFor(() => {
        expect(screen.queryByText(/Create Classroom/i)).toBeInTheDocument();
      }, { timeout: 5000 });
      link = screen.getByRole('button', { name: /Create Classroom/i }).closest('a');
      expect(link).toHaveAttribute('href', '/classrooms/create');
    });
  });
});
