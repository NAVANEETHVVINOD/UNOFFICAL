"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface OnboardingCheckResult {
  isComplete: boolean;
  missingFields: string[];
}

/**
 * Check if user has completed mandatory onboarding fields
 * Mandatory fields: fullName, collegeId (or college.id)
 */
export function checkOnboardingStatus(user: any): OnboardingCheckResult {
  const missingFields: string[] = [];

  const fullName = user?.profile?.fullName;
  const hasFullName = typeof fullName === 'string' && fullName.trim().length > 0;
  
  if (!hasFullName) {
    missingFields.push("fullName");
  }
  
  // Check both collegeId and college.id since the API might return either
  const collegeId = user?.profile?.collegeId;
  const collegeObjId = user?.profile?.college?.id;
  const hasCollege = !!(collegeId || collegeObjId);
  
  if (!hasCollege) {
    missingFields.push("collegeId");
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Hook to enforce mandatory onboarding completion
 * Redirects to /onboarding if user hasn't completed mandatory fields
 * Note: Does NOT redirect to login - that's handled by AuthContext
 */
export function useOnboardingGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Don't do anything while loading
    if (loading) {
      return;
    }
    
    // If no user, don't redirect here - let the page handle it or show loading
    // The AuthContext will handle showing loading state
    if (!user) {
      // Only redirect to login if we're sure there's no session
      // Check if we have a token - if not, redirect to login
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (!token && !hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        router.replace("/login");
      }
      return;
    }

    // Reset redirect flag when user is available
    hasRedirectedRef.current = false;

    // Check onboarding status
    const { isComplete, missingFields } = checkOnboardingStatus(user);

    if (!isComplete) {
      // Store missing fields for onboarding page to highlight
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "onboarding_missing_fields",
          JSON.stringify(missingFields)
        );
      }
      
      // Redirect to specific step if only college is missing
      if (missingFields.includes("collegeId") && !missingFields.includes("fullName")) {
        router.replace("/onboarding?step=college");
      } else {
        router.replace("/onboarding");
      }
    } else {
      setIsReady(true);
    }
  }, [user, loading, router, pathname]);

  return {
    isReady,
    loading,
    user,
  };
}

export default useOnboardingGuard;
