"use client";

import { useAuth } from "../context/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Navigation
import Navbar from "../components/Navbar";
import CategoryRibbon from "../components/CategoryRibbon";
import OrbitNav from "../components/navigation/OrbitNav";
import ArcMenu from "../components/navigation/ArcMenu";

// Sidebars
import ToolsSidebar from "../components/dashboard/ToolsSidebar";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import NewsTicker from "../components/dashboard/NewsTicker";
import UpcomingEventsStack from "../components/dashboard/UpcomingEventsStack";

// Feed
import { useInfiniteFeed } from "../hooks/useInfiniteFeed";
import FeedItemFactory from "../components/FeedItemFactory";
import FeedComposer from "../components/feed/FeedComposer";
import PinnedPaper from "../components/ui/PinnedPaper";
import { RetroToastProvider } from "../context/ToastContext";

// Components
import CreatePostModal from "../components/CreatePostModal";
import { FeedSkeleton } from "../components/ui/Skeleton";

// Animations
import { containerVariants, feedItemVariants, pageVariants } from "../../lib/animations";

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

  // Swipe handler for mobile navigation
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (window.innerWidth < 768) {
      if (direction === 'left') {
        window.location.href = '/my-college';
      }
    }
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-paper">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-display text-xl">Loading your feed...</p>
      </motion.div>
    </div>
  );

  if (!user) return null;

  return (
    <motion.div
      className="bg-paper min-h-screen flex flex-col relative selection:bg-accent-yellow selection:text-black"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-halftone opacity-30" />

      {/* Fixed Header */}
      <Navbar />

      {/* Main Layout Container */}
      <div className="flex-1 flex relative z-10 max-w-[1400px] w-full mx-auto">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex lg:w-[280px] flex-col border-r border-black/10 bg-paper/80 backdrop-blur-sm z-20 sticky top-[88px] h-[calc(100vh-88px)] p-4 overflow-y-auto scrollbar-hide">
          <div className="space-y-4">
            <ProfileSidebar />

            {/* Widgets */}
            <motion.div
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={feedItemVariants}>
                <PinnedPaper />
              </motion.div>
              <motion.div variants={feedItemVariants}>
                <ToolsSidebar />
              </motion.div>
              <motion.div variants={feedItemVariants}>
                <UpcomingEventsStack />
              </motion.div>
              <motion.div variants={feedItemVariants}>
                <NewsTicker />
              </motion.div>
            </motion.div>

            {/* Version */}
            <div className="text-[10px] font-mono text-gray-400 text-center pt-4 border-t border-gray-200">
              LINKER v3.0.0 (BETA)
            </div>
          </div>
        </aside>

        {/* CENTER FEED */}
        <motion.main
          className="flex-1 min-h-screen bg-gray-50/50"
          id="feed-container"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={(_, info) => {
            if (info.offset.x < -100) handleSwipe('left');
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
            <CategoryRibbon />

            <div className="space-y-6 mt-6">
              {/* Feed Header */}
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 bg-red-500 rounded-full animate-pulse" />
                <h2 className="font-display font-black text-xl uppercase tracking-tight">
                  Campus Feed
                </h2>
              </div>

              <FeedComposer />

              {/* Feed Items with Staggered Animation */}
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={feedItemVariants}
                      layout
                    >
                      <FeedItemFactory item={item} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Loading State */}
              {isLoading && <FeedSkeleton count={2} />}

              {/* End of Feed */}
              {!hasMore && items.length > 0 && (
                <motion.div
                  className="text-center py-8 font-mono text-xs text-gray-400 uppercase tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  — End of feed —
                </motion.div>
              )}

              {/* Empty State */}
              {!isLoading && items.length === 0 && (
                <div className="text-center py-12">
                  <p className="font-display text-lg text-gray-500">No posts yet</p>
                  <p className="text-sm text-gray-400 mt-2">Be the first to share something!</p>
                </div>
              )}

              {/* Mobile Bottom Spacer */}
              <div className="h-24 md:hidden" />
            </div>
          </div>
        </motion.main>
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

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        initialTab={postModalTab}
        onPostCreated={() => {
          // TODO: Refresh feed or show toast
        }}
      />
    </motion.div>
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
