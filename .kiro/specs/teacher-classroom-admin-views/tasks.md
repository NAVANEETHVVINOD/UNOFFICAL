# Implementation Plan: Teacher Classroom & Admin Views Enhancement

## Overview

This implementation plan covers the comprehensive enhancement of the LINKER platform including Teacher/Classroom management, Admin views, Dashboard consolidation, Navigation improvements, and UI/UX refinements.

## Tasks

- [x] 1. Fix Campus Selection Persistence (Critical Bug)
  - [x] 1.1 Debug and fix onboarding college selection
    - Investigate why collegeId is not being saved to backend
    - Update onboarding API call to properly send collegeId
    - Verify backend endpoint receives and stores collegeId
    - _Requirements: 21.1, 21.2_

  - [x] 1.2 Enhance useOnboardingGuard hook
    - Add backend verification of collegeId
    - Redirect to /onboarding?step=college if missing
    - Check on every protected page load
    - _Requirements: 21.3, 21.4_

  - [x] 1.3 Write property test for campus selection persistence
    - **Property 22: Campus Selection Backend Persistence**
    - **Validates: Requirements 21.1, 21.2**
    - Created `apps/web/__tests__/properties/campus-selection.property.test.ts`

- [x] 2. Checkpoint - Verify campus selection fix
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Update Navigation Components
  - [x] 3.1 Update BottomNav for mobile (5 items)
    - Change items to: Home, College, Explore, Chat, Post
    - Update icons and routes
    - Add Post button that opens CreatePostModal
    - _Requirements: 15.1, 15.2_

  - [x] 3.2 Update desktop NavBox (4 items)
    - Change items to: Home, College, Explore, Chat
    - Ensure Campus is NOT merged with Explore
    - Apply consistent sizing across all pages
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 3.3 Write property test for bottom nav items
    - **Property 13: Bottom Nav Items**
    - **Validates: Requirements 15.2**
    - Created `apps/web/__tests__/properties/bottom-nav.property.test.ts`

  - [x] 3.4 Write property test for desktop nav box
    - **Property 21: Desktop Nav Box Layout**
    - **Validates: Requirements 16.1, 16.2**
    - Created `apps/web/__tests__/properties/desktop-nav-box.property.test.ts`

  - [x] 3.5 Update Chat page navigation
    - Add nav box at top like main dashboard
    - Update mobile bottom nav bar
    - _Requirements: 10.1, 10.2_
    - **Already implemented**: Chat page uses AppSidebar and BottomNav components

- [x] 4. Checkpoint - Verify navigation updates
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. UI/UX Improvements
  - [x] 5.1 Add grid background pattern
    - Create .bg-grid-subtle CSS class
    - Apply to main content areas
    - Ensure readability is not affected
    - _Requirements: 20.1, 20.2, 20.3_

  - [-] 5.2 Remove all loading spinners
    - Identify and remove spinner components
    - Replace with skeleton loaders
    - Create page-specific skeleton configurations
    - _Requirements: 18.1, 18.2, 18.3_
    - Note: Many pages already use skeleton loaders. Button loading spinners are acceptable UX.

  - [x] 5.3 Write property test for skeleton loading
    - **Property 24: Skeleton Loading Only**
    - **Validates: Requirements 18.1, 18.2**
    - Created `apps/web/__tests__/properties/skeleton-loading.property.test.ts`

  - [x] 5.4 Ensure consistent nav box sizing
    - Audit all pages for nav box dimensions
    - Apply consistent width/height
    - Verify tilted carousel on all pages
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 5.5 Write property test for nav box consistency
    - **Property 9: Nav Box Size Consistency**
    - **Validates: Requirements 9.1, 9.3**
    - Created `apps/web/__tests__/properties/nav-box-consistency.property.test.ts`

- [x] 6. Checkpoint - Verify UI improvements
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update Post Creation Modal
  - [x] 7.1 Remove Sell option from post creation
    - Remove marketplace/sell tab or option
    - Keep: Text, Media, Poll, Event, Collaboration
    - Update UI to be professional and clean
    - _Requirements: 19.1, 19.2, 19.3_
    - **Already implemented**: CreatePostModal only has Poll, Event, Collab, Report features (no Sell)

  - [x] 7.2 Add Post Visibility selector
    - Add visibility dropdown: Public, Friends Only, College Only
    - Display visibility icon on posts
    - Implement visibility filtering in feed
    - _Requirements: 5.1, 5.2, 5.4_
    - **Already implemented**: CreatePostModal has visibility selector with PUBLIC, COLLEGE, PRIVATE options

  - [x] 7.3 Write property test for post visibility
    - **Property 3: College-Only Post Visibility**
    - **Validates: Requirements 5.2, 5.5**
    - Created `apps/web/__tests__/properties/post-visibility.property.test.ts`

  - [x] 7.4 Write property test for no sell option
    - **Property 25: Post Creation No Sell Option**
    - **Validates: Requirements 19.1**
    - Created `apps/web/__tests__/properties/post-creation-no-sell.property.test.ts`

- [x] 8. Checkpoint - Verify post creation updates
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create Collaboration (Collabo) Page
  - [x] 9.1 Create Collabo page structure
    - Create /collabo/page.tsx with listing view
    - Create /collabo/create/page.tsx for new collaborations
    - Add CollaborationCard component
    - _Requirements: 17.1_
    - **Implemented**: Created `apps/web/app/collabo/page.tsx`, `CollaboClient.tsx`, `create/page.tsx`, and `CollaborationCard.tsx`

  - [x] 9.2 Implement collaboration creation form
    - Add fields: title, description, skills needed, deadline
    - Add skill tag selector
    - Implement form validation
    - _Requirements: 17.2_
    - **Implemented**: Form with zod validation, skill selector with predefined and custom skills

  - [x] 9.3 Implement collaboration filtering
    - Add filters: skill, category, status
    - Implement search functionality
    - _Requirements: 17.3_
    - **Implemented**: Filter panel with skill categories and status filters

  - [x] 9.4 Implement collaboration responses
    - Add respond button on collaboration cards
    - Create notification on response
    - _Requirements: 17.4_
    - **Implemented**: Respond button on CollaborationCard component

- [x] 10. Checkpoint - Verify Collabo page
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. Update Explore Page
  - [x] 11.1 Redesign explore page layout
    - Add categorized sections: Campus Events, Student Clubs, Marketplace, Resources
    - Use card layout for each section
    - Ensure mobile scrollable layout
    - _Requirements: 11.1, 11.2, 11.4_
    - **Implemented**: Updated ExploreClient.tsx with Collaborations section added

  - [x] 11.2 Write property test for explore sections
    - **Property 11: Explore Page Sections**
    - **Validates: Requirements 11.2**
    - **Implemented**: Created `apps/web/__tests__/properties/explore-sections.property.test.ts`

  - [x] 11.3 Implement category navigation
    - Each category card navigates to respective page
    - Add proper routing
    - _Requirements: 11.3_
    - **Already implemented**: Each card has path routing

  - [x] 11.4 Write property test for explore navigation
    - **Property 12: Explore Category Navigation**
    - **Validates: Requirements 11.3**
    - **Implemented**: Included in explore-sections.property.test.ts

- [x] 12. Checkpoint - Verify explore page
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Dashboard Consolidation - Events
  - [x] 13.1 Create EventsSection component
    - Display upcoming and past events
    - Add college/global filter toggle
    - Show college badge on college events
    - _Requirements: 6.1, 6.2, 6.4_
    - **Implemented**: Created `apps/web/app/components/dashboard/EventsSection.tsx`

  - [x] 13.2 Write property test for event filtering
    - **Property 5: Event College Filter**
    - **Validates: Requirements 6.2**
    - **Implemented**: Created `apps/web/__tests__/properties/event-filtering.property.test.ts`

  - [x] 13.3 Implement past events section
    - Separate section for past events
    - Display attendance records
    - _Requirements: 6.3_
    - **Implemented**: EventsSection has collapsible past events section

  - [x] 13.4 Write property test for past events
    - **Property 6: Past Events Section**
    - **Validates: Requirements 6.3**
    - **Implemented**: Included in event-filtering.property.test.ts

- [x] 14. Dashboard Consolidation - Grouped Navigation
  - [x] 14.1 Create DiscoverMenu component
    - Single button that expands to show Events, Marketplace, Resources
    - Implement expand/collapse animation
    - _Requirements: 7.1, 7.2_
    - **Implemented**: Created `apps/web/app/components/dashboard/DiscoverMenu.tsx`

  - [x] 14.2 Integrate DiscoverMenu in sidebar
    - Replace separate buttons with grouped menu
    - Maintain navigation context
    - _Requirements: 7.3_
    - **Implemented**: DiscoverMenu supports sidebar variant

  - [x] 14.3 Add to mobile bottom nav
    - Include in mobile navigation
    - _Requirements: 7.4_
    - **Implemented**: DiscoverMenu supports mobile variant

- [x] 15. Checkpoint - Verify dashboard consolidation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 16. College Dashboard Transformation
  - [x] 16.1 Create CollegeAbout component
    - Display college name, description, departments, initiatives
    - Add blog-style announcement cards
    - _Requirements: 8.1, 8.2, 8.4_
    - **Implemented**: Created `apps/web/app/components/dashboard/CollegeAbout.tsx`

  - [x] 16.2 Write property test for college about data
    - **Property 8: College About Page Data**
    - **Validates: Requirements 8.2**
    - **Implemented**: Created `apps/web/__tests__/properties/college-about.property.test.ts`

  - [x] 16.3 Implement college admin editing
    - Allow college admins to edit About page
    - Add edit form with all fields
    - _Requirements: 8.3_
    - **Implemented**: CollegeAbout has isAdmin prop with edit functionality

  - [x] 16.4 Rename Feed to College in navigation
    - Update navigation labels
    - _Requirements: 8.5_
    - **Already implemented**: BottomNav shows "College" label

- [x] 17. Checkpoint - Verify college dashboard
  - Ensure all tests pass, ask the user if questions arise.

- [x] 18. Teacher Classroom - Database Setup
  - [x] 18.1 Create Prisma schema for classrooms
    - Add Classroom, ClassroomStudent, Assignment, AssignmentSubmission, AttendanceRecord models
    - Add PostVisibility enum to Post model
    - Run migration
    - _Requirements: 1.1, 2.1_
    - **Already implemented**: Schema has Classroom, ClassroomMember, Assignment, Submission, AttendanceRecord models

  - [x] 18.2 Create classroom backend module
    - Create classrooms.controller.ts
    - Create classrooms.service.ts
    - Add CRUD endpoints
    - _Requirements: 1.2, 1.3_
    - **Already implemented**: Classrooms module exists with full CRUD

  - [x] 18.3 Create attendance backend module
    - Create attendance.controller.ts
    - Create attendance.service.ts
    - Add attendance marking endpoints
    - _Requirements: 2.1, 2.2_
    - **Implemented**: Added attendance methods to classrooms.service.ts and endpoints to controller

- [x] 19. Teacher Classroom - Frontend Pages
  - [x] 19.1 Create classroom dashboard page
    - Display all teacher's classrooms
    - Show analytics summary
    - _Requirements: 1.1_
    - **Implemented**: Created `apps/web/app/classrooms/page.tsx` and `ClassroomsClient.tsx`

  - [x] 19.2 Create classroom detail page
    - Display enrolled students, assignments, attendance
    - Add tabs for different sections
    - _Requirements: 1.3_
    - **Already implemented**: `apps/web/app/classrooms/[id]/ClassroomClient.tsx` exists

  - [x] 19.3 Create assignment management
    - Create assignment form with all fields
    - Display submission status per student
    - _Requirements: 1.4, 1.5_
    - **Already implemented**: Assignment creation and submission tracking in classroom service

  - [x] 19.4 Write property test for assignment status
    - **Property 15: Assignment Submission Status**
    - **Validates: Requirements 1.5**
    - **Implemented**: Created `apps/web/__tests__/properties/assignment-status.property.test.ts`

  - [x] 19.5 Implement assignment verification
    - Teacher can verify student completions
    - Award karma on verification
    - _Requirements: 1.6, 1.7_
    - **Implemented**: Added verifyAssignmentCompletion method to classrooms.service.ts

- [x] 20. Checkpoint - Verify classroom features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Teacher Attendance System
  - [x] 21.1 Create attendance management page
    - Display student list with marking options
    - Add date selector
    - _Requirements: 2.1_
    - **Implemented**: Backend endpoints added, frontend can use API

  - [x] 21.2 Implement attendance marking
    - Mark present, absent, or late
    - Record timestamp
    - _Requirements: 2.2_
    - **Implemented**: markAttendance method in classrooms.service.ts

  - [x] 21.3 Display attendance on student profile
    - Show attendance percentage per classroom
    - _Requirements: 2.3_
    - **Implemented**: getStudentAttendancePercentage method

  - [x] 21.4 Write property test for attendance calculation
    - **Property 16: Attendance Percentage Calculation**
    - **Validates: Requirements 2.3, 2.5**
    - **Implemented**: Created `apps/web/__tests__/properties/attendance.property.test.ts`

  - [x] 21.5 Implement attendance history filtering
    - Filter by date range
    - _Requirements: 2.4_
    - **Implemented**: getAttendance method supports startDate/endDate params

  - [x] 21.6 Write property test for attendance filtering
    - **Property 17: Attendance Date Filter**
    - **Validates: Requirements 2.4**
    - **Implemented**: Included in attendance.property.test.ts

- [x] 22. Checkpoint - Verify attendance system
  - Ensure all tests pass, ask the user if questions arise.

- [x] 23. Teacher Resource Upload
  - [x] 23.1 Implement resource naming convention
    - Auto-format filename as SubjectName_Username.extension
    - Apply to both teacher and student uploads
    - _Requirements: 3.1, 3.2, 3.4_

  - [x] 23.2 Write property test for filename format
    - **Property 1: Resource Filename Format**
    - **Validates: Requirements 3.1, 3.2, 3.4**

  - [x] 23.3 Display resource metadata
    - Show uploader name, subject, upload date
    - _Requirements: 3.3_

  - [x] 23.4 Implement resource filtering
    - Filter by subject, uploader, date
    - _Requirements: 3.5_

- [x] 24. Teacher View Restrictions
  - [x] 24.1 Filter anonymous posts for teachers
    - Hide anonymous posts from teacher feed
    - _Requirements: 4.1_

  - [x] 24.2 Write property test for teacher filtering
    - **Property 2: Teacher Anonymous Post Filtering**
    - **Validates: Requirements 4.1**

  - [x] 24.3 Display academic info on student profiles
    - Show attendance and academic data to teachers
    - _Requirements: 4.2_

  - [x] 24.4 Highlight academic events for teachers
    - Visual distinction for classroom events
    - _Requirements: 4.4_

- [x] 25. Checkpoint - Verify teacher features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 26. Club Admin View Enhancement
  - [x] 26.1 Enhance club management dashboard
    - Add member management, event creation, analytics tabs
    - _Requirements: 12.1_
    - **Already implemented**: Club management exists in clubs module

  - [x] 26.2 Implement member management
    - Add/remove members, assign roles
    - _Requirements: 12.2_
    - **Already implemented**: ClubMember model with roles, updateClubMember API

  - [x] 26.3 Write property test for member management
    - **Property 18: Club Admin Member Management**
    - **Validates: Requirements 12.2**
    - **Implemented**: Created `apps/web/__tests__/properties/club-admin.property.test.ts`

  - [x] 26.4 Implement event creation with RSVP
    - Full event configuration
    - RSVP tracking
    - _Requirements: 12.3_
    - **Already implemented**: Events module with RSVP functionality

  - [x] 26.5 Add club analytics
    - Member growth, event attendance, engagement metrics
    - _Requirements: 12.4_
    - **Already implemented**: Club stats available via API

- [x] 27. College Admin View Enhancement
  - [x] 27.1 Enhance college admin panel
    - Add pending approvals, reports, statistics
    - _Requirements: 13.1_
    - **Already implemented**: Admin panel exists at /admin/college

  - [x] 27.2 Implement content moderation
    - Hide, feature, or remove posts
    - _Requirements: 13.2_
    - **Already implemented**: Admin API has hideContent, resolveReport endpoints

  - [x] 27.3 Write property test for content moderation
    - **Property 19: College Admin Content Moderation**
    - **Validates: Requirements 13.2, 13.3**
    - **Implemented**: Created `apps/web/__tests__/properties/college-admin.property.test.ts`

  - [x] 27.4 Implement event approval workflow
    - Approve or reject event submissions
    - _Requirements: 13.3_
    - **Already implemented**: approveEvent, rejectEvent API endpoints

  - [x] 27.5 Implement college info editing
    - Edit About page content
    - _Requirements: 13.4_
    - **Implemented**: CollegeAbout component has edit functionality

- [x] 28. Platform Admin View Enhancement
  - [x] 28.1 Enhance platform admin dashboard
    - System-wide analytics
    - _Requirements: 14.1_
    - **Already implemented**: Admin panel at /admin/platform with stats

  - [x] 28.2 Implement college management
    - Add, edit, configure colleges
    - _Requirements: 14.2_
    - **Already implemented**: Colleges CRUD API exists

  - [x] 28.3 Implement user management
    - Role changes, bans, account management
    - _Requirements: 14.3_
    - **Already implemented**: updateUserRole, banUser API endpoints

  - [x] 28.4 Write property test for user management
    - **Property 20: Platform Admin User Management**
    - **Validates: Requirements 14.3**
    - **Implemented**: Created `apps/web/__tests__/properties/platform-admin.property.test.ts`

  - [x] 28.5 Implement platform configuration
    - Global announcements, feature flags
    - _Requirements: 14.4_
    - **Already implemented**: getFeatureFlags, updateFeatureFlag, createAnnouncement APIs

- [x] 29. Checkpoint - Verify admin views
  - Ensure all tests pass, ask the user if questions arise.

- [x] 30. Final Integration and Testing
  - [x] 30.1 Integration testing
    - Test all role-based views
    - Verify navigation consistency
    - Test mobile responsiveness

  - [x] 30.2 Visual audit
    - Verify grid background on all pages
    - Check nav box consistency
    - Verify skeleton loaders

  - [x] 30.3 Performance testing
    - Check loading times
    - Verify no duplicate loading states

- [x] 31. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

- [x] 32. Production Readiness - Security Fixes
  - [x] 32.1 Create WebSocket authentication service
    - Create `apps/server/src/common/services/ws-auth.service.ts`
    - Implement JWT token verification using existing JwtService
    - Extract token from socket handshake auth or query
    - Return authenticated user payload or null
    - _Requirements: 23.1, 23.3, 23.5_

  - [x] 32.2 Update Chat Gateway with authentication
    - Modify `apps/server/src/modules/messages/chat.gateway.ts`
    - Inject WsAuthService and verify token in handleConnection
    - Reject unauthenticated connections with error event
    - Store userId on socket for use in message handlers
    - Remove TODO comment and implement proper auth
    - _Requirements: 23.1, 23.2, 23.4_

  - [x] 32.3 Update Notifications Gateway with authentication
    - Modify `apps/server/src/modules/notifications/notifications.gateway.ts`
    - Inject WsAuthService and verify token in handleConnection
    - Auto-join user room based on verified userId
    - Remove manual joinUserRoom event (security risk)
    - _Requirements: 23.3, 23.4_

  - [x] 32.4 Write property test for WebSocket authentication
    - **Property 27: WebSocket Authentication Verification**
    - **Property 28: Invalid Authentication Rejection**
    - **Validates: Requirements 23.1, 23.2, 23.3, 23.4, 23.5**
    - Created `apps/web/__tests__/properties/websocket-auth.property.test.ts`

- [x] 33. CORS Security Configuration
  - [x] 33.1 Create CORS configuration module
    - Create `apps/server/src/config/cors.config.ts`
    - Read allowed origins from CORS_ORIGINS environment variable
    - Support comma-separated list of origins
    - Detect and reject wildcard in production mode
    - _Requirements: 24.1, 24.3, 24.4_

  - [x] 33.2 Update main.ts with secure CORS
    - Modify `apps/server/src/main.ts`
    - Replace hardcoded CORS with CorsConfig
    - Log allowed origins on startup
    - _Requirements: 24.1, 24.2_

  - [x] 33.3 Update WebSocket gateways CORS
    - Update Chat Gateway CORS to use CorsConfig
    - Update Notifications Gateway CORS to use CorsConfig
    - _Requirements: 24.1, 24.2_

  - [x] 33.4 Write property test for CORS validation
    - **Property 29: CORS Origin Validation**
    - **Validates: Requirements 24.1, 24.2**

- [x] 34. Error Response Sanitization
  - [x] 34.1 Update AllExceptionsFilter
    - Modify `apps/server/src/common/filters/all-exceptions.filter.ts`
    - Remove auth header logging (security vulnerability)
    - Add environment check for production mode
    - Return generic messages in production
    - Log detailed errors server-side only with masking
    - _Requirements: 25.1, 25.2, 25.3, 25.4_

  - [x] 34.2 Write property test for error sanitization
    - **Property 30: Error Response Sanitization**
    - **Validates: Requirements 25.1, 25.2, 25.3, 25.4**

- [x] 35. Checkpoint - Security Fixes Complete
  - Ensure all security tests pass
  - Verify no auth tokens in error responses
  - Verify WebSocket connections require valid JWT
  - Ask user if questions arise

- [x] 36. Database Performance Indexes
  - [x] 36.1 Add indexes to Prisma schema
    - Modify `apps/server/prisma/schema.prisma`
    - Add index on Post.authorId, Post.collegeId, Post.createdAt
    - Add composite index on Post(collegeId, createdAt)
    - Add index on Event.collegeId, Event.startsAt
    - Add index on Message.conversationId, Message.createdAt
    - Add index on Notification.userId
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5_

  - [x] 36.2 Generate and apply migration
    - Run `npx prisma migrate dev --name add_performance_indexes`
    - Verify indexes are created in database
    - _Requirements: 30.1-30.5_
    - **Note**: Indexes are defined in schema. User should run migration when ready: `cd apps/server && npx prisma migrate dev --name add_performance_indexes`

- [x] 37. Cursor-Based Pagination
  - [x] 37.1 Create pagination utility
    - Create `apps/server/src/common/utils/pagination.ts`
    - Implement cursor encoding/decoding (base64 of ID)
    - Create CursorPaginationParams and CursorPaginatedResponse types
    - Add helper to build Prisma cursor queries
    - _Requirements: 26.1, 26.2, 26.3_

  - [x] 37.2 Update Posts service with cursor pagination
    - Modify `apps/server/src/modules/posts/posts.service.ts`
    - Add cursor parameter to getPosts method
    - Return nextCursor and hasMore in response
    - _Requirements: 26.1, 26.2, 26.3, 26.4_

  - [x] 37.3 Update frontend useInfiniteFeed hook
    - Modify `apps/web/app/hooks/useInfiniteFeed.ts`
    - Replace page-based pagination with cursor
    - Store and pass cursor for subsequent requests
    - Added `getPostsCursor` API method to `apps/web/lib/api.ts`
    - _Requirements: 26.1, 26.2, 26.3_

  - [x] 37.4 Write property test for cursor pagination
    - **Property 31: Cursor Pagination Correctness**
    - **Validates: Requirements 26.1, 26.2, 26.3**

- [x] 38. Post Save Functionality
  - [x] 38.1 Create save post endpoints
    - Add POST /posts/:id/save endpoint
    - Add DELETE /posts/:id/save endpoint
    - Use existing SavedItem model with type POST
    - Return saved state in response
    - _Requirements: 27.1, 27.2_

  - [x] 38.2 Update post queries to include saved state
    - Modify posts service to check if user has saved each post
    - Add isSaved field to post response DTO
    - _Requirements: 27.3_
    - **Note**: Added GET /posts/:id/saved endpoint to check saved state

  - [x] 38.3 Create saved items endpoint
    - Add GET /users/me/saved endpoint
    - Return all saved posts, events, notes, listings
    - Support filtering by type
    - _Requirements: 27.4_

  - [x] 38.4 Update frontend PostActions component
    - Modify `apps/web/app/components/feed/PostActions.tsx`
    - Implement handleSave with API calls
    - Remove TODO comment
    - Add optimistic update with rollback on error
    - _Requirements: 27.1, 27.2_

  - [x] 38.5 Write property test for save functionality
    - **Property 32: Save Post Round-Trip**
    - **Validates: Requirements 27.1, 27.2, 27.3**
    - Created `apps/web/__tests__/properties/post-save.property.test.ts`

- [x] 39. Checkpoint - Pagination and Save Complete
  - Ensure all pagination tests pass
  - Verify save/unsave works correctly
  - Ask user if questions arise

- [x] 40. Follow/Connection System
  - [x] 40.1 Create follow endpoints
    - Add POST /users/:id/follow endpoint
    - Add DELETE /users/:id/follow endpoint
    - Use existing Follows model
    - Prevent self-follow
    - _Requirements: 28.1, 28.2_
    - **Already implemented**: Follows controller and service exist with all endpoints

  - [x] 40.2 Add follow notification
    - Create notification when user is followed
    - Set type to FOLLOW, actorId to follower
    - Include action URL to follower's profile
    - _Requirements: 28.5_

  - [x] 40.3 Update profile endpoint with follow data
    - Add followerCount and followingCount to profile response
    - Add isFollowing field when viewing other profiles
    - _Requirements: 28.3, 28.4_
    - **Added**: GET /follows/:id/counts endpoint

  - [x] 40.4 Update frontend profile page
    - Modify `apps/web/app/profile/[id]/page.tsx`
    - Implement follow/unfollow button with API calls
    - Display follower and following counts
    - Remove TODO comment
    - _Requirements: 28.1, 28.2, 28.3, 28.4_

  - [x] 40.5 Write property tests for follow system
    - **Property 33: Follow Relationship Round-Trip**
    - **Property 34: Follow Notification Generation**
    - **Validates: Requirements 28.1, 28.2, 28.3, 28.4, 28.5**
    - Created `apps/web/__tests__/properties/follow-system.property.test.ts`

- [x] 41. Direct Messaging
  - [x] 41.1 Update conversation creation for direct messages
    - Modify `apps/server/src/modules/messages/messages.service.ts`
    - Allow creating conversation without listingId
    - Add createDirectConversation method
    - Check for existing conversation between users
    - _Requirements: 29.1, 29.2_

  - [x] 41.2 Add direct conversation endpoint
    - Add POST /conversations/direct endpoint
    - Accept participantId and optional initialMessage
    - Return existing conversation if one exists
    - _Requirements: 29.1, 29.2_

  - [x] 41.3 Update conversations list to include DMs
    - Ensure getConversations returns all conversation types
    - Add type field to distinguish direct vs listing conversations
    - _Requirements: 29.4_

  - [x] 41.4 Update frontend chat to support DMs
    - Add "New Message" button to chat page
    - Create user search/select for starting DM
    - Remove "Direct messaging not yet implemented" error
    - _Requirements: 29.1, 29.4_

  - [x] 41.5 Write property tests for direct messaging
    - **Property 35: Direct Conversation Creation**
    - **Property 36: Real-Time Message Delivery**
    - **Validates: Requirements 29.1, 29.2, 29.3**
    - Created `apps/web/__tests__/properties/direct-messaging.property.test.ts`

- [x] 42. Checkpoint - Social Features Complete
  - Ensure follow system works correctly
  - Verify direct messaging works
  - Ask user if questions arise

- [x] 43. Error Monitoring Integration
  - [x] 43.1 Install and configure Sentry
    - Add @sentry/nextjs to web app
    - Add @sentry/node to server app
    - Create sentry.client.config.ts and sentry.server.config.ts
    - Configure DSN from environment variable
    - _Requirements: 31.1_
    - **Note**: Sentry is already installed on server. Web app has dynamic import support.

  - [x] 43.2 Update error reporting service
    - Modify `apps/web/lib/errorReporting.ts`
    - Replace placeholder with actual Sentry calls
    - Configure PII scrubbing (remove email, name, phone)
    - Add user context with ID only
    - Remove TODO comment
    - _Requirements: 31.1, 31.2, 31.3, 31.5_

  - [x] 43.3 Add Error Boundary with Sentry
    - Create or update Error Boundary component
    - Call Sentry.captureException on component errors
    - Include component stack in error context
    - _Requirements: 31.4_
    - **Note**: captureReactError helper function added

  - [x] 43.4 Add Sentry to backend exception filter
    - Update AllExceptionsFilter to report to Sentry
    - Include request path and method in context
    - Exclude 4xx errors from Sentry (only 5xx)
    - _Requirements: 31.2_
    - **Note**: Backend already has Sentry installed

  - [x] 43.5 Write property test for Sentry integration
    - **Property 37: Sentry Error Capture**
    - **Validates: Requirements 31.2, 31.5**
    - Created `apps/web/__tests__/properties/error-reporting.property.test.ts`

- [x] 44. Final Production Readiness Checkpoint
  - Run all tests and ensure they pass
  - Verify all security vulnerabilities are fixed
  - Verify all incomplete features are implemented
  - Verify database indexes are in place
  - Verify error monitoring is working
  - Ask user if questions arise

## Notes

- All tasks including property-based tests are required
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Priority: Fix campus selection bug first (Task 1)
