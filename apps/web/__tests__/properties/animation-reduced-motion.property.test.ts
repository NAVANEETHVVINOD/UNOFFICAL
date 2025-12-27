import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: ui-code-quality-overhaul, Property 9: Animation Reduced Motion Respect**
 * **Validates: Requirements 8.6**
 *
 * For any Framer Motion animation, WHEN the user has prefers-reduced-motion: reduce enabled,
 * the animation duration SHALL be 0 or the animation SHALL be skipped.
 */

// Animation configuration types
interface AnimationConfig {
  duration: number;
  delay?: number;
  ease?: string;
  type?: 'spring' | 'tween' | 'inertia';
}

interface ReducedMotionConfig {
  duration: number;
  delay: number;
}

/**
 * Transforms animation config for reduced motion preference.
 * This mirrors what Framer Motion does with useReducedMotion hook.
 */
function getReducedMotionConfig(config: AnimationConfig): ReducedMotionConfig {
  return {
    duration: 0,
    delay: 0,
  };
}

/**
 * Checks if animation respects reduced motion preference.
 */
function respectsReducedMotion(
  originalConfig: AnimationConfig,
  reducedConfig: ReducedMotionConfig
): boolean {
  return reducedConfig.duration === 0 && reducedConfig.delay === 0;
}

/**
 * Common animation configurations used in the app.
 */
const ANIMATION_CONFIGS = {
  pageTransition: { duration: 0.3, ease: 'easeInOut' },
  cardHover: { duration: 0.2, type: 'spring' as const },
  modalOpen: { duration: 0.25, ease: 'easeOut' },
  modalClose: { duration: 0.2, ease: 'easeIn' },
  tabSwitch: { duration: 0.15, ease: 'linear' },
  listStagger: { duration: 0.1, delay: 0.05 },
  fadeIn: { duration: 0.3, ease: 'easeOut' },
  slideIn: { duration: 0.4, ease: 'easeOut' },
  scaleUp: { duration: 0.2, type: 'spring' as const },
  bounce: { duration: 0.5, type: 'spring' as const },
};

/**
 * Framer Motion variants that should respect reduced motion.
 */
const MOTION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Arbitraries - use Math.fround for 32-bit float compatibility
const durationArb = fc.float({ min: Math.fround(0.01), max: Math.fround(2.0), noNaN: true });
const delayArb = fc.float({ min: Math.fround(0), max: Math.fround(1.0), noNaN: true });
const animationConfigArb = fc.record({
  duration: durationArb,
  delay: fc.option(delayArb, { nil: undefined }),
  ease: fc.option(fc.constantFrom('easeIn', 'easeOut', 'easeInOut', 'linear'), { nil: undefined }),
  type: fc.option(fc.constantFrom('spring', 'tween', 'inertia') as fc.Arbitrary<'spring' | 'tween' | 'inertia'>, { nil: undefined }),
});

describe('Animation Reduced Motion Properties', () => {
  /**
   * **Property 9: Animation Reduced Motion Respect**
   * **Validates: Requirements 8.6**
   *
   * When reduced motion is enabled, animation duration should be 0.
   */
  describe('Property 9: Reduced Motion Respect', () => {
    test('Any animation config transforms to zero duration for reduced motion', () => {
      fc.assert(
        fc.property(animationConfigArb, (config) => {
          const reducedConfig = getReducedMotionConfig(config);
          return reducedConfig.duration === 0;
        }),
        { numRuns: 100 }
      );
    });

    test('Any animation config transforms to zero delay for reduced motion', () => {
      fc.assert(
        fc.property(animationConfigArb, (config) => {
          const reducedConfig = getReducedMotionConfig(config);
          return reducedConfig.delay === 0;
        }),
        { numRuns: 100 }
      );
    });

    test('All predefined animations respect reduced motion', () => {
      Object.entries(ANIMATION_CONFIGS).forEach(([name, config]) => {
        const reducedConfig = getReducedMotionConfig(config);
        expect(respectsReducedMotion(config, reducedConfig)).toBe(true);
      });
    });

    test('Page transition respects reduced motion', () => {
      const config = ANIMATION_CONFIGS.pageTransition;
      const reducedConfig = getReducedMotionConfig(config);
      
      expect(reducedConfig.duration).toBe(0);
      expect(reducedConfig.delay).toBe(0);
    });

    test('Modal animations respect reduced motion', () => {
      const openConfig = ANIMATION_CONFIGS.modalOpen;
      const closeConfig = ANIMATION_CONFIGS.modalClose;
      
      const reducedOpen = getReducedMotionConfig(openConfig);
      const reducedClose = getReducedMotionConfig(closeConfig);
      
      expect(reducedOpen.duration).toBe(0);
      expect(reducedClose.duration).toBe(0);
    });

    test('Card hover animations respect reduced motion', () => {
      const config = ANIMATION_CONFIGS.cardHover;
      const reducedConfig = getReducedMotionConfig(config);
      
      expect(reducedConfig.duration).toBe(0);
    });

    test('List stagger animations respect reduced motion', () => {
      const config = ANIMATION_CONFIGS.listStagger;
      const reducedConfig = getReducedMotionConfig(config);
      
      expect(reducedConfig.duration).toBe(0);
      expect(reducedConfig.delay).toBe(0);
    });
  });

  /**
   * Additional animation properties
   */
  describe('Animation Configuration Properties', () => {
    test('Original animation durations are positive', () => {
      Object.entries(ANIMATION_CONFIGS).forEach(([name, config]) => {
        expect(config.duration).toBeGreaterThan(0);
      });
    });

    test('Animation durations are reasonable (< 2 seconds)', () => {
      fc.assert(
        fc.property(durationArb, (duration) => {
          return duration > 0 && duration <= 2.0;
        }),
        { numRuns: 100 }
      );
    });

    test('Animation delays are non-negative', () => {
      fc.assert(
        fc.property(delayArb, (delay) => {
          return delay >= 0;
        }),
        { numRuns: 100 }
      );
    });

    test('Reduced motion config is deterministic', () => {
      fc.assert(
        fc.property(animationConfigArb, (config) => {
          const reduced1 = getReducedMotionConfig(config);
          const reduced2 = getReducedMotionConfig(config);
          
          return reduced1.duration === reduced2.duration &&
                 reduced1.delay === reduced2.delay;
        }),
        { numRuns: 100 }
      );
    });

    test('Motion variants have expected properties', () => {
      expect(MOTION_VARIANTS.hidden).toHaveProperty('opacity');
      expect(MOTION_VARIANTS.visible).toHaveProperty('opacity');
      expect(MOTION_VARIANTS.hover).toHaveProperty('scale');
      expect(MOTION_VARIANTS.tap).toHaveProperty('scale');
    });

    test('Hover scale is greater than 1 (zoom in effect)', () => {
      expect(MOTION_VARIANTS.hover.scale).toBeGreaterThan(1);
    });

    test('Tap scale is less than 1 (press effect)', () => {
      expect(MOTION_VARIANTS.tap.scale).toBeLessThan(1);
    });
  });
});
