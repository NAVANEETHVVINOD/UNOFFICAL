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
            // Simulate API delay for "feel"
            // await new Promise(r => setTimeout(r, 800));

            // Construct API call based on category
            // In a real scenario, this would likely be a unified /feed endpoint
            // For now, we simulate mixing posts and events

            let newBatch: FeedItemData[] = [];

            // 1. Fetch Posts
            // const postsPromise = api.getPosts(undefined, currentPage);

            // 2. Fetch Events (only on first page or interleaved)
            // const eventsPromise = reset ? api.getEvents(undefined, undefined, 5) : Promise.resolve([]);

            // Mocking Response for consistent Dev Experience until Backend is 100%
            // Replace this block with actual API calls
            const mockPosts = Array.from({ length: 5 }).map((_, i) => ({
                id: `post-${currentPage}-${i}-${Math.random()}`,
                type: (Math.random() > 0.7 ? 'poll' : 'post') as FeedItemType,
                createdAt: new Date().toISOString(),
                data: {
                    id: `post-${currentPage}-${i}`,
                    content: `This is a retro post #${i + 1} from page ${currentPage}. #campus #vibes`,
                    author: { name: 'Campus Chaos', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=chaos' },
                    likes: Math.floor(Math.random() * 100),
                    comments: Math.floor(Math.random() * 20),
                    image: Math.random() > 0.5 ? 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853' : undefined,
                }
            }));

            newBatch = [...mockPosts];

            setItems(prev => {
                if (reset) return newBatch;

                // Dedup logic
                const existingIds = new Set(prev.map(i => i.id));
                const filterednew = newBatch.filter(i => !existingIds.has(i.id));
                return [...prev, ...filterednew];
            });

            setPage(prev => reset ? 2 : prev + 1);

            // Stop after 5 pages for demo
            if (currentPage >= 5) setHasMore(false);

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
