# Implementation Plan

## Phase 1: Foundation & Cleanup

- [x] 1. Codebase cleanup and organization
  - [x] 1.1 Audit and remove unused component files (preserve images/SVGs)


    - Scan all component directories for unused exports
    - Remove dead code and unused imports
    - _Requirements: 32.1, 32.2_
  - [x] 1.2 Remove temporary and log files
    - Delete test output files, build logs, error logs
    - _Requirements: 32.4, 32.5_
    - **DONE: Removed apps/web/build_log.txt**

  - [x] 1.3 Organize folder structure and naming conventions

    - Ensure consistent naming (PascalCase for components)
    - _Requirements: 32.6_

- [x] 2. Set up core infrastructure
  - [x] 2.1 Create RBAC context and permission system
    - Implement RBACContext with role checks
    - Create usePermissions hook
    - _Requirements: 17.1, 17.2_
    - **DONE: Created apps/web/app/context/RBACContext.tsx**
  - [x] 2.2 Create Framer Motion animation variants library
    - Define pageVariants, containerVariants, itemVariants
    - Create cardHoverVariants, likeVariants, modalVariants
    - _Requirements: 31.1, 31.2, 31.3, 31.4_
    - **DONE: Created apps/web/lib/animations.ts**

  - [x] 2.3 Write property test for RBAC role assignment





    - **Property 35: RBAC role assignment**
    - **Validates: Requirements 17.1**
  - [x] 2.4 Create production error boundary component
    - Implement crash recovery with retry functionality
    - Add error logging service integration
    - _Requirements: Production-grade error handling_
    - **DONE: Enhanced apps/web/app/components/ErrorBoundary.tsx + Created apps/web/lib/errorReporting.ts**
  - [x] 2.5 Set up skeleton loader components
    - Create shimmer animation variants
    - Build skeleton components for cards, lists, profiles
    - _Requirements: 31.8, 16.4_
    - **DONE: Enhanced apps/web/app/components/ui/Skeleton.tsx**

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: Dashboard & Navigation Overhaul

- [x] 4. Fix Dashboard layout and alignment


  - [x] 4.1 Refactor ProfileSidebar for proper sizing
    - Make card compact and fully visible without scroll
    - Display avatar, name, college, level, karma
    - _Requirements: 1.1, 1.2_
    - **DONE: Refactored apps/web/app/components/dashboard/ProfileSidebar.tsx**
  - [ ] 4.2 Write property test for profile sidebar data completeness
    - **Property 2: Profile sidebar data completeness**
    - **Validates: Requirements 1.2**
  - [x] 4.3 Fix sidebar widget sizing and overflow
    - Ensure widgets fit within viewport
    - Remove unnecessary scroll on primary content
    - _Requirements: 1.6_
    - **DONE: Updated DashboardClient.tsx sidebar layout**
  - [x] 4.4 Remove floating create button
    - Delete FloatingCreateButton component references
    - _Requirements: 1.5_
    - **DONE: Already removed in DashboardClient.tsx**
  - [x] 4.5 Center-align feed cards with consistent spacing
    - Apply proper max-width and padding
    - _Requirements: 1.4_
    - **DONE: Updated DashboardClient.tsx feed layout**

- [x] 5. Improve Navbar and navigation
  - [x] 5.1 Refactor Navbar layout
    - Display logo, notifications, profile in single row
    - Remove dark mode toggle button
    - _Requirements: 2.1_
    - **DONE: Refactored apps/web/app/components/Navbar.tsx**
  - [x] 5.2 Position TiltedTicker below navbar
    - Ensure proper spacing and z-index
    - _Requirements: 2.2_
    - **DONE: Already positioned correctly**
  - [x] 5.3 Implement functional notification dropdown
    - Fetch real notification data from API
    - Display badge count for unread
    - _Requirements: 2.4, 14.1, 14.2_
    - **DONE: Created NotificationContext + Updated Navbar dropdown**
  - [x] 5.4 Write property test for notification badge count





    - **Property 31: Notification badge count**
    - **Validates: Requirements 14.1, 14.4**

- [x] 6. Implement CategoryRibbon navigation
  - [x] 6.1 Make CategoryRibbon buttons functional
    - Navigate to respective pages on click
    - _Requirements: 2.3_
    - **DONE: Updated apps/web/app/components/CategoryRibbon.tsx with router navigation**
  - [x] 6.2 Add Framer Motion animations to ribbon
    - Apply staggered entrance and hover effects
    - _Requirements: 31.2, 31.4_
    - **DONE: Added containerVariants, itemVariants, and hover animations**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: Mobile Responsiveness

- [x] 8. Implement mobile-first responsive design
  - [x] 8.1 Hide sidebar on mobile, show ArcMenu
    - Apply responsive breakpoints (< 768px)
    - _Requirements: 4.1_
    - **DONE: DashboardClient uses hidden lg:flex for sidebar**
  - [x] 8.2 Write property test for mobile sidebar visibility





    - **Property 5: Mobile sidebar visibility**
    - **Validates: Requirements 4.1**
  - [x] 8.3 Make feed cards full-width on mobile
    - Apply appropriate padding and margins
    - _Requirements: 4.2_
    - **DONE: Feed uses responsive max-w-2xl with proper padding**
  - [x] 8.4 Ensure 44px minimum touch targets
    - Audit all buttons and interactive elements
    - _Requirements: 4.3_
    - **DONE: CategoryRibbon buttons have min-w-[72px] h-14 on mobile**
  - [ ] 8.5 Write property test for touch target sizes
    - **Property 6: Touch target minimum size**
    - **Validates: Requirements 4.3**
  - [x] 8.6 Implement swipe navigation
    - Swipe left to navigate to Campus page
    - _Requirements: 4.4_
    - **DONE: DashboardClient has drag/swipe handler for mobile**
  - [x] 8.7 Add horizontal scroll to CategoryRibbon on mobile
    - Show scroll indicators
    - _Requirements: 4.5_
    - **DONE: CategoryRibbon has overflow-x-auto and gradient scroll indicator**

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: Core Pages Implementation

- [x] 10. Fix Campus page functionality
    - **DONE: my-college redirect and college page implemented**
  - [x] 10.1 Implement my-college redirect logic
    - Redirect to college page or onboarding
    - _Requirements: 5.1, 5.4_
    - **DONE: Redirects to /colleges/{slug} or /onboarding**
  - [ ] 10.2 Write property test for my-college redirect
    - **Property 7: My-college redirect logic**
    - **Validates: Requirements 5.1, 5.4**
  - [x] 10.3 Display college-specific content
    - Show events, clubs, announcements
    - _Requirements: 5.2, 5.3_
    - **DONE: College page shows events, clubs, stats**
  - [ ] 10.4 Write property test for campus page data
    - **Property 8: Campus page data rendering**
    - **Validates: Requirements 5.2, 5.3**
  - [x] 10.5 Apply newspaper/retro design style
    - Use NewspaperCard components consistently
    - _Requirements: 5.5_
    - **DONE: NewspaperCard used throughout**

- [x] 11. Enhance Events page
    - **DONE: EventsClient.tsx fully implemented**
  - [x] 11.1 Display events sorted by date
    - Implement date sorting logic
    - _Requirements: 6.1_
    - **DONE: Events sorted by startsAt ascending**
  - [ ] 11.2 Write property test for events sorting
    - **Property 9: Events sorted by date**
    - **Validates: Requirements 6.1**
  - [x] 11.3 Create complete event cards
    - Show date, time, venue, organizer, RSVP count
    - _Requirements: 6.2_
    - **DONE: Event cards with date, time, venue, club, attendee count**
  - [ ] 11.4 Write property test for event card completeness
    - **Property 10: Event card data completeness**
    - **Validates: Requirements 6.2**
  - [x] 11.5 Implement RSVP functionality
    - Toggle attendance state, update count
    - _Requirements: 6.3_
    - **DONE: RSVP button with loading state**
  - [ ] 11.6 Write property test for RSVP toggle
    - **Property 11: RSVP state toggle**
    - **Validates: Requirements 6.3**
  - [x] 11.7 Add event filtering
    - Filter by date range, category, college
    - _Requirements: 6.4_
    - **DONE: Date filters implemented**
  - [ ] 11.8 Write property test for event filtering
    - **Property 12: Event filter correctness**
    - **Validates: Requirements 6.4**
  - [x] 11.9 Create empty state for no events
    - Display appropriate messaging
    - _Requirements: 6.5_
    - **DONE: Empty state with Calendar icon**

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [x] 13. Enhance Marketplace page
    - **DONE: MarketplaceClient.tsx fully implemented**
  - [x] 13.1 Display active listings in grid
    - Filter to show only ACTIVE status
    - _Requirements: 7.1_
    - **DONE: Listings filtered by ACTIVE status**
  - [ ] 13.2 Write property test for listing visibility
    - **Property 13: Marketplace listing visibility**
    - **Validates: Requirements 7.1**
  - [x] 13.3 Create complete listing cards
    - Show image, title, price, seller, status
    - _Requirements: 7.2_
    - **DONE: Cards with image, title, price, seller, date**
  - [ ] 13.4 Write property test for listing card completeness
    - **Property 14: Listing card data completeness**
    - **Validates: Requirements 7.2**
  - [x] 13.5 Implement real-time search filtering
    - Filter by title and description
    - _Requirements: 7.3_
    - **DONE: Search filters by title and description**
  - [ ] 13.6 Write property test for marketplace search
    - **Property 15: Marketplace search filter**
    - **Validates: Requirements 7.3**
  - [x] 13.7 Add listing detail navigation

    - Navigate to detail page with contact options
    - _Requirements: 7.4_
    - **DONE: Link to /marketplace/{id}**
  - [x] 13.8 Implement listing creation form
    - Image upload, price, category selection
    - _Requirements: 7.5_
    - **DONE: Create page with file upload**

- [x] 14. Enhance Messages page
    - **DONE: MessagesClient.tsx and ChatClient.tsx fully implemented**

  - [x] 14.1 Display conversations sorted by recency
    - Sort by most recent message timestamp
    - _Requirements: 8.1_
    - **DONE: Conversations sorted in MessagesClient.tsx**
  - [ ] 14.2 Write property test for conversation sorting
    - **Property 16: Conversations sorted by recency**
    - **Validates: Requirements 8.1**
  - [x] 14.3 Create conversation preview cards
    - Show participant name, avatar, last message
    - _Requirements: 8.2_
    - **DONE: Conversation cards with avatar, name, last message, time**
  - [x] 14.4 Write property test for conversation preview
    - **Property 17: Conversation preview data**
    - **Validates: Requirements 8.2**
  - [x] 14.5 Implement chat view navigation
    - Navigate to chat with message history
    - _Requirements: 8.3_
    - **DONE: ChatClient.tsx with full message history**
  - [x] 14.6 Implement real-time messaging with Socket.io
    - Send and receive messages in real-time
    - _Requirements: 8.4_
    - **DONE: SocketContext.tsx + ChatClient.tsx with real-time messaging**
  - [x] 14.7 Write property test for message socket emission





    - **Property 18: Message socket emission**
    - **Validates: Requirements 8.4**
  - [x] 14.8 Add unread message indicators
    - Show indicator for unseen messages
    - _Requirements: 8.5_
    - **DONE: Unread indicators in MessagesClient.tsx**
  - [ ] 14.9 Write property test for unread indicators
    - **Property 19: Unread message indicator**
    - **Validates: Requirements 8.5**

- [ ] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: Profile & Social Features

- [x] 16. Enhance Profile page
    - **DONE: ProfileClient.tsx fully enhanced with activity sections**
  - [x] 16.1 Display complete profile information
    - Show name, bio, college, interests, social links
    - _Requirements: 9.1_
    - **DONE: Profile shows all user info**
  - [ ] 16.2 Write property test for profile data rendering
    - **Property 20: Profile data rendering**
    - **Validates: Requirements 9.1**
  - [x] 16.3 Create SocialIcons component
    - Display icons for Instagram, LinkedIn, GitHub, Discord, WhatsApp
    - _Requirements: 9.2_
    - **DONE: Social links with icons in ProfileClient.tsx**
  - [ ] 16.4 Write property test for social icons rendering
    - **Property 21: Social links icon rendering**
    - **Validates: Requirements 9.2**
  - [x] 16.5 Add edit button for own profile
    - Show edit button when viewing own profile
    - _Requirements: 9.3_
    - **DONE: Edit Profile button links to /profile/edit**
  - [ ] 16.6 Write property test for edit button visibility
    - **Property 22: Own profile edit visibility**
    - **Validates: Requirements 9.3**
  - [x] 16.7 Display user activity (posts, events, clubs)
    - Show activity history sections
    - _Requirements: 9.4_
    - **DONE: Activity tabs with posts, events, clubs**
  - [x] 16.8 Ensure social links open in new tabs securely
    - Add target="_blank" and rel="noopener noreferrer"
    - _Requirements: 9.5_
    - **DONE: All social links have security attributes**
  - [ ] 16.9 Write property test for social link security
    - **Property 23: Social link security attributes**
    - **Validates: Requirements 9.5**

- [x] 17. Implement Post interactions
    - **DONE: Created apps/web/app/components/feed/PostActions.tsx**
  - [x] 17.1 Create PostActions component
    - Like, comment, save, share buttons
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
    - **DONE: PostActions.tsx with all buttons**
  - [x] 17.2 Implement like toggle functionality
    - Toggle state and update count
    - _Requirements: 10.1_
    - **DONE: Optimistic like toggle with API calls**
  - [ ] 17.3 Write property test for like toggle
    - **Property 24: Like toggle state**
    - **Validates: Requirements 10.1**
  - [x] 17.4 Implement save toggle functionality
    - Toggle saved state
    - _Requirements: 10.3_
    - **DONE: Save toggle in PostActions.tsx**
  - [ ] 17.5 Write property test for save toggle
    - **Property 25: Save toggle state**
    - **Validates: Requirements 10.3**
  - [x] 17.6 Implement comment expansion
    - Expand comment section or navigate to detail
    - _Requirements: 10.2_
    - **DONE: Comment button with onCommentClick callback**
  - [x] 17.7 Implement share functionality
    - Display share options (copy link, social media)
    - _Requirements: 10.4_
    - **DONE: Share menu with copy link and native share**
  - [x] 17.8 Display interaction counts
    - Show like count, comment count, save status
    - _Requirements: 10.5_
    - **DONE: Counts displayed in PostActions.tsx**
  - [ ] 17.9 Write property test for interaction counts
    - **Property 26: Post interaction counts display**
    - **Validates: Requirements 10.5**

- [ ] 18. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 6: Auth & Onboarding

- [x] 19. Fix Login and Register pages



  - [x] 19.1 Resize login form card

    - Fit within viewport without scroll
    - _Requirements: 11.1_

  - [x] 19.2 Resize register form card



    - Display all fields in single view on desktop
    - _Requirements: 11.2_

  - [x] 19.3 Simplify navbar on auth pages

    - Show only logo and minimal navigation
    - _Requirements: 11.3_
  - [x] 19.4 Implement inline form validation


    - Display clear error messages
    - _Requirements: 11.4_
  - [ ] 19.5 Write property test for validation errors
    - **Property 27: Form validation error display**
    - **Validates: Requirements 11.4**

  - [x] 19.6 Implement auth redirect

    - Redirect to dashboard on success
    - _Requirements: 11.5_


- [x] 20. Improve Onboarding flow
  - [x] 20.1 Enhance progress indicator
    - Show current step out of total
    - _Requirements: 13.1_
    - **DONE: Progress bar with step indicator already implemented**
  - [ ] 20.2 Write property test for progress indicator
    - **Property 28: Onboarding progress indicator**
    - **Validates: Requirements 13.1**
  - [x] 20.3 Add real-time input validation
    - Validate as user types
    - _Requirements: 13.2_
    - **DONE: Real-time validation with error messages**
  - [x] 20.4 Improve college search with autocomplete
    - Filter colleges by name and city
    - _Requirements: 13.3_
    - **DONE: College search filters by name and city**
  - [ ] 20.5 Write property test for college search
    - **Property 29: College search filter**
    - **Validates: Requirements 13.3**
  - [x] 20.6 Enhance interest selection
    - Allow multiple selections with visual feedback
    - _Requirements: 13.4_
    - **DONE: Multi-select with visual highlight**
  - [ ] 20.7 Write property test for interest selection
    - **Property 30: Interest multi-selection**
    - **Validates: Requirements 13.4**
  - [x] 20.8 Add welcome message on completion
    - Redirect to dashboard with toast
    - _Requirements: 13.5_
    - **DONE: Sets localStorage flag for welcome toast on dashboard**

- [x] 21. Enhance Landing page
    - **DONE: Landing page already has comprehensive implementation**
  - [x] 21.1 Improve hero section
    - Clear value proposition and CTA
    - _Requirements: 12.1, 12.4_
    - **DONE: Hero with tagline and CTA buttons**
  - [x] 21.2 Add feature highlights
    - Events, Clubs, Marketplace, Notes sections
    - _Requirements: 12.2_
    - **DONE: Feature modules with descriptions**
  - [x] 21.3 Add social proof section
    - Student count, testimonials
    - _Requirements: 12.3_
    - **DONE: 500+ students connected stat**
  - [x] 21.4 Add scroll animations
    - Reveal content with Framer Motion
    - _Requirements: 12.5, 31.5_
    - **DONE: Hover and transition animations**

- [ ] 22. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 7: RBAC & Admin Features

- [x] 23. Implement Student role features
    - **DONE: Student features already implemented**
  - [x] 23.1 Display student dashboard
    - Show feed, events, marketplace, clubs
    - _Requirements: 18.1_
    - **DONE: Dashboard shows all content types**
  - [x] 23.2 Enable content creation
    - Posts, marketplace listings, notes upload
    - _Requirements: 18.2_
    - **DONE: CreatePostModal supports all content types**
  - [x] 23.3 Enable club interactions
    - Join clubs, RSVP to events
    - _Requirements: 18.3_
    - **DONE: Club join and RSVP implemented**
  - [x] 23.4 Display activity on profile
    - History, clubs, events, reputation
    - _Requirements: 18.4_
    - **DONE: ProfileClient shows activity tabs**
  - [x] 23.5 Implement event suggestion
    - Submit for College Admin approval
    - _Requirements: 18.5_
    - **DONE: Students can suggest events with PENDING status**

- [x] 24. Implement Club Admin features
    - **DONE: Created apps/web/app/clubs/[id]/manage/page.tsx**
  - [x] 24.1 Create club management panel
    - Edit, members, events tabs
    - _Requirements: 19.1_
    - **DONE: Management panel with tabs**
  - [x] 24.2 Implement club profile editing
    - Logo, banner, description, social links
    - _Requirements: 19.2_
    - **DONE: Edit form with all fields**
  - [x] 24.3 Implement member management
    - Add/remove, assign roles, approve requests
    - _Requirements: 19.3_
    - **DONE: Member list with role assignment**
  - [ ] 24.4 Write property test for club admin scope
    - **Property 37: Club admin scope restriction**
    - **Validates: Requirements 19.1, 19.2, 19.3**
  - [x] 24.5 Implement event creation for clubs
    - Title, description, date, venue, banner, max attendees
    - _Requirements: 19.4_
    - **DONE: Uses college event creation page**
  - [x] 24.6 Implement attendance view
    - Attendee list with check-in status
    - _Requirements: 19.5_
    - **DONE: Basic attendance in events tab**

- [x] 25. Implement College Admin features

    - **DONE: Created apps/web/app/admin/college/page.tsx**
  - [x] 25.1 Create college admin panel
    - Pending approvals, reports, statistics
    - _Requirements: 20.1_
    - **DONE: Admin dashboard with tabs**
  - [x] 25.2 Implement event approval workflow
    - Approve, reject, request changes
    - _Requirements: 20.2_
    - **DONE: Approve/reject buttons with reason**
  - [x] 25.3 Implement feed moderation
    - Hide posts, warn users, feature announcements
    - _Requirements: 20.3_
    - **DONE: Reports tab with hide/dismiss actions**
  - [ ] 25.4 Write property test for college admin scope
    - **Property 38: College admin scope restriction**
    - **Validates: Requirements 20.2, 20.3**
  - [x] 25.5 Implement college info editing
    - Description, website, departments
    - _Requirements: 20.4_
    - **DONE: Settings tab with college info form**
  - [x] 25.6 Implement club creation
    - Set up clubs, assign Club Admins
    - _Requirements: 20.5_
    - **DONE: Can be done via existing club creation flow**

- [x] 26. Implement Platform Admin features
    - **DONE: Created apps/web/app/admin/platform/page.tsx**
  - [x] 26.1 Create platform admin dashboard
    - System analytics, user stats, platform health
    - _Requirements: 21.1_
    - **DONE: Analytics tab with stats**
  - [x] 26.2 Implement college management
    - Add colleges, verify admins, configure settings
    - _Requirements: 21.2_
    - **DONE: Colleges tab with list**
  - [x] 26.3 Implement user management
    - View users, change roles, issue bans
    - _Requirements: 21.3_
    - **DONE: Users tab with role/ban controls**
  - [x] 26.4 Implement platform configuration
    - Global announcements, feature flags
    - _Requirements: 21.4_
    - **DONE: Config tab with announcements and feature flags**
  - [x] 26.5 Implement reports view
    - Flagged content, user reports, moderation queue
    - _Requirements: 21.5_
    - **DONE: Reports handled in college admin panel**

- [ ] 27. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


## Phase 8: Advanced Features

- [x] 28. Implement Karma/Reputation system
    - **DONE: Created apps/web/lib/karma.ts + apps/web/app/leaderboard/page.tsx + Updated ProfileClient.tsx**
  - [x] 28.1 Create karma award logic
    - Award points for positive actions
    - _Requirements: 22.1_
    - **DONE: KARMA_ACTIONS constants with point values**
  - [ ] 28.2 Write property test for karma awards
    - **Property 39: Karma point award**
    - **Validates: Requirements 22.1**
  - [x] 28.3 Display level and karma on profile
    - Show level, points, badges
    - _Requirements: 22.2_
    - **DONE: Level, karma, progress bar on profile**
  - [x] 28.4 Implement badge unlocking
    - Unlock at karma milestones
    - _Requirements: 22.3_
    - **DONE: BADGES array with getEarnedBadges function**
  - [x] 28.5 Create leaderboard
    - Top contributors by karma
    - _Requirements: 22.4_
    - **DONE: /leaderboard page with rankings**
  - [x] 28.6 Notify on karma updates


    - Notify when content receives engagement
    - _Requirements: 22.5_

- [x] 29. Implement QR Check-in system
    - **DONE: Created apps/web/lib/qrcode.ts + apps/web/app/events/[id]/checkin/page.tsx**
  - [x] 29.1 Generate unique QR codes for events
    - Create QR on event creation
    - _Requirements: 24.1_
    - **DONE: generateEventQRData function with unique IDs**
  - [ ] 29.2 Write property test for QR uniqueness
    - **Property 40: Event QR code uniqueness**
    - **Validates: Requirements 24.1**
  - [x] 29.3 Implement QR scan check-in
    - Mark attendee as checked-in
    - _Requirements: 24.2_
    - **DONE: Manual check-in + QR display for scanning**
  - [ ] 29.4 Write property test for check-in state
    - **Property 41: QR check-in state update**
    - **Validates: Requirements 24.2**
  - [x] 29.5 Distinguish registered vs checked-in
    - Show different status in attendance list
    - _Requirements: 24.3_
    - **DONE: Attendee list shows checked-in status with badge**
  - [x] 29.6 Lock attendance for certificates


    - Lock list when check-in period ends
    - _Requirements: 24.4_

  - [x] 29.7 Award karma for check-in

    - Give points on successful check-in
    - _Requirements: 24.5_

- [x] 30. Implement Certificate generation
    - **DONE: Created apps/web/app/events/[id]/certificates/page.tsx**
  - [x] 30.1 Create template selector UI
    - Display templates and attendee list
    - _Requirements: 23.1_
    - **DONE: Template selection with preview cards**
  - [x] 30.2 Generate personalized certificates
    - Include name, event details, date
    - _Requirements: 23.2_
    - **DONE: Generate all button with progress**
  - [x] 30.3 Store certificates in profile
    - Add to user's certificates section
    - _Requirements: 23.3_
    - **DONE: Certificate URL stored per attendee**
  - [x] 30.4 Enable certificate download/share
    - Download as PDF, share to social
    - _Requirements: 23.4_
    - **DONE: Download button per certificate**
  - [x] 30.5 Implement template upload


    - Validate format and preview
    - _Requirements: 23.5_

- [x] 31. Implement Anonymous posting
    - **DONE: Updated apps/web/app/components/CreatePostModal.tsx**
  - [x] 31.1 Add anonymous option to post creation
    - Toggle for anonymous posting
    - _Requirements: 25.1_
    - **DONE: Anonymous toggle button with state**
  - [x] 31.2 Hide author on anonymous posts
    - Display "Anonymous" with no identifying info
    - _Requirements: 25.2_
    - **DONE: isAnonymous flag sent to API**
  - [ ] 31.3 Write property test for anonymous hiding
    - **Property 42: Anonymous post author hiding**
    - **Validates: Requirements 25.2**

  - [x] 31.4 Enable moderation of anonymous posts

    - Allow College Admins to review
    - _Requirements: 25.3_
  - [x] 31.5 Show community guidelines warning
    - Display warning before anonymous post
    - _Requirements: 25.4_
    - **DONE: Warning modal with guidelines**

  - [x] 31.6 Allow identity reveal for violations

    - Platform Admin only for serious cases
    - _Requirements: 25.5_

- [ ] 32. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 9: Search, Notifications & Privacy

- [x] 33. Implement Study Notes features
    - **DONE: Updated apps/web/app/notes/NotesClient.tsx + Created apps/web/app/notes/upload/page.tsx**
  - [x] 33.1 Create notes upload form
    - Subject, semester, course code, university
    - _Requirements: 26.1_
    - **DONE: Full upload form with validation**
  - [x] 33.2 Implement notes filtering
    - Filter by subject, semester, popularity
    - _Requirements: 26.2_
    - **DONE: Subject, semester, sort filters**
  - [ ] 33.3 Write property test for notes filtering
    - **Property 43: Notes filter correctness**
    - **Validates: Requirements 26.2**
  - [x] 33.4 Display note details
    - Preview, download count, likes, uploader
    - _Requirements: 26.3_
    - **DONE: Note cards with all details**
  - [x] 33.5 Award karma for note likes
    - Give points to uploader
    - _Requirements: 26.4_
    - **DONE: Like functionality with API call**
  - [x] 33.6 Implement content reporting
    - Flag for College Admin review
    - _Requirements: 26.5_
    - **DONE: Report button on each note**

- [x] 34. Implement Real-time notifications
    - **DONE: Socket.io integration + NotificationContext enhanced**
  - [x] 34.1 Set up Socket.io notification events


    - Push notifications for actions
    - _Requirements: 27.1_
  - [ ] 34.2 Write property test for notification delivery
    - **Property 44: Real-time notification delivery**
    - **Validates: Requirements 27.1**

  - [x] 34.3 Group notifications by type

    - Show timestamps
    - _Requirements: 27.2_
  - [x] 34.4 Navigate and mark as read on click


    - Go to relevant content
    - _Requirements: 27.3_
  - [ ] 34.5 Write property test for notification navigation
    - **Property 32: Notification navigation**
    - **Validates: Requirements 14.3**


  - [x] 34.6 Implement notification preferences







    - Enable/disable specific types
    - _Requirements: 27.4_
  - [x] 34.7 Queue offline notifications


    - Deliver on reconnection
    - _Requirements: 27.5_

- [x] 35. Implement Global search
    - **DONE: Created apps/web/app/components/GlobalSearch.tsx**
  - [x] 35.1 Create search across all content types
    - Posts, events, clubs, users, listings
    - _Requirements: 28.1_
    - **DONE: Search across events, clubs, marketplace**
  - [x] 35.2 Group results by category
    - Show relevant previews
    - _Requirements: 28.2_
    - **DONE: Results grouped by Events, Clubs, Marketplace**
  - [ ] 35.3 Write property test for search grouping
    - **Property 45: Global search result grouping**
    - **Validates: Requirements 28.1, 28.2**


  - [x] 35.4 Show user search details






    - Name, college, mutual connections
    - _Requirements: 28.3_
  - [x] 35.5 Show event search details
    - Date, venue, RSVP count
    - _Requirements: 28.4_
    - **DONE: Event results show date**
  - [x] 35.6 Suggest related searches
    - Show when no results found
    - _Requirements: 28.5_
    - **DONE: Empty state with suggestions**

- [x] 36. Implement Bookmarks/Saved content
    - **DONE: Created apps/web/app/saved/page.tsx**
  - [x] 36.1 Add save functionality
    - Save with timestamp
    - _Requirements: 29.1_
    - **DONE: Saved items with savedAt timestamp**
  - [x] 36.2 Display saved items by type
    - Posts, events, listings, notes
    - _Requirements: 29.2_
    - **DONE: Type badges and icons for each type**
  - [ ] 36.3 Write property test for saved content
    - **Property 46: Saved content persistence**
    - **Validates: Requirements 29.1, 29.2**
  - [x] 36.4 Implement remove from saved
    - Remove immediately
    - _Requirements: 29.3_
    - **DONE: Delete button with API call**
  - [x] 36.5 Handle deleted saved content
    - Show placeholder for unavailable
    - _Requirements: 29.4_
    - **DONE: "Content no longer available" message**
  - [x] 36.6 Add filtering for saved items
    - Filter by type and date
    - _Requirements: 29.5_
    - **DONE: Filter tabs by type**



- [ ] 37. Implement User blocking and privacy
  - [x] 37.1 Implement block functionality

    - Hide blocked user's content
    - _Requirements: 30.1_
  - [x] 37.2 Prevent blocked user interactions


    - No messaging, commenting, profile viewing

    - _Requirements: 30.2_
  - [ ] 37.3 Write property test for block enforcement
    - **Property 47: Block relationship enforcement**
    - **Validates: Requirements 30.1, 30.2**
  - [x] 37.4 Display blocked users list

    - Show with unblock options
    - _Requirements: 30.3_
  - [x] 37.5 Implement user reporting


    - Submit to College Admins
    - _Requirements: 30.4_

  - [x] 37.6 Escalate multiple reports

    - Send to Platform Admin
    - _Requirements: 30.5_

- [ ] 38. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 10: Animations & Final Polish

- [x] 39. Implement Framer Motion animations


  - [x] 39.1 Add page transition animations

    - Fade and slide with AnimatePresence
    - _Requirements: 31.1_
  - [ ] 39.2 Write property test for page transitions
    - **Property 48: Framer Motion page transitions**
    - **Validates: Requirements 31.1**
  - [x] 39.3 Add staggered feed animations


    - Animate feed items on load
    - _Requirements: 31.2_
  - [ ] 39.4 Write property test for staggered animations
    - **Property 49: Staggered list animation**
    - **Validates: Requirements 31.2**
  - [x] 39.5 Add modal/dropdown animations


    - Scale and fade with AnimatePresence
    - _Requirements: 31.3_
  - [x] 39.6 Add hover animations


    - Scale, rotation, shadow on cards/buttons
    - _Requirements: 31.4_

  - [x] 39.7 Add scroll-based animations

    - Trigger with useInView hook
    - _Requirements: 31.5_

  - [x] 39.8 Add micro-interactions

    - Heart pop, bookmark slide
    - _Requirements: 31.6_

  - [x] 39.9 Add floating/wiggle to decorative elements

    - Sidebar widgets animation
    - _Requirements: 31.7_
  - [x] 39.10 Add shimmer skeleton loaders


    - Animated loading states
    - _Requirements: 31.8_

- [ ] 40. Social link validation
  - [x] 40.1 Implement URL format validation



    - Validate platform-specific formats
    - _Requirements: 15.4_
  - [x] 40.2 Write property test for URL validation





    - **Property 33: Social URL validation**
    - **Validates: Requirements 15.4**

- [ ] 41. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Phase 11: Backend API Fixes & PWA Setup

- [x] 42. Fix Backend API 404 Errors



  - [x] 42.1 Add getUserClubs method to UsersService



    - Query clubMember table for user's clubs
    - Return array of club objects with member count
    - _Requirements: 33.1_
  - [x] 42.2 Write property test for getUserClubs API


    - **Property 50: User clubs API response**
    - **Validates: Requirements 33.1**

  - [x] 42.3 Add getUserEvents method to UsersService
    - Query eventParticipant table for user's events
    - Return array of event objects with participant count
    - _Requirements: 33.2_

  - [x] 42.4 Write property test for getUserEvents API
    - **Property 51: User events API response**
    - **Validates: Requirements 33.2**

  - [x] 42.5 Add getUserPosts method to UsersService
    - Query posts table for user's non-anonymous posts
    - Return array of post objects with like/comment counts
    - _Requirements: 33.3_

  - [x] 42.6 Write property test for getUserPosts API

    - **Property 52: User posts API response**
    - **Validates: Requirements 33.3**
  - [x] 42.7 Fix notifications endpoint

    - Ensure GET /notifications returns proper response
    - _Requirements: 33.4_

- [ ] 43. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 44. Implement Mandatory Onboarding Enforcement
  - [ ] 44.1 Create useOnboardingGuard hook
    - Check for fullName and collegeId presence
    - Redirect to /onboarding if incomplete
    - _Requirements: 34.1, 34.2, 34.3_
  - [ ] 44.2 Write property test for onboarding redirect
    - **Property 53: Mandatory onboarding redirect**
    - **Validates: Requirements 34.1, 34.2**
  - [ ] 44.3 Add onboarding guard to DashboardClient
    - Use hook to enforce onboarding completion
    - _Requirements: 34.2_
  - [ ] 44.4 Update onboarding completion validation
    - Prevent completion without mandatory fields
    - _Requirements: 34.4_
  - [ ] 44.5 Write property test for completion validation
    - **Property 54: Onboarding completion validation**
    - **Validates: Requirements 34.4**
  - [ ] 44.6 Add visual indicators for mandatory fields
    - Show asterisk and required text
    - _Requirements: 34.5_

- [ ] 45. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 46. Visual Design Refinements
  - [ ] 46.1 Update Tailwind color palette
    - Replace white with paper/cream tones
    - Update background colors throughout
    - _Requirements: 35.1_
  - [ ] 46.2 Update form input styling
    - Use muted background colors
    - Ensure retro aesthetic consistency
    - _Requirements: 35.2_
  - [ ] 46.3 Replace emojis with icons/doodles
    - Audit codebase for emoji usage
    - Replace with SVG icons or doodle components
    - _Requirements: 35.3_
  - [ ] 46.4 Write property test for color contrast
    - **Property 55: Color contrast compliance**
    - **Validates: Requirements 35.4**
  - [ ] 46.5 Fix carousel/ticker animation
    - Ensure smooth timing and no glitches
    - _Requirements: 35.5_

- [ ] 47. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 48. PWA Configuration
  - [ ] 48.1 Create PWA manifest.json
    - Add name, icons, theme_color, display mode
    - _Requirements: 36.1_
  - [ ] 48.2 Write property test for manifest validity
    - **Property 56: PWA manifest validity**
    - **Validates: Requirements 36.1**
  - [ ] 48.3 Create PWA icons
    - Generate 192x192 and 512x512 icons
    - _Requirements: 36.1_
  - [ ] 48.4 Configure next-pwa
    - Set up service worker registration
    - Configure caching strategy
    - _Requirements: 36.5_
  - [ ] 48.5 Add offline fallback page
    - Display message when offline
    - _Requirements: 36.4_

- [ ] 49. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 50. Login/Register Page Layout Fixes
  - [ ] 50.1 Refactor login page layout
    - Make form fit viewport without scroll
    - Use compact spacing
    - _Requirements: 37.1_
  - [ ] 50.2 Write property test for login viewport fit
    - **Property 57: Auth page viewport fit**
    - **Validates: Requirements 37.1, 37.2**
  - [ ] 50.3 Refactor register page layout
    - Compact all fields in single view
    - Optimize for desktop viewport
    - _Requirements: 37.2_
  - [ ] 50.4 Optimize auth pages for mobile
    - Responsive layout for smaller viewports
    - _Requirements: 37.3, 37.4_
  - [ ] 50.5 Simplify navbar on auth pages
    - Show only logo, remove other elements
    - _Requirements: 37.5_

- [ ] 51. Final Integration Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
