# Implementation Plan

## Phase 1: Foundation & Styling Updates

- [x] 1. Update Tailwind configuration and global styles

  - [x] 1.1 Add new button hover color classes


    - Add primary-600, primary-700 for darker hover states
    - Update hover:bg-primary to hover:bg-primary-600
    - _Requirements: 6.1, 6.2_
  - [x] 1.2 Add card utility classes

    - Create .card-paper class with bg-paper background
    - Add .card-elevated with shadow-neo and border
    - _Requirements: 3.1, 3.2_
  - [x] 1.3 Write property test for button hover states


    - **Property 7: Button hover state visibility**
    - **Validates: Requirements 6.1, 6.2**

- [x] 2. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Navigation Improvements

- [x] 3. Update Navbar for mobile responsiveness

  - [x] 3.1 Hide notification and profile buttons on mobile


    - Add hidden md:flex to notification dropdown wrapper
    - Add hidden md:block to profile link
    - Keep only logo and search visible on mobile
    - _Requirements: 4.1, 4.2_
  - [x] 3.2 Write property test for mobile navbar


    - **Property 5: Mobile navbar simplification**
    - **Validates: Requirements 4.1, 4.2**

- [x] 4. Improve TiltedTicker design

  - [x] 4.1 Increase ticker size and improve styling


    - Increase text size to text-xl
    - Add more padding (py-4)
    - Ensure rotation is visible (rotate-1)
    - _Requirements: 5.1, 5.2_
  - [x] 4.2 Verify icons are used instead of emojis

    - Confirm SVG icons in ticker content
    - _Requirements: 5.3_
  - [x] 4.3 Write property test for ticker design

    - **Property 6: Ticker design properties**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [x] 5. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Dashboard Cleanup

- [x] 6. Remove Pro Tip widget and update cards

  - [x] 6.1 Remove Pro Tip widget from right sidebar


    - Delete the "Pro Tip" card-neo-yellow section
    - _Requirements: 7.1_
  - [x] 6.2 Update card backgrounds to paper tones


    - Replace bg-white with bg-paper in card components
    - Update NewspaperCard default background
    - _Requirements: 3.1, 9.1_
  - [x] 6.3 Write property test for card backgrounds

    - **Property 4: Card background consistency**
    - **Validates: Requirements 3.1, 3.2, 9.1**

- [x] 7. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Profile Page Redesign

- [x] 8. Create profile tab navigation component

  - [x] 8.1 Create ProfileTabs component


    - Horizontal scrollable tabs on mobile
    - Fixed tabs on desktop
    - Icons for each tab (Activities, Projects, Experience, Education, Volunteering)
    - _Requirements: 1.1_
  - [x] 8.2 Write property test for profile tabs


    - **Property 1: Profile tab navigation completeness**
    - **Validates: Requirements 1.1**

- [x] 9. Redesign profile header

  - [x] 9.1 Update profile header layout

    - Display @username handle
    - Avatar with edit overlay
    - Full name, college, bio
    - Edit Profile button
    - _Requirements: 1.2_
  - [x] 9.2 Update interests display

    - Horizontal scrollable row
    - Tags with icons
    - _Requirements: 1.3_
  - [x] 9.3 Write property test for profile header

    - **Property 2: Profile header data completeness**
    - **Validates: Requirements 1.2**

- [x] 10. Create Activities tab

  - [x] 10.1 Implement ActivitiesTab component

    - List of past events
    - Event icon, name, date/time
    - Attendance status badge (ATTENDED, REGISTERED, MISSED)
    - _Requirements: 1.4_
  - [x] 10.2 Write property test for activity entries

    - **Property 3: Activity entry data completeness**
    - **Validates: Requirements 1.4**

- [x] 11. Create Projects tab

  - [x] 11.1 Implement ProjectsTab component

    - Project cards with image preview
    - Title, description, category tags
    - Link to project
    - Empty state with Add + button
    - _Requirements: 1.5_

- [x] 12. Create Education tab

  - [x] 12.1 Implement EducationTab component

    - Timeline format with yellow dots
    - Year range (2025 - Present)
    - Degree, field, institution, location
    - Add + button
    - _Requirements: 1.6_

- [x] 13. Create Experience and Volunteering tabs

  - [x] 13.1 Implement ExperienceTab component

    - Work history entries
    - Empty state with icon and Add + button
    - _Requirements: 1.7_
  - [x] 13.2 Implement VolunteeringTab component

    - Volunteer work entries
    - Empty state with icon and Add + button
    - _Requirements: 1.8_
  - [x] 13.3 Write property test for empty states

    - **Property 9: Empty state pattern**
    - **Validates: Requirements 1.7, 1.8, 9.4**

- [x] 14. Add GitHub contribution graph

  - [x] 14.1 Create GitHubContributions component

    - Display contribution grid
    - Show "X contributions in past Y days"
    - Only show if GitHub connected
    - _Requirements: 1.9_

- [x] 15. Integrate all profile components

  - [x] 15.1 Update ProfileClient.tsx


    - Replace current layout with new tabbed design
    - Integrate all new tab components
    - Maintain existing functionality
    - _Requirements: 1.1-1.9_

- [x] 16. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Chat Interface Improvements

- [x] 17. Update chat styling

  - [x] 17.1 Update chat bubble colors


    - Use softer colors for sent messages (bg-primary-100 instead of bg-accent-yellow)
    - Use bg-paper for received messages
    - _Requirements: 2.1, 2.2_
  - [x] 17.2 Improve timestamp styling

    - Smaller, more subtle timestamps
    - Use text-neutral-400 for less prominence
    - _Requirements: 2.4_
  - [x] 17.3 Write property test for chat message distinction

    - **Property 10: Chat message distinction**
    - **Validates: Requirements 2.1, 2.2**

- [x] 18. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

## Phase 6: College Requirement Enforcement

- [x] 19. Strengthen college selection requirement

  - [x] 19.1 Update useOnboardingGuard hook


    - Check for collegeId in addition to fullName
    - Redirect to /onboarding?step=college if missing
    - _Requirements: 8.1, 8.2_
  - [x] 19.2 Update my-college redirect logic

    - Ensure redirect to onboarding if no college
    - Show clear message about college selection
    - _Requirements: 8.2_
  - [x] 19.3 Write property test for college requirement

    - **Property 8: College requirement enforcement**
    - **Validates: Requirements 8.1, 8.2, 8.3**

- [x] 20. Checkpoint - Ensure all tests pass

  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: Final Polish

- [x] 21. Update remaining card components

  - [x] 21.1 Update FeedItemFactory cards


    - Use paper backgrounds
    - Improve hover states
    - _Requirements: 3.1, 3.3_
  - [x] 21.2 Update sidebar widgets

    - Consistent paper backgrounds
    - Better shadows
    - _Requirements: 3.1, 3.2_

- [x] 22. Final visual audit

  - [x] 22.1 Audit all pages for white backgrounds

    - Replace remaining bg-white with bg-paper
    - _Requirements: 9.1_
  - [x] 22.2 Verify button hover states throughout

    - Ensure all buttons have visible hover feedback
    - _Requirements: 6.1, 6.2_

- [x] 23. Final Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
