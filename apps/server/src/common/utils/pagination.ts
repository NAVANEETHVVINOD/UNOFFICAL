/**
 * Cursor-based pagination utilities for efficient infinite scroll.
 * 
 * **Validates: Requirements 26.1, 26.2, 26.3**
 * 
 * Cursor pagination is more efficient than offset pagination for large datasets
 * because it doesn't require counting all previous records.
 */

/**
 * Parameters for cursor-based pagination requests.
 */
export interface CursorPaginationParams {
  /** The cursor pointing to the last item of the previous page (base64 encoded ID) */
  cursor?: string;
  /** Number of items to return per page (default: 20, max: 100) */
  limit?: number;
}

/**
 * Response structure for cursor-paginated endpoints.
 */
export interface CursorPaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Cursor for the next page (null if no more items) */
  nextCursor: string | null;
  /** Whether there are more items after this page */
  hasMore: boolean;
}

/**
 * Default and maximum limits for pagination.
 */
export const PAGINATION_DEFAULTS = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/**
 * Encode an ID to a cursor string (base64).
 * @param id - The ID to encode
 * @returns Base64 encoded cursor string
 */
export function encodeCursor(id: string): string {
  return Buffer.from(id, 'utf-8').toString('base64');
}

/**
 * Decode a cursor string back to an ID.
 * @param cursor - The base64 encoded cursor
 * @returns The decoded ID, or null if invalid
 */
export function decodeCursor(cursor: string): string | null {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8');
    // Basic validation - should be a non-empty string
    return decoded && decoded.length > 0 ? decoded : null;
  } catch {
    return null;
  }
}

/**
 * Normalize the limit parameter to be within valid bounds.
 * @param limit - The requested limit
 * @returns Normalized limit between 1 and MAX_LIMIT
 */
export function normalizeLimit(limit?: number): number {
  if (!limit || limit < 1) {
    return PAGINATION_DEFAULTS.DEFAULT_LIMIT;
  }
  return Math.min(limit, PAGINATION_DEFAULTS.MAX_LIMIT);
}

/**
 * Build Prisma cursor query parameters for cursor-based pagination.
 * 
 * @param params - Pagination parameters from the request
 * @returns Prisma query options for cursor pagination
 * 
 * @example
 * ```typescript
 * const { cursor, take, skip } = buildPrismaCursorQuery({ cursor: 'abc123', limit: 20 });
 * const posts = await prisma.post.findMany({
 *   cursor,
 *   take,
 *   skip,
 *   orderBy: { createdAt: 'desc' },
 * });
 * ```
 */
export function buildPrismaCursorQuery(params: CursorPaginationParams): {
  cursor: { id: string } | undefined;
  take: number;
  skip: number;
} {
  const limit = normalizeLimit(params.limit);
  const decodedCursor = params.cursor ? decodeCursor(params.cursor) : null;

  return {
    // If we have a cursor, start after that record
    cursor: decodedCursor ? { id: decodedCursor } : undefined,
    // Take one extra to determine if there are more items
    take: limit + 1,
    // Skip the cursor record itself when using cursor
    skip: decodedCursor ? 1 : 0,
  };
}

/**
 * Process query results and build a paginated response.
 * 
 * @param items - Array of items returned from the database (should include one extra)
 * @param limit - The requested limit (not including the extra item)
 * @returns Paginated response with data, nextCursor, and hasMore
 * 
 * @example
 * ```typescript
 * const posts = await prisma.post.findMany({ take: limit + 1, ... });
 * const response = buildPaginatedResponse(posts, limit);
 * // response.data contains at most `limit` items
 * // response.hasMore indicates if there are more items
 * // response.nextCursor is the cursor for the next page
 * ```
 */
export function buildPaginatedResponse<T extends { id: string }>(
  items: T[],
  limit: number,
): CursorPaginatedResponse<T> {
  const normalizedLimit = normalizeLimit(limit);
  const hasMore = items.length > normalizedLimit;
  
  // Remove the extra item used for hasMore detection
  const data = hasMore ? items.slice(0, normalizedLimit) : items;
  
  // Get the cursor for the next page (last item's ID)
  const lastItem = data[data.length - 1];
  const nextCursor = hasMore && lastItem ? encodeCursor(lastItem.id) : null;

  return {
    data,
    nextCursor,
    hasMore,
  };
}

/**
 * Helper to create a complete cursor pagination flow.
 * Combines query building and response processing.
 * 
 * @param params - Pagination parameters from the request
 * @param queryFn - Function that executes the database query
 * @returns Paginated response
 * 
 * @example
 * ```typescript
 * const response = await executeCursorPagination(
 *   { cursor: req.query.cursor, limit: 20 },
 *   async (queryParams) => {
 *     return prisma.post.findMany({
 *       ...queryParams,
 *       orderBy: { createdAt: 'desc' },
 *       include: { author: true },
 *     });
 *   }
 * );
 * ```
 */
export async function executeCursorPagination<T extends { id: string }>(
  params: CursorPaginationParams,
  queryFn: (queryParams: ReturnType<typeof buildPrismaCursorQuery>) => Promise<T[]>,
): Promise<CursorPaginatedResponse<T>> {
  const limit = normalizeLimit(params.limit);
  const queryParams = buildPrismaCursorQuery(params);
  const items = await queryFn(queryParams);
  return buildPaginatedResponse(items, limit);
}
