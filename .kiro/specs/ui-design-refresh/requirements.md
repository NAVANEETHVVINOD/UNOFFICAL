# Requirements Document

## Introduction

This specification covers a comprehensive UI/UX refresh for the LINKER platform, focusing on improving the profile page design (inspired by reference images), chat interface, card visibility, navigation improvements, and overall visual polish. The goal is to create a more professional, cohesive design that matches the retro/neo-brutalist aesthetic while improving usability.

## Glossary

- **LINKER**: The campus social platform application
- **Profile Page**: User profile display with activities, projects, education, and social information
- **Chat Interface**: Real-time messaging between users
- **Card**: UI component displaying content in a bordered container
- **Ticker/Carousel**: Scrolling announcement banner below the navbar
- **Bottom Nav**: Mobile navigation bar at the bottom of the screen
- **Onboarding**: User registration flow including college selection

## Requirements

### Requirement 1: Profile Page Redesign

**User Story:** As a user, I want a comprehensive profile page with multiple sections, so that I can showcase my activities, projects, education, and experience.

#### Acceptance Criteria

1. WHEN a user views a profile THEN the system SHALL display a horizontal tab navigation with sections: Activities, Projects, Experience, Education, Volunteering
2. WHEN viewing the profile header THEN the system SHALL display username handle, avatar, full name, college, bio, and edit profile button
3. WHEN viewing interests THEN the system SHALL display interest tags with icons in a horizontal scrollable row
4. WHEN viewing the Activities tab THEN the system SHALL display past events with event name, date/time, and attendance status badge
5. WHEN viewing the Projects tab THEN the system SHALL display project cards with image, title, description, and category tags
6. WHEN viewing the Education tab THEN the system SHALL display education entries with year range, degree, field, and institution in a timeline format
7. WHEN viewing the Experience tab THEN the system SHALL display work history with an "Add +" button for empty states
8. WHEN viewing the Volunteering tab THEN the system SHALL display volunteer work with an "Add +" button for empty states
9. WHEN the profile has GitHub connected THEN the system SHALL display a contribution graph showing activity over time

### Requirement 2: Chat Interface Improvements

**User Story:** As a user, I want an improved chat interface, so that I can have better conversations with other users.

#### Acceptance Criteria

1. WHEN viewing a chat THEN the system SHALL display messages with clear visual distinction between sent and received
2. WHEN viewing chat bubbles THEN the system SHALL use softer colors that match the paper/cream aesthetic
3. WHEN typing a message THEN the system SHALL display a typing indicator to the other user
4. WHEN viewing message timestamps THEN the system SHALL display them in a subtle, non-intrusive format

### Requirement 3: Card Design Improvements

**User Story:** As a user, I want cards that are visually distinct and readable, so that I can easily scan content.

#### Acceptance Criteria

1. WHEN displaying cards THEN the system SHALL use paper/cream background colors instead of pure white
2. WHEN displaying cards THEN the system SHALL add subtle shadows and borders for depth
3. WHEN hovering over cards THEN the system SHALL provide visual feedback with shadow or scale changes
4. WHEN displaying card content THEN the system SHALL ensure proper contrast for readability

### Requirement 4: Navigation Improvements

**User Story:** As a user, I want streamlined navigation that works well on both desktop and mobile.

#### Acceptance Criteria

1. WHEN viewing on mobile THEN the system SHALL hide navbar action buttons (notifications, profile) since bottom nav handles these
2. WHEN viewing on mobile THEN the system SHALL display only the logo and search in the navbar
3. WHEN using bottom navigation THEN the system SHALL provide access to all main sections
4. WHEN navigating THEN the system SHALL maintain consistent behavior across devices

### Requirement 5: Ticker/Carousel Improvements

**User Story:** As a user, I want an improved announcement ticker that is visually appealing and readable.

#### Acceptance Criteria

1. WHEN displaying the ticker THEN the system SHALL use a tilted design with proper rotation
2. WHEN displaying the ticker THEN the system SHALL be slightly larger for better readability
3. WHEN displaying ticker content THEN the system SHALL use icons instead of emojis
4. WHEN animating the ticker THEN the system SHALL provide smooth, seamless scrolling

### Requirement 6: Button Hover States

**User Story:** As a user, I want clear visual feedback when interacting with buttons.

#### Acceptance Criteria

1. WHEN hovering over buttons THEN the system SHALL display a visible color change that contrasts with the button
2. WHEN hovering over primary buttons THEN the system SHALL use a darker shade instead of bright yellow
3. WHEN pressing buttons THEN the system SHALL provide tactile feedback with scale animation
4. WHEN buttons are disabled THEN the system SHALL display a muted appearance

### Requirement 7: Remove Pro Tip Widget

**User Story:** As a user, I want a cleaner dashboard without promotional content.

#### Acceptance Criteria

1. WHEN viewing the dashboard THEN the system SHALL NOT display the "Pro Tip" widget in the right sidebar
2. WHEN viewing the dashboard THEN the system SHALL display only relevant content widgets

### Requirement 8: Mandatory College Selection

**User Story:** As a user, I want to be guided to complete my profile with college selection, so that I can access campus-specific features.

#### Acceptance Criteria

1. WHEN a user has not selected a college THEN the system SHALL redirect them to onboarding
2. WHEN accessing campus page without college THEN the system SHALL redirect to college selection step
3. WHEN completing onboarding THEN the system SHALL require college selection before proceeding
4. WHEN viewing profile sidebar THEN the system SHALL show "No Campus Selected" if college is not set

### Requirement 9: Overall Visual Polish

**User Story:** As a user, I want a polished, cohesive visual design throughout the application.

#### Acceptance Criteria

1. WHEN displaying backgrounds THEN the system SHALL use paper/cream tones consistently
2. WHEN displaying text THEN the system SHALL ensure proper contrast and readability
3. WHEN displaying interactive elements THEN the system SHALL provide clear affordances
4. WHEN displaying empty states THEN the system SHALL show helpful icons and "Add +" buttons
