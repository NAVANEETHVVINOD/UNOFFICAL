# Design Document: Navigation & Explore Page Redesign

## Overview

This design document outlines the technical approach for redesigning the navigation structure and explore page in LINKER. The changes include creating consistent NavBox navigation across pages, transforming the college page into an information hub, and simplifying the explore page to show only 4 feature cards.

## Architecture

The redesign follows the existing Next.js App Router architecture with React components. Key changes:

1. **CategoryRibbon Component** - Modified to accept a `variant` prop for different navigation contexts
2. **CollegeFeed Component** - Replaced with a new CollegeInfo component
3. **ExploreClient Component** - Simplified to show only 4 cards
4. **Layout Integration** - NavBox added to college layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Navbar                                │
├─────────────────────────────────────────────────────────────┤
│  NavBox (variant: 'global' | 'college')                     │
│  ┌─────────┬─────────┬─────────┬─────────┐                  │
│  │  Home   │ Explore │  Chat   │ College │  (global)        │
│  └─────────┴─────────┴─────────┴─────────┘                  │
│  ┌─────────┬─────────┬─────────┐                            │
│  │  Home   │ College │  Clubs  │           (college)        │
│  └─────────┴─────────┴─────────┘                            │
├─────────────────────────────────────────────────────────────┤
│                     Page Content                             │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### CategoryRibbon (NavBox) Component

```typescript
interface CategoryRibbonProps {
  variant?: 'global' | 'college';
  className?: string;
}

// Global variant items
const GLOBAL_CATEGORIES = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
  { id: 'chat', label: 'Chat', icon: MessageCircle, path: '/messages' },
  { id: 'college', label: 'College', icon: GraduationCap, path: collegeHref },
];

// College variant items
const COLLEGE_CATEGORIES = [
  { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
  { id: 'college', label: 'College', icon: GraduationCap, path: collegeHref },
  { id: 'clubs', label: 'Clubs', icon: Users, path: '/clubs' },
];
```

### CollegeInfo Component (New)

Replaces CollegeFeed with a professional information page.

```typescript
interface CollegeInfoProps {
  college: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    city?: string;
    state?: string;
    logoUrl?: string;
  };
  stats: {
    totalClubs: number;
    totalEvents: number;
    totalMembers: number;
    totalNotes: number;
  };
}
```

### Explore Page Cards

```typescript
const EXPLORE_CARDS = [
  {
    id: 'events',
    label: 'Events',
    description: 'Discover campus events, workshops, and meetups',
    icon: Calendar,
    color: 'bg-accent-coral',
    path: '/events',
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    description: 'Buy, sell, and trade with other students',
    icon: ShoppingBag,
    color: 'bg-primary',
    path: '/marketplace',
  },
  {
    id: 'collabo',
    label: 'Collaborations',
    description: 'Find teammates for projects and hackathons',
    icon: Users,
    color: 'bg-accent-mint',
    path: '/collabo',
  },
  {
    id: 'resources',
    label: 'Resources',
    description: 'Notes, guides, and academic help',
    icon: BookOpen,
    color: 'bg-accent-purple',
    path: '/resources',
  },
];
```

## Data Models

No new data models required. Uses existing:
- `College` entity from Prisma schema
- `CollegeStats` interface for statistics

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: NavBox Consistency

*For any* page rendering the NavBox component, the NavBox SHALL have no rotation transform applied and SHALL maintain consistent dimensions.

**Validates: Requirements 1.1, 1.2**

### Property 2: NavBox Item Count by Context

*For any* NavBox rendered with variant 'global', it SHALL contain exactly 4 navigation items. *For any* NavBox rendered with variant 'college', it SHALL contain exactly 3 navigation items.

**Validates: Requirements 1.1.1, 1.2.1**

### Property 3: Feed Sorting

*For any* list of feed items displayed in the global dashboard, the items SHALL be sorted by createdAt in descending order (newest first).

**Validates: Requirements 2.3**

### Property 4: Explore Page Card Count

*For any* rendering of the Explore page, it SHALL display exactly 4 feature cards.

**Validates: Requirements 4.1**

## Error Handling

- If college data fails to load, display a fallback UI with college slug as name
- If stats fail to load, display "0" for all statistics
- NavBox gracefully handles missing college slug by linking to `/my-college`

## Testing Strategy

### Unit Tests
- Test NavBox renders correct items for each variant
- Test navigation click handlers
- Test CollegeInfo displays all required fields

### Property-Based Tests
Using `vitest` and `fast-check`:

1. **NavBox Consistency Test** - Generate random page contexts, verify NavBox has no rotation and consistent styling
2. **NavBox Item Count Test** - For global variant, always 4 items; for college variant, always 3 items
3. **Feed Sorting Test** - Generate random feed items, verify sorted by date descending
4. **Explore Card Count Test** - Verify exactly 4 cards rendered

Configuration:
- Minimum 100 iterations per property test
- Tag format: **Feature: navigation-explore-redesign, Property N: description**
