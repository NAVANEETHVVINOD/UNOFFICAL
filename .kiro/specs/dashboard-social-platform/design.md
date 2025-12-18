# Design Document: Dashboard Social Platform Overhaul

## Overview

This design document outlines the implementation of a comprehensive dashboard UI overhaul for the LINKER platform. The changes focus on visual refinements (curved cards, black/yellow carousel, dot patterns), responsive behavior (hiding CategoryRibbon on mobile), sticky header, color accessibility improvements, and a modernized unified post creation system.

The implementation will modify existing components rather than creating new ones, ensuring backward compatibility while delivering a more polished user experience.

## Architecture

### Component Hierarchy

```
DashboardClient
├── Navbar (sticky header)
│   └── TiltedTicker (black/yellow carousel)
├── CategoryRibbon (hidden on mobile)
├── Main Content Area (dot pattern background)
│   ├── ProfileSidebar (curved cards)
│   ├── Feed (curved post cards)
│   └── Widgets (curved cards)
├── ArcMenu (mobile navigation)
└── CreatePostModal (unified post creation)
```

### Styling Strategy

All styling changes will be implemented through:
1. Tailwind CSS utility classes
2. CSS custom properties in `globals.css`
3. Tailwind config extensions in `tailwind.config.js`

## Components and Interfaces

### 1. Card Styling System

**File:** `apps/web/tailwind.config.js`

Add new border-radius utilities:
```javascript
borderRadius: {
  'card': '12px',
  'card-lg': '16px',
  'card-xl': '20px',
}
```

**Affected Components:**
- `ProfileSidebar.tsx` - Apply `rounded-card` class
- `FeedItemFactory.tsx` - Apply `rounded-card` to all feed cards
- `CreatePostModal.tsx` - Apply `rounded-card-lg` to modal
- All sidebar widgets - Apply `rounded-card` class

### 2. Carousel/Ticker Redesign

**File:** `apps/web/app/components/Navbar.tsx`

New ticker design specifications:
- Background: `bg-ink` (black)
- Text: `text-primary` (yellow)
- Height: `py-2.5` (increased from `py-1.5`)
- Decorative separators: `//` between items
- Typography: `font-bold uppercase tracking-wider`

```typescript
interface TickerItem {
  text: string;
  icon?: string; // Optional icon instead of emoji
}
```

### 3. CategoryRibbon Responsive Behavior

**File:** `apps/web/app/components/CategoryRibbon.tsx`

Add responsive visibility:
```typescript
// Hide on mobile (< 768px), show on desktop
className="hidden md:flex ..."
```

### 4. Dot Pattern Background

**File:** `apps/web/app/globals.css`

New CSS custom property:
```css
.bg-dots-subtle {
  background-image: radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

**File:** `apps/web/app/dashboard/DashboardClient.tsx`

Apply to main content wrapper while keeping header solid.

### 5. Sticky Header Implementation

**File:** `apps/web/app/components/Navbar.tsx`

Current implementation already uses `fixed top-0`. Ensure:
- `z-50` for proper stacking
- Main content has `pt-16 md:pt-20` padding

### 6. Color Accessibility Updates

**File:** `apps/web/tailwind.config.js`

New hover color utilities:
```javascript
colors: {
  hover: {
    primary: '#E6D435', // Darker yellow for hover
    muted: '#D4C92F',   // Even more muted
  }
}
```

**File:** `apps/web/app/globals.css`

Override bright yellow hover states:
```css
.hover\:bg-primary:hover {
  background-color: #E6D435 !important;
}
```

### 7. White Color Reduction

Update all `bg-white` usages to `bg-paper` or `bg-paper-light`:
- Cards: `bg-paper`
- Inputs: `bg-input-bg`
- Modals: `bg-paper`

### 8. Unified Post Creation Modal

**File:** `apps/web/app/components/CreatePostModal.tsx`

New unified interface structure:

```typescript
interface UnifiedPostData {
  content: string;
  isAnonymous: boolean;
  attachments: {
    poll?: {
      question: string;
      options: string[];
    };
    event?: {
      title: string;
      date: string;
      time: string;
      location: string;
    };
    collaboration?: {
      title: string;
      skills: string[];
      description: string;
    };
    report?: {
      category: string;
      isAnonymous: boolean;
    };
  };
  media?: File[];
}
```

Remove separate tabs, use toggle buttons for optional features.

### 9. GlobalSearch Fix

**File:** `apps/web/app/components/GlobalSearch.tsx`

Fix the "000" display issue by:
1. Removing any debug output
2. Ensuring proper error handling
3. Adding proper empty state handling

### 10. Profile Messaging Integration

**Files:**
- `apps/web/app/profile/[id]/page.tsx` - Add message button
- `apps/web/app/messages/[id]/page.tsx` - Add profile link in header

## Data Models

### UnifiedPost Schema

```typescript
interface UnifiedPost {
  id: string;
  content: string;
  authorId: string;
  isAnonymous: boolean;
  type: 'standard' | 'poll' | 'event' | 'collaboration' | 'report';
  
  // Optional attachments
  poll?: {
    question: string;
    options: PollOption[];
    expiresAt?: Date;
  };
  
  event?: {
    title: string;
    startsAt: Date;
    endsAt?: Date;
    location: string;
    maxAttendees?: number;
  };
  
  collaboration?: {
    title: string;
    skills: string[];
    deadline?: Date;
  };
  
  report?: {
    category: 'feedback' | 'issue' | 'suggestion';
  };
  
  media?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing the acceptance criteria, the following redundancies were identified and consolidated:
- Properties 1.1-1.4 (card border-radius) consolidated into Property 1
- Properties 3.1-3.3 (responsive visibility) consolidated into Property 2
- Properties 5.1-5.2, 5.4 (sticky header) consolidated into Property 3
- Properties 6.1-6.4 (hover colors) consolidated into Property 4
- Properties 7.1-7.3 (white reduction) consolidated into Property 5
- Properties 9.2-9.3 (search navigation) consolidated into Property 6
- Properties 10.2-10.3, 10.5 (messaging) consolidated into Property 7

### Correctness Properties

**Property 1: Card Border Radius Consistency**
*For any* card component (feed cards, sidebar cards, modal cards), the rendered element SHALL have a border-radius of at least 12px applied.
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

**Property 2: CategoryRibbon Responsive Visibility**
*For any* viewport width, the CategoryRibbon SHALL be hidden when width < 768px and visible when width >= 768px.
**Validates: Requirements 3.1, 3.2, 3.3**

**Property 3: Sticky Header Behavior**
*For any* scroll position, the header SHALL remain fixed at the top of the viewport and the main content SHALL have sufficient top padding to prevent overlap.
**Validates: Requirements 5.1, 5.2, 5.4**

**Property 4: Hover Color Accessibility**
*For any* interactive element with a hover state, the hover color SHALL NOT be bright yellow (#FFD700, #FFEB3B) and SHALL provide visible contrast from the default state.
**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

**Property 5: Background Color Accessibility**
*For any* background color used on cards, inputs, or content areas, the color SHALL NOT be pure white (#FFFFFF) and SHALL be within the paper/cream color range.
**Validates: Requirements 7.1, 7.2, 7.3**

**Property 6: Search Result Navigation**
*For any* search result clicked, the system SHALL navigate to the correct URL corresponding to that result's type and ID.
**Validates: Requirements 9.2, 9.3**

**Property 7: Profile Messaging Flow**
*For any* message button click on a profile, the system SHALL create or open a conversation with that user and send a notification to the recipient.
**Validates: Requirements 10.2, 10.3, 10.5**

**Property 8: Post Creation Marketplace Exclusion**
*For any* post creation modal state, the marketplace/sell option SHALL NOT be available as a post type or attachment.
**Validates: Requirements 8.6**

## Error Handling

### Search Errors
- Network failures: Display "Unable to search. Please try again."
- Empty results: Display helpful empty state with suggestions
- Invalid input: Sanitize and handle gracefully

### Post Creation Errors
- Validation failures: Inline error messages per field
- Upload failures: Toast notification with retry option
- Network errors: Save draft locally, prompt to retry

### Messaging Errors
- Conversation creation failure: Toast with retry
- Message send failure: Show failed state with resend option
- User not found: Redirect to search

## Testing Strategy

### Dual Testing Approach

This implementation requires both unit tests and property-based tests:

**Unit Tests** verify specific examples and edge cases:
- Component renders correctly with expected props
- User interactions trigger correct callbacks
- Error states display appropriate messages

**Property-Based Tests** verify universal properties across all inputs:
- Visual consistency properties (border-radius, colors)
- Responsive behavior properties
- Navigation correctness properties

### Property-Based Testing Library

**Library:** `fast-check` (TypeScript PBT library)

**Configuration:**
- Minimum 100 iterations per property test
- Seed logging for reproducibility

### Test File Structure

```
apps/web/__tests__/
├── properties/
│   ├── card-styling.property.test.ts
│   ├── responsive-visibility.property.test.ts
│   ├── color-accessibility.property.test.ts
│   ├── search-navigation.property.test.ts
│   └── messaging-flow.property.test.ts
└── unit/
    ├── CreatePostModal.test.tsx
    ├── GlobalSearch.test.tsx
    └── Navbar.test.tsx
```

### Property Test Annotation Format

Each property-based test MUST include:
```typescript
/**
 * **Feature: dashboard-social-platform, Property 1: Card Border Radius Consistency**
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
 */
```

