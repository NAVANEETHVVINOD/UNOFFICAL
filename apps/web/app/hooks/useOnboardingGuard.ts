"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  // Debug logging
  if (typeof window !== 'undefined') {
    console.log("[OnboardingGuard] Check:", {
      fullName,
      hasFullName,
      collegeId,
      collegeObjId,
      hasCollege,
      missingFields,
      profile: user?.profile
    });
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Hook to enforce mandatory onboarding completion
 * Redirects to /onboarding if user hasn't completed mandatory fields
 */
export function useOnboardingGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;
    
    // If no user, redirect to login
    if (!user) {
      console.log("[OnboardingGuard] No user, redirecting to login");
      router.replace("/login");
      return;
    }

    // Check onboarding status
    const { isComplete, missingFields } = checkOnboardingStatus(user);
    
    console.log("[OnboardingGuard] Status:", { isComplete, missingFields, hasRedirected });

    if (!isComplete && !hasRedirected) {
      // Store missing fields for onboarding page to highlight
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "onboarding_missing_fields",
          JSON.stringify(missingFields)
        );
      }
      
      setHasRedirected(true);
      
      // Redirect to specific step if only college is missing
      if (missingFields.includes("collegeId") && !missingFields.includes("fullName")) {
        console.log("[OnboardingGuard] Redirecting to college selection");
        router.replace("/onboarding?step=college");
      } else {
        console.log("[OnboardingGuard] Redirecting to onboarding");
        router.replace("/onboarding");
      }
    } else if (isComplete) {
      setIsReady(true);
    }
  }, [user, loading, router, hasRedirected]);

  return {
    isReady,
    loading,
    user,
  };
}

export default useOnboardingGuard;
