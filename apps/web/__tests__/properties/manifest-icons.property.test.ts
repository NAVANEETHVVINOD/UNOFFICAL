/**
 * Property-Based Tests for PWA Manifest Icon Configuration
 * Feature: android-twa-conversion, Property 1: Manifest Icon Configuration Validity
 * Validates: Requirements 1.2, 1.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Read the actual manifest file
const manifestPath = path.join(__dirname, '../../public/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

interface ManifestIcon {
  src: string;
  sizes: string;
  type: string;
  purpose: string;
}

// Required icon configurations for TWA
const REQUIRED_SIZES = ['192x192', '512x512'];
const REQUIRED_PURPOSES = ['any', 'maskable'];
const VALID_PNG_TYPE = 'image/png';

describe('Feature: android-twa-conversion, Property 1: Manifest Icon Configuration Validity', () => {
  
  it('manifest should have icons array', () => {
    expect(manifest.icons).toBeDefined();
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  it('should have PNG icons for all required sizes', () => {
    const pngIcons = manifest.icons.filter(
      (icon: ManifestIcon) => icon.type === VALID_PNG_TYPE
    );
    
    REQUIRED_SIZES.forEach(size => {
      const hasSize = pngIcons.some((icon: ManifestIcon) => icon.sizes === size);
      expect(hasSize).toBe(true);
    });
  });

  it('should have both any and maskable purpose icons', () => {
    const pngIcons = manifest.icons.filter(
      (icon: ManifestIcon) => icon.type === VALID_PNG_TYPE
    );
    
    REQUIRED_PURPOSES.forEach(purpose => {
      const hasPurpose = pngIcons.some((icon: ManifestIcon) => icon.purpose === purpose);
      expect(hasPurpose).toBe(true);
    });
  });

  it('should have maskable icons for all required sizes', () => {
    const maskableIcons = manifest.icons.filter(
      (icon: ManifestIcon) => icon.purpose === 'maskable' && icon.type === VALID_PNG_TYPE
    );
    
    REQUIRED_SIZES.forEach(size => {
      const hasSize = maskableIcons.some((icon: ManifestIcon) => icon.sizes === size);
      expect(hasSize).toBe(true);
    });
  });

  // Property test: For any PNG icon in manifest, it should have valid configuration
  it('property: all PNG icons should have valid src, sizes, type, and purpose', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...manifest.icons.filter((i: ManifestIcon) => i.type === VALID_PNG_TYPE)),
        (icon: ManifestIcon) => {
          // src should be a valid path starting with /icons/
          expect(icon.src).toMatch(/^\/icons\/icon-\d+(-maskable)?\.png$/);
          
          // sizes should be in NxN format
          expect(icon.sizes).toMatch(/^\d+x\d+$/);
          
          // type should be image/png
          expect(icon.type).toBe(VALID_PNG_TYPE);
          
          // purpose should be 'any' or 'maskable'
          expect(['any', 'maskable']).toContain(icon.purpose);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Icon files should exist on disk
  it('property: all referenced PNG icon files should exist', () => {
    const pngIcons = manifest.icons.filter(
      (icon: ManifestIcon) => icon.type === VALID_PNG_TYPE
    );
    
    fc.assert(
      fc.property(
        fc.constantFrom(...pngIcons),
        (icon: ManifestIcon) => {
          const iconPath = path.join(__dirname, '../../public', icon.src);
          const exists = fs.existsSync(iconPath);
          expect(exists).toBe(true);
          return exists;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Icon dimensions in filename should match sizes property
  it('property: icon filename dimensions should match sizes property', () => {
    const pngIcons = manifest.icons.filter(
      (icon: ManifestIcon) => icon.type === VALID_PNG_TYPE
    );
    
    fc.assert(
      fc.property(
        fc.constantFrom(...pngIcons),
        (icon: ManifestIcon) => {
          // Extract size from filename (e.g., icon-192.png -> 192)
          const filenameMatch = icon.src.match(/icon-(\d+)/);
          if (filenameMatch) {
            const filenameSize = filenameMatch[1];
            const expectedSizes = `${filenameSize}x${filenameSize}`;
            expect(icon.sizes).toBe(expectedSizes);
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
