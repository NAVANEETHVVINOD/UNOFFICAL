/**
 * Property-Based Tests for Digital Asset Links Configuration
 * Feature: android-twa-conversion, Property 2: Asset Links File Validity
 * Validates: Requirements 2.2, 2.3, 2.5
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Read the actual assetlinks.json file
const assetlinksPath = path.join(__dirname, '../../public/.well-known/assetlinks.json');
const assetlinks = JSON.parse(fs.readFileSync(assetlinksPath, 'utf-8'));

interface AssetLinkTarget {
  namespace: string;
  package_name: string;
  sha256_cert_fingerprints: string[];
}

interface AssetLink {
  relation: string[];
  target: AssetLinkTarget;
}

// Expected configuration values
const EXPECTED_PACKAGE_NAME = 'com.linker.campus';
const EXPECTED_NAMESPACE = 'android_app';
const EXPECTED_RELATION = 'delegate_permission/common.handle_all_urls';

// SHA256 fingerprint format: 64 hex characters with colons (e.g., AA:BB:CC:...)
// or placeholder format for development
const SHA256_PATTERN = /^([A-F0-9]{2}:){31}[A-F0-9]{2}$|^PLACEHOLDER:/;

describe('Feature: android-twa-conversion, Property 2: Asset Links File Validity', () => {
  
  it('assetlinks.json should be a valid array', () => {
    expect(Array.isArray(assetlinks)).toBe(true);
    expect(assetlinks.length).toBeGreaterThan(0);
  });

  it('should contain correct package name (com.linker.campus)', () => {
    const hasCorrectPackage = assetlinks.some(
      (link: AssetLink) => link.target.package_name === EXPECTED_PACKAGE_NAME
    );
    expect(hasCorrectPackage).toBe(true);
  });

  it('should use android_app namespace', () => {
    const hasCorrectNamespace = assetlinks.some(
      (link: AssetLink) => link.target.namespace === EXPECTED_NAMESPACE
    );
    expect(hasCorrectNamespace).toBe(true);
  });

  it('should include delegate_permission/common.handle_all_urls relation', () => {
    const hasCorrectRelation = assetlinks.some(
      (link: AssetLink) => link.relation.includes(EXPECTED_RELATION)
    );
    expect(hasCorrectRelation).toBe(true);
  });

  it('should have SHA256 fingerprints array', () => {
    const hasFingerprints = assetlinks.some(
      (link: AssetLink) => 
        Array.isArray(link.target.sha256_cert_fingerprints) &&
        link.target.sha256_cert_fingerprints.length > 0
    );
    expect(hasFingerprints).toBe(true);
  });

  // Property test: For any asset link entry, it should have valid structure
  it('property: all asset link entries should have valid structure', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...assetlinks),
        (link: AssetLink) => {
          // relation should be an array with at least one entry
          expect(Array.isArray(link.relation)).toBe(true);
          expect(link.relation.length).toBeGreaterThan(0);
          
          // target should have required fields
          expect(link.target).toBeDefined();
          expect(link.target.namespace).toBeDefined();
          expect(link.target.package_name).toBeDefined();
          expect(link.target.sha256_cert_fingerprints).toBeDefined();
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Package name should match expected value
  it('property: package name should be com.linker.campus', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...assetlinks),
        (link: AssetLink) => {
          expect(link.target.package_name).toBe(EXPECTED_PACKAGE_NAME);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Namespace should be android_app
  it('property: namespace should be android_app', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...assetlinks),
        (link: AssetLink) => {
          expect(link.target.namespace).toBe(EXPECTED_NAMESPACE);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: Relation should include handle_all_urls permission
  it('property: relation should include handle_all_urls permission', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...assetlinks),
        (link: AssetLink) => {
          expect(link.relation).toContain(EXPECTED_RELATION);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: SHA256 fingerprints should be valid format or placeholder
  it('property: SHA256 fingerprints should be valid format or placeholder', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...assetlinks),
        (link: AssetLink) => {
          link.target.sha256_cert_fingerprints.forEach(fingerprint => {
            expect(fingerprint).toMatch(SHA256_PATTERN);
          });
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
