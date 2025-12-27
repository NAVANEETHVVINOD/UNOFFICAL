# Requirements Document

## Introduction

This document outlines the requirements for a comprehensive UI/UX overhaul and code quality improvement for the LINKER campus platform. The changes include removing dark mode (light mode only), improving the landing page, enhancing settings and profile pages, adding proper navigation components, implementing consistent typography with retro/sketch aesthetics, improving mobile responsiveness, and restructuring the codebase for better maintainability.

## Glossary

- **System**: The LINKER web application frontend
- **User**: Any person interacting with the LINKER platform
- **Nav_Box**: A sticky navigation component with horizontal scrollable tabs
- **Doodle**: Hand-drawn style SVG/image decorative elements
- **Typography_System**: Consistent font styling across the platform (retro pixel, cursive handwriting, sketch-like fonts)
- **Light_Mode**: The single theme mode (cream/paper background with black ink text)
- **Carousel**: Full-width sliding content component
- **Framer_Motion**: Animation library for React components

## Requirements

### Requirement 1: Light Mode Only on Landing Page

**User Story:** As a visitor, I want the landing page to have a consistent light-themed experience, so that the platform maintains its retro newspaper aesthetic for first impressions.

#### Acceptance Criteria

1. THE System SHALL force light mode on the landing page regardless of user preference
2. THE System SHALL restore user's theme preference when navigating away from landing page
3. THE System SHALL maintain dark mode toggle functionality on all other pages
4. THE System SHALL ensure the landing page renders with the paper/cream background (#FDF6E3)
5. THE System SHALL allow users to toggle between light and dark modes in settings and dashboard

### Requirement 2: Landing Page Content and UI Enhancement

**User Story:** As a visitor, I want an engaging landing page with complete content and proper visual hierarchy, so that I understand what LINKER offers.

#### Acceptance Criteria

1. THE System SHALL display a full-width hero section with the header background image
2. THE System SHALL implement an end-to-end carousel for featured content
3. WHEN the landing page loads, THE System SHALL display all feature sections (Events, Clubs, Marketplace, Notes, Messaging)
4. THE System SHALL place doodle decorations strategically throughout the page
5. THE System SHALL ensure the marquee/ticker runs smoothly across the full width
6. THE System SHALL display proper call-to-action buttons with retro styling
7. THE System SHALL show statistics and social proof sections

### Requirement 3: Typography System Implementation

**User Story:** As a user, I want consistent and visually appealing typography, so that the platform feels cohesive and matches the retro aesthetic.

#### Acceptance Criteria

1. THE System SHALL use retro pixel font (VT323) for headings and labels
2. THE System SHALL use cursive/handwriting font (Caveat) for quotes and emphasis
3. THE System SHALL use sketch-like font (Permanent Marker) for badges and stickers
4. THE System SHALL use display font (Outfit) for body text
5. THE System SHALL maintain consistent font sizes across breakpoints
6. THE System SHALL ensure all text is readable with proper contrast ratios

### Requirement 4: Settings Page Enhancement

**User Story:** As a user, I want a complete settings page with account management features, so that I can control my account and preferences.

#### Acceptance Criteria

1. THE System SHALL display a Nav_Box with tabs for different settings sections
2. THE System SHALL include a "Delete Account" option in the privacy/account section
3. THE System SHALL remove the dark mode toggle from appearance settings
4. THE System SHALL display notification preferences with proper toggles
5. THE System SHALL show blocked users management
6. THE System SHALL include links to privacy policy and terms of service
7. WHEN a user clicks "Delete Account", THE System SHALL show a confirmation dialog

### Requirement 5: Profile Page Enhancement

**User Story:** As a user, I want a complete profile page with proper navigation, so that I can view and manage my profile information effectively.

#### Acceptance Criteria

1. THE System SHALL display a Nav_Box with tabs (Activities, Projects, Experience, Education, Volunteering)
2. THE System SHALL show the profile header with avatar, name, bio, and stats
3. THE System SHALL enable swipe navigation between tabs on mobile
4. THE System SHALL display social links with proper icons
5. THE System SHALL show GitHub contributions graph if connected
6. THE System SHALL allow editing profile sections with modal forms

### Requirement 6: Navigation Box Component

**User Story:** As a user, I want consistent navigation across pages, so that I can easily switch between sections.

#### Acceptance Criteria

1. THE System SHALL create a reusable NavBox component
2. THE System SHALL make NavBox horizontally scrollable on mobile
3. THE System SHALL highlight the active tab with primary color
4. THE System SHALL support icons alongside tab labels
5. THE System SHALL stick to the top of the viewport when scrolling
6. THE System SHALL animate tab transitions smoothly

### Requirement 7: Mobile Responsiveness

**User Story:** As a mobile user, I want all pages to be fully responsive, so that I can use the platform comfortably on any device.

#### Acceptance Criteria

1. THE System SHALL ensure all pages render correctly on screens 320px and above
2. THE System SHALL implement proper touch targets (minimum 44px)
3. THE System SHALL hide desktop-only elements on mobile
4. THE System SHALL show mobile-specific navigation (BottomNav)
5. THE System SHALL enable swipe gestures for tab navigation
6. THE System SHALL ensure images and cards scale appropriately
7. THE System SHALL prevent horizontal overflow on all pages

### Requirement 8: Framer Motion Animations

**User Story:** As a user, I want smooth animations throughout the platform, so that interactions feel polished and engaging.

#### Acceptance Criteria

1. THE System SHALL animate page transitions with fade and slide effects
2. THE System SHALL animate card hover states
3. THE System SHALL animate modal open/close transitions
4. THE System SHALL animate tab content changes
5. THE System SHALL use staggered animations for list items
6. THE System SHALL ensure animations respect reduced-motion preferences

### Requirement 9: Doodle Integration

**User Story:** As a user, I want decorative doodles placed throughout the platform, so that it maintains its playful, sketch-like aesthetic.

#### Acceptance Criteria

1. THE System SHALL place doodles in empty states
2. THE System SHALL use doodles as section dividers
3. THE System SHALL animate doodles subtly (float, wiggle)
4. THE System SHALL ensure doodles don't interfere with content readability
5. THE System SHALL load doodles efficiently (lazy loading)

### Requirement 10: Code Quality and File Structure

**User Story:** As a developer, I want well-organized code with proper separation of concerns, so that the codebase is maintainable and scalable.

#### Acceptance Criteria

1. THE System SHALL organize components into logical folders (ui, layout, navigation, sections, forms)
2. THE System SHALL create reusable layout components (PageLayout, CardLayout, SectionLayout)
3. THE System SHALL extract common styles into utility classes
4. THE System SHALL use consistent naming conventions (PascalCase for components, camelCase for functions)
5. THE System SHALL remove unused files and dead code
6. THE System SHALL ensure all components have proper TypeScript types
7. THE System SHALL create shared hooks for common functionality

### Requirement 11: Carousel Component

**User Story:** As a user, I want full-width carousels for featured content, so that I can browse through highlights easily.

#### Acceptance Criteria

1. THE System SHALL create a reusable Carousel component
2. THE System SHALL support auto-play with pause on hover
3. THE System SHALL display navigation dots/arrows
4. THE System SHALL enable swipe navigation on touch devices
5. THE System SHALL span the full viewport width (edge-to-edge)
6. THE System SHALL support different content types (images, cards, text)

### Requirement 12: Page Loading States

**User Story:** As a user, I want proper loading states, so that I know the page is loading and don't see broken layouts.

#### Acceptance Criteria

1. THE System SHALL display skeleton loaders while content loads
2. THE System SHALL show loading spinners for async actions
3. THE System SHALL maintain layout stability during loading
4. THE System SHALL animate loading states smoothly
5. THE System SHALL handle error states gracefully with retry options

### Requirement 13: User Flow Optimization

**User Story:** As a user, I want intuitive navigation flows, so that I can accomplish tasks efficiently.

#### Acceptance Criteria

1. THE System SHALL provide clear navigation paths between related pages
2. THE System SHALL include back buttons on all detail pages
3. THE System SHALL maintain scroll position when returning to list pages
4. THE System SHALL show breadcrumbs on nested pages
5. THE System SHALL highlight current location in navigation
