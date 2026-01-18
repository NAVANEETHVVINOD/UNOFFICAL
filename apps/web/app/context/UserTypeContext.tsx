"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { UserType, USER_TYPE_CONFIGS, UserTypeConfig, parseUserType } from "../../lib/userTypes";
import { api } from "../../lib/api";

/**
 * UserTypeContext - State management for user type personalization
 * 
 * This context manages the userType field which controls dashboard layout
 * and feature visibility. It is separate from the permission role system.
 * 
 * Requirements: 3.5, 15.1, 15.2
 */

interface UserTypeContextType {
  userType: UserType | null;
  config: UserTypeConfig | null;
  isLoading: boolean;
  setUserType: (type: UserType) => Promise<void>;
  isFeatureEnabled: (feature: string) => boolean;
}

const UserTypeContext = createContext<UserTypeContextType | undefined>(undefined);

export function UserTypeProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [userType, setUserTypeState] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize userType from user profile
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setUserTypeState(null);
      setIsLoading(false);
      return;
    }

    // Get userType from user profile
    const profileUserType = user.profile?.userType;
    
    if (profileUserType) {
      // Parse and validate the userType
      const parsedType = parseUserType(profileUserType);
      setUserTypeState(parsedType);
      
      // Verify cached userType matches current userType (Requirement 20.1, 20.4)
      if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
        try {
          const cachedUserType = sessionStorage.getItem('currentUserType');
          if (cachedUserType && cachedUserType !== parsedType) {
            // UserType has changed, clear stale cache
            sessionStorage.removeItem('dashboardState');
            sessionStorage.removeItem('dashboardCache');
            sessionStorage.removeItem('navigationState');
            sessionStorage.removeItem('lastDashboardType');
            sessionStorage.setItem('currentUserType', parsedType);
          } else if (!cachedUserType) {
            // First time, set the cached userType
            sessionStorage.setItem('currentUserType', parsedType);
          }
        } catch (error) {
          // SessionStorage not available (e.g., in tests)
          console.warn('SessionStorage not available:', error);
        }
      }
    } else {
      // No userType set yet
      setUserTypeState(null);
    }
    
    setIsLoading(false);
  }, [user, isAuthenticated]);

  /**
   * Update user type with API call
   * Requirements: 2.3, 15.1, 20.1, 20.2, 20.3, 20.4
   */
  const setUserType = async (type: UserType): Promise<void> => {
    if (!isAuthenticated || !user) {
      throw new Error("Must be authenticated to set user type");
    }

    try {
      setIsLoading(true);
      
      // Update profile via API
      await api.updateProfile({ userType: type });
      
      // Update local state
      setUserTypeState(type);
      
      // Clear cached dashboard state (Requirement 20.2, 20.3)
      if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined' && typeof localStorage !== 'undefined') {
        try {
          // Clear session storage
          sessionStorage.removeItem('dashboardState');
          sessionStorage.removeItem('dashboardCache');
          
          // Clear any dashboard-related local storage
          localStorage.removeItem('dashboardState');
          localStorage.removeItem('dashboardCache');
          
          // Clear any cached navigation state
          sessionStorage.removeItem('navigationState');
          sessionStorage.removeItem('lastDashboardType');
          
          // Store the new userType to prevent stale data on back navigation
          sessionStorage.setItem('currentUserType', type);
        } catch (error) {
          // Storage not available (e.g., in tests)
          console.warn('Storage not available:', error);
        }
      }
      
      // Refresh user data from backend
      await refreshUser();
    } catch (error) {
      console.error("Failed to update user type:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Check if a feature is enabled for the current user type
   * Requirements: 15.1, 15.2
   */
  const isFeatureEnabled = (feature: string): boolean => {
    if (!userType) return false;
    
    const config = USER_TYPE_CONFIGS[userType];
    return config ? config.enabledFeatures.includes(feature) : false;
  };

  // Get configuration for current user type
  const config = userType ? USER_TYPE_CONFIGS[userType] : null;

  return (
    <UserTypeContext.Provider
      value={{
        userType,
        config,
        isLoading,
        setUserType,
        isFeatureEnabled,
      }}
    >
      {children}
    </UserTypeContext.Provider>
  );
}

/**
 * Hook to access UserType context
 * Must be used within a UserTypeProvider
 */
export function useUserType() {
  const context = useContext(UserTypeContext);
  if (context === undefined) {
    throw new Error("useUserType must be used within a UserTypeProvider");
  }
  return context;
}
