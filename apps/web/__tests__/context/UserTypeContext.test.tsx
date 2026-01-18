/**
 * Unit tests for UserTypeContext
 * Tests the context provider, state management, and API integration
 * 
 * Requirements: 3.5, 15.1, 15.2
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { UserTypeProvider, useUserType } from '../../app/context/UserTypeContext';
import { UserType } from '../../lib/userTypes';
import * as AuthContext from '../../app/context/AuthContext';
import * as api from '../../lib/api';

// Mock the AuthContext
vi.mock('../../app/context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the API
vi.mock('../../lib/api', () => ({
  api: {
    updateProfile: vi.fn(),
  },
}));

describe('UserTypeContext', () => {
  const mockRefreshUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createWrapper = () => {
    return ({ children }: { children: ReactNode }) => (
      <UserTypeProvider>{children}</UserTypeProvider>
    );
  };

  describe('initialization', () => {
    it('should initialize with null userType when not authenticated', () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      expect(result.current.userType).toBeNull();
      expect(result.current.config).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should initialize with userType from user profile (Requirement 3.5)', async () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: 'STUDENT',
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBe(UserType.STUDENT);
        expect(result.current.config).toBeDefined();
        expect(result.current.config?.type).toBe(UserType.STUDENT);
      });
    });

    it('should handle null userType in profile', async () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: null,
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should parse invalid userType with fallback to STUDENT', async () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: 'INVALID_TYPE',
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBe(UserType.STUDENT);
      });
    });
  });

  describe('setUserType', () => {
    it('should update userType via API call (Requirement 1.3, 2.3)', async () => {
      const mockUpdateProfile = vi.fn().mockResolvedValue({});
      vi.mocked(api.api.updateProfile).mockImplementation(mockUpdateProfile);

      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: 'STUDENT',
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBe(UserType.STUDENT);
      });

      // Change userType to ORGANIZER
      await act(async () => {
        await result.current.setUserType(UserType.ORGANIZER);
      });

      expect(mockUpdateProfile).toHaveBeenCalledWith({ userType: UserType.ORGANIZER });
      expect(mockRefreshUser).toHaveBeenCalled();
      expect(result.current.userType).toBe(UserType.ORGANIZER);
    });

    it('should throw error when not authenticated', async () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await expect(async () => {
        await act(async () => {
          await result.current.setUserType(UserType.ORGANIZER);
        });
      }).rejects.toThrow('Must be authenticated to set user type');
    });

    it('should handle API errors gracefully', async () => {
      const mockUpdateProfile = vi.fn().mockRejectedValue(new Error('API Error'));
      vi.mocked(api.api.updateProfile).mockImplementation(mockUpdateProfile);

      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: 'STUDENT',
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBe(UserType.STUDENT);
      });

      await expect(async () => {
        await act(async () => {
          await result.current.setUserType(UserType.ORGANIZER);
        });
      }).rejects.toThrow('API Error');

      // UserType should remain unchanged after error
      expect(result.current.userType).toBe(UserType.STUDENT);
    });

    it('should clear cached dashboard state on userType change (Requirement 20.2, 20.3)', async () => {
      const mockUpdateProfile = vi.fn().mockResolvedValue({});
      vi.mocked(api.api.updateProfile).mockImplementation(mockUpdateProfile);

      // Mock sessionStorage
      const mockSessionStorage = {
        removeItem: vi.fn(),
      };
      Object.defineProperty(window, 'sessionStorage', {
        value: mockSessionStorage,
        writable: true,
      });

      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: 'STUDENT',
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBe(UserType.STUDENT);
      });

      await act(async () => {
        await result.current.setUserType(UserType.ORGANIZER);
      });

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('dashboardState');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('dashboardCache');
    });
  });

  describe('isFeatureEnabled', () => {
    it('should return true for enabled features (Requirement 15.1, 15.2)', async () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: 'ORGANIZER',
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBe(UserType.ORGANIZER);
      });

      expect(result.current.isFeatureEnabled('eventsView')).toBe(true);
      expect(result.current.isFeatureEnabled('eventsCreate')).toBe(true);
      expect(result.current.isFeatureEnabled('analytics')).toBe(true);
    });

    it('should return false for disabled features', async () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: 'STUDENT',
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.userType).toBe(UserType.STUDENT);
      });

      expect(result.current.isFeatureEnabled('eventsCreate')).toBe(false);
      expect(result.current.isFeatureEnabled('analytics')).toBe(false);
      expect(result.current.isFeatureEnabled('classroom')).toBe(false);
    });

    it('should return false when userType is null', () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: null,
        isAuthenticated: false,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFeatureEnabled('eventsView')).toBe(false);
    });
  });

  describe('config', () => {
    it('should provide correct config for each userType', async () => {
      const testCases = [
        { userType: 'STUDENT', expectedDashboard: 'StudentDashboard', expectedFAB: false },
        { userType: 'PROFESSIONAL', expectedDashboard: 'ProfessionalDashboard', expectedFAB: false },
        { userType: 'ORGANIZER', expectedDashboard: 'OrganizerDashboard', expectedFAB: true },
        { userType: 'TEACHER', expectedDashboard: 'TeacherDashboard', expectedFAB: false },
      ];

      for (const testCase of testCases) {
        vi.mocked(AuthContext.useAuth).mockReturnValue({
          user: {
            id: 'user-1',
            email: 'test@example.com',
            role: 'STUDENT',
            profile: {
              fullName: 'Test User',
              userType: testCase.userType,
            },
          },
          isAuthenticated: true,
          loading: false,
          login: vi.fn(),
          register: vi.fn(),
          logout: vi.fn(),
          refreshUser: mockRefreshUser,
          loginWithGoogle: vi.fn(),
        });

        const { result } = renderHook(() => useUserType(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.config).toBeDefined();
          expect(result.current.config?.dashboardComponent).toBe(testCase.expectedDashboard);
          expect(result.current.config?.showFAB).toBe(testCase.expectedFAB);
        });
      }
    });

    it('should return null config when userType is null', () => {
      vi.mocked(AuthContext.useAuth).mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          role: 'STUDENT',
          profile: {
            fullName: 'Test User',
            userType: null,
          },
        },
        isAuthenticated: true,
        loading: false,
        login: vi.fn(),
        register: vi.fn(),
        logout: vi.fn(),
        refreshUser: mockRefreshUser,
        loginWithGoogle: vi.fn(),
      });

      const { result } = renderHook(() => useUserType(), {
        wrapper: createWrapper(),
      });

      expect(result.current.config).toBeNull();
    });
  });

  describe('useUserType hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useUserType());
      }).toThrow('useUserType must be used within a UserTypeProvider');

      consoleError.mockRestore();
    });
  });
});
