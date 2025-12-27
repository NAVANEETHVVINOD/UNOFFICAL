# Design Document: UI/Code Quality Overhaul

## Overview

This design document outlines the technical approach for overhauling the LINKER platform's UI, removing dark mode, enhancing key pages, implementing consistent typography, and restructuring the codebase for better maintainability. The design follows a retro newspaper/sketch aesthetic with light mode only.

## Architecture

### Theme Architecture (Light Mode on Landing Page)

```
ThemeContext (Full Support)
├── theme: "light" | "dark"
├── toggleTheme: () => void
├── setTheme: (theme) => void
├── isDark: boolean
└── colors: paper (#FDF6E3 light / #121212 dark)

Landing Page Behavior:
├── Forces light mode on mount
├── Removes "dark" class from document
└── Restores user preference on unmount
```

### Component Architecture

```
components/
├── ui/                    # Atomic UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── NavBox.tsx         # NEW: Reusable tab navigation
│   ├── Carousel.tsx       # NEW: Full-width carousel
│   ├── Doodle.tsx
│   └── ...
├── layout/                # Layout components
│   ├── PageLayout.tsx     # NEW: Standard page wrapper
│   ├── SectionLayout.tsx  # NEW: Section wrapper
│   └── ...
├── navigation/            # Navigation components
│   ├── BottomNav.tsx
│   ├── Navbar.tsx
│   └── ...
├── sections/              # Landing page sections
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   └── ...
└── [feature]/             # Feature-specific components
```

### Page Structure

```
Each Page
├── PageLayout (wrapper)
│   ├── Header/Navbar
│   ├── NavBox (if applicable)
│   ├── Main Content
│   │   └── Framer Motion animations
│   └── BottomNav (mobile)
```

## Components and Interfaces

### NavBox Component

```typescript
interface NavBoxProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  sticky?: boolean;
  className?: string;
}

// Usage
<NavBox
  tabs={[
    { id: 'activities', label: 'Activities', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: Star },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
  sticky
/>
```

### Carousel Component

```typescript
interface CarouselProps {
  items: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  fullWidth?: boolean;
  className?: string;
}

// Usage
<Carousel
  items={[<Slide1 />, <Slide2 />, <Slide3 />]}
  autoPlay
  autoPlayInterval={5000}
  showDots
  fullWidth
/>
```

### PageLayout Component

```typescript
interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showNavBox?: boolean;
  navBoxTabs?: NavBoxProps['tabs'];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
}
```

## Data Models

### Typography Scale

```typescript
const typography = {
  // Display - Outfit (headings)
  display: {
    hero: 'text-5xl md:text-7xl font-display font-black',
    h1: 'text-4xl md:text-5xl font-display font-bold',
    h2: 'text-3xl md:text-4xl font-display font-bold',
    h3: 'text-2xl md:text-3xl font-display font-semibold',
  },
  // Pixel - VT323 (retro labels, badges)
  pixel: {
    large: 'text-2xl font-pixel uppercase tracking-wider',
    medium: 'text-xl font-pixel uppercase',
    small: 'text-base font-pixel uppercase',
  },
  // Hand - Caveat (quotes, emphasis)
  hand: {
    large: 'text-3xl font-hand',
    medium: 'text-2xl font-hand',
    small: 'text-xl font-hand',
  },
  // Marker - Permanent Marker (stickers, badges)
  marker: {
    large: 'text-2xl font-marker',
    medium: 'text-xl font-marker',
    small: 'text-base font-marker',
  },
  // Body - Outfit (paragraphs)
  body: {
    large: 'text-lg font-body',
    medium: 'text-base font-body',
    small: 'text-sm font-body',
  },
};
```

### Color Palette (Light Mode Only)

```typescript
const colors = {
  // Backgrounds
  paper: '#FDF6E3',      // Main background
  paperLight: '#FAF3E0', // Lighter variant
  paperDark: '#F5ECD7',  // Darker variant
  white: '#FFFFFF',      // Cards, inputs
  
  // Text
  ink: '#1A1A1A',        // Primary text
  inkLight: '#4A4A4A',   // Secondary text
  
  // Accents
  primary: '#FFEB3B',    // Yellow (primary action)
  coral: '#FF6B6B',      // Coral (alerts, highlights)
  mint: '#4ECDC4',       // Mint (success)
  blue: '#45B7D1',       // Blue (info)
  pink: '#FF69B4',       // Pink (special)
  purple: '#9B59B6',     // Purple (premium)
};
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Landing Page Light Mode Consistency
*For any* visit to the landing page, regardless of user's stored theme preference, the document element SHALL NOT have a "dark" class, and the computed background color SHALL be the paper color (#FDF6E3).
**Validates: Requirements 1.1, 1.2, 1.4**

### Property 2: Typography Font Family Consistency
*For any* text element with a typography class (font-pixel, font-hand, font-marker, font-display, font-body), the computed font-family SHALL include the corresponding font (VT323, Caveat, Permanent Marker, Outfit).
**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

### Property 3: NavBox Single Active Tab
*For any* NavBox component with N tabs where N > 0, exactly one tab SHALL have the active styling (primary background color) at any given time.
**Validates: Requirements 6.3, 6.4**

### Property 4: NavBox Sticky Positioning
*For any* NavBox component with sticky={true}, the computed position SHALL be "sticky" and top SHALL be defined.
**Validates: Requirements 6.5**

### Property 5: Mobile No Horizontal Overflow
*For any* page rendered at viewport width between 320px and 767px, the document.body.scrollWidth SHALL be less than or equal to the viewport width.
**Validates: Requirements 7.1, 7.7**

### Property 6: Touch Target Minimum Size
*For any* interactive element (button, link, input) on mobile viewport, the computed height and width SHALL both be at least 44px.
**Validates: Requirements 7.2**

### Property 7: Carousel Index Bounds
*For any* Carousel component with N items where N > 0, the currentIndex state SHALL always satisfy 0 <= currentIndex < N after any navigation action.
**Validates: Requirements 11.2, 11.4**

### Property 8: Carousel Auto-Play Pause on Hover
*For any* Carousel with autoPlay={true}, WHEN the user hovers over the carousel, the auto-advance timer SHALL be paused, and WHEN hover ends, the timer SHALL resume.
**Validates: Requirements 11.2**

### Property 9: Animation Reduced Motion Respect
*For any* Framer Motion animation, WHEN the user has prefers-reduced-motion: reduce enabled, the animation duration SHALL be 0 or the animation SHALL be skipped.
**Validates: Requirements 8.6**

### Property 10: Back Button Presence on Detail Pages
*For any* detail page (profile/[id], events/[id], marketplace/[id], clubs/[id], notes/[id]), a back button or navigation element SHALL be present in the header.
**Validates: Requirements 13.2**

### Property 11: Layout Stability During Loading
*For any* component that displays a skeleton loader, the skeleton's dimensions (width, height) SHALL match the loaded content's dimensions within a 10% tolerance.
**Validates: Requirements 12.3**

### Property 12: Active Navigation Highlight
*For any* navigation component (BottomNav, Navbar, NavBox), the item corresponding to the current route SHALL have distinct active styling (different background or text color).
**Validates: Requirements 13.5**

## Error Handling

### Component Error Boundaries

```typescript
// Wrap feature sections in error boundaries
<ErrorBoundary fallback={<SectionErrorFallback />}>
  <FeatureSection />
</ErrorBoundary>
```

### Loading Error States

```typescript
// Retry mechanism for failed loads
const { data, error, retry } = useAsyncData();

if (error) {
  return (
    <ErrorState 
      message="Failed to load content"
      onRetry={retry}
    />
  );
}
```

### Form Validation Errors

```typescript
// Delete account confirmation
const handleDeleteAccount = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Delete Account',
    message: 'This action cannot be undone. All your data will be permanently deleted.',
    confirmText: 'Delete My Account',
    confirmVariant: 'danger',
  });
  
  if (confirmed) {
    await api.deleteAccount();
    logout();
  }
};
```

## Testing Strategy

### Unit Tests
- Test NavBox tab switching logic
- Test Carousel index management
- Test typography utility functions
- Test color contrast calculations

### Property-Based Tests
- Test light mode consistency across random page renders
- Test NavBox with random tab configurations
- Test Carousel with random item counts
- Test responsive breakpoints with random viewport sizes

### Integration Tests
- Test page navigation flows
- Test settings page save/load cycle
- Test profile edit workflow
- Test delete account flow

### Visual Regression Tests
- Capture screenshots of key pages
- Compare against baseline for layout shifts
- Test across breakpoints (320px, 768px, 1024px, 1440px)

## File Structure Changes

### Files to Create

```
apps/web/app/components/
├── ui/
│   ├── NavBox.tsx           # Reusable tab navigation
│   ├── Carousel.tsx         # Full-width carousel
│   ├── PageHeader.tsx       # Consistent page headers
│   └── DeleteAccountModal.tsx
├── layout/
│   ├── PageLayout.tsx       # Standard page wrapper
│   └── SectionLayout.tsx    # Section wrapper with doodles
```

### Files to Modify

```
apps/web/app/
├── context/ThemeContext.tsx  # Remove dark mode, light only
├── page.tsx                  # Landing page overhaul
├── settings/page.tsx         # Add delete account, remove dark toggle
├── profile/ProfileClient.tsx # Already has NavBox, enhance
├── globals.css               # Remove dark mode styles
├── tailwind.config.js        # Remove dark mode config
```

### Files to Delete

```
apps/web/app/components/
├── ThemeToggle.tsx           # No longer needed
```

## Implementation Phases

### Phase 1: Theme Simplification
1. Update ThemeContext to light mode only
2. Remove dark: classes from all components
3. Update tailwind.config.js
4. Remove ThemeToggle component

### Phase 2: Core Components
1. Create NavBox component
2. Create Carousel component
3. Create PageLayout component
4. Update typography utilities

### Phase 3: Landing Page
1. Restructure hero section
2. Add full-width carousel
3. Place doodles strategically
4. Ensure mobile responsiveness

### Phase 4: Settings & Profile
1. Add delete account to settings
2. Enhance NavBox in profile
3. Add missing settings sections
4. Improve mobile layouts

### Phase 5: Code Quality
1. Reorganize component folders
2. Add TypeScript types
3. Remove dead code
4. Add documentation comments
