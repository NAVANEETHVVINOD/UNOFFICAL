# Implementation Plan: Navigation & Explore Page Redesign

## Overview

This plan implements the navigation redesign with consistent NavBox across pages, a new college information page, and a simplified explore page with 4 feature cards.

## Tasks

- [x] 1. Update CategoryRibbon component with variant support
  - [x] 1.1 Add variant prop to CategoryRibbon component
    - Add `variant?: 'global' | 'college'` prop
    - Define GLOBAL_CATEGORIES array (Home, Explore, Chat, College)
    - Define COLLEGE_CATEGORIES array (Home, College, Clubs)
    - Render appropriate items based on variant
    - Remove any rotation/tilt transforms
    - _Requirements: 1.1, 1.2, 1.1.1, 1.2.1_

  - [x] 1.2 Write property test for NavBox item count
    - **Property 2: NavBox Item Count by Context**
    - **Validates: Requirements 1.1.1, 1.2.1**

- [x] 2. Create CollegeInfo component
  - [x] 2.1 Create new CollegeInfo component
    - Create `apps/web/app/colleges/[slug]/CollegeInfo.tsx`
    - Display college name, logo/icon prominently
    - Display location (city, state)
    - Display description
    - Display statistics (members, clubs, events, notes)
    - Add quick action links to events, marketplace, clubs
    - Make mobile-responsive
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 2.2 Update college page to use CollegeInfo
    - Update `apps/web/app/colleges/[slug]/page.tsx`
    - Replace CollegeFeed with CollegeInfo
    - Add CategoryRibbon with variant='college'
    - Fetch college stats
    - _Requirements: 3.1, 1.2.1_

- [x] 3. Checkpoint - Verify college page works
  - Ensure college page displays correctly
  - Ensure NavBox shows 3 items on college page
  - Ask the user if questions arise

- [x] 4. Redesign Explore page
  - [x] 4.1 Update ExploreClient with 4 cards only
    - Update `apps/web/app/explore/ExploreClient.tsx`
    - Keep only: Events, Marketplace, Collaborations, Resources
    - Remove: Clubs, Colleges cards
    - Update grid to 2x2 on mobile, flexible on desktop
    - Ensure cards have consistent styling
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9_

  - [x] 4.2 Write property test for Explore card count
    - **Property 4: Explore Page Card Count**
    - **Validates: Requirements 4.1**

- [x] 5. Update NavBox on global pages
  - [x] 5.1 Update Dashboard to use global variant NavBox
    - Ensure CategoryRibbon uses variant='global' (default)
    - Verify 4 items: Home, Explore, Chat, College
    - _Requirements: 1.1.1_

  - [x] 5.2 Update Explore page NavBox
    - Ensure CategoryRibbon uses variant='global'
    - _Requirements: 1.1.1_

  - [x] 5.3 Update Messages page NavBox
    - Ensure CategoryRibbon uses variant='global'
    - _Requirements: 1.1.1_

- [x] 6. Update NavBox on college-related pages
  - [x] 6.1 Update Clubs page to use college variant NavBox
    - Add CategoryRibbon with variant='college'
    - Verify 3 items: Home, College, Clubs
    - _Requirements: 1.2.1_

- [-] 7. Final checkpoint - Ensure all tests pass
  - Build the project
  - Run property tests
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
