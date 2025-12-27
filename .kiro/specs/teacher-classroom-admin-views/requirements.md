# Requirements Document

## Introduction

This specification covers a comprehensive enhancement of the LINKER platform focusing on: Teacher/Classroom management features (Google Classroom-like functionality), Admin views for Club Admin, College Admin, Platform Admin, and Teacher roles, Dashboard consolidation (merging feed, events, marketplace, resources into unified views), Navigation improvements (tilted carousel, consistent nav boxes), and College Dashboard transformation with an About page. The goal is to create a professional, cohesive platform with role-specific views and streamlined navigation.

## Glossary

- **LINKER**: The campus social platform application
- **Teacher**: User role with classroom management capabilities
- **Classroom**: A virtual space where teachers can manage students, assignments, and attendance
- **Assignment**: A task created by a teacher for students to complete
- **Attendance**: Daily tracking of student presence in a classroom
- **College Dashboard**: The college-specific view showing college information and content
- **Global Dashboard**: The main feed page accessible to all users
- **Post Visibility**: Privacy setting for posts (Public, Friends Only, College Only)
- **Nav Box**: Navigation card/button in the sidebar or navigation area
- **Tilted Carousel**: The scrolling announcement ticker with tilted design
- **RSVP**: Response to event invitation (Going/Interested/Not Going)
- **Anonymous Post**: A post where the author's identity is hidden

## Requirements

### Requirement 1: Teacher Classroom Management

**User Story:** As a teacher, I want to create and manage classrooms like Google Classroom, so that I can organize students, assign tasks, and track progress.

#### Acceptance Criteria

1. WHEN a teacher accesses the classroom section THEN the System SHALL display a dashboard with all their classrooms and analytics
2. WHEN a teacher creates a classroom THEN the System SHALL allow setting name, description, subject, and student enrollment method
3. WHEN a teacher views a classroom THEN the System SHALL display enrolled students, assignments, and attendance records
4. WHEN a teacher creates an assignment THEN the System SHALL allow setting title, description, due date, attachments, and point value
5. WHEN a teacher views assignments THEN the System SHALL display submission status for each student
6. WHEN a student marks an assignment as complete THEN the System SHALL notify the teacher for verification
7. WHEN a teacher verifies a completion THEN the System SHALL update the student's progress and award karma points

### Requirement 2: Daily Attendance System

**User Story:** As a teacher, I want to mark daily attendance for my classroom, so that students can track their attendance percentage.

#### Acceptance Criteria

1. WHEN a teacher opens attendance THEN the System SHALL display a list of enrolled students with attendance marking options
2. WHEN a teacher marks attendance THEN the System SHALL record present, absent, or late status with timestamp
3. WHEN a student views their profile THEN the System SHALL display their attendance percentage per classroom
4. WHEN viewing attendance history THEN the System SHALL show daily records with filtering by date range
5. WHEN attendance is marked THEN the System SHALL calculate and update the student's overall attendance percentage

### Requirement 3: Teacher Resource Upload

**User Story:** As a teacher, I want to upload notes and resources with proper naming conventions, so that students can easily find materials.

#### Acceptance Criteria

1. WHEN a teacher uploads a resource THEN the System SHALL require subject name and auto-append username to filename
2. WHEN a resource is uploaded THEN the System SHALL format the filename as "SubjectName_Username.pdf"
3. WHEN viewing resources THEN the System SHALL display uploader name, subject, and upload date
4. WHEN a student uploads a note THEN the System SHALL also apply the naming convention
5. WHEN searching resources THEN the System SHALL allow filtering by subject, uploader, and date

### Requirement 4: Teacher View Restrictions

**User Story:** As a teacher, I want a filtered view of the platform, so that I only see appropriate content for my role.

#### Acceptance Criteria

1. WHEN a teacher views the feed THEN the System SHALL NOT display anonymous posts
2. WHEN a teacher views student profiles THEN the System SHALL display academic information and attendance
3. WHEN a teacher accesses classroom features THEN the System SHALL display management tools
4. WHEN a teacher views events THEN the System SHALL highlight academic and classroom-related events

### Requirement 5: Post Visibility Options

**User Story:** As a user, I want to control who sees my posts, so that I can share content with specific audiences.

#### Acceptance Criteria

1. WHEN creating a post THEN the System SHALL display visibility options: Public, Friends Only, College Only
2. WHEN selecting College Only THEN the System SHALL restrict visibility to users from the same college
3. WHEN filtering the global feed THEN the System SHALL allow filtering for "College Only" posts
4. WHEN viewing a post THEN the System SHALL display a visibility indicator icon
5. WHEN a user from a different college views the feed THEN the System SHALL NOT display College Only posts from other colleges

### Requirement 6: Dashboard Consolidation - Events

**User Story:** As a user, I want events integrated into the global dashboard, so that I can see all events in one place with filtering options.

#### Acceptance Criteria

1. WHEN viewing the global dashboard THEN the System SHALL display an events section with upcoming and past events
2. WHEN filtering events THEN the System SHALL allow filtering by College Events and Global Events
3. WHEN viewing past events THEN the System SHALL display them in a separate section with attendance records
4. WHEN an event is college-specific THEN the System SHALL display a college badge on the event card
5. WHEN viewing the events section THEN the System SHALL maintain professional UI/UX with proper spacing and hierarchy

### Requirement 7: Dashboard Consolidation - Grouped Navigation

**User Story:** As a user, I want Marketplace, Resources, and Events grouped into a single navigation button, so that navigation is simplified.

#### Acceptance Criteria

1. WHEN viewing the global dashboard sidebar THEN the System SHALL display a single "Discover" or "More" button
2. WHEN clicking the grouped button THEN the System SHALL expand to show Events, Marketplace, and Resources options
3. WHEN navigating to a sub-section THEN the System SHALL maintain the grouped navigation context
4. WHEN on mobile THEN the System SHALL display the grouped navigation in the bottom nav menu

### Requirement 8: College Dashboard Transformation

**User Story:** As a user, I want the college dashboard to show college information instead of a feed, so that I can learn about my college.

#### Acceptance Criteria

1. WHEN viewing the college dashboard THEN the System SHALL display an "About" section instead of a feed
2. WHEN viewing the About section THEN the System SHALL display college name, description, departments, and initiatives
3. WHEN a college admin edits the About page THEN the System SHALL allow updating all college information
4. WHEN viewing the college page THEN the System SHALL display blog-style cards for announcements and updates
5. WHEN the college page loads THEN the System SHALL rename the "Feed" button to "College" in navigation

### Requirement 9: Navigation Box Consistency

**User Story:** As a user, I want consistent navigation boxes across all pages, so that the interface feels cohesive.

#### Acceptance Criteria

1. WHEN displaying nav boxes THEN the System SHALL use the same size and styling across all pages
2. WHEN displaying the carousel/ticker THEN the System SHALL apply a slight tilt angle consistently
3. WHEN viewing different pages THEN the System SHALL maintain nav box dimensions and spacing
4. WHEN on mobile THEN the System SHALL adapt nav boxes to appropriate mobile sizes

### Requirement 10: Chat Page Navigation Update

**User Story:** As a user, I want the chat page navigation to match the main dashboard, so that the experience is consistent.

#### Acceptance Criteria

1. WHEN viewing the chat page THEN the System SHALL display the nav box at the top like the main dashboard
2. WHEN viewing the chat page on mobile THEN the System SHALL display the updated bottom nav bar
3. WHEN navigating from chat THEN the System SHALL maintain consistent navigation behavior

### Requirement 11: Explore Page Content Update

**User Story:** As a user, I want the explore page to display relevant discovery content, so that I can find interesting content and communities.

#### Acceptance Criteria

1. WHEN viewing the explore page THEN the System SHALL display categorized content sections
2. WHEN viewing explore THEN the System SHALL show Campus Events, Student Clubs, Marketplace, and Resources sections
3. WHEN clicking a category THEN the System SHALL navigate to the respective detailed view
4. WHEN on mobile THEN the System SHALL display explore content in a scrollable card layout

### Requirement 12: Club Admin View

**User Story:** As a club admin, I want a comprehensive management view, so that I can effectively manage my club.

#### Acceptance Criteria

1. WHEN a club admin accesses their club THEN the System SHALL display a management dashboard
2. WHEN managing members THEN the System SHALL allow adding, removing, and assigning roles
3. WHEN creating events THEN the System SHALL allow full event configuration with RSVP tracking
4. WHEN viewing analytics THEN the System SHALL display member growth, event attendance, and engagement metrics

### Requirement 13: College Admin View

**User Story:** As a college admin, I want a comprehensive moderation view, so that I can manage college-level content and users.

#### Acceptance Criteria

1. WHEN a college admin accesses the admin panel THEN the System SHALL display pending approvals and reports
2. WHEN moderating content THEN the System SHALL allow hiding, featuring, or removing posts
3. WHEN managing events THEN the System SHALL allow approving or rejecting event submissions
4. WHEN editing college info THEN the System SHALL allow updating the About page content

### Requirement 14: Platform Admin View

**User Story:** As a platform admin, I want full system access, so that I can manage the entire platform.

#### Acceptance Criteria

1. WHEN a platform admin accesses the dashboard THEN the System SHALL display system-wide analytics
2. WHEN managing colleges THEN the System SHALL allow adding, editing, and configuring colleges
3. WHEN managing users THEN the System SHALL allow role changes, bans, and account management
4. WHEN configuring the platform THEN the System SHALL allow setting global announcements and feature flags

### Requirement 15: Bottom Navigation Bar Update

**User Story:** As a mobile user, I want an updated bottom navigation bar, so that I can access all features easily.

#### Acceptance Criteria

1. WHEN viewing on mobile THEN the System SHALL display an updated bottom nav bar with 5 items
2. WHEN the bottom nav renders THEN the System SHALL include Home, College, Explore, Chat, and Post (create) icons
3. WHEN tapping a nav item THEN the System SHALL navigate to the respective page with smooth transition
4. WHEN on the active page THEN the System SHALL highlight the corresponding nav item

### Requirement 16: Desktop Navigation Box Layout

**User Story:** As a desktop user, I want a clear navigation with 4 main buttons, so that I can quickly access key sections.

#### Acceptance Criteria

1. WHEN viewing the desktop nav box THEN the System SHALL display 4 buttons: Home, College, Explore, Chat
2. WHEN Campus/College is a separate button THEN the System SHALL NOT merge it with Explore
3. WHEN clicking College button THEN the System SHALL navigate to the user's college page
4. WHEN the nav box renders THEN the System SHALL maintain consistent sizing and styling

### Requirement 17: Collaboration Page

**User Story:** As a user, I want a dedicated collaboration page, so that I can find and post collaboration opportunities.

#### Acceptance Criteria

1. WHEN accessing the Collabo page THEN the System SHALL display collaboration requests and opportunities
2. WHEN creating a collaboration post THEN the System SHALL allow setting title, description, skills needed, and deadline
3. WHEN viewing collaborations THEN the System SHALL allow filtering by skill, category, and status
4. WHEN responding to a collaboration THEN the System SHALL notify the creator

### Requirement 18: Loading State Improvements

**User Story:** As a user, I want consistent loading states, so that the interface feels polished and professional.

#### Acceptance Criteria

1. WHEN content is loading THEN the System SHALL display skeleton loaders matching the content shape
2. WHEN loading THEN the System SHALL NOT display multiple loading screens or spinners
3. WHEN skeleton loaders render THEN the System SHALL match the page layout structure
4. WHEN content loads THEN the System SHALL smoothly transition from skeleton to content

### Requirement 19: Post Creation Cleanup

**User Story:** As a user, I want a clean post creation interface without marketplace options, so that posting is focused on social content.

#### Acceptance Criteria

1. WHEN opening post creation THEN the System SHALL NOT display a "Sell" or marketplace option
2. WHEN creating a post THEN the System SHALL offer: Text, Media, Poll, Event, Collaboration options
3. WHEN the post modal renders THEN the System SHALL use professional styling with proper spacing
4. WHEN selecting post type THEN the System SHALL show relevant fields for that type only

### Requirement 20: Background Grid Pattern

**User Story:** As a user, I want a subtle grid background, so that the interface has visual texture.

#### Acceptance Criteria

1. WHEN displaying the main content area THEN the System SHALL apply a subtle grid pattern background
2. WHEN displaying the grid THEN the System SHALL use light, non-distracting lines
3. WHEN displaying content over the grid THEN the System SHALL ensure readability is not affected

### Requirement 21: Campus Selection Persistence

**User Story:** As a user, I want my campus selection to persist correctly, so that I can access campus features.

#### Acceptance Criteria

1. WHEN a user selects a campus during onboarding THEN the System SHALL save the collegeId to the user profile in the backend
2. WHEN a user completes onboarding THEN the System SHALL verify the collegeId is stored before redirecting
3. WHEN a user accesses any page THEN the System SHALL check if collegeId exists and redirect to onboarding if missing
4. WHEN the campus is not selected THEN the System SHALL redirect to the onboarding college selection step
5. WHEN viewing the profile sidebar THEN the System SHALL display the correct college name if selected

### Requirement 22: Enhanced Admin Features

**User Story:** As an admin (Club/College/Platform), I want comprehensive management tools, so that I can effectively manage my responsibilities.

#### Acceptance Criteria

1. WHEN a Club Admin accesses management THEN the System SHALL display member management, event creation, analytics, and content moderation
2. WHEN a College Admin accesses management THEN the System SHALL display event approvals, content moderation, college info editing, and user reports
3. WHEN a Platform Admin accesses management THEN the System SHALL display system analytics, college management, user management, and platform configuration
4. WHEN a Teacher accesses their dashboard THEN the System SHALL display classroom management, attendance, assignments, and student progress

### Requirement 23: WebSocket Authentication Security

**User Story:** As a platform administrator, I want WebSocket connections to be authenticated, so that unauthorized users cannot access real-time features.

#### Acceptance Criteria

1. WHEN a client connects to the Chat_Gateway THEN the Chat_Gateway SHALL verify the JWT_Token from handshake auth
2. IF the JWT_Token is invalid or missing THEN the Chat_Gateway SHALL reject the connection with an authentication error
3. WHEN a client connects to the Notifications_Gateway THEN the Notifications_Gateway SHALL verify the JWT_Token before allowing room joins
4. IF a user attempts to join a room without valid authentication THEN the WebSocket_Gateway SHALL emit an error event and disconnect the client
5. THE WebSocket_Gateway SHALL extract user ID from the verified JWT_Token instead of trusting client-provided data

### Requirement 24: CORS Security Configuration

**User Story:** As a security engineer, I want CORS to be properly configured, so that only authorized origins can access the API.

#### Acceptance Criteria

1. THE Server SHALL configure CORS to allow only whitelisted origins from environment variables
2. WHEN a request comes from a non-whitelisted origin THEN the Server SHALL reject it with a 403 status
3. THE Server SHALL support multiple allowed origins for development, staging, and production environments
4. THE Server SHALL NOT use wildcard (*) CORS origin in production mode

### Requirement 25: Error Response Sanitization

**User Story:** As a security engineer, I want error responses to be sanitized, so that sensitive information is not exposed to clients.

#### Acceptance Criteria

1. THE All_Exceptions_Filter SHALL NOT include authorization headers in error logs
2. THE All_Exceptions_Filter SHALL NOT include JWT tokens in error responses
3. WHEN an error occurs THEN the All_Exceptions_Filter SHALL log sensitive data only to server-side logs with appropriate masking
4. THE All_Exceptions_Filter SHALL return generic error messages to clients in production mode

### Requirement 26: Feed Cursor Pagination

**User Story:** As a user, I want infinite scroll to work efficiently, so that I can browse content without performance issues.

#### Acceptance Criteria

1. WHEN loading more feed items THEN the Feed_API SHALL use cursor-based pagination instead of page numbers
2. THE Feed_API SHALL return a cursor pointing to the last item in each response
3. WHEN the cursor is provided THEN the Feed_API SHALL return items after that cursor
4. THE Feed_API SHALL support cursor pagination for posts, events, and marketplace listings

### Requirement 27: Post Save Functionality

**User Story:** As a user, I want to save posts for later, so that I can easily find content I'm interested in.

#### Acceptance Criteria

1. WHEN a user clicks the save button on a post THEN the System SHALL persist the saved state to the database
2. WHEN a user clicks save on an already-saved post THEN the System SHALL remove the saved state
3. THE System SHALL display the correct saved state when loading posts
4. THE User_Profile SHALL include a section to view all saved posts

### Requirement 28: Follow/Connection System

**User Story:** As a user, I want to follow other users, so that I can see their content in my feed.

#### Acceptance Criteria

1. WHEN a user clicks follow on another user's profile THEN the System SHALL create a follow relationship
2. WHEN a user clicks unfollow THEN the System SHALL remove the follow relationship
3. THE Profile_Page SHALL display follower and following counts
4. THE Profile_Page SHALL show the correct follow/unfollow button state
5. WHEN a user follows another user THEN the System SHALL send a notification to the followed user

### Requirement 29: Direct Messaging

**User Story:** As a user, I want to send direct messages to other users, so that I can communicate privately.

#### Acceptance Criteria

1. WHEN a user initiates a direct message THEN the System SHALL create a conversation between the two users
2. THE System SHALL NOT require a marketplace listing to start a conversation
3. WHEN a message is sent THEN the System SHALL deliver it in real-time via WebSocket
4. THE Chat_Page SHALL display all conversations including direct messages

### Requirement 30: Database Performance Indexes

**User Story:** As a platform administrator, I want database queries to be optimized, so that the platform performs well under load.

#### Acceptance Criteria

1. THE Database SHALL have indexes on Post.authorId, Post.collegeId, and Post.createdAt for efficient queries
2. THE Database SHALL have indexes on Event.collegeId and Event.startsAt for efficient event filtering
3. THE Database SHALL have indexes on Message.conversationId and Message.createdAt for efficient message retrieval
4. THE Database SHALL have indexes on Notification.userId for efficient notification queries
5. THE Database SHALL have composite indexes where multiple columns are frequently queried together

### Requirement 31: Error Monitoring Integration

**User Story:** As a developer, I want errors to be tracked in a monitoring service, so that I can identify and fix issues quickly.

#### Acceptance Criteria

1. THE System SHALL integrate Sentry for error tracking in production
2. WHEN an unhandled exception occurs THEN the System SHALL report it to Sentry with context
3. THE System SHALL include user ID (anonymized) in error reports for debugging
4. THE System SHALL capture React component errors via Error Boundary
5. THE System SHALL NOT send PII to Sentry

