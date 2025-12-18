# Requirements Document

## Introduction

This specification covers a comprehensive dashboard overhaul to transform LINKER into a complete social networking platform. The focus areas include: visual design improvements (curved card edges, black/yellow carousel, dot pattern backgrounds), mobile responsiveness (hiding navigation bar on mobile), sticky header behavior, color accessibility (reducing bright yellow/white), and a modernized unified post creation system that merges polls, events, collaborations, and reports into a single interface. Additionally, this spec addresses search functionality fixes and messaging improvements.

## Glossary

- **Dashboard**: The main social feed page where users view and create posts
- **Carousel/Ticker**: The scrolling announcement banner below the navbar with tilted design
- **CategoryRibbon**: The horizontal navigation tabs (Home, Campus, Events, Market, Chat)
- **Post Creation Modal**: The interface for creating new content (posts, polls, events, collaborations)
- **Sticky Header**: A header that remains fixed at the top while the main content scrolls
- **Dot Pattern**: A subtle background pattern of small dots for visual texture
- **GlobalSearch**: The search component for finding users, posts, events, and content

## Requirements

### Requirement 1: Card Edge Design

**User Story:** As a user, I want all cards to have curved edges, so that the interface feels modern and cohesive.

#### Acceptance Criteria

1. WHEN displaying any card component THEN the System SHALL apply rounded corners with a minimum radius of 12px
2. WHEN displaying feed post cards THEN the System SHALL use consistent border-radius across all card types
3. WHEN displaying sidebar cards THEN the System SHALL match the border-radius of feed cards
4. WHEN displaying modal cards THEN the System SHALL apply the same curved edge styling

### Requirement 2: Carousel/Ticker Redesign

**User Story:** As a user, I want a visually striking black and yellow carousel with decorative elements, so that announcements stand out.

#### Acceptance Criteria

1. WHEN displaying the carousel THEN the System SHALL use a black background with yellow text and accents
2. WHEN displaying the carousel THEN the System SHALL include decorative slash (//) elements as visual separators
3. WHEN displaying the carousel THEN the System SHALL increase the height to improve visibility and readability
4. WHEN animating the carousel THEN the System SHALL provide smooth continuous scrolling
5. WHEN displaying carousel content THEN the System SHALL use bold typography for emphasis

### Requirement 3: Mobile Navigation Visibility

**User Story:** As a mobile user, I want the CategoryRibbon (Home, Campus, Events, Market, Chat) hidden on mobile, so that I have more screen space for content.

#### Acceptance Criteria

1. WHEN viewing on mobile devices (width < 768px) THEN the System SHALL hide the CategoryRibbon navigation bar
2. WHEN viewing on mobile THEN the System SHALL rely on the bottom ArcMenu for navigation
3. WHEN viewing on desktop THEN the System SHALL display the CategoryRibbon normally
4. WHEN transitioning between breakpoints THEN the System SHALL smoothly show/hide the CategoryRibbon

### Requirement 4: Background Dot Pattern

**User Story:** As a user, I want a subtle dot pattern on the main content background, so that the header and body are visually distinct.

#### Acceptance Criteria

1. WHEN displaying the main content area THEN the System SHALL apply a subtle dot pattern background
2. WHEN displaying the dot pattern THEN the System SHALL use small, evenly spaced dots that are barely visible
3. WHEN displaying the dot pattern THEN the System SHALL ensure dots do not interfere with content readability
4. WHEN displaying the header THEN the System SHALL use a solid background without the dot pattern

### Requirement 5: Sticky Header Behavior

**User Story:** As a user, I want the header to stay fixed while scrolling, so that I always have access to navigation.

#### Acceptance Criteria

1. WHEN scrolling the page THEN the System SHALL keep the header fixed at the top of the viewport
2. WHEN scrolling THEN the System SHALL only scroll the main content body
3. WHEN the header is sticky THEN the System SHALL apply appropriate z-index to stay above content
4. WHEN the header is sticky THEN the System SHALL not overlap or hide any content

### Requirement 6: Hover Color Accessibility

**User Story:** As a user, I want hover states to use visible colors instead of bright yellow, so that I can see interactive feedback clearly.

#### Acceptance Criteria

1. WHEN hovering over buttons or interactive elements THEN the System SHALL NOT use bright yellow (#FFD700 or similar)
2. WHEN hovering over elements THEN the System SHALL use a darker or muted color that provides clear contrast
3. WHEN hovering over primary buttons THEN the System SHALL use a darker shade of the button color
4. WHEN hovering over text links THEN the System SHALL use a visible color change

### Requirement 7: White Color Reduction

**User Story:** As a user, I want less bright white colors throughout the interface, so that the design is easier on the eyes.

#### Acceptance Criteria

1. WHEN displaying backgrounds THEN the System SHALL use off-white or cream tones instead of pure white (#FFFFFF)
2. WHEN displaying cards THEN the System SHALL use paper-like background colors (e.g., #FAF9F6, #F5F5DC)
3. WHEN displaying input fields THEN the System SHALL use muted background colors
4. WHEN displaying text on backgrounds THEN the System SHALL maintain sufficient contrast for readability

### Requirement 8: Unified Post Creation System

**User Story:** As a user, I want a single modern post creation interface that combines all content types, so that I can easily create posts with polls, events, collaborations, or reports as optional additions.

#### Acceptance Criteria

1. WHEN opening the post creation modal THEN the System SHALL display a unified interface for all content types
2. WHEN creating a post THEN the System SHALL allow adding optional poll questions with multiple choice answers
3. WHEN creating a post THEN the System SHALL allow attaching event details (date, time, location)
4. WHEN creating a post THEN the System SHALL allow marking as collaboration request with requirements
5. WHEN creating a post THEN the System SHALL allow marking as report/feedback with category selection
6. WHEN creating a post THEN the System SHALL NOT include marketplace/sell options (these belong in Marketplace only)
7. WHEN displaying post type options THEN the System SHALL use toggle buttons or checkboxes for optional features
8. WHEN the modal renders THEN the System SHALL use modern design with smooth animations

### Requirement 9: Search Functionality Fix

**User Story:** As a user, I want the search to work correctly without displaying errors, so that I can find content and users.

#### Acceptance Criteria

1. WHEN clicking the search input THEN the System SHALL NOT display "000" or any error text at the bottom
2. WHEN searching for users THEN the System SHALL display matching results with profile information
3. WHEN clicking on a search result THEN the System SHALL navigate to the correct profile or content page
4. WHEN no results are found THEN the System SHALL display a helpful empty state message

### Requirement 10: Profile Messaging Integration

**User Story:** As a user, I want to message someone directly from their profile, so that I can easily connect with other users.

#### Acceptance Criteria

1. WHEN viewing another user's profile THEN the System SHALL display a message button
2. WHEN clicking the message button THEN the System SHALL open or create a conversation with that user
3. WHEN messaging a user THEN the System SHALL send a notification to the recipient
4. WHEN viewing a conversation THEN the System SHALL display the other user's profile icon and name in the header
5. WHEN clicking the profile icon/name in messages THEN the System SHALL navigate to that user's profile

