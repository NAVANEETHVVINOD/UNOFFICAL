"use client";

import { useAuth } from "../context/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Navigation
import Navbar from "../components/Navbar";
import CategoryRibbon from "../components/CategoryRibbon";
import OrbitNav from "../components/navigation/OrbitNav";
import ArcMenu from "../components/navigation/ArcMenu";

// Sidebars
import ToolsSidebar from "../components/dashboard/ToolsSidebar";
import MarketplaceRail from "../components/dashboard/MarketplaceRail";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import NewsTicker from "../components/dashboard/NewsTicker";
import UpcomingEventsStack from "../components/dashboard/UpcomingEventsStack";

// Feed
import { useInfiniteFeed } from "../hooks/useInfiniteFeed";
import FeedItemFactory from "../components/FeedItemFactory";
import FeedComposer from "../components/feed/FeedComposer";
import PinnedPaper from "../components/ui/PinnedPaper";
import { RetroToastProvider } from "../context/ToastContext";

// New Components
import CreatePostModal from "../components/CreatePostModal";
// import FloatingCreateButton from "../components/ui/FloatingCreateButton"; // Removed per user request
import CRTModeToggle from "../components/ui/CRTModeToggle";

function DashboardContent() {
  const { user, loading } = useAuth();
  const { items, isLoading, loadMore, hasMore } = useInfiniteFeed({ category: 'feed' });

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalTab, setPostModalTab] = useState<'TEXT' | 'POLL' | 'MARKET' | 'EVENT'>('TEXT');

  // Listen for sidebar events
  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setPostModalTab(e.detail?.type || 'TEXT');
      setIsPostModalOpen(true);
    };
    document.addEventListener('open-create-modal', handleOpenModal);
    return () => document.removeEventListener('open-create-modal', handleOpenModal);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-paper">
      <div className="font-display text-2xl animate-pulse">Loading Chaos...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-paper h-screen flex flex-col overflow-hidden relative selection:bg-accent-yellow selection:text-black">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-halftone opacity-50"></div>

      {/* Fixed Header */}
      <Navbar />

      {/* Main Layout Container - Fixed Height with Flex */}
      <div className="flex-1 flex overflow-hidden relative z-10 max-w-[1600px] w-full mx-auto">

        {/* --- LEFT SIDEBAR (Consolidated "Desk") --- */}
        <aside className="hidden lg:flex lg:w-[320px] flex-col border-r-thick border-black bg-paper z-20 h-full overflow-hidden p-4 space-y-4 pb-4">

          <div className="scale-90 origin-top-left w-[110%] h-full flex flex-col gap-4">
            <ProfileSidebar />

            {/* Widgets */}
            <div className="space-y-4 flex-1">
              {/* Pinned Paper Widget */}
              <div className="transform origin-left hover:scale-[1.02] transition-transform">
                <PinnedPaper />
              </div>

              <ToolsSidebar />
              <UpcomingEventsStack />
              <NewsTicker />
            </div>

            <div className="text-xs font-mono text-gray-400 text-center opacity-50">
              LINKER v3.0.0 (BETA)
            </div>
          </div>
        </aside>

        {/* --- CENTER FEED (Scrollable) --- */}
        <motion.main
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-gray-50/50 relative"
          id="feed-container"
          onPanEnd={(e: any, info: any) => {
            // Mobile Swipe Logic (Only active on small screens)
            if (window.innerWidth < 768) {
              if (info.offset.x < -100) {
                // Swipe Left -> Go to "Next" (Campus)
                window.location.href = '/my-college';
              }
            }
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
            <CategoryRibbon />

            <div className="space-y-8 mt-6">
              {/* Feed Header */}
              <div className="flex items-center gap-3 px-2">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight">Campus Feed</h2>
              </div>

              <FeedComposer />

              {items.map((item) => (
                <FeedItemFactory key={item.id} item={item} />
              ))}

              {isLoading && (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 animate-pulse">
                  Loading more chaos...
                </div>
              )}

              {!hasMore && items.length > 0 && (
                <div className="text-center py-8 font-mono text-xs text-gray-400 uppercase tracking-widest">
                  --- End of the internet ---
                </div>
              )}
              {/* Spacer for Bottom Nav */}
              <div className="h-24 md:hidden"></div>
            </div>
          </div>
        </motion.main>

        {/* Right Sidebar Removed (2-Column Layout) */}

      </div>

      {/* OrbitNav (Desktop Only) */}
      <div className="hidden md:block">
        <OrbitNav />
      </div>

      {/* ArcMenu (Mobile Radial Nav) */}
      <ArcMenu onCompose={() => {
        setPostModalTab('TEXT');
        setIsPostModalOpen(true);
      }} />

      {/* CRT Toggle (Desktop) */}
      <CRTModeToggle />

      {/* Modals */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        initialTab={postModalTab}
        onPostCreated={() => {
          // refresh feed or show toast
        }}
      />
    </div>
  );
}

export default function DashboardClient() {
  return (
    <RetroToastProvider>
      <ErrorBoundary>
        <DashboardContent />
      </ErrorBoundary>
    </RetroToastProvider>
  );
}
