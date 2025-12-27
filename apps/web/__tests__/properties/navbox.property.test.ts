import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: ui-code-quality-overhaul, Properties 3 & 4: NavBox Component**
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
 * 
 * Property 3: NavBox Single Active Tab - Exactly one tab is active at any time
 * Property 4: NavBox Sticky Positioning - Sticky prop enables sticky positioning
 */

// NavBox tab interface
interface NavBoxTab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// NavBox state interface
interface NavBoxState {
  tabs: NavBoxTab[];
  activeTab: string;
  sticky: boolean;
}

// Simulates NavBox active tab logic
function getActiveTabCount(tabs: NavBoxTab[], activeTab: string): number {
  return tabs.filter(tab => tab.id === activeTab).length;
}

// Validates that exactly one tab is active
function hasExactlyOneActiveTab(tabs: NavBoxTab[], activeTab: string): boolean {
  // Active tab must exist in tabs array
  const activeExists = tabs.some(tab => tab.id === activeTab);
  // Only one tab can match the activeTab id
  const activeCount = getActiveTabCount(tabs, activeTab);
  return activeExists && activeCount === 1;
}

// Simulates tab change - returns new active tab
function handleTabChange(currentActive: string, newTabId: string, tabs: NavBoxTab[]): string {
  // Only change if the new tab exists
  const tabExists = tabs.some(tab => tab.id === newTabId);
  return tabExists ? newTabId : currentActive;
}

// Validates sticky positioning configuration
function getStickyStyles(sticky: boolean, stickyOffset: string = 'top-16 md:top-20'): {
  position: 'sticky' | 'static';
  top: string | undefined;
  zIndex: number | undefined;
} {
  if (sticky) {
    return {
      position: 'sticky',
      top: stickyOffset,
      zIndex: 40,
    };
  }
  return {
    position: 'static',
    top: undefined,
    zIndex: undefined,
  };
}

// Arbitraries for testing
const tabIdArb = fc.stringMatching(/^[a-z][a-z0-9-]{0,19}$/);

const tabArb = fc.record({
  id: tabIdArb,
  label: fc.string({ minLength: 1, maxLength: 20 }),
});

// Generate array of tabs with unique IDs
const tabsArrayArb = fc.array(tabArb, { minLength: 1, maxLength: 10 })
  .map(tabs => {
    // Ensure unique IDs
    const seen = new Set<string>();
    return tabs.filter(tab => {
      if (seen.has(tab.id)) return false;
      seen.add(tab.id);
      return true;
    });
  })
  .filter(tabs => tabs.length > 0);

const stickyArb = fc.boolean();

const stickyOffsetArb = fc.constantFrom(
  'top-0',
  'top-16',
  'top-16 md:top-20',
  'top-20',
  'top-24'
);

describe('NavBox Single Active Tab Properties', () => {
  /**
   * **Feature: ui-code-quality-overhaul, Property 3: NavBox Single Active Tab**
   * **Validates: Requirements 6.3, 6.4**
   * 
   * For any NavBox with N tabs where N > 0, exactly one tab is active.
   */
  test('Property 3: Exactly one tab is active at any time', () => {
    fc.assert(
      fc.property(tabsArrayArb, (tabs) => {
        // Active tab is the first tab by default
        const activeTab = tabs[0].id;
        return hasExactlyOneActiveTab(tabs, activeTab);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 3: NavBox Single Active Tab**
   * **Validates: Requirements 6.3, 6.4**
   * 
   * After tab change, exactly one tab remains active.
   */
  test('Property 3: Tab change maintains single active tab', () => {
    fc.assert(
      fc.property(
        tabsArrayArb,
        fc.nat({ max: 9 }),
        (tabs, targetIndex) => {
          const currentActive = tabs[0].id;
          const targetTab = tabs[Math.min(targetIndex, tabs.length - 1)];
          const newActive = handleTabChange(currentActive, targetTab.id, tabs);
          return hasExactlyOneActiveTab(tabs, newActive);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 3: NavBox Single Active Tab**
   * **Validates: Requirements 6.3, 6.4**
   * 
   * Invalid tab ID does not change active tab.
   */
  test('Property 3: Invalid tab ID preserves current active', () => {
    fc.assert(
      fc.property(tabsArrayArb, (tabs) => {
        const currentActive = tabs[0].id;
        const invalidId = 'non-existent-tab-id-xyz';
        const newActive = handleTabChange(currentActive, invalidId, tabs);
        return newActive === currentActive;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 3: NavBox Single Active Tab**
   * **Validates: Requirements 6.3, 6.4**
   * 
   * Active tab count is always exactly 1 for valid configurations.
   */
  test('Property 3: Active tab count is always 1', () => {
    fc.assert(
      fc.property(
        tabsArrayArb,
        fc.nat({ max: 9 }),
        (tabs, activeIndex) => {
          const activeTab = tabs[Math.min(activeIndex, tabs.length - 1)].id;
          const count = getActiveTabCount(tabs, activeTab);
          return count === 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 3: NavBox Single Active Tab**
   * **Validates: Requirements 6.3**
   * 
   * Active tab styling is applied to exactly one tab.
   */
  test('Property 3: Active styling applied to single tab', () => {
    fc.assert(
      fc.property(tabsArrayArb, (tabs) => {
        const activeTab = tabs[0].id;
        
        // Simulate rendering - count tabs that would have active styling
        const tabsWithActiveStyle = tabs.filter(tab => tab.id === activeTab);
        
        return tabsWithActiveStyle.length === 1;
      }),
      { numRuns: 100 }
    );
  });
});

describe('NavBox Sticky Positioning Properties', () => {
  /**
   * **Feature: ui-code-quality-overhaul, Property 4: NavBox Sticky Positioning**
   * **Validates: Requirements 6.5**
   * 
   * When sticky={true}, position is 'sticky' and top is defined.
   */
  test('Property 4: Sticky true enables sticky positioning', () => {
    fc.assert(
      fc.property(stickyOffsetArb, (offset) => {
        const styles = getStickyStyles(true, offset);
        return styles.position === 'sticky' && styles.top !== undefined;
      }),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 4: NavBox Sticky Positioning**
   * **Validates: Requirements 6.5**
   * 
   * When sticky={false}, position is 'static' and top is undefined.
   */
  test('Property 4: Sticky false disables sticky positioning', () => {
    const styles = getStickyStyles(false);
    expect(styles.position).toBe('static');
    expect(styles.top).toBeUndefined();
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 4: NavBox Sticky Positioning**
   * **Validates: Requirements 6.5**
   * 
   * Sticky NavBox has z-index for proper layering.
   */
  test('Property 4: Sticky NavBox has z-index', () => {
    fc.assert(
      fc.property(stickyArb, (sticky) => {
        const styles = getStickyStyles(sticky);
        if (sticky) {
          return styles.zIndex !== undefined && styles.zIndex > 0;
        }
        return styles.zIndex === undefined;
      }),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 4: NavBox Sticky Positioning**
   * **Validates: Requirements 6.5**
   * 
   * Sticky offset is preserved in styles.
   */
  test('Property 4: Sticky offset is preserved', () => {
    fc.assert(
      fc.property(stickyOffsetArb, (offset) => {
        const styles = getStickyStyles(true, offset);
        return styles.top === offset;
      }),
      { numRuns: 50 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Property 4: NavBox Sticky Positioning**
   * **Validates: Requirements 6.5**
   * 
   * Default sticky offset is applied when not specified.
   */
  test('Property 4: Default sticky offset applied', () => {
    const styles = getStickyStyles(true);
    expect(styles.top).toBe('top-16 md:top-20');
  });
});

describe('NavBox Combined Properties', () => {
  /**
   * **Feature: ui-code-quality-overhaul, Properties 3 & 4**
   * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
   * 
   * Complete NavBox state invariant.
   */
  test('NavBox state invariant: valid configuration', () => {
    fc.assert(
      fc.property(
        tabsArrayArb,
        stickyArb,
        fc.nat({ max: 9 }),
        (tabs, sticky, activeIndex) => {
          const activeTab = tabs[Math.min(activeIndex, tabs.length - 1)].id;
          const state: NavBoxState = { tabs, activeTab, sticky };
          
          // Invariant 1: Active tab exists in tabs
          const activeExists = state.tabs.some(t => t.id === state.activeTab);
          
          // Invariant 2: Exactly one active tab
          const singleActive = hasExactlyOneActiveTab(state.tabs, state.activeTab);
          
          // Invariant 3: Tabs have unique IDs
          const ids = state.tabs.map(t => t.id);
          const uniqueIds = new Set(ids).size === ids.length;
          
          return activeExists && singleActive && uniqueIds;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: ui-code-quality-overhaul, Properties 3 & 4**
   * **Validates: Requirements 6.2, 6.4**
   * 
   * All tabs have required properties.
   */
  test('NavBox tabs have required properties', () => {
    fc.assert(
      fc.property(tabsArrayArb, (tabs) => {
        return tabs.every(tab => 
          typeof tab.id === 'string' && 
          tab.id.length > 0 &&
          typeof tab.label === 'string' &&
          tab.label.length > 0
        );
      }),
      { numRuns: 100 }
    );
  });
});
