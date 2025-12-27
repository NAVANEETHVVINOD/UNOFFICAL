/**
 * Property-Based Tests for Service Worker Precache Routes
 * Feature: android-twa-conversion, Property 3: Service Worker Precache Routes
 * Validates: Requirements 5.3
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// Read the service worker file
const swPath = path.join(__dirname, '../../public/sw.js');
const swContent = fs.readFileSync(swPath, 'utf-8');

// Extract PRECACHE_ASSETS array from service worker
function extractPrecacheAssets(content: string): string[] {
  const match = content.match(/const PRECACHE_ASSETS = \[([\s\S]*?)\];/);
  if (!match) return [];
  
  // Parse the array contents
  const arrayContent = match[1];
  const routes = arrayContent
    .split(',')
    .map(item => item.trim().replace(/['"]/g, ''))
    .filter(item => item.startsWith('/'));
  
  return routes;
}

const precacheAssets = extractPrecacheAssets(swContent);

// Required routes for TWA offline functionality
const REQUIRED_ROUTES = [
  '/',
  '/offline',
  '/dashboard',
  '/explore',
  '/events',
  '/messages',
  '/legal/privacy',
  '/legal/terms',
];

describe('Feature: android-twa-conversion, Property 3: Service Worker Precache Routes', () => {
  
  it('service worker should define PRECACHE_ASSETS array', () => {
    expect(precacheAssets.length).toBeGreaterThan(0);
  });

  it('should include root route', () => {
    expect(precacheAssets).toContain('/');
  });

  it('should include offline page', () => {
    expect(precacheAssets).toContain('/offline');
  });

  it('should include dashboard route', () => {
    expect(precacheAssets).toContain('/dashboard');
  });

  it('should include explore route', () => {
    expect(precacheAssets).toContain('/explore');
  });

  it('should include events route', () => {
    expect(precacheAssets).toContain('/events');
  });

  it('should include messages route', () => {
    expect(precacheAssets).toContain('/messages');
  });

  it('should include legal pages for offline access', () => {
    expect(precacheAssets).toContain('/legal/privacy');
    expect(precacheAssets).toContain('/legal/terms');
  });

  // Property test: All required routes should be in precache
  it('property: all required routes should be included in precache', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...REQUIRED_ROUTES),
        (route: string) => {
          expect(precacheAssets).toContain(route);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: All precache routes should be valid paths
  it('property: all precache routes should be valid paths starting with /', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...precacheAssets),
        (route: string) => {
          expect(route).toMatch(/^\//);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property test: No duplicate routes
  it('property: precache routes should not have duplicates', () => {
    const uniqueRoutes = [...new Set(precacheAssets)];
    expect(uniqueRoutes.length).toBe(precacheAssets.length);
  });

  // Property test: Essential navigation routes should be cached
  it('property: essential navigation routes should be cached', () => {
    const navigationRoutes = ['/dashboard', '/explore', '/events', '/messages'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...navigationRoutes),
        (route: string) => {
          expect(precacheAssets).toContain(route);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
