# Implementation Plan: Role-Based UX Launch

## Overview

This implementation plan transforms LINKER into a focused "Events OS for Students & Organizers" by adding UX personalization through userType selection, role-specific dashboards, simplified navigation, and feature gating. The implementation follows an incremental approach, building core infrastructure first, then UI components, and finally integration.

## Tasks

- [ ] 1. Backend: Add userType field to Profile model
  - [ ] 1.1 Add UserType enum and field to Prisma schema
    - Add `enum UserType { STUDENT PROFESSIONAL ORGANIZER TEACHER }` to schema.prisma
    - Add `userType UserType?` field to Profile model
    - Run `npx prisma migrate dev --name add-user-type`
    - _Requirements: 17.1, 17.2, 17.5_
  
  - [ ] 1.2 Update Users service and controller to handle userType
    - Update `updateProfile` method to accept userType field
    - Ensure userType is included in profile response
    - Add validation for valid UserType enum values
    - _Requirements: 17.3, 17.4_
  
  - [ ] 1.3 Write property test for userType-role independence
    - **Property 1: UserType-Role Independence**
    - **Validates: Requirements 1.4, 12.3, 12.4, 17.5**

- [ ] 2. Frontend: Create UserType types and configuration
  - [ ] 2.1 Create userTypes.ts with enum and configuration
    - Create `apps/web/lib/userTypes.ts`
    - Define UserType enum matching backend
    - Define USER_TYPE_CONFIGS with icons, labels, descriptions, features
    - _Requirements: 13.1, 13.2, 10.1_
  
  - [ ] 2.2 Create UserTypeContext for state management
    - Create `apps/web/app/context/UserTypeContext.tsx`
    - Implement userType state from user profile
    - Implement setUserType function with API call
    - Implement isFeatureEnabled helper
    - _Requirements: 3.5, 15.1, 15.2_
  
  - [ ] 2.3 Write property test for feature flag gating
    - **Property 4: Feature Flag UserType Gating**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 15.2, 15.3**

- [ ] 3. Checkpoint - Backend and core types complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Frontend: Update feature flags system
  - [ ] 4.1 Extend featureFlags.ts with userType support
    - Add new feature flags: feedComposer, socialFeed, eventCreation, marketplaceWrite, notesWrite
    - Create `isFeatureEnabledForUserType` function
    - Maintain backward compatibility with existing role-based checks
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  
  - [ ] 4.2 Write unit tests for feature flag functions
    - Test isFeatureEnabledForUserType with various userType/feature combinations
    - Test backward compatibility with existing isFeatureEnabled
    - _Requirements: 15.4_

- [ ] 5. Frontend: Create User Type Selector component
  - [ ] 5.1 Create UserTypeSelector component
    - Create `apps/web/app/components/onboarding/UserTypeSelector.tsx`
    - Display 4 options with icons, labels, descriptions
    - Handle selection and call setUserType
    - Style with existing design system (neo-brutalist)
    - _Requirements: 1.2, 1.6, 13.1, 13.2_
  
  - [ ] 5.2 Integrate UserTypeSelector into onboarding flow
    - Add new step to STEPS array in onboarding/page.tsx after identity step
    - Add step handling in renderStepContent and handleNext
    - Update progress indicator
    - _Requirements: 1.1, 16.1, 16.2, 16.3, 16.4_
  
  - [ ] 5.3 Write unit tests for UserTypeSelector
    - Test all 4 options render correctly
    - Test selection triggers setUserType
    - Test College Admin is NOT displayed
    - _Requirements: 12.1_

- [ ] 6. Frontend: Create role-specific dashboard components
  - [ ] 6.1 Create StudentDashboard component
    - Create `apps/web/app/components/dashboard/StudentDashboard.tsx`
    - Display sections: Upcoming Events, Campus Events (conditional), Recommended Events
    - NO FeedComposer, NO social feed posts
    - Use EventCard in attendee mode
    - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.7_
  
  - [ ] 6.2 Create ProfessionalDashboard component
    - Create `apps/web/app/components/dashboard/ProfessionalDashboard.tsx`
    - Similar layout to StudentDashboard
    - Default to Global Events view
    - _Requirements: 5.1, 5.2, 5.3, 5.4_
  
  - [ ] 6.3 Create OrganizerDashboard component
    - Create `apps/web/app/components/dashboard/OrganizerDashboard.tsx`
    - Display "Your Events" section with Create Event button
    - Use EventCard in organizer mode (registrations, attendance %, revenue, status)
    - Sort events by status: Live > Draft > Ended
    - Quick access to Scanner, Analytics, Attendee list
    - Empty state with "Create Your First Event" CTA
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ] 6.4 Create TeacherDashboard component
    - Create `apps/web/app/components/dashboard/TeacherDashboard.tsx`
    - Display sections: My Classrooms, Upcoming Verified Events, Attendance Requests
    - Classroom cards with name, student count, recent activity
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 6.5 Write property test for dashboard routing
    - **Property 2: Dashboard Routing Correctness**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 8.3, 14.5**

  - [ ] 6.6 Create Empty State UX for all dashboards (CRITICAL FOR LAUNCH)
    - **StudentDashboard empty state:**
      - Illustration: Calendar/events doodle
      - Message: "No events yet — explore what's happening around you"
      - CTA Button: "Browse Events" → navigates to /events
    - **ProfessionalDashboard empty state:**
      - Illustration: Globe/network doodle
      - Message: "No events in your area yet — discover global opportunities"
      - CTA Button: "Explore Events" → navigates to /events
    - **OrganizerDashboard empty state:**
      - Illustration: Megaphone/stage doodle
      - Message: "You haven't hosted any events yet"
      - CTA Button: "Create Your First Event" → opens event creation
    - **TeacherDashboard empty state:**
      - Illustration: Classroom/chalkboard doodle
      - Message: "No classrooms created yet"
      - CTA Button: "Create Classroom" → navigates to /classrooms/create
    - Use existing doodle components and neo-brutalist styling
    - _Note: At launch, 90% of dashboards will be empty. Empty UX decides retention._

- [ ] 7. Checkpoint - Dashboard components complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Frontend: Create EventCard component with modes
  - [ ] 8.1 Create or update EventCard component
    - Create `apps/web/app/components/events/EventCard.tsx`
    - Support "attendee" mode: RSVP, Save, Share, View Details
    - Support "organizer" mode: Registrations, Attendance %, Revenue, Status
    - Dark mode support
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ] 8.2 Write property test for EventCard modes
    - **Property 8: Event Card Display Modes**
    - **Validates: Requirements 19.2, 19.3, 19.4**

- [ ] 9. Frontend: Update DashboardClient with routing
  - [ ] 9.1 Update DashboardClient to route by userType
    - Import all dashboard components
    - Read userType from UserTypeContext
    - Render appropriate dashboard based on userType
    - Redirect to onboarding if userType not set
    - Handle loading states with skeletons
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 14.5, 18.1, 18.2, 18.3_
  
  - [ ] 9.2 Write property test for userType persistence
    - **Property 3: UserType Persistence Round-Trip**
    - **Validates: Requirements 1.3, 2.3, 16.3**

- [ ] 10. Frontend: Simplify navigation components
  - [ ] 10.1 Update Navbar for desktop (4 items)
    - Modify `apps/web/app/components/Navbar.tsx`
    - Display only: Dashboard, Events, Messages, Profile
    - Remove: College, Explore, Marketplace, Notes, Communities, Collaboration links
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 10.2 Update BottomNav for mobile (4 items + FAB)
    - Modify `apps/web/app/components/ui/BottomNav.tsx`
    - Display only: Home, Events, Chat, Profile
    - Remove: College, Explore, Post button
    - Add conditional FAB for ORGANIZER userType
    - FAB opens event creation flow
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ] 10.3 Write property test for FAB visibility
    - **Property 6: FAB Visibility by UserType**
    - **Validates: Requirements 9.2, 9.3**

- [ ] 11. Checkpoint - Navigation complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Frontend: Update Events page with userType tabs
  - [ ] 12.1 Update Events page tab configuration
    - Modify events page to read userType from context
    - Configure tabs based on userType:
      - STUDENT: Campus, Open Events, My RSVPs
      - PROFESSIONAL: All Events, My RSVPs
      - ORGANIZER: My Events, All Events
      - TEACHER: Verified Events, Campus Events, My RSVPs
    - Default to first tab for each userType
    - **Note: The Events page is the primary discovery surface at launch. Dashboards are personalized summaries, not discovery engines.**
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ] 12.2 Write property test for events page tabs
    - **Property 5: Events Page Tab Configuration**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [ ] 13. Frontend: Add userType to Settings page
  - [ ] 13.1 Add User Type section to Settings
    - Modify `apps/web/app/settings/page.tsx`
    - Display current userType with icon
    - Allow changing to any of 4 options
    - Redirect to dashboard after change
    - **Add helper text:** "User Type controls how LINKER looks — not what you're allowed to do."
    - _This prevents "Why can't I create events?" confusion and reduces support issues_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 13.3_
  
  - [ ] 13.2 Write property test for settings userType options
    - **Property 12: Settings UserType Options**
    - **Validates: Requirements 2.2, 2.4**

- [ ] 14. Frontend: Handle navigation state and caching
  - [ ] 14.1 Implement cache clearing on userType change
    - Clear any cached dashboard state when userType changes
    - Ensure browser back button works correctly
    - Handle navigation state persistence
    - _Requirements: 20.1, 20.2, 20.3, 20.4_
  
  - [ ] 14.2 Write property test for navigation state
    - **Property 10: Navigation State Consistency**
    - **Validates: Requirements 20.1, 20.2, 20.3, 20.4**

- [ ] 15. Frontend: Wire providers and context
  - [ ] 15.1 Add UserTypeProvider to app layout
    - Wrap app with UserTypeProvider in layout.tsx or providers
    - Ensure context is available throughout the app
    - _Requirements: 14.5, 15.2_

- [ ] 16. Final checkpoint - Full integration
  - Ensure all tests pass, ask the user if questions arise.
  - Verify onboarding flow with userType selection
  - Verify dashboard routing for all 4 userTypes
  - Verify navigation simplification on desktop and mobile
  - Verify feature gating works correctly
  - Verify Events page tabs change by userType

## Notes

- All tasks including property-based tests are required for comprehensive coverage
- The userType field is completely separate from the permission role - they serve different purposes
- Feature flags should maintain backward compatibility with existing role-based checks
- All dashboard components should support dark mode using the existing color palette
- The FAB should only appear for ORGANIZER userType on mobile
- Property-based tests use fast-check library with minimum 100 iterations per test

## Critical Launch Guardrails (DO NOT CHANGE)

❌ Do NOT add more user types
❌ Do NOT add hybrid dashboards
❌ Do NOT auto-switch userType based on actions
❌ Do NOT expose College Admin in onboarding
❌ Do NOT enable social feed yet

## Recommended Execution Order

1. Backend userType (Task 1)
2. UserTypeContext (Task 2)
3. Feature flags (Task 4)
4. UserTypeSelector (Task 5)
5. Dashboards with empty states (Task 6)
6. EventCard (Task 8)
7. DashboardClient routing (Task 9)
8. Navigation (Task 10)
9. Events tabs (Task 12)
10. Settings (Task 13)

## Launch Configuration

**Enable at launch:**
- STUDENT userType
- ORGANIZER userType
- Events (view + RSVP)
- QR check-in
- Certificates
- Messaging

**Hide at launch:**
- PROFESSIONAL userType (optional - can enable)
- TEACHER userType (optional - can enable)
- Communities
- Social feed / post creation
- Collaboration
- Marketplace (read-only)

## Success Metrics to Track

- Event views
- RSVPs
- Organizer creation flow completion
- Empty state → CTA click rate
