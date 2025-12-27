"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../context/AuthContext';

/**
 * **Validates: Requirements 26.1, 26.2, 26.3**
 * 
 * Cursor-based pagination for infinite scroll feed.
 * More efficient than offset pagination for large datasets.
 */

// Types
export type FeedItemType = 'post' | 'event' | 'poll' | 'market';

export interface FeedItemData {
    id: string;
    type: FeedItemType;
    data: any;
    createdAt: string;
}

interface UseInfiniteFeedProps {
    initialItems?: FeedItemData[];
    category?: string; // 'feed' | 'campus' | 'events' | 'market'
    filter?: 'all' | 'college' | 'events' | 'market';
}

interface CursorPaginatedResponse<T> {
    data: T[];
    nextCursor: string | null;
    hasMore: boolean;
}

export function useInfiniteFeed({ initialItems = [], category = 'feed', filter = 'college' }: UseInfiniteFeedProps) {
    const { user } = useAuth();
    const [items, setItems] = useState<FeedItemData[]>(initialItems);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Ref to prevent double-fetching in React Strict Mode
    const isFetching = useRef(false);

    const loadMore = useCallback(async (reset = false) => {
        if ((!hasMore && !reset) || isFetching.current || !user) return;

        isFetching.current = true;
        setIsLoading(true);
        setError(null);

        const currentCursor = reset ? undefined : cursor ?? undefined;

        try {
            let newItems: FeedItemData[] = [];
            let nextCursor: string | null = null;
            let moreAvailable = false;

            if (filter === 'events') {
                // --- EVENTS ONLY ---
                const { data } = await api.getEvents(undefined, undefined, 10);
                const mappedEvents = (data || []).map((e: any) => ({
                    id: `event-${e.id}`,
                    type: 'event' as const,
                    data: e,
                    createdAt: e.createdAt
                }));
                newItems = mappedEvents;
                moreAvailable = data.length === 10;

            } else if (filter === 'market') {
                // --- MARKET ONLY ---
                const { data } = await api.getMarketplaceListings(undefined, undefined, undefined, 10);
                const mappedMarket = (data || []).map((m: any) => ({
                    id: `market-${m.id}`,
                    type: 'market' as const,
                    data: m,
                    createdAt: m.createdAt
                }));
                newItems = mappedMarket;
                moreAvailable = data.length === 10;

            } else {
                // --- MIXED FEED (ALL or COLLEGE) using cursor pagination ---

                // Get college slug for filtering
                const collegeSlug = filter === 'college' && user?.profile?.college?.slug 
                    ? user.profile.college.slug 
                    : undefined;

                // Fetch posts with cursor pagination
                const postsRes = await api.getPostsCursor({
                    cursor: currentCursor,
                    limit: 20,
                    collegeSlug,
                    filter: filter as 'all' | 'college',
                }).catch(e => {
                    console.error("Posts fetch error", e);
                    return { data: [], nextCursor: null, hasMore: false };
                });

                // Fetch events only on initial load (reset)
                let eventsData: any[] = [];
                if (reset) {
                    try {
                        const eventsRes = await api.getEvents(collegeSlug, undefined, 5);
                        eventsData = eventsRes.data || [];
                    } catch (e) {
                        console.error("Events fetch error", e);
                    }
                }

                const postsData = postsRes.data || [];
                nextCursor = postsRes.nextCursor || null;
                moreAvailable = postsRes.hasMore ?? false;

                // Map Posts
                const mappedPosts: FeedItemData[] = postsData.map((p: any) => ({
                    id: `post-${p.id}`,
                    type: 'post' as const,
                    data: p,
                    createdAt: p.createdAt
                }));

                // Map Events
                const mappedEvents: FeedItemData[] = eventsData.map((e: any) => ({
                    id: `event-${e.id}`,
                    type: 'event' as const,
                    data: e,
                    createdAt: e.createdAt
                }));

                // Combine
                newItems = [...mappedPosts, ...mappedEvents];
            }

            // Sort by createdAt desc
            newItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Update State
            setItems(prev => {
                const combined = reset ? newItems : [...prev, ...newItems];
                // Dedup by id
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                // Re-sort
                return unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            });

            // Update cursor and hasMore
            setCursor(nextCursor);
            setHasMore(moreAvailable);

        } catch (err) {
            console.error("Feed Error:", err);
            setError("Failed to load feed. Try again.");
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, [user, cursor, hasMore, category, filter]);


    // Initial Load
    useEffect(() => {
        // Reset cursor when filter changes
        setCursor(null);
        setHasMore(true);
        loadMore(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, filter]);

    return {
        items,
        isLoading,
        hasMore,
        error,
        loadMore,
        refresh: () => {
            setCursor(null);
            setHasMore(true);
            loadMore(true);
        }
    };
}
