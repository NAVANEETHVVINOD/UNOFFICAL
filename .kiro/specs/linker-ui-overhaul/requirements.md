# Requirements Document

## Introduction

This document specifies the requirements for a comprehensive UI/UX overhaul and feature enhancement of the LINKER platform - "The Campus Collective". The goal is to transform the current beta version into a professional, modern, and fully functional social platform for college students while maintaining the unique retro/newspaper aesthetic. The improvements span across all pages including Dashboard, Campus, Events, Marketplace, Messages, Profile, Login/Register, Landing Page, and Onboarding flows.

The platform supports a multi-tenant architecture with Role-Based Access Control (RBAC) supporting four distinct user roles: Students, Club Admins, College Admins, and Platform Admins.

## Glossary

- **LINKER**: The campus social platform application
- **Dashboard**: The main social feed page where users view and create posts
- **Campus Hub**: College-specific page showing events, clubs, and announcements for a user's college
- **Feed**: The scrollable list of posts, events, and marketplace items
- **Sidebar**: The left panel containing user profile, tools, and widgets
- **CategoryRibbon**: The horizontal navigation tabs (Home, Campus, Events, Market, Messages)
- **ArcMenu**: The mobile radial navigation menu

- **Neo-brutalist**: Design style with bold borders, shadows, and geometric shapes
- **PWA**: Progressive Web App - installable web application
- **RBAC**: Role-Based Access Control - permission system based on user roles
- **Student**: Default user role with basic platform access
- **Club Admin**: User who manages a specific club (events, members, content)
- **College Admin**: User who moderates college-level content and approves events
- **Platform Admin**: Super admin with system-wide access and configuration rights
- **RSVP**: Response to event invitation (Going/Interested/Not Going)
- **Karma/Rep**: User reputation points earned through platform engagement

## Requirements

### Requirement 1: Dashboard Layout and Alignment

**User Story:** As a student, I want a properly aligned and sized dashboard layout, so that I can easily navigate and consume content without visual clutter.

#### Acceptance Criteria

1. WHEN the Dashboard loads THEN the System SHALL display the left sidebar with properly sized cards that fit within the viewport without requiring scroll for primary content
2. WHEN viewing the ProfileSidebar THEN the System SHALL display the user avatar, name, college, level, and reputation in a compact card that is fully visible
3. WHEN the CategoryRibbon renders THEN the System SHALL position it directly below the navbar with proper spacing and alignment
4. WHEN the feed container renders THEN the System SHALL center-align post cards with consistent width and spacing
5. WHEN the floating create button exists THEN the System SHALL remove it from the interface to reduce visual clutter
6. WHEN widgets render in the sidebar THEN the System SHALL size them proportionally to fit within the visible area without overflow

### Requirement 2: Navbar and Navigation Improvements

**User Story:** As a student, I want a clean and functional navbar, so that I can easily access key features and navigate the platform.

#### Acceptance Criteria

1. WHEN the navbar renders THEN the System SHALL display logo, notifications, and profile in a single row with proper alignment
2. WHEN the TiltedTicker/Carousel renders THEN the System SHALL position it directly below the main navbar section
3. WHEN on mobile devices THEN the System SHALL display a responsive navbar that collapses appropriately
4. WHEN the notification bell is clicked THEN the System SHALL display a functional dropdown with real notification data
5. WHEN the profile avatar is clicked THEN the System SHALL navigate to the profile page

### Requirement 4: Mobile Responsiveness

**User Story:** As a student using a mobile device, I want the website to be fully responsive, so that I can use all features comfortably on my phone.

#### Acceptance Criteria

1. WHEN viewing on mobile (width < 768px) THEN the System SHALL hide the left sidebar and show the ArcMenu for navigation
2. WHEN viewing on mobile THEN the System SHALL display feed cards at full width with appropriate padding
3. WHEN viewing on mobile THEN the System SHALL ensure all buttons and interactive elements have minimum 44px touch targets
4. WHEN swiping left on the dashboard THEN the System SHALL navigate to the Campus page smoothly
5. WHEN the CategoryRibbon renders on mobile THEN the System SHALL allow horizontal scrolling with visible scroll indicators

### Requirement 5: Campus Page Functionality

**User Story:** As a student, I want the Campus page to load properly and display my college's content, so that I can stay updated with campus activities.

#### Acceptance Criteria

1. WHEN navigating to /my-college THEN the System SHALL redirect to the user's college page or onboarding if no college is set
2. WHEN the Campus page loads THEN the System SHALL display college-specific events, clubs, and announcements
3. WHEN the Campus page loads THEN the System SHALL show the college name, description, and statistics
4. WHEN no college is associated THEN the System SHALL redirect to onboarding with a clear message
5. WHEN viewing the Campus page THEN the System SHALL display content in the newspaper/retro design style

### Requirement 6: Events Page Enhancement

**User Story:** As a student, I want a fully functional Events page, so that I can discover, RSVP, and manage campus events.

#### Acceptance Criteria

1. WHEN the Events page loads THEN the System SHALL display all upcoming events sorted by date
2. WHEN viewing an event card THEN the System SHALL show date, time, venue, organizer, and RSVP count
3. WHEN clicking RSVP THEN the System SHALL register the user's attendance and update the count
4. WHEN filtering events THEN the System SHALL allow filtering by date range, category, and college
5. WHEN no events exist THEN the System SHALL display an empty state with appropriate messaging

### Requirement 7: Marketplace Page Enhancement

**User Story:** As a student, I want a fully functional Marketplace page, so that I can buy, sell, and trade items with other students.

#### Acceptance Criteria

1. WHEN the Marketplace page loads THEN the System SHALL display all active listings in a grid layout
2. WHEN viewing a listing card THEN the System SHALL show image, title, price, seller name, and status
3. WHEN searching listings THEN the System SHALL filter results in real-time based on title and description
4. WHEN clicking a listing THEN the System SHALL navigate to the detail page with contact options
5. WHEN creating a listing THEN the System SHALL allow image upload, price setting, and category selection

### Requirement 8: Messages Page Enhancement

**User Story:** As a student, I want a fully functional Messages page, so that I can communicate with other students and sellers.

#### Acceptance Criteria

1. WHEN the Messages page loads THEN the System SHALL display all conversations sorted by most recent
2. WHEN viewing a conversation THEN the System SHALL show the other participant's name, avatar, and last message preview
3. WHEN clicking a conversation THEN the System SHALL navigate to the chat view with message history
4. WHEN sending a message THEN the System SHALL deliver it in real-time using Socket.io
5. WHEN receiving a message THEN the System SHALL show an unread indicator on the conversation

### Requirement 9: Profile Page and Social Features

**User Story:** As a student, I want a complete profile page with social features, so that I can showcase my activities and connect with others.

#### Acceptance Criteria

1. WHEN viewing the profile page THEN the System SHALL display user info, bio, college, interests, and social links
2. WHEN the profile has social links THEN the System SHALL display clickable icons for Instagram, LinkedIn, GitHub, Discord, and WhatsApp
3. WHEN viewing own profile THEN the System SHALL show an edit button to modify profile information
4. WHEN viewing the profile THEN the System SHALL display user's posts, events attended, and clubs joined
5. WHEN clicking a social link THEN the System SHALL open the link in a new tab

### Requirement 10: Post Interactions (Like, Comment, Save, Share)

**User Story:** As a student, I want to interact with posts through likes, comments, saves, and shares, so that I can engage with the community.

#### Acceptance Criteria

1. WHEN clicking the like button on a post THEN the System SHALL toggle the like state and update the count
2. WHEN clicking the comment button THEN the System SHALL expand the comment section or navigate to post detail
3. WHEN clicking the save button THEN the System SHALL add the post to the user's saved items
4. WHEN clicking the share button THEN the System SHALL display share options (copy link, social media)
5. WHEN viewing a post THEN the System SHALL display the current like count, comment count, and save status

### Requirement 11: Login and Register Page Improvements

**User Story:** As a new user, I want clean and properly sized login/register pages, so that I can easily create an account or sign in.

#### Acceptance Criteria

1. WHEN viewing the login page THEN the System SHALL display the form card at appropriate size without requiring scroll
2. WHEN viewing the register page THEN the System SHALL display all form fields in a single view on desktop
3. WHEN the navbar is present on auth pages THEN the System SHALL show only the logo and minimal navigation
4. WHEN form validation fails THEN the System SHALL display clear error messages inline
5. WHEN authentication succeeds THEN the System SHALL redirect to the dashboard immediately

### Requirement 12: Landing Page Enhancement

**User Story:** As a visitor, I want an informative and engaging landing page, so that I can understand what LINKER offers before signing up.

#### Acceptance Criteria

1. WHEN viewing the landing page THEN the System SHALL display a hero section with clear value proposition
2. WHEN viewing the landing page THEN the System SHALL show feature highlights for Events, Clubs, Marketplace, and Notes
3. WHEN viewing the landing page THEN the System SHALL display social proof (student count, testimonials)
4. WHEN viewing the landing page THEN the System SHALL include clear call-to-action buttons for registration
5. WHEN scrolling the landing page THEN the System SHALL reveal content with smooth animations

### Requirement 13: Onboarding Flow Improvements

**User Story:** As a new user, I want a smooth onboarding experience, so that I can set up my profile quickly and start using the platform.

#### Acceptance Criteria

1. WHEN starting onboarding THEN the System SHALL display a progress indicator showing current step
2. WHEN entering profile details THEN the System SHALL validate inputs in real-time
3. WHEN selecting a college THEN the System SHALL provide search functionality with autocomplete
4. WHEN selecting interests THEN the System SHALL allow multiple selections with visual feedback
5. WHEN completing onboarding THEN the System SHALL redirect to the dashboard with a welcome message

### Requirement 14: Notification System

**User Story:** As a student, I want a functional notification system, so that I can stay updated on relevant activities.

#### Acceptance Criteria

1. WHEN a notification is received THEN the System SHALL display a badge count on the notification bell
2. WHEN clicking the notification bell THEN the System SHALL display a dropdown with recent notifications
3. WHEN clicking a notification THEN the System SHALL navigate to the relevant content
4. WHEN marking notifications as read THEN the System SHALL update the badge count
5. WHEN no notifications exist THEN the System SHALL display an empty state message

### Requirement 15: Additional Social Integrations

**User Story:** As a student, I want to connect my social accounts, so that I can share my profile and content across platforms.

#### Acceptance Criteria

1. WHEN editing profile THEN the System SHALL allow adding Instagram, LinkedIn, Discord, WhatsApp, and GitHub links
2. WHEN viewing a profile with social links THEN the System SHALL display recognizable icons for each platform
3. WHEN sharing a post THEN the System SHALL provide options to share to WhatsApp, Instagram Stories, and copy link
4. WHEN connecting social accounts THEN the System SHALL validate URL formats before saving
5. WHEN displaying social links THEN the System SHALL open them in new tabs with proper security attributes

### Requirement 16: Animation and Visual Polish

**User Story:** As a student, I want modern animations and visual polish, so that the platform feels professional and engaging.

#### Acceptance Criteria

1. WHEN page transitions occur THEN the System SHALL apply smooth fade and slide animations
2. WHEN cards appear in the feed THEN the System SHALL animate them with staggered entrance effects
3. WHEN hovering over interactive elements THEN the System SHALL provide visual feedback with scale or shadow changes
4. WHEN loading content THEN the System SHALL display skeleton loaders matching the content shape
5. WHEN scrolling THEN the System SHALL apply parallax effects to decorative elements where appropriate


### Requirement 17: Role-Based Access Control (RBAC) System

**User Story:** As a platform administrator, I want a comprehensive role-based access system, so that different users have appropriate permissions based on their responsibilities.

#### Acceptance Criteria

1. WHEN a user registers THEN the System SHALL assign the STUDENT role by default
2. WHEN viewing the user interface THEN the System SHALL display role-appropriate navigation and actions based on the user's role
3. WHEN a Club Admin accesses club management THEN the System SHALL allow editing club profile, managing members, creating events, and posting updates
4. WHEN a College Admin accesses college management THEN the System SHALL allow approving events, moderating campus feed, and editing college information
5. WHEN a Platform Admin accesses the admin dashboard THEN the System SHALL allow managing all colleges, global bans, platform configuration, and analytics

### Requirement 18: Student Role Features

**User Story:** As a student, I want access to all core platform features, so that I can fully participate in campus life.

#### Acceptance Criteria

1. WHEN a student views the dashboard THEN the System SHALL display the global feed, events, marketplace, and clubs
2. WHEN a student creates content THEN the System SHALL allow creating posts, marketplace listings, and uploading notes
3. WHEN a student interacts with clubs THEN the System SHALL allow joining clubs, viewing club content, and RSVPing to events
4. WHEN a student views their profile THEN the System SHALL display their activity history, clubs joined, events attended, and reputation
5. WHEN a student suggests an event THEN the System SHALL submit the event for College Admin approval

### Requirement 19: Club Admin Role Features

**User Story:** As a club admin, I want to manage my club effectively, so that I can grow the community and organize events.

#### Acceptance Criteria

1. WHEN a Club Admin views their club page THEN the System SHALL display a management panel with edit, members, and events tabs
2. WHEN a Club Admin edits club profile THEN the System SHALL allow updating logo, banner, description, and social links
3. WHEN a Club Admin manages members THEN the System SHALL allow adding/removing members, assigning display roles (Chair, Lead, Core Team, Volunteer), and approving join requests
4. WHEN a Club Admin creates an event THEN the System SHALL allow setting title, description, date, venue, banner, and max attendees
5. WHEN a Club Admin views event attendance THEN the System SHALL display attendee list with check-in status and allow generating certificates

### Requirement 20: College Admin Role Features

**User Story:** As a college admin, I want to moderate and manage college-level content, so that I can maintain quality and relevance for students.

#### Acceptance Criteria

1. WHEN a College Admin views the admin panel THEN the System SHALL display pending approvals, reported content, and college statistics
2. WHEN a College Admin reviews an event THEN the System SHALL allow approving, rejecting, or requesting changes with feedback
3. WHEN a College Admin moderates the feed THEN the System SHALL allow hiding posts, warning users, and featuring important announcements
4. WHEN a College Admin edits college info THEN the System SHALL allow updating description, website, departments, and initiatives
5. WHEN a College Admin creates a club THEN the System SHALL allow setting up new clubs and assigning initial Club Admins

### Requirement 21: Platform Admin Role Features

**User Story:** As a platform admin, I want full system access, so that I can manage the entire platform and ensure smooth operation.

#### Acceptance Criteria

1. WHEN a Platform Admin accesses the admin dashboard THEN the System SHALL display system-wide analytics, user statistics, and platform health
2. WHEN a Platform Admin manages colleges THEN the System SHALL allow adding new colleges, verifying college admins, and configuring college settings
3. WHEN a Platform Admin manages users THEN the System SHALL allow viewing all users, changing roles, issuing bans, and resetting accounts
4. WHEN a Platform Admin configures the platform THEN the System SHALL allow setting global announcements, feature flags, and system parameters
5. WHEN a Platform Admin views reports THEN the System SHALL display flagged content, user reports, and moderation queue across all colleges

### Requirement 22: User Activity and Reputation System

**User Story:** As a student, I want to earn reputation and track my activity, so that I can showcase my campus involvement.

#### Acceptance Criteria

1. WHEN a user performs positive actions (posts, helps, attends events) THEN the System SHALL award karma/reputation points
2. WHEN viewing a user profile THEN the System SHALL display their level, karma points, and activity badges
3. WHEN a user reaches karma milestones THEN the System SHALL unlock badges and display them on the profile
4. WHEN viewing the leaderboard THEN the System SHALL display top contributors by karma within the college
5. WHEN a user's content receives engagement THEN the System SHALL notify them and update their karma accordingly

### Requirement 23: Event Certificate Generation

**User Story:** As a club admin, I want to generate certificates for event attendees, so that students can document their participation.

#### Acceptance Criteria

1. WHEN a Club Admin opens certificate generation THEN the System SHALL display a template selector and attendee list
2. WHEN generating certificates THEN the System SHALL create personalized certificates with attendee name, event details, and date
3. WHEN certificates are generated THEN the System SHALL store them in the attendee's profile under certificates section
4. WHEN a user views their certificates THEN the System SHALL allow downloading as PDF and sharing to social media
5. WHEN uploading a certificate template THEN the System SHALL validate the template format and preview the result

### Requirement 24: QR Code Event Check-in

**User Story:** As an event organizer, I want QR-based check-in, so that I can efficiently track attendance at events.

#### Acceptance Criteria

1. WHEN an event is created THEN the System SHALL generate a unique QR code for the event
2. WHEN a student scans the event QR code THEN the System SHALL mark them as checked-in and update attendance
3. WHEN viewing event attendance THEN the System SHALL distinguish between registered and checked-in attendees
4. WHEN the check-in period ends THEN the System SHALL lock the attendance list for certificate generation
5. WHEN a student checks in THEN the System SHALL award karma points for attendance

### Requirement 25: Anonymous Posting and Confessions

**User Story:** As a student, I want to post anonymously, so that I can share feedback or confessions without revealing my identity.

#### Acceptance Criteria

1. WHEN creating a post THEN the System SHALL provide an option to post anonymously
2. WHEN viewing an anonymous post THEN the System SHALL display "Anonymous" as the author with no identifying information
3. WHEN an anonymous post violates guidelines THEN the System SHALL allow College Admins to review and take action
4. WHEN posting anonymously THEN the System SHALL show a warning about community guidelines
5. WHEN moderating anonymous posts THEN the System SHALL allow Platform Admins to reveal identity only for serious violations

### Requirement 26: Study Notes and Resources

**User Story:** As a student, I want to share and access study materials, so that I can collaborate academically with peers.

#### Acceptance Criteria

1. WHEN uploading notes THEN the System SHALL allow selecting subject, semester, course code, and university
2. WHEN browsing notes THEN the System SHALL allow filtering by subject, semester, and popularity
3. WHEN viewing a note THEN the System SHALL display preview, download count, likes, and uploader info
4. WHEN a note receives likes THEN the System SHALL award karma to the uploader
5. WHEN reporting inappropriate content THEN the System SHALL flag the note for College Admin review

### Requirement 27: Real-time Notifications and Updates

**User Story:** As a user, I want real-time notifications, so that I stay updated on relevant activities without refreshing.

#### Acceptance Criteria

1. WHEN a relevant action occurs (like, comment, event update) THEN the System SHALL push a real-time notification via Socket.io
2. WHEN viewing notifications THEN the System SHALL group them by type and show timestamps
3. WHEN clicking a notification THEN the System SHALL navigate to the relevant content and mark as read
4. WHEN configuring notification preferences THEN the System SHALL allow enabling/disabling specific notification types
5. WHEN the user is offline THEN the System SHALL queue notifications and deliver them on reconnection

### Requirement 28: Search and Discovery

**User Story:** As a user, I want powerful search functionality, so that I can find content, people, and events quickly.

#### Acceptance Criteria

1. WHEN using global search THEN the System SHALL search across posts, events, clubs, users, and marketplace listings
2. WHEN displaying search results THEN the System SHALL group results by category with relevant previews
3. WHEN searching users THEN the System SHALL show name, college, and mutual connections
4. WHEN searching events THEN the System SHALL show date, venue, and RSVP count
5. WHEN no results are found THEN the System SHALL suggest related searches or popular content

### Requirement 29: Bookmarks and Saved Content

**User Story:** As a user, I want to save content for later, so that I can easily access important posts, events, and listings.

#### Acceptance Criteria

1. WHEN saving content THEN the System SHALL add it to the user's saved items with timestamp
2. WHEN viewing saved items THEN the System SHALL display them organized by type (posts, events, listings, notes)
3. WHEN removing a saved item THEN the System SHALL remove it from the saved list immediately
4. WHEN saved content is deleted by author THEN the System SHALL show "Content no longer available" placeholder
5. WHEN viewing saved items THEN the System SHALL allow filtering by content type and date

### Requirement 30: User Blocking and Privacy

**User Story:** As a user, I want to control who can interact with me, so that I can maintain a safe and comfortable experience.

#### Acceptance Criteria

1. WHEN blocking a user THEN the System SHALL hide their content from the blocker's feed
2. WHEN blocked THEN the System SHALL prevent the blocked user from messaging, commenting on, or viewing the blocker's profile
3. WHEN viewing blocked users THEN the System SHALL display a list with unblock options
4. WHEN reporting a user THEN the System SHALL submit a report to College Admins with reason and evidence
5. WHEN a user is reported multiple times THEN the System SHALL escalate to Platform Admin review


### Requirement 31: Framer Motion Animations

**User Story:** As a user, I want smooth, modern animations throughout the platform, so that the experience feels polished and engaging.

#### Acceptance Criteria

1. WHEN navigating between pages THEN the System SHALL apply page transition animations using Framer Motion (fade, slide)
2. WHEN feed items load THEN the System SHALL animate them with staggered entrance effects using Framer Motion variants
3. WHEN opening modals or dropdowns THEN the System SHALL apply scale and fade animations with AnimatePresence
4. WHEN hovering over cards and buttons THEN the System SHALL apply subtle scale, rotation, or shadow animations using whileHover
5. WHEN scrolling the page THEN the System SHALL trigger scroll-based animations for sections using useInView hook
6. WHEN liking or saving content THEN the System SHALL apply micro-interactions (heart pop, bookmark slide) using spring animations
7. WHEN the sidebar widgets render THEN the System SHALL apply a gentle floating or wiggle animation to decorative elements
8. WHEN loading states occur THEN the System SHALL display animated skeleton loaders with shimmer effects

### Requirement 32: Codebase Cleanup

**User Story:** As a developer, I want a clean and organized codebase, so that the project is maintainable and free of unused code.

#### Acceptance Criteria

1. WHEN reviewing the codebase THEN the System SHALL identify and remove unused component files (excluding images and SVGs)
2. WHEN reviewing imports THEN the System SHALL remove unused imports and dead code from all TypeScript/JavaScript files
3. WHEN reviewing dependencies THEN the System SHALL identify unused npm packages for removal
4. WHEN reviewing test output files THEN the System SHALL remove temporary test output files (e.g., test_output.txt, e2e-output.txt)
5. WHEN reviewing log files THEN the System SHALL remove development log files (e.g., error.log, build_log.txt)
6. WHEN organizing components THEN the System SHALL ensure consistent file naming and folder structure
7. WHEN reviewing the codebase THEN the System SHALL preserve all image files (.jpg, .png, .gif) and SVG files (.svg)

### Requirement 33: Backend API Completeness

**User Story:** As a frontend developer, I want all API endpoints to be functional, so that the frontend can fetch user data without 404 errors.

#### Acceptance Criteria

1. WHEN the frontend calls GET /users/:id/clubs THEN the System SHALL return the list of clubs the user has joined
2. WHEN the frontend calls GET /users/:id/events THEN the System SHALL return the list of events the user has attended or RSVP'd to
3. WHEN the frontend calls GET /users/:id/posts THEN the System SHALL return the list of posts created by the user
4. WHEN the frontend calls GET /notifications THEN the System SHALL return the user's notifications without 404 error
5. WHEN any API endpoint is called THEN the System SHALL return appropriate error responses with status codes and messages

### Requirement 34: Mandatory Onboarding Enforcement

**User Story:** As a platform administrator, I want users to complete mandatory onboarding fields, so that all users have essential profile information.

#### Acceptance Criteria

1. WHEN a user logs in via Google OAuth without a college selected THEN the System SHALL redirect to the onboarding flow
2. WHEN a user attempts to access the dashboard without completing mandatory fields (fullName, collegeId) THEN the System SHALL redirect to onboarding
3. WHEN checking onboarding status THEN the System SHALL verify both isOnboarded flag AND presence of mandatory fields
4. WHEN a user completes onboarding THEN the System SHALL validate that all mandatory fields are filled before allowing completion
5. WHEN displaying onboarding THEN the System SHALL clearly mark mandatory fields with visual indicators

### Requirement 35: Visual Design Refinements

**User Story:** As a user, I want a visually comfortable interface, so that I can use the platform without eye strain.

#### Acceptance Criteria

1. WHEN displaying white backgrounds THEN the System SHALL use off-white or cream tones (paper color) instead of pure white
2. WHEN displaying search inputs and form fields THEN the System SHALL use muted background colors that match the retro aesthetic
3. WHEN displaying interactive elements THEN the System SHALL use black-outlined icons and doodles instead of emojis
4. WHEN displaying text on colored backgrounds THEN the System SHALL ensure sufficient contrast ratio (minimum 4.5:1)
5. WHEN the carousel/ticker renders THEN the System SHALL display smoothly with proper timing and no visual glitches

### Requirement 36: PWA Configuration

**User Story:** As a mobile user, I want to install the app on my device, so that I can access it like a native application.

#### Acceptance Criteria

1. WHEN the PWA manifest is loaded THEN the System SHALL include app name, icons, theme color, and display mode
2. WHEN a user visits on mobile THEN the System SHALL prompt for PWA installation when criteria are met
3. WHEN the app is installed THEN the System SHALL display the app icon and splash screen correctly
4. WHEN offline THEN the System SHALL display a cached version or offline message
5. WHEN the service worker is registered THEN the System SHALL cache essential assets for offline access

### Requirement 37: Login/Register Page Layout

**User Story:** As a new user, I want the login and register pages to fit on one screen, so that I can complete authentication without scrolling.

#### Acceptance Criteria

1. WHEN viewing the login page on desktop THEN the System SHALL display the entire form without vertical scrolling
2. WHEN viewing the register page on desktop THEN the System SHALL display all fields in a compact layout without scrolling
3. WHEN viewing auth pages on mobile THEN the System SHALL optimize the layout for the viewport height
4. WHEN the form content exceeds viewport THEN the System SHALL use a compact design with smaller spacing
5. WHEN displaying auth pages THEN the System SHALL show a minimal navbar with only the logo
