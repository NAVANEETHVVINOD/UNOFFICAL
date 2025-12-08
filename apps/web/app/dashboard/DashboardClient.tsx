/**
 * DashboardClient
 * 
 * 3-Column Social Feed Layout for Campus Kerala.
 */
"use client";

import Container from "../components/ui/Container";
import { PageTransition } from "../providers/AnimationProvider";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import { api } from "../../lib/api";
import {
  MiniProfile,
  NavStack,
  QuickActions,
  InlinePostCreate,
  PostCard,
  EventTicket,
  CollegeRadar,
  TrendingMarquee
} from "../components/ui/SocialComponents";
import { RetroButton, Badge } from "../components/ui/NewspaperUI";
import Link from "next/link";
import Navbar from "../components/Navbar";
import CreatePostModal from "../components/CreatePostModal";

// Helper to determine feed item type
type FeedItem = {
  type: 'post' | 'event';
  data: any;
  date: Date;
}

function DashboardContent() {
  const { isAuthenticated, user, loading } = useAuth();
  // const router = useRouter(); // Unused
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalTab, setPostModalTab] = useState<string>('TEXT'); // 'TEXT', 'MEDIA', 'POLL', 'COLLAB'
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadFeed = useCallback(async (reset = false) => {
    if (!user) return;

    const currentPage = reset ? 1 : page;

    if (reset) {
      setLoadingFeed(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      // Fetch Posts and Events
      const postsPromise = api.getPosts(undefined, currentPage);
      const eventsPromise = reset ? api.getEvents(undefined, undefined, 5) : Promise.resolve([]);

      const [postsRes, events] = await Promise.all([
        postsPromise.catch(() => ({ data: [], meta: { lastPage: 0 } })),
        eventsPromise.catch(() => [])
      ]);

      const postsData = postsRes.data || [];
      const newItems: FeedItem[] = [
        ...postsData.map((p: any) => ({ type: 'post', data: p, date: new Date(p.createdAt) } as FeedItem)),
        ...(Array.isArray(events) ? events : []).map((e: any) => ({ type: 'event', data: e, date: new Date(e.createdAt || e.startsAt) } as FeedItem))
      ];

      setFeedItems(prev => {
        const combined = reset ? newItems : [...prev, ...newItems];
        // Remove duplicates just in case
        const unique = Array.from(new Map(combined.map(item => [item.data.id, item])).values());
        // Sort by date descending
        return unique.sort((a, b) => b.date.getTime() - a.date.getTime());
      });

      if (postsRes.meta) {
        setHasMore(currentPage < postsRes.meta.lastPage);
        setPage(currentPage + 1);
      } else {
        setHasMore(false);
      }

    } catch (e) {
      console.error("Feed load failed", e);
    } finally {
      setLoadingFeed(false);
      setIsLoadingMore(false);
    }
  }, [user, page]);

  useEffect(() => {
    if (user) {
      loadFeed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePostCreated = () => {
    loadFeed(true);
  }

  const handleOpenPostModal = (type: string = 'TEXT') => {
    setPostModalTab(type);
    setIsPostModalOpen(true);
  }

  // Quick action handler from sidebar
  const handleQuickAction = (action: string) => {
    if (action === 'post') handleOpenPostModal('TEXT');
    else if (action === 'note') alert("Upload Note Coming Soon!");
    else if (action === 'event') alert("Create Event Coming Soon!");
  }

  if (loading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="bg-paper min-h-screen">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <Navbar showLinks={true} />

      <Container>
        <div className="grid md:grid-cols-12 gap-8 py-4 relative">

          {/* --- LEFT SIDEBAR (3 cols) - Minimal/Trending --- */}
          <div className="md:col-span-3 hidden md:block">
            <div className="sticky top-24 space-y-6">
              <TrendingMarquee />
              <QuickActions onAction={handleQuickAction} />

              <div className="text-[10px] uppercase text-gray-400 font-mono leading-relaxed mt-8">
                Linker OS v1.6<br />
                © 2024 Campus Kerala
              </div>
            </div>
          </div>

          {/* --- MAIN FEED (6 cols) --- */}
          <div className="md:col-span-6">

            {/* Inline Create Post Widget */}
            <InlinePostCreate user={user} onClick={handleOpenPostModal} />

            <div className="mb-6 flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-2">
              <h2 className="font-display font-black text-2xl uppercase">Latest Chaos</h2>
              <Badge className="bg-white border-gray-300 text-gray-400">Sort: Newest</Badge>
            </div>

            {/* Feed Content */}
            <div className="space-y-6">
              {loadingFeed ? (
                <div className="text-center py-20 font-mono animate-pulse">
                  Loading the chaos...
                </div>
              ) : feedItems.length > 0 ? (
                <>
                  {feedItems.map((item, idx) => {
                    if (item.type === 'post') return <PostCard key={`post-${item.data.id || idx}`} post={item.data} />;
                    if (item.type === 'event') return <EventTicket key={`event-${item.data.id || idx}`} event={item.data} />;
                    return null;
                  })}

                  {/* Load More Button */}
                  <div className="text-center pt-8 pb-12">
                    {isLoadingMore ? (
                      <span className="font-mono text-gray-400 animate-pulse">Loading more...</span>
                    ) : hasMore ? (
                      <RetroButton onClick={() => loadFeed(false)} variant="outline">Load More</RetroButton>
                    ) : (
                      <span className="font-mono text-gray-400 text-xs uppercase tracking-widest">--- You've reached the end ---</span>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-20 border-4 border-dashed border-gray-300 rounded-xl">
                  <h3 className="font-display text-2xl text-gray-400 uppercase">It's quiet... too quiet.</h3>
                  <p className="text-gray-500">Be the first to post something!</p>
                  <RetroButton
                    className="mt-4 mx-auto"
                    variant="secondary"
                    onClick={() => handleOpenPostModal('TEXT')}
                  >
                    Create First Post
                  </RetroButton>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT SIDEBAR (3 cols) - Profile --- */}
          <div className="md:col-span-3 hidden md:block">
            <div className="sticky top-24 space-y-6">
              <MiniProfile user={user} />
              <CollegeRadar />
            </div>
          </div>

        </div>
      </Container>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={() => handlePostCreated()}
        initialTab={postModalTab as any}
      />
    </div>
  );
}

export default function DashboardClient() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
