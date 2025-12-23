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
}

export function useInfiniteFeed({ initialItems = [], category = 'feed' }: UseInfiniteFeedProps) {
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

            // 1. Fetch Posts
            const postsPromise = api.getPosts(undefined, currentPage);

            // 2. Fetch Events (only on first page for now to interleave)
            const eventsPromise = reset ? api.getEvents(undefined, undefined, 5) : Promise.resolve({ data: [] });

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

            // Sort by createdAt desc
            newItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Update State
            setItems(prev => {
                const combined = reset ? newItems : [...prev, ...newItems];
                // Dedup
                const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
                // Re-sort to be safe
                return unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            });

            // Pagination Logic
            if (postsRes.meta) {
                setHasMore(currentPage < postsRes.meta.lastPage);
                setPage(currentPage + 1);
            } else {
                setHasMore(false);
            }

        } catch (err) {
            console.error("Feed Error:", err);
            setError("Failed to load chaos. Try again.");
        } finally {
            setIsLoading(false);
            isFetching.current = false;
        }
    }, [user, page, hasMore, category]);

    // Initial Load
    useEffect(() => {
        loadMore(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]); // Reload when category changes

    return {
        items,
        isLoading,
        hasMore,
        error,
        loadMore,
        refresh: () => loadMore(true)
    };
}
