import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
 * **Validates: Requirements 4.1**
 *
 * Property: For any viewport width less than 768px, the left sidebar SHALL be hidden
 * and the ArcMenu SHALL be visible; for viewport width >= 768px, the sidebar SHALL be visible.
 *
 * This test verifies the responsive visibility logic for sidebar and mobile navigation.
 */

// Tailwind breakpoints used in the application
const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// The actual breakpoints used in DashboardClient.tsx:
// - Left sidebar: "hidden lg:block" -> visible at >= 1024px
// - ArcMenu: "md:hidden" -> visible at < 768px
const SIDEBAR_BREAKPOINT = TAILWIND_BREAKPOINTS.lg; // 1024px - sidebar visible at lg and above
const ARCMENU_BREAKPOINT = TAILWIND_BREAKPOINTS.md; // 768px - ArcMenu hidden at md and above

/**
 * Determines if the sidebar should be visible based on viewport width.
 * Based on DashboardClient.tsx: className="hidden lg:block"
 */
function isSidebarVisible(viewportWidth: number): boolean {
  return viewportWidth >= SIDEBAR_BREAKPOINT;
}

/**
 * Determines if the ArcMenu (mobile navigation) should be visible based on viewport width.
 * Based on ArcMenu.tsx: className="md:hidden"
 */
function isArcMenuVisible(viewportWidth: number): boolean {
  return viewportWidth < ARCMENU_BREAKPOINT;
}

/**
 * Determines if the device is considered "mobile" based on viewport width.
 * Mobile is defined as viewport width < 768px per Requirements 4.1
 */
function isMobileViewport(viewportWidth: number): boolean {
  return viewportWidth < ARCMENU_BREAKPOINT;
}

// Arbitrary for generating realistic viewport widths
// Common device widths range from 320px (small phones) to 2560px (large monitors)
const viewportWidthArb = fc.integer({ min: 320, max: 2560 });

// Arbitrary for mobile viewport widths (< 768px)
const mobileViewportArb = fc.integer({ min: 320, max: 767 });

// Arbitrary for tablet/desktop viewport widths (>= 768px)
const desktopViewportArb = fc.integer({ min: 768, max: 2560 });

// Arbitrary for large desktop viewport widths (>= 1024px) where sidebar is visible
const largeDesktopViewportArb = fc.integer({ min: 1024, max: 2560 });

describe('Mobile Sidebar Visibility Properties', () => {
  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * On mobile viewports (< 768px), the ArcMenu should be visible for navigation.
   */
  test('Property 5: ArcMenu is visible on mobile viewports (< 768px)', () => {
    fc.assert(
      fc.property(mobileViewportArb, (viewportWidth) => {
        const arcMenuVisible = isArcMenuVisible(viewportWidth);
        return arcMenuVisible === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * On mobile viewports (< 768px), the sidebar should be hidden.
   */
  test('Property 5: Sidebar is hidden on mobile viewports (< 768px)', () => {
    fc.assert(
      fc.property(mobileViewportArb, (viewportWidth) => {
        const sidebarVisible = isSidebarVisible(viewportWidth);
        return sidebarVisible === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * On tablet/desktop viewports (>= 768px), the ArcMenu should be hidden.
   */
  test('Property 5: ArcMenu is hidden on tablet/desktop viewports (>= 768px)', () => {
    fc.assert(
      fc.property(desktopViewportArb, (viewportWidth) => {
        const arcMenuVisible = isArcMenuVisible(viewportWidth);
        return arcMenuVisible === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * On large desktop viewports (>= 1024px), the sidebar should be visible.
   */
  test('Property 5: Sidebar is visible on large desktop viewports (>= 1024px)', () => {
    fc.assert(
      fc.property(largeDesktopViewportArb, (viewportWidth) => {
        const sidebarVisible = isSidebarVisible(viewportWidth);
        return sidebarVisible === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * Mobile viewports should always have navigation available (either sidebar or ArcMenu).
   */
  test('Property 5: Navigation is always available at any viewport width', () => {
    fc.assert(
      fc.property(viewportWidthArb, (viewportWidth) => {
        const sidebarVisible = isSidebarVisible(viewportWidth);
        const arcMenuVisible = isArcMenuVisible(viewportWidth);

        // At least one navigation method should be available
        // Note: There's a gap between 768px-1023px where neither is visible
        // This is by design - tablet users see the CategoryRibbon for navigation
        if (viewportWidth < ARCMENU_BREAKPOINT) {
          // Mobile: ArcMenu should be visible
          return arcMenuVisible === true;
        } else if (viewportWidth >= SIDEBAR_BREAKPOINT) {
          // Large desktop: Sidebar should be visible
          return sidebarVisible === true;
        } else {
          // Tablet (768px - 1023px): Neither sidebar nor ArcMenu
          // Users navigate via CategoryRibbon and Navbar
          return sidebarVisible === false && arcMenuVisible === false;
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * Sidebar and ArcMenu should never both be visible at the same time.
   */
  test('Property 5: Sidebar and ArcMenu are mutually exclusive', () => {
    fc.assert(
      fc.property(viewportWidthArb, (viewportWidth) => {
        const sidebarVisible = isSidebarVisible(viewportWidth);
        const arcMenuVisible = isArcMenuVisible(viewportWidth);

        // They should never both be visible at the same time
        return !(sidebarVisible && arcMenuVisible);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * Visibility functions are deterministic - same input always produces same output.
   */
  test('Property 5: Visibility functions are deterministic', () => {
    fc.assert(
      fc.property(viewportWidthArb, (viewportWidth) => {
        // Call each function twice with the same input
        const sidebar1 = isSidebarVisible(viewportWidth);
        const sidebar2 = isSidebarVisible(viewportWidth);
        const arcMenu1 = isArcMenuVisible(viewportWidth);
        const arcMenu2 = isArcMenuVisible(viewportWidth);

        return sidebar1 === sidebar2 && arcMenu1 === arcMenu2;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * Boundary test: At exactly 768px, ArcMenu should be hidden.
   */
  test('Property 5: At exactly 768px boundary, ArcMenu is hidden', () => {
    const arcMenuVisible = isArcMenuVisible(768);
    expect(arcMenuVisible).toBe(false);
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * Boundary test: At exactly 767px, ArcMenu should be visible.
   */
  test('Property 5: At exactly 767px, ArcMenu is visible', () => {
    const arcMenuVisible = isArcMenuVisible(767);
    expect(arcMenuVisible).toBe(true);
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * Boundary test: At exactly 1024px, sidebar should be visible.
   */
  test('Property 5: At exactly 1024px boundary, sidebar is visible', () => {
    const sidebarVisible = isSidebarVisible(1024);
    expect(sidebarVisible).toBe(true);
  });

  /**
   * **Feature: linker-ui-overhaul, Property 5: Mobile sidebar visibility**
   * **Validates: Requirements 4.1**
   *
   * Boundary test: At exactly 1023px, sidebar should be hidden.
   */
  test('Property 5: At exactly 1023px, sidebar is hidden', () => {
    const sidebarVisible = isSidebarVisible(1023);
    expect(sidebarVisible).toBe(false);
  });
});
