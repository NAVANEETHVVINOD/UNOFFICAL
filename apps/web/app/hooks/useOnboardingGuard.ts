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
 * Mandatory fields: fullName, collegeId
 */
export function checkOnboardingStatus(user: any): OnboardingCheckResult {
  const missingFields: string[] = [];

  if (!user?.profile?.fullName?.trim()) {
    missingFields.push("fullName");
  }
  if (!user?.profile?.collegeId) {
    missingFields.push("collegeId");
  }

  return {
    isComplete:
      user?.profile?.isOnboarded === true && missingFields.length === 0,
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

  useEffect(() => {
    if (!loading && user) {
      const { isComplete, missingFields } = checkOnboardingStatus(user);
      if (!isComplete) {
        // Store missing fields for onboarding page to highlight
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "onboarding_missing_fields",
            JSON.stringify(missingFields)
          );
        }
        router.replace("/onboarding");
      } else {
        setIsReady(true);
      }
    } else if (!loading && !user) {
      // Not logged in, redirect to login
      router.replace("/login");
    }
  }, [user, loading, router]);

  return {
    isReady: !loading && user && checkOnboardingStatus(user).isComplete,
    loading,
    user,
  };
}

export default useOnboardingGuard;
