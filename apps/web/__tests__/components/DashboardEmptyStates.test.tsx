/**
 * Unit tests for Dashboard Empty States
 * 
 * Task 6.6: Create Empty State UX for all dashboards (CRITICAL FOR LAUNCH)
 * 
 * Tests verify that all four dashboard components render appropriate empty states
 * with correct illustrations, messages, and CTA buttons.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import StudentDashboard from '../../app/components/dashboard/StudentDashboard';
import ProfessionalDashboard from '../../app/components/dashboard/ProfessionalDashboard';
import OrganizerDashboard from '../../app/components/dashboard/OrganizerDashboard';
import TeacherDashboard from '../../app/components/dashboard/TeacherDashboard';

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

// Mock API
vi.mock('../../../lib/api', () => ({
  api: {
    getEvents: vi.fn().mockResolvedValue([]),
    getUserEvents: vi.fn().mockResolvedValue([]),
    getClassrooms: vi.fn().mockResolvedValue([]),
    getVerifiedEvents: vi.fn().mockResolvedValue([]),
    getAttendanceRequests: vi.fn().mockResolvedValue([]),
  },
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
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Dashboard Empty States', () => {
  describe('StudentDashboard', () => {
    it('should render empty state with calendar illustration', async () => {
      render(<StudentDashboard />);
      
      // Wait for component to load
      await screen.findByText(/No events yet — explore what's happening around you/i);
      
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
      render(<ProfessionalDashboard />);
      
      // Wait for component to load
      await screen.findByText(/No events in your area yet — discover global opportunities/i);
      
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
      render(<OrganizerDashboard />);
      
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
      render(<TeacherDashboard />);
      
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
      const { container } = render(<StudentDashboard />);
      
      // Wait for component to load
      await screen.findByText(/No events yet — explore what's happening around you/i);
      
      // Check for neo-brutalist styling classes
      const emptyStateContainer = container.querySelector('.border-dashed');
      expect(emptyStateContainer).toBeInTheDocument();
      expect(emptyStateContainer).toHaveClass('rounded-card-lg');
    });

    it('should have proper button styling', async () => {
      render(<StudentDashboard />);
      
      // Wait for component to load
      await screen.findByText(/No events yet — explore what's happening around you/i);
      
      const ctaButton = screen.getByRole('button', { name: /Browse Events/i });
      expect(ctaButton).toHaveClass('btn-neo', 'btn-primary');
    });
  });

  describe('Empty State Messages', () => {
    it('should have unique messages for each dashboard type', async () => {
      // Student message
      const { unmount: unmountStudent } = render(<StudentDashboard />);
      await screen.findByText(/No events yet — explore what's happening around you/i);
      unmountStudent();

      // Professional message
      const { unmount: unmountProfessional } = render(<ProfessionalDashboard />);
      await screen.findByText(/No events in your area yet — discover global opportunities/i);
      unmountProfessional();

      // Organizer message
      const { unmount: unmountOrganizer } = render(<OrganizerDashboard />);
      await screen.findByText(/You haven't hosted any events yet/i);
      unmountOrganizer();

      // Teacher message
      render(<TeacherDashboard />);
      await screen.findByText(/No classrooms created yet/i);
    });
  });

  describe('CTA Button Navigation', () => {
    it('should have correct navigation targets for each dashboard', async () => {
      // Student - Browse Events
      const { unmount: unmountStudent } = render(<StudentDashboard />);
      await screen.findByText(/Browse Events/i);
      let link = screen.getByRole('button', { name: /Browse Events/i }).closest('a');
      expect(link).toHaveAttribute('href', '/events');
      unmountStudent();

      // Professional - Explore Events
      const { unmount: unmountProfessional } = render(<ProfessionalDashboard />);
      await screen.findByText(/Explore Events/i);
      link = screen.getByRole('button', { name: /Explore Events/i }).closest('a');
      expect(link).toHaveAttribute('href', '/events');
      unmountProfessional();

      // Organizer - Create Your First Event
      const { unmount: unmountOrganizer } = render(<OrganizerDashboard />);
      await screen.findByText(/Create Your First Event/i);
      link = screen.getByRole('button', { name: /Create Your First Event/i }).closest('a');
      expect(link).toHaveAttribute('href', '/events/create');
      unmountOrganizer();

      // Teacher - Create Classroom
      render(<TeacherDashboard />);
      await screen.findByText(/Create Classroom/i);
      link = screen.getByRole('button', { name: /Create Classroom/i }).closest('a');
      expect(link).toHaveAttribute('href', '/classrooms/create');
    });
  });
});
