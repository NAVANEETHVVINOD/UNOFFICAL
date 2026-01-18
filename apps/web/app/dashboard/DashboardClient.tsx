"use client";

import { useAuth } from "../context/AuthContext";
import { useUserType } from "../context/UserTypeContext";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useRouter } from "next/navigation";
import { UserType } from "../../lib/userTypes";

// Dashboard Components
import StudentDashboard from "../components/dashboard/StudentDashboard";
import ProfessionalDashboard from "../components/dashboard/ProfessionalDashboard";
import OrganizerDashboard from "../components/dashboard/OrganizerDashboard";
import TeacherDashboard from "../components/dashboard/TeacherDashboard";

// Layout & Components
import DashboardLayout from "../components/layouts/DashboardLayout";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import UpcomingEventsWidget from "../components/dashboard/UpcomingEventsWidget";
import { FeedSkeleton } from "../components/ui/Skeleton";

// Icons
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * DashboardContent Component
 * 
 * Routes to the appropriate dashboard based on userType
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 14.5, 18.1, 18.2, 18.3
 */
function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const { userType, isLoading: userTypeLoading } = useUserType();
  const { isReady: onboardingComplete } = useOnboardingGuard();
  const router = useRouter();

  // Combined loading state (Requirement 18.1, 18.2)
  const isLoading = authLoading || userTypeLoading || !onboardingComplete;

  // Loading State - Render Skeleton Shell (Requirement 18.1)
  if (isLoading) {
    return (
      <DashboardLayout
        leftSidebarContent={
          <>
            <FeedSkeleton count={1} />
            <FeedSkeleton count={1} />
          </>
        }
        rightSidebarContent={<FeedSkeleton count={1} />}
      >
        <FeedSkeleton count={3} />
      </DashboardLayout>
    );
  }

  // Redirect to onboarding if userType not set (Requirement 3.5)
  if (!user || !userType) {
    // Show brief loading indicator while redirecting (Requirement 18.3)
    router.replace('/onboarding?step=usertype');
    return (
      <DashboardLayout
        leftSidebarContent={<FeedSkeleton count={1} />}
        rightSidebarContent={<FeedSkeleton count={1} />}
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
            <p className="text-neutral-600 dark:text-dark-text-muted font-mono text-sm">
              Setting up your dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Route to appropriate dashboard based on userType (Requirements 3.1, 3.2, 3.3, 3.4, 14.5)
  switch (userType) {
    case UserType.STUDENT:
      return <StudentDashboard />;
    
    case UserType.PROFESSIONAL:
      return <ProfessionalDashboard />;
    
    case UserType.ORGANIZER:
      return <OrganizerDashboard />;
    
    case UserType.TEACHER:
      return <TeacherDashboard />;
    
    default:
      // Fallback: Invalid userType - show error and redirect
      console.error(`Invalid userType: ${userType}, redirecting to onboarding`);
      router.replace('/onboarding?step=usertype');
      return (
        <DashboardLayout
          leftSidebarContent={<ProfileSidebar />}
          rightSidebarContent={<UpcomingEventsWidget />}
        >
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-accent-coral/20 dark:bg-accent-coral/10 border-2 border-dashed border-accent-coral rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-accent-coral" />
            </div>
            <h3 className="font-display text-xl text-ink dark:text-dark-text mb-2">
              Invalid User Type
            </h3>
            <p className="text-neutral-500 dark:text-dark-text-muted mb-6">
              Please select your user type to continue
            </p>
            <button
              onClick={() => router.push('/onboarding?step=usertype')}
              className="btn-neo btn-primary"
            >
              Select User Type
            </button>
          </div>
        </DashboardLayout>
      );
  }
}

export default function DashboardClient() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
