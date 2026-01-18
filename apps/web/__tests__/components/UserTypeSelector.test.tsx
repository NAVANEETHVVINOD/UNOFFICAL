/**
 * Unit tests for UserTypeSelector component
 * Tests that all 4 options render correctly and selection triggers setUserType
 * 
 * Task: 5.3 Write unit tests for UserTypeSelector
 * Requirements: 12.1 (College Admin is NOT displayed)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserTypeSelector from '../../app/components/onboarding/UserTypeSelector';
import { UserType, USER_TYPE_CONFIGS } from '../../lib/userTypes';

// Mock the UserTypeContext
const mockSetUserType = vi.fn();
const mockUseUserType = {
  userType: null,
  config: null,
  isLoading: false,
  setUserType: mockSetUserType,
  isFeatureEnabled: vi.fn(),
};

vi.mock('../../app/context/UserTypeContext', () => ({
  useUserType: () => mockUseUserType,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}));

describe('UserTypeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetUserType.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render the component with header', () => {
      render(<UserTypeSelector />);
      
      expect(screen.getByText('Who are you?')).toBeInTheDocument();
      expect(screen.getByText(/Choose your role to personalize your LINKER experience/i)).toBeInTheDocument();
    });

    it('should render all 4 user type options', () => {
      render(<UserTypeSelector />);
      
      // Check that all 4 user types are rendered
      expect(screen.getByText('Student')).toBeInTheDocument();
      expect(screen.getByText('Working Professional')).toBeInTheDocument();
      expect(screen.getByText('I want to host events')).toBeInTheDocument();
      expect(screen.getByText('Teacher / Faculty')).toBeInTheDocument();
    });

    it('should display icons for each user type', () => {
      render(<UserTypeSelector />);
      
      // Check that icons are rendered (emojis from config)
      expect(screen.getByText('🎓')).toBeInTheDocument(); // Student
      expect(screen.getByText('🧑‍💼')).toBeInTheDocument(); // Professional
      expect(screen.getByText('🎤')).toBeInTheDocument(); // Organizer
      expect(screen.getByText('👨‍🏫')).toBeInTheDocument(); // Teacher
    });

    it('should display descriptions for each user type', () => {
      render(<UserTypeSelector />);
      
      expect(screen.getByText(USER_TYPE_CONFIGS[UserType.STUDENT].description)).toBeInTheDocument();
      expect(screen.getByText(USER_TYPE_CONFIGS[UserType.PROFESSIONAL].description)).toBeInTheDocument();
      expect(screen.getByText(USER_TYPE_CONFIGS[UserType.ORGANIZER].description)).toBeInTheDocument();
      expect(screen.getByText(USER_TYPE_CONFIGS[UserType.TEACHER].description)).toBeInTheDocument();
    });

    it('should display helper text about changing later', () => {
      render(<UserTypeSelector />);
      
      expect(screen.getByText(/you can change this later in settings/i)).toBeInTheDocument();
    });

    it('should NOT display College Admin option (Requirement 12.1)', () => {
      render(<UserTypeSelector />);
      
      // Verify that only 4 options are displayed (not 5)
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
      
      // Verify College Admin is not in the document
      expect(screen.queryByText(/College Admin/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/college administrator/i)).not.toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('should call setUserType when Student is clicked', async () => {
      render(<UserTypeSelector />);
      
      const studentButton = screen.getByText('Student').closest('button');
      expect(studentButton).toBeInTheDocument();
      
      fireEvent.click(studentButton!);
      
      await waitFor(() => {
        expect(mockSetUserType).toHaveBeenCalledWith(UserType.STUDENT);
        expect(mockSetUserType).toHaveBeenCalledTimes(1);
      });
    });

    it('should call setUserType when Professional is clicked', async () => {
      render(<UserTypeSelector />);
      
      const professionalButton = screen.getByText('Working Professional').closest('button');
      expect(professionalButton).toBeInTheDocument();
      
      fireEvent.click(professionalButton!);
      
      await waitFor(() => {
        expect(mockSetUserType).toHaveBeenCalledWith(UserType.PROFESSIONAL);
        expect(mockSetUserType).toHaveBeenCalledTimes(1);
      });
    });

    it('should call setUserType when Organizer is clicked', async () => {
      render(<UserTypeSelector />);
      
      const organizerButton = screen.getByText('I want to host events').closest('button');
      expect(organizerButton).toBeInTheDocument();
      
      fireEvent.click(organizerButton!);
      
      await waitFor(() => {
        expect(mockSetUserType).toHaveBeenCalledWith(UserType.ORGANIZER);
        expect(mockSetUserType).toHaveBeenCalledTimes(1);
      });
    });

    it('should call setUserType when Teacher is clicked', async () => {
      render(<UserTypeSelector />);
      
      const teacherButton = screen.getByText('Teacher / Faculty').closest('button');
      expect(teacherButton).toBeInTheDocument();
      
      fireEvent.click(teacherButton!);
      
      await waitFor(() => {
        expect(mockSetUserType).toHaveBeenCalledWith(UserType.TEACHER);
        expect(mockSetUserType).toHaveBeenCalledTimes(1);
      });
    });

    it('should call onComplete callback after successful selection', async () => {
      const onComplete = vi.fn();
      render(<UserTypeSelector onComplete={onComplete} />);
      
      const studentButton = screen.getByText('Student').closest('button');
      fireEvent.click(studentButton!);
      
      await waitFor(() => {
        expect(mockSetUserType).toHaveBeenCalledWith(UserType.STUDENT);
        expect(onComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('should not call onComplete if setUserType fails', async () => {
      const onComplete = vi.fn();
      mockSetUserType.mockRejectedValueOnce(new Error('API Error'));
      
      render(<UserTypeSelector onComplete={onComplete} />);
      
      const studentButton = screen.getByText('Student').closest('button');
      fireEvent.click(studentButton!);
      
      await waitFor(() => {
        expect(mockSetUserType).toHaveBeenCalledWith(UserType.STUDENT);
        expect(onComplete).not.toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should disable other buttons while submitting', async () => {
      // Make setUserType take some time
      mockSetUserType.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<UserTypeSelector />);
      
      const studentButton = screen.getByText('Student').closest('button');
      const professionalButton = screen.getByText('Working Professional').closest('button');
      
      fireEvent.click(studentButton!);
      
      // During submission, other buttons should be disabled
      expect(professionalButton).toBeDisabled();
    });

    it('should show selected state on clicked option', async () => {
      mockSetUserType.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      render(<UserTypeSelector />);
      
      const studentButton = screen.getByText('Student').closest('button');
      fireEvent.click(studentButton!);
      
      // The selected button should have specific styling (check for checkmark SVG)
      const checkmark = studentButton?.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSetUserType.mockRejectedValueOnce(new Error('Network error'));
      
      render(<UserTypeSelector />);
      
      const studentButton = screen.getByText('Student').closest('button');
      fireEvent.click(studentButton!);
      
      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'Failed to set user type:',
          expect.any(Error)
        );
      });
      
      consoleError.mockRestore();
    });

    it('should reset selection state after error', async () => {
      mockSetUserType.mockRejectedValueOnce(new Error('API Error'));
      
      render(<UserTypeSelector />);
      
      const studentButton = screen.getByText('Student').closest('button');
      fireEvent.click(studentButton!);
      
      await waitFor(() => {
        expect(mockSetUserType).toHaveBeenCalled();
      });
      
      // After error, button should be clickable again
      expect(studentButton).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should render buttons with proper role', () => {
      render(<UserTypeSelector />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('should have clickable buttons', () => {
      render(<UserTypeSelector />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).not.toBeDisabled();
      });
    });
  });

  describe('Custom className', () => {
    it('should apply custom className to container', () => {
      const { container } = render(<UserTypeSelector className="custom-class" />);
      
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });
});
