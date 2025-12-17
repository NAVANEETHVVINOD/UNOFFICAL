# Design Document

## Overview

This design document outlines the UI/UX refresh for the LINKER platform, focusing on creating a more polished, professional interface while maintaining the retro/neo-brutalist aesthetic. The refresh includes a comprehensive profile page redesign inspired by modern portfolio apps, improved chat interface, better card visibility, streamlined navigation, and overall visual polish.

## Architecture

The UI refresh follows the existing component-based architecture with React/Next.js. Changes are primarily in the presentation layer:

```
apps/web/
├── app/
│   ├── profile/
│   │   └── ProfileClient.tsx      # Redesigned with tabs
│   ├── messages/[id]/
│   │   └── ChatClient.tsx         # Updated styling
│   ├── dashboard/
│   │   └── DashboardClient.tsx    # Remove Pro Tip, update cards
│   └── components/
│       ├── Navbar.tsx             # Mobile-responsive updates
│       ├── ui/
│       │   ├── TiltedTicker.tsx   # Larger, improved design
│       │   └── Button.tsx         # Updated hover states
│       └── profile/
│           ├── ProfileTabs.tsx    # New tab navigation
│           ├── ActivitiesTab.tsx  # Past events list
│           ├── ProjectsTab.tsx    # Project cards
│           ├── EducationTab.tsx   # Timeline format
│           ├── ExperienceTab.tsx  # Work history
│           └── VolunteeringTab.tsx # Volunteer work
├── tailwind.config.js             # Updated colors/shadows
└── globals.css                    # New utility classes
```

## Components and Interfaces

### Profile Page Components

```typescript
// ProfileTabs - Horizontal tab navigation
interface ProfileTab {
  id: 'activities' | 'projects' | 'experience' | 'education' | 'volunteering';
  label: string;
  icon: React.ComponentType;
}

// Activity Entry
interface ActivityEntry {
  id: string;
  eventName: string;
  eventIcon?: string;
  startDate: string;
  endDate?: string;
  status: 'ATTENDED' | 'REGISTERED' | 'MISSED';
}

// Project Entry
interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  link?: string;
}

// Education Entry
interface EducationEntry {
  id: string;
  yearStart: string;
  yearEnd: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
}

// Experience Entry
interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
}
```

### Updated Card Styling

```typescript
// Card variants with paper backgrounds
type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
}
```

### Button Hover States

```typescript
// Button variants with improved hover states
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children: React.ReactNode;
}
```

## Data Models

### Profile Extensions

```typescript
// Extended profile data for new sections
interface ExtendedProfile {
  // Existing fields
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  college?: College;
  tags?: string[];
  
  // New fields for profile sections
  projects?: ProjectEntry[];
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  volunteering?: ExperienceEntry[];
  githubUsername?: string;
  githubContributions?: number[];
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Profile tab navigation completeness
*For any* profile page render, the tab navigation SHALL contain all five required tabs: Activities, Projects, Experience, Education, and Volunteering with proper labels and icons.
**Validates: Requirements 1.1**

### Property 2: Profile header data completeness
*For any* user profile with data, the header section SHALL display the username handle, avatar (or placeholder), full name, college name (or "No Campus Selected"), and bio if present.
**Validates: Requirements 1.2**

### Property 3: Activity entry data completeness
*For any* activity entry in the Activities tab, the display SHALL include event name, date/time range, and attendance status badge.
**Validates: Requirements 1.4**

### Property 4: Card background consistency
*For any* card component rendered in the application, the background color SHALL use paper/cream tones (bg-paper, bg-paper-light, or bg-paper-dark) instead of pure white (bg-white).
**Validates: Requirements 3.1, 3.2, 9.1**

### Property 5: Mobile navbar simplification
*For any* viewport width below 768px, the navbar SHALL hide notification and profile buttons, displaying only the logo and search functionality.
**Validates: Requirements 4.1, 4.2**

### Property 6: Ticker design properties
*For any* ticker/carousel render, the component SHALL use SVG icons (not emojis), apply rotation transform, use text size of at least text-lg, and have smooth animation.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 7: Button hover state visibility
*For any* primary button hover state, the background color SHALL change to a darker shade (primary-600 or darker) that provides visible contrast against the default primary color.
**Validates: Requirements 6.1, 6.2**

### Property 8: College requirement enforcement
*For any* user without a collegeId set, accessing protected pages (dashboard, campus, profile) SHALL redirect to the onboarding flow with college selection step.
**Validates: Requirements 8.1, 8.2, 8.3**

### Property 9: Empty state pattern
*For any* section (Experience, Volunteering, Projects) with no data, the display SHALL show a helpful icon and an "Add +" button for adding new entries.
**Validates: Requirements 1.7, 1.8, 9.4**

### Property 10: Chat message distinction
*For any* chat conversation, sent messages SHALL have visually distinct styling (different background color, alignment) from received messages.
**Validates: Requirements 2.1, 2.2**

## Error Handling

- Profile sections with missing data display empty states with "Add +" buttons
- Failed API calls show retry options with error messages
- Invalid profile data gracefully degrades to placeholder content
- Navigation errors redirect to appropriate fallback pages

## Testing Strategy

### Dual Testing Approach

**Property-Based Testing Library:** fast-check (already configured in the project)

**Unit Tests:**
- Test individual component rendering
- Test tab switching behavior
- Test responsive breakpoint behavior
- Test button state transitions

**Property-Based Tests:**
- Each correctness property above will be implemented as a property-based test
- Tests will generate random valid inputs and verify properties hold
- Minimum 100 iterations per property test
- Tests tagged with format: `**Feature: ui-design-refresh, Property {number}: {property_text}**`

### Test File Structure

```
apps/web/__tests__/
├── properties/
│   ├── profile-tabs.property.test.ts
│   ├── card-styling.property.test.ts
│   ├── navbar-mobile.property.test.ts
│   ├── ticker-design.property.test.ts
│   ├── button-hover.property.test.ts
│   └── college-requirement.property.test.ts
```
