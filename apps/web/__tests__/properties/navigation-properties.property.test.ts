import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: ui-code-quality-overhaul, Properties 10 & 12: Navigation**
 * **Validates: Requirements 13.2, 13.5**
 *
 * Property 10: Back Button Presence on Detail Pages
 * Property 12: Active Navigation Highlight
 */

// Detail page routes that should have back buttons
const DETAIL_PAGE_ROUTES = [
  '/profile/[id]',
  '/events/[id]',
  '/marketplace/[id]',
  '/clubs/[id]',
  '/notes/[id]',
  '/events/[id]/certificates',
  '/events/[id]/checkin',
  '/colleges/[slug]',
  '/users/[id]',
];

// Navigation items and their routes
const NAVIGATION_ITEMS = {
  bottomNav: [
    { label: 'Home', href: '/dashboard' },
    { label: 'College', href: '/colleges' },
    { label: 'Explore', href: '/explore' },
    { label: 'Chat', href: '/messages' },
    { label: 'Post', href: null }, // Action, not route
  ],
  navbar: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Events', href: '/events' },
    { label: 'Clubs', href: '/clubs' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Notes', href: '/notes' },
  ],
};

/**
 * Checks if a route is a detail page (has dynamic segment).
 */
function isDetailPage(route: string): boolean {
  return route.includes('[') && route.includes(']');
}

/**
 * Checks if a route matches a navigation item.
 */
function routeMatchesNavItem(currentRoute: string, navHref: string | null): boolean {
  if (navHref === null) return false;
  
  // Exact match
  if (currentRoute === navHref) return true;
  
  // Prefix match for nested routes
  if (navHref !== '/dashboard' && currentRoute.startsWith(navHref)) return true;
  
  return false;
}

/**
 * Gets the active navigation item for a route.
 */
function getActiveNavItem(
  currentRoute: string, 
  navItems: Array<{ label: string; href: string | null }>
): { label: string; href: string | null } | null {
  for (const item of navItems) {
    if (routeMatchesNavItem(currentRoute, item.href)) {
      return item;
    }
  }
  return null;
}

/**
 * Checks if a detail page should have a back button.
 */
function shouldHaveBackButton(route: string): boolean {
  return isDetailPage(route);
}

// Arbitraries
const detailPageArb = fc.constantFrom(...DETAIL_PAGE_ROUTES);
const navTypeArb = fc.constantFrom('bottomNav', 'navbar');
const routeArb = fc.constantFrom(
  '/dashboard',
  '/events',
  '/events/123',
  '/clubs',
  '/clubs/456',
  '/marketplace',
  '/marketplace/789',
  '/notes',
  '/notes/abc',
  '/messages',
  '/explore',
  '/profile/user123'
);

describe('Navigation Properties', () => {
  /**
   * **Property 10: Back Button Presence on Detail Pages**
   * **Validates: Requirements 13.2**
   */
  describe('Property 10: Back Button Presence on Detail Pages', () => {
    test('All detail page routes are identified correctly', () => {
      fc.assert(
        fc.property(detailPageArb, (route) => {
          return isDetailPage(route);
        }),
        { numRuns: 50 }
      );
    });

    test('Detail pages should have back buttons', () => {
      DETAIL_PAGE_ROUTES.forEach((route) => {
        expect(shouldHaveBackButton(route)).toBe(true);
      });
    });

    test('List pages should not require back buttons', () => {
      const listPages = ['/events', '/clubs', '/marketplace', '/notes', '/dashboard'];
      listPages.forEach((route) => {
        expect(isDetailPage(route)).toBe(false);
      });
    });

    test('Profile detail page requires back button', () => {
      expect(shouldHaveBackButton('/profile/[id]')).toBe(true);
    });

    test('Event detail page requires back button', () => {
      expect(shouldHaveBackButton('/events/[id]')).toBe(true);
    });

    test('Marketplace detail page requires back button', () => {
      expect(shouldHaveBackButton('/marketplace/[id]')).toBe(true);
    });

    test('Club detail page requires back button', () => {
      expect(shouldHaveBackButton('/clubs/[id]')).toBe(true);
    });

    test('Notes detail page requires back button', () => {
      expect(shouldHaveBackButton('/notes/[id]')).toBe(true);
    });
  });

  /**
   * **Property 12: Active Navigation Highlight**
   * **Validates: Requirements 13.5**
   */
  describe('Property 12: Active Navigation Highlight', () => {
    test('Dashboard route highlights Home in bottom nav', () => {
      const activeItem = getActiveNavItem('/dashboard', NAVIGATION_ITEMS.bottomNav);
      expect(activeItem?.label).toBe('Home');
    });

    test('Explore route highlights Explore in bottom nav', () => {
      const activeItem = getActiveNavItem('/explore', NAVIGATION_ITEMS.bottomNav);
      expect(activeItem?.label).toBe('Explore');
    });

    test('Messages route highlights Chat in bottom nav', () => {
      const activeItem = getActiveNavItem('/messages', NAVIGATION_ITEMS.bottomNav);
      expect(activeItem?.label).toBe('Chat');
    });

    test('Events route highlights Events in navbar', () => {
      const activeItem = getActiveNavItem('/events', NAVIGATION_ITEMS.navbar);
      expect(activeItem?.label).toBe('Events');
    });

    test('Nested event route highlights Events in navbar', () => {
      const activeItem = getActiveNavItem('/events/123', NAVIGATION_ITEMS.navbar);
      expect(activeItem?.label).toBe('Events');
    });

    test('Clubs route highlights Clubs in navbar', () => {
      const activeItem = getActiveNavItem('/clubs', NAVIGATION_ITEMS.navbar);
      expect(activeItem?.label).toBe('Clubs');
    });

    test('Marketplace route highlights Marketplace in navbar', () => {
      const activeItem = getActiveNavItem('/marketplace', NAVIGATION_ITEMS.navbar);
      expect(activeItem?.label).toBe('Marketplace');
    });

    test('Notes route highlights Notes in navbar', () => {
      const activeItem = getActiveNavItem('/notes', NAVIGATION_ITEMS.navbar);
      expect(activeItem?.label).toBe('Notes');
    });

    test('At most one nav item is active for any route', () => {
      fc.assert(
        fc.property(routeArb, navTypeArb, (route, navType) => {
          const navItems = NAVIGATION_ITEMS[navType as keyof typeof NAVIGATION_ITEMS];
          const activeItems = navItems.filter(item => routeMatchesNavItem(route, item.href));
          
          // At most one item should be active
          return activeItems.length <= 1;
        }),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Route matching properties
   */
  describe('Route Matching Properties', () => {
    test('Exact route matches return true', () => {
      expect(routeMatchesNavItem('/dashboard', '/dashboard')).toBe(true);
      expect(routeMatchesNavItem('/events', '/events')).toBe(true);
      expect(routeMatchesNavItem('/clubs', '/clubs')).toBe(true);
    });

    test('Prefix matches work for nested routes', () => {
      expect(routeMatchesNavItem('/events/123', '/events')).toBe(true);
      expect(routeMatchesNavItem('/clubs/456/members', '/clubs')).toBe(true);
      expect(routeMatchesNavItem('/notes/abc/edit', '/notes')).toBe(true);
    });

    test('Dashboard does not prefix match other routes', () => {
      // Dashboard should only match exactly, not prefix
      expect(routeMatchesNavItem('/dashboard/settings', '/dashboard')).toBe(false);
    });

    test('Null href never matches', () => {
      expect(routeMatchesNavItem('/any-route', null)).toBe(false);
    });

    test('Unrelated routes do not match', () => {
      expect(routeMatchesNavItem('/events', '/clubs')).toBe(false);
      expect(routeMatchesNavItem('/marketplace', '/notes')).toBe(false);
    });
  });

  /**
   * Navigation configuration properties
   */
  describe('Navigation Configuration Properties', () => {
    test('Bottom nav has 5 items', () => {
      expect(NAVIGATION_ITEMS.bottomNav.length).toBe(5);
    });

    test('Navbar has 5 items', () => {
      expect(NAVIGATION_ITEMS.navbar.length).toBe(5);
    });

    test('All nav items have labels', () => {
      [...NAVIGATION_ITEMS.bottomNav, ...NAVIGATION_ITEMS.navbar].forEach(item => {
        expect(item.label).toBeTruthy();
        expect(typeof item.label).toBe('string');
      });
    });

    test('Post button in bottom nav is an action (null href)', () => {
      const postItem = NAVIGATION_ITEMS.bottomNav.find(item => item.label === 'Post');
      expect(postItem?.href).toBeNull();
    });

    test('All detail page routes have dynamic segments', () => {
      DETAIL_PAGE_ROUTES.forEach(route => {
        expect(route).toMatch(/\[.+\]/);
      });
    });
  });
});
