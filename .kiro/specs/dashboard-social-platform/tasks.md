# Implementation Plan

- [x] 1. Fix Vercel Build Error and Setup

  - [x] 1.1 Fix TypeScript error in MessagesClient.tsx

    - Fix the `name` possibly undefined error on line 235
    - Ensure proper null coalescing for name variable
    - _Requirements: 10.4_
  - [x] 1.2 Update Tailwind config with new design tokens


    - Add `rounded-card` (12px), `rounded-card-lg` (16px), `rounded-card-xl` (20px) border-radius utilities
    - Add hover color variants (`hover-primary: #E6D435`, `hover-muted: #D4C92F`)
    - Add `bg-dots-subtle` background pattern
    - _Requirements: 1.1, 6.1, 4.1_

- [x] 2. Card Edge Styling Updates
  - [x] 2.1 Update ProfileSidebar with curved edges
    - Replace sharp borders with `rounded-xl` (12px+) on all card containers
    - Apply consistent border-radius to Quick Actions and Trending widgets
    - _Requirements: 1.1, 1.3_

  - [x] 2.2 Update FeedItemFactory with curved edges
    - Apply `rounded-xl` to all feed card types (posts, polls, events)
    - Ensure consistent styling across different post types
    - _Requirements: 1.1, 1.2_

  - [ ] 2.3 Write property test for card border radius consistency
    - **Property 1: Card Border Radius Consistency**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4**

- [x] 3. Carousel/Ticker Redesign


  - [x] 3.1 Redesign TiltedTicker with black/yellow theme

    - Change background to black (`bg-ink`)
    - Change text to yellow (`text-primary`)
    - Increase height with `py-2.5`
    - Add `//` decorative separators between items
    - Use bold uppercase typography
    - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 4. Mobile Navigation Improvements
  - [x] 4.1 Hide CategoryRibbon on mobile
    - Add `hidden md:flex` to CategoryRibbon container
    - Ensure ArcMenu remains visible on mobile for navigation
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 4.2 Write property test for responsive visibility
    - **Property 2: CategoryRibbon Responsive Visibility**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 5. Background and Header Styling
  - [x] 5.1 Add dot pattern to main content background
    - Create subtle dot pattern CSS in globals.css
    - Apply to main content area in DashboardClient
    - Keep header with solid background (no dots)
    - _Requirements: 4.1, 4.4_

  - [x] 5.2 Verify sticky header behavior
    - Ensure header has `fixed top-0 z-50`
    - Verify main content has proper top padding (`pt-16 md:pt-20`)
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 5.3 Write property test for sticky header
    - **Property 3: Sticky Header Behavior**
    - **Validates: Requirements 5.1, 5.2, 5.4**

- [x] 6. Color Accessibility Improvements
  - [x] 6.1 Update hover states to use accessible colors
    - Replace bright yellow hover states with darker shades
    - Update button hover colors in globals.css
    - Apply to all interactive elements
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 6.2 Replace pure white backgrounds with cream/paper tones
    - Update `bg-white` usages to `bg-paper` or `bg-paper-light`
    - Update input backgrounds to `bg-input-bg`
    - Ensure sufficient contrast for readability
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ] 6.3 Write property test for hover color accessibility
    - **Property 4: Hover Color Accessibility**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**

  - [ ] 6.4 Write property test for background color accessibility
    - **Property 5: Background Color Accessibility**
    - **Validates: Requirements 7.1, 7.2, 7.3**

- [ ] 7. Checkpoint - Verify styling changes
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Unified Post Creation Modal
  - [x] 8.1 Redesign CreatePostModal with unified interface
    - Remove separate tabs for Post/Poll/Market/Event/Collab/Report
    - Create single text input area with optional feature toggles
    - Add toggle buttons for: Poll, Event, Collaboration, Report
    - Remove Market/Sell option entirely
    - Apply curved edges (`rounded-xl`) to modal
    - _Requirements: 8.1, 8.6, 8.7_

  - [x] 8.2 Implement poll attachment feature
    - Add collapsible poll section when toggle is enabled
    - Allow adding question and multiple choice options
    - _Requirements: 8.2_

  - [x] 8.3 Implement event attachment feature
    - Add collapsible event section when toggle is enabled
    - Include date, time, and location fields
    - _Requirements: 8.3_

  - [x] 8.4 Implement collaboration attachment feature
    - Add collapsible collaboration section when toggle is enabled
    - Include title, skills needed, and description
    - _Requirements: 8.4_

  - [x] 8.5 Implement report/feedback attachment feature
    - Add collapsible report section when toggle is enabled
    - Include category selection dropdown
    - _Requirements: 8.5_

  - [ ] 8.6 Write property test for marketplace exclusion
    - **Property 8: Post Creation Marketplace Exclusion**
    - **Validates: Requirements 8.6**

- [x] 9. Search Functionality Fix
  - [x] 9.1 Fix GlobalSearch "000" error display
    - Identify and remove any debug output causing "000"
    - Add proper error handling for search failures
    - Ensure clean empty state when no query
    - _Requirements: 9.1, 9.4_

  - [x] 9.2 Improve search result display
    - Ensure user results show profile info (name, college, mutual connections)
    - Verify navigation to correct profile/content pages
    - _Requirements: 9.2, 9.3_

  - [ ] 9.3 Write property test for search navigation
    - **Property 6: Search Result Navigation**
    - **Validates: Requirements 9.2, 9.3**

- [x] 10. Profile Messaging Integration
  - [x] 10.1 Add message button to user profile page
    - Display message button on other users' profiles
    - Style consistently with profile design
    - _Requirements: 10.1_

  - [x] 10.2 Implement message button functionality
    - Create or open conversation when clicked
    - Send notification to recipient
    - Navigate to conversation view
    - _Requirements: 10.2, 10.3_

  - [x] 10.3 Add profile link in message conversation header
    - Display other user's avatar and name in conversation header
    - Make avatar/name clickable to navigate to profile
    - _Requirements: 10.4, 10.5_

  - [ ] 10.4 Write property test for messaging flow
    - **Property 7: Profile Messaging Flow**
    - **Validates: Requirements 10.2, 10.3, 10.5**

- [ ] 11. Final Checkpoint - Verify all changes
  - Ensure all tests pass, ask the user if questions arise.
  - Build and test the application
  - Verify Vercel deployment succeeds
