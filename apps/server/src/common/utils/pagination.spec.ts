import * as fc from 'fast-check';
import {
  encodeCursor,
  decodeCursor,
  normalizeLimit,
  buildPrismaCursorQuery,
  buildPaginatedResponse,
  PAGINATION_DEFAULTS,
  CursorPaginatedResponse,
} from './pagination';

/**
 * **Feature: teacher-classroom-admin-views, Property 31: Cursor Pagination Correctness**
 * **Validates: Requirements 26.1, 26.2, 26.3**
 * 
 * For any cursor-based pagination request, the system SHALL:
 * - Correctly encode and decode cursors (round-trip)
 * - Return at most `limit` items per page
 * - Correctly indicate hasMore when more items exist
 * - Provide a valid nextCursor when hasMore is true
 */
describe('Cursor Pagination', () => {
  describe('Property 31: Cursor Pagination Correctness', () => {
    it('should correctly encode and decode cursors (round-trip)', () => {
      fc.assert(
        fc.property(
          // Generate random IDs (cuid-like strings)
          fc.string({ minLength: 10, maxLength: 30 }).filter(s => /^[a-z0-9]+$/.test(s)),
          (id) => {
            const encoded = encodeCursor(id);
            const decoded = decodeCursor(encoded);
            
            // Property: Encoding then decoding should return the original ID
            return decoded === id;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty string cursor gracefully', () => {
      const decoded = decodeCursor('');
      // Empty string decodes to empty string, which is falsy
      expect(decoded === null || decoded === '').toBe(true);
    });

    it('should normalize limit to valid bounds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 1000 }),
          (limit) => {
            const normalized = normalizeLimit(limit);
            
            // Property: Normalized limit should be between 1 and MAX_LIMIT
            return normalized >= 1 && normalized <= PAGINATION_DEFAULTS.MAX_LIMIT;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use default limit for undefined or invalid values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(undefined, 0, -1, -100),
          (limit) => {
            const normalized = normalizeLimit(limit as any);
            
            // Property: Invalid limits should return default
            return normalized === PAGINATION_DEFAULTS.DEFAULT_LIMIT;
          }
        ),
        { numRuns: 10 }
      );
    });

    it('should cap limit at MAX_LIMIT', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: PAGINATION_DEFAULTS.MAX_LIMIT + 1, max: 10000 }),
          (limit) => {
            const normalized = normalizeLimit(limit);
            
            // Property: Limits above MAX should be capped
            return normalized === PAGINATION_DEFAULTS.MAX_LIMIT;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should build correct Prisma cursor query without cursor', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (limit) => {
            const query = buildPrismaCursorQuery({ limit });
            
            // Property: Without cursor, cursor should be undefined and skip should be 0
            return query.cursor === undefined && query.skip === 0 && query.take === normalizeLimit(limit) + 1;
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should build correct Prisma cursor query with cursor', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 10, maxLength: 30 }).filter(s => /^[a-z0-9]+$/.test(s)),
          fc.integer({ min: 1, max: 100 }),
          (id, limit) => {
            const cursor = encodeCursor(id);
            const query = buildPrismaCursorQuery({ cursor, limit });
            
            // Property: With cursor, cursor should be set and skip should be 1
            return (
              query.cursor?.id === id &&
              query.skip === 1 &&
              query.take === normalizeLimit(limit) + 1
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should correctly indicate hasMore when more items exist', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          fc.boolean(),
          (limit, hasExtraItem) => {
            // Generate items with IDs
            const itemCount = hasExtraItem ? limit + 1 : limit;
            const items = Array.from({ length: itemCount }, (_, i) => ({
              id: `item-${i}`,
              content: `Content ${i}`,
            }));

            const response = buildPaginatedResponse(items, limit);

            // Property: hasMore should be true only when we have more items than limit
            return response.hasMore === hasExtraItem;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return at most limit items in data', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          fc.integer({ min: 0, max: 100 }),
          (limit, itemCount) => {
            const items = Array.from({ length: itemCount }, (_, i) => ({
              id: `item-${i}`,
              content: `Content ${i}`,
            }));

            const response = buildPaginatedResponse(items, limit);

            // Property: Data should contain at most `limit` items
            return response.data.length <= limit;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should provide valid nextCursor when hasMore is true', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          (limit) => {
            // Create items with one extra (hasMore = true)
            const items = Array.from({ length: limit + 1 }, (_, i) => ({
              id: `item-${i}`,
              content: `Content ${i}`,
            }));

            const response = buildPaginatedResponse(items, limit);

            // Property: When hasMore is true, nextCursor should be valid and decodable
            if (response.hasMore) {
              const decoded = decodeCursor(response.nextCursor!);
              return decoded === items[limit - 1].id; // Last item in data
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return null nextCursor when hasMore is false', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }),
          (limit) => {
            // Create items without extra (hasMore = false)
            const items = Array.from({ length: limit }, (_, i) => ({
              id: `item-${i}`,
              content: `Content ${i}`,
            }));

            const response = buildPaginatedResponse(items, limit);

            // Property: When hasMore is false, nextCursor should be null
            return !response.hasMore && response.nextCursor === null;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle empty results correctly', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (limit) => {
            const response = buildPaginatedResponse([], limit);

            // Property: Empty results should have no data, no cursor, and hasMore false
            return (
              response.data.length === 0 &&
              response.nextCursor === null &&
              response.hasMore === false
            );
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
