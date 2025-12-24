"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api'; // Correct path
import { useAuth } from '../context/AuthContext';

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
    filter?: 'all' | 'college' | 'events' | 'market'; // Added events/market
}

export function useInfiniteFeed({ initialItems = [], category = 'feed', filter = 'college' }: UseInfiniteFeedProps) {
    const { user } = useAuth();
    const [items, setItems] = useState<FeedItemData[]>(initialItems);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState<string | null>(null);

    // Ref to prevent double-fetching in React Strict Mode
    const isFetching = useRef(false);

    const loadMore = useCallback(async (reset = false) => {
        if ((!hasMore && !reset) || isFetching.current || !user) return;

        isFetching.current = true;
        setIsLoading(true);
        setError(null);

        const currentPage = reset ? 1 : page;

        try {
            let newItems: FeedItemData[] = [];

            if (filter === 'events') {
                // --- EVENTS ONLY ---
                const { data } = await api.getEvents(undefined, undefined, 10); // TODO: Pagination cursor support
                const mappedEvents = (data || []).map((e: any) => ({
                    id: `event-${e.id}`,
                    type: 'event' as const,
                    data: e,
                    createdAt: e.createdAt // Events need start date sorting usually, but feed uses createdAt?
                }));
                newItems = mappedEvents;
                // Simple pagination hack for now as getEvents uses cursor, not page
                setHasMore(data.length === 10);

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
                setHasMore(data.length === 10);

            } else {
                // --- MIXED FEED (ALL or COLLEGE) ---

                // 1. Fetch Posts
                // If filter is 'college', API handles the logic via collegeSlug or user context? 
                // Currently api.getPosts takes filter param.
                const postsPromise = api.getPosts(undefined, currentPage, 20, filter as 'all' | 'college');

                // 2. Fetch Events (conditionally filtered)
                let eventCollegeSlug = undefined;
                if (filter === 'college' && user?.profile?.college?.slug) {
                    eventCollegeSlug = user.profile.college.slug;
                }

                const eventsPromise = reset ? api.getEvents(eventCollegeSlug, undefined, 5) : Promise.resolve({ data: [] });

                const [postsRes, eventsRes] = await Promise.all([
                    postsPromise.catch(e => { console.error("Posts fetch error", e); return { data: [], meta: { lastPage: 0 } } }),
                    eventsPromise.catch(e => { console.error("Events fetch error", e); return { data: [] } })
                ]);

                const postsData = postsRes.data || [];
                const eventsData = (eventsRes as any).data || [];

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

                // Pagination Logic
                if (postsRes.meta) {
                    setHasMore(currentPage < postsRes.meta.lastPage);
                    setPage(currentPage + 1);
                } else {
                    setHasMore(false);
                }
            }

            // Sort by createdAt desc (or custom logic)
            // Note: Events might need sorting by eventDate, but feed is usually creation time
            newItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Update State
            setItems(prev => {
                const combined = reset ? newItems : [...prev, ...newItems];
                // Dedup
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                // Re-sort
                return unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            });

            if (!reset && filter !== 'events' && filter !== 'market') {
                // Only increment page for mixed feed where we track page state
                // Events/Market need cursor implementation later
            }

        } catch (err) {
            console.error("Feed Error:", err);
            setError("Failed to load chaos. Try again.");
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, [user, page, hasMore, category, filter]);


    // Initial Load
    useEffect(() => {
        loadMore(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, filter]); // Reload when category or filter changes

    return {
        items,
        isLoading,
        hasMore,
        error,
        loadMore,
        refresh: () => loadMore(true)
    };
}
