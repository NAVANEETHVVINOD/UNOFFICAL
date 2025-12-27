# Requirements Document

## Introduction

This document specifies the requirements for redesigning the navigation structure and explore page in LINKER. The goal is to simplify navigation by consolidating feeds, creating a professional college information page, and streamlining the explore page to show only 4 key feature cards.

## Glossary

- **NavBox**: The CategoryRibbon component that provides main navigation on desktop
- **Global_Dashboard**: The main dashboard at `/dashboard` showing unified feed from all sources
- **College_Page**: The dedicated page for a specific college at `/colleges/[slug]`
- **Explore_Page**: The discovery hub at `/explore` for finding features
- **System**: The LINKER web application

## Requirements

### Requirement 1: Consistent NavBox Across All Pages

**User Story:** As a user, I want consistent navigation across all pages, so that I can easily navigate without confusion.

#### Acceptance Criteria

1. THE NavBox SHALL have consistent sizing and styling across all pages
2. THE NavBox SHALL NOT be tilted or rotated on any page
3. THE NavBox SHALL NOT overlap with carousels or other content
4. THE NavBox SHALL be positioned at the top of the content area below the main navbar

#### 1.1 Global Pages NavBox (Dashboard, Explore, Chat)

1. THE Global_Dashboard, Explore_Page, and Messages_Page SHALL display a NavBox with 4 items: Home, Explore, Chat, and College
2. WHEN a user clicks Home, THE System SHALL navigate to `/dashboard`
3. WHEN a user clicks Explore, THE System SHALL navigate to `/explore`
4. WHEN a user clicks Chat, THE System SHALL navigate to `/messages`
5. WHEN a user clicks College, THE System SHALL navigate to the user's college page

#### 1.2 College-Related Pages NavBox (College Page, Clubs)

1. THE College_Page and Clubs_Page SHALL display a NavBox with 3 items: Home, College, and Clubs
2. WHEN a user clicks Home, THE System SHALL navigate to `/dashboard`
3. WHEN a user clicks College, THE System SHALL navigate to the user's college page (`/colleges/[slug]`)
4. WHEN a user clicks Clubs, THE System SHALL navigate to `/clubs`

### Requirement 2: Merge College Feed into Global Dashboard

**User Story:** As a user, I want to see all posts in one unified feed, so that I don't have to switch between college and global feeds.

#### Acceptance Criteria

1. THE Global_Dashboard SHALL display posts from both college-specific and global sources in a single feed
2. THE System SHALL remove the separate college feed page functionality
3. WHEN displaying the unified feed, THE System SHALL sort posts by creation date (newest first)

### Requirement 3: Redesign College Page as Information Hub

**User Story:** As a user, I want the college page to show comprehensive information about my college, so that I can learn about my campus and its features.

#### Acceptance Criteria

1. WHEN a user navigates to the College_Page, THE System SHALL display a professional college information layout
2. THE College_Page SHALL display the college name, logo/icon, and location prominently
3. THE College_Page SHALL display college description and key statistics (members, clubs, events count)
4. THE College_Page SHALL provide quick access links to college-specific events, marketplace, and clubs
5. THE College_Page SHALL NOT display a feed/posts section (feed is now in global dashboard)
6. THE College_Page SHALL be mobile-responsive with proper spacing and layout

### Requirement 4: Redesign Explore Page with 4 Feature Cards

**User Story:** As a user, I want the explore page to show only the main features as cards, so that I can quickly discover and access key functionality.

#### Acceptance Criteria

1. THE Explore_Page SHALL display exactly 4 feature cards: Events, Marketplace, Collaborations, and Resources
2. THE Explore_Page SHALL remove the colleges listing card
3. THE Explore_Page SHALL remove the clubs card (clubs now in NavBox)
4. WHEN a user clicks the Events card, THE System SHALL navigate to `/events`
5. WHEN a user clicks the Marketplace card, THE System SHALL navigate to `/marketplace`
6. WHEN a user clicks the Collaborations card, THE System SHALL navigate to `/collabo`
7. WHEN a user clicks the Resources card, THE System SHALL navigate to `/resources`
8. THE Explore_Page SHALL use a responsive grid layout (2x2 on mobile, flexible on desktop)
9. THE Explore_Page SHALL have visually distinct, professional card designs with icons and descriptions

### Requirement 5: Mobile-Friendly Design

**User Story:** As a mobile user, I want all pages to be properly responsive, so that I can use the app comfortably on my phone.

#### Acceptance Criteria

1. THE Explore_Page cards SHALL stack in a 2-column grid on mobile devices
2. THE College_Page SHALL have appropriate padding and spacing on mobile
3. THE NavBox SHALL remain hidden on mobile (BottomNav handles mobile navigation)
4. WHEN viewing on mobile, THE System SHALL ensure all text is readable and buttons are tappable
