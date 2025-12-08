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
  const router = useRouter();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
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
      // For Load More, we might only want posts? For now, fetch both to keep mix consistent or just posts?
      // Let's just fetch posts for pagination to keep events at top.
      const postsPromise = api.getPosts(undefined, currentPage);
      const eventsPromise = reset ? api.getEvents(undefined, undefined, 5) : Promise.resolve([]); // Only fetch events on initial load

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
      // Intentionally only run on mount/user change
      loadFeed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handlePostCreated = () => {
    loadFeed(true);
  }

  const handleQuickAction = (action: string) => {
    if (action === 'post') {
      setIsPostModalOpen(true);
    } else {
      console.log("Action not implemented yet:", action);
    }
  }

  if (loading) return <LoadingState />;
  if (!user) return null;

  return (
    <div className="bg-paper min-h-screen">
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-5 z-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <Navbar showLinks={false} />

      <Container>
        <div className="grid md:grid-cols-12 gap-8 py-4 relative">

          {/* --- LEFT SIDEBAR (3 cols) --- */}
          <div className="md:col-span-3 hidden md:block">
            <div className="sticky top-8">
              <MiniProfile user={user} />
              <NavStack />
              <QuickActions onAction={handleQuickAction} />
            </div>
          </div>

          {/* --- MAIN FEED (6 cols) --- */}
          <div className="md:col-span-6">
            {/* Mobile Profile Toggle or View could go here */}

            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-display font-black text-4xl uppercase leading-none">The Feed</h2>
                <p className="font-hand text-xl text-gray-500 -mt-1 transform -rotate-1">What's chaotic today?</p>
              </div>
              {/* Toggle Switch Placeholder */}
              <div className="hidden md:block">
                <Badge className="bg-black text-white hover:bg-accent-retroAccent cursor-pointer">CHAOS MODE ⚡</Badge>
              </div>
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
                    onClick={() => setIsPostModalOpen(true)}
                  >
                    Create Post
                  </RetroButton>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT SIDEBAR (3 cols) --- */}
          <div className="md:col-span-3 hidden md:block">
            <div className="sticky top-8 space-y-8">
              <CollegeRadar />

              <TrendingMarquee />

              {/* Suggested Clubs */}
              <div className="border-t-4 border-black pt-4">
                <h4 className="font-bold text-sm uppercase mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent-pink rounded-full"></span>
                  Suggested Clubs
                </h4>
                <div className="space-y-3">
                  {/* Mock Club 1 */}
                  <div className="bg-white border text-left p-3 shadow-neo-sm hover:translate-x-1 transition-transform cursor-pointer flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-full text-white flex items-center justify-center font-bold text-xs">R</div>
                    <div className="flex-1">
                      <h5 className="font-bold text-sm leading-none">Robotics</h5>
                      <p className="text-[10px] text-gray-500">Tech • 240 Members</p>
                    </div>
                    <div className="text-lg">+</div>
                  </div>
                  {/* Mock Club 2 */}
                  <div className="bg-white border text-left p-3 shadow-neo-sm hover:translate-x-1 transition-transform cursor-pointer flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent-blue rounded-full text-white flex items-center justify-center font-bold text-xs">D</div>
                    <div className="flex-1">
                      <h5 className="font-bold text-sm leading-none">Debate</h5>
                      <p className="text-[10px] text-gray-500">Lit • 105 Members</p>
                    </div>
                    <div className="text-lg">+</div>
                  </div>
                </div>
              </div>

              {/* Footer Credits */}
              <div className="text-[10px] uppercase text-gray-400 font-mono leading-relaxed">
                Linker OS v1.0<br />
                Made with ☕ & 💻<br />
                © 2024
              </div>
            </div>
          </div>
        </div>
      </Container>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={() => handlePostCreated()}
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
