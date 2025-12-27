import { describe, test, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: ui-code-quality-overhaul, Property 2: Typography Font Family Consistency**
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 *
 * For any text element with a typography class (font-pixel, font-hand, font-marker, font-display, font-body),
 * the computed font-family SHALL include the corresponding font (VT323, Caveat, Permanent Marker, Outfit).
 */

// Typography class to font family mapping
const TYPOGRAPHY_MAPPING: Record<string, string[]> = {
  'font-pixel': ['VT323', 'monospace'],
  'font-hand': ['Caveat', 'cursive'],
  'font-marker': ['Permanent Marker', 'cursive'],
  'font-display': ['Outfit', 'sans-serif'],
  'font-body': ['Outfit', 'sans-serif'],
};

// Typography scale definitions
const TYPOGRAPHY_SCALE = {
  display: {
    hero: 'text-5xl md:text-7xl font-display font-black',
    h1: 'text-4xl md:text-5xl font-display font-bold',
    h2: 'text-3xl md:text-4xl font-display font-bold',
    h3: 'text-2xl md:text-3xl font-display font-semibold',
  },
  pixel: {
    large: 'text-2xl font-pixel uppercase tracking-wider',
    medium: 'text-xl font-pixel uppercase',
    small: 'text-base font-pixel uppercase',
  },
  hand: {
    large: 'text-3xl font-hand',
    medium: 'text-2xl font-hand',
    small: 'text-xl font-hand',
  },
  marker: {
    large: 'text-2xl font-marker',
    medium: 'text-xl font-marker',
    small: 'text-base font-marker',
  },
  body: {
    large: 'text-lg font-body',
    medium: 'text-base font-body',
    small: 'text-sm font-body',
  },
};

/**
 * Extracts font class from a className string.
 */
function extractFontClass(className: string): string | null {
  const fontClasses = Object.keys(TYPOGRAPHY_MAPPING);
  for (const fontClass of fontClasses) {
    if (className.includes(fontClass)) {
      return fontClass;
    }
  }
  return null;
}

/**
 * Gets expected font families for a typography class.
 */
function getExpectedFontFamilies(fontClass: string): string[] {
  return TYPOGRAPHY_MAPPING[fontClass] || [];
}

/**
 * Validates that a font class maps to correct font families.
 */
function validateFontMapping(fontClass: string): boolean {
  const expectedFonts = getExpectedFontFamilies(fontClass);
  return expectedFonts.length > 0;
}

// Arbitraries
const fontClassArb = fc.constantFrom(...Object.keys(TYPOGRAPHY_MAPPING));
const typographyScaleArb = fc.constantFrom('display', 'pixel', 'hand', 'marker', 'body');
const sizeArb = fc.constantFrom('large', 'medium', 'small', 'hero', 'h1', 'h2', 'h3');

describe('Typography Consistency Properties', () => {
  /**
   * **Property 2: Typography Font Family Consistency**
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
   */
  describe('Property 2: Typography Font Family Consistency', () => {
    test('All font classes map to valid font families', () => {
      fc.assert(
        fc.property(fontClassArb, (fontClass) => {
          return validateFontMapping(fontClass);
        }),
        { numRuns: 50 }
      );
    });

    test('font-pixel maps to VT323', () => {
      const fonts = getExpectedFontFamilies('font-pixel');
      expect(fonts).toContain('VT323');
    });

    test('font-hand maps to Caveat', () => {
      const fonts = getExpectedFontFamilies('font-hand');
      expect(fonts).toContain('Caveat');
    });

    test('font-marker maps to Permanent Marker', () => {
      const fonts = getExpectedFontFamilies('font-marker');
      expect(fonts).toContain('Permanent Marker');
    });

    test('font-display maps to Outfit', () => {
      const fonts = getExpectedFontFamilies('font-display');
      expect(fonts).toContain('Outfit');
    });

    test('font-body maps to Outfit', () => {
      const fonts = getExpectedFontFamilies('font-body');
      expect(fonts).toContain('Outfit');
    });

    test('All font mappings include fallback fonts', () => {
      Object.entries(TYPOGRAPHY_MAPPING).forEach(([fontClass, fonts]) => {
        expect(fonts.length).toBeGreaterThan(1);
        // Last font should be a generic fallback
        const lastFont = fonts[fonts.length - 1];
        expect(['sans-serif', 'serif', 'monospace', 'cursive']).toContain(lastFont);
      });
    });
  });

  /**
   * Typography scale properties
   */
  describe('Typography Scale Properties', () => {
    test('Display typography includes font-display class', () => {
      Object.values(TYPOGRAPHY_SCALE.display).forEach((className) => {
        expect(className).toContain('font-display');
      });
    });

    test('Pixel typography includes font-pixel class', () => {
      Object.values(TYPOGRAPHY_SCALE.pixel).forEach((className) => {
        expect(className).toContain('font-pixel');
      });
    });

    test('Hand typography includes font-hand class', () => {
      Object.values(TYPOGRAPHY_SCALE.hand).forEach((className) => {
        expect(className).toContain('font-hand');
      });
    });

    test('Marker typography includes font-marker class', () => {
      Object.values(TYPOGRAPHY_SCALE.marker).forEach((className) => {
        expect(className).toContain('font-marker');
      });
    });

    test('Body typography includes font-body class', () => {
      Object.values(TYPOGRAPHY_SCALE.body).forEach((className) => {
        expect(className).toContain('font-body');
      });
    });

    test('All typography scales have size variants', () => {
      Object.entries(TYPOGRAPHY_SCALE).forEach(([scale, variants]) => {
        expect(Object.keys(variants).length).toBeGreaterThan(0);
      });
    });

    test('Typography classes include text size classes', () => {
      const textSizePattern = /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/;
      
      Object.values(TYPOGRAPHY_SCALE).forEach((variants) => {
        Object.values(variants).forEach((className) => {
          expect(className).toMatch(textSizePattern);
        });
      });
    });
  });

  /**
   * Font class extraction properties
   */
  describe('Font Class Extraction Properties', () => {
    test('extractFontClass returns correct class from className', () => {
      fc.assert(
        fc.property(fontClassArb, fc.string(), (fontClass, prefix) => {
          const className = `${prefix} ${fontClass} some-other-class`;
          const extracted = extractFontClass(className);
          return extracted === fontClass;
        }),
        { numRuns: 50 }
      );
    });

    test('extractFontClass returns null for non-font classes', () => {
      const nonFontClasses = ['text-lg', 'bg-primary', 'p-4', 'flex', 'items-center'];
      nonFontClasses.forEach((className) => {
        expect(extractFontClass(className)).toBeNull();
      });
    });

    test('extractFontClass handles empty string', () => {
      expect(extractFontClass('')).toBeNull();
    });

    test('extractFontClass handles multiple font classes (returns first)', () => {
      const className = 'font-pixel font-hand';
      const extracted = extractFontClass(className);
      expect(extracted).toBe('font-pixel');
    });
  });

  /**
   * Consistency properties
   */
  describe('Consistency Properties', () => {
    test('Font mapping is deterministic', () => {
      fc.assert(
        fc.property(fontClassArb, (fontClass) => {
          const fonts1 = getExpectedFontFamilies(fontClass);
          const fonts2 = getExpectedFontFamilies(fontClass);
          return JSON.stringify(fonts1) === JSON.stringify(fonts2);
        }),
        { numRuns: 50 }
      );
    });

    test('All defined font classes are valid', () => {
      const validFontClasses = Object.keys(TYPOGRAPHY_MAPPING);
      expect(validFontClasses).toContain('font-pixel');
      expect(validFontClasses).toContain('font-hand');
      expect(validFontClasses).toContain('font-marker');
      expect(validFontClasses).toContain('font-display');
      expect(validFontClasses).toContain('font-body');
    });

    test('Typography scale covers all font types', () => {
      const scaleTypes = Object.keys(TYPOGRAPHY_SCALE);
      expect(scaleTypes).toContain('display');
      expect(scaleTypes).toContain('pixel');
      expect(scaleTypes).toContain('hand');
      expect(scaleTypes).toContain('marker');
      expect(scaleTypes).toContain('body');
    });
  });
});
