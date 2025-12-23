"use client";

import { useAuth } from "../context/AuthContext";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Navigation & Layout
import DashboardLayout from "../components/layouts/DashboardLayout";
import CategoryRibbon from "../components/CategoryRibbon";
import ArcMenu from "../components/navigation/ArcMenu";

// Sidebars
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import QuickActions from "../components/dashboard/QuickActions";
import UpcomingEventsWidget from "../components/dashboard/UpcomingEventsWidget";

// Feed
import { useInfiniteFeed } from "../hooks/useInfiniteFeed";
import FeedItemFactory from "../components/FeedItemFactory";
import FeedComposer from "../components/feed/FeedComposer";

// Components
import CreatePostModal from "../components/CreatePostModal";
import { FeedSkeleton } from "../components/ui/Skeleton";

// Icons
import { Sparkles } from "lucide-react";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

function DashboardContent() {
  const { user, loading } = useAuth();
  const { isReady: onboardingComplete } = useOnboardingGuard();
  const { items, isLoading, loadMore, hasMore } = useInfiniteFeed({ category: 'feed' });

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalTab, setPostModalTab] = useState<'TEXT' | 'POLL' | 'MARKET' | 'EVENT'>('TEXT');

  const handleLoadMore = () => {
    loadMore();
  };

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

  // Loading State - Render Skeleton Shell instead of blocking screen
  if (loading || !onboardingComplete) return (
    <DashboardLayout
      leftSidebarContent={
        <>
          <FeedSkeleton count={1} />
          <FeedSkeleton count={1} />
        </>
      }
      rightSidebarContent={<FeedSkeleton count={1} />}
    >
      <FeedSkeleton count={3} />
    </DashboardLayout>
  );

  if (!user) return null;

  return (
    <DashboardLayout
      leftSidebarContent={
        <>
          <ProfileSidebar />
          <QuickActions />
          {/* Trending Widget - Optional: Add back if API exists, removed mock as requested */}
        </>
      }
      rightSidebarContent={
        <>
          <UpcomingEventsWidget />
        </>
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) handleSwipe('left');
        }}
      >

        {/* Category Navigation */}
        <CategoryRibbon />

        {/* Feed Header */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary border-2 border-ink rounded-lg flex items-center justify-center shadow-neo-sm">
              <Sparkles className="w-5 h-5 text-ink" />
            </div>
            <div>
              <h1 className="font-display text-2xl text-ink leading-tight">
                Campus Feed
              </h1>
              <p className="text-sm text-neutral-500">
                What's happening on campus
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-paper border-2 border-ink rounded-full shadow-neo-sm">
            <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse" />
            <span className="font-mono text-xs uppercase">Live</span>
          </div>
        </div>

        {/* Feed Composer */}
        <FeedComposer />

        {/* Feed Items */}
        <motion.div
          className="space-y-4 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className="transform-gpu"
              >
                <FeedItemFactory item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Loading State */}
        {isLoading && <FeedSkeleton count={2} />}

        {/* Load More */}
        {hasMore && !isLoading && items.length > 0 && (
          <motion.div
            className="flex justify-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={handleLoadMore}
              className="btn-neo btn-primary px-6 py-3 text-sm"
            >
              Load More Posts
            </button>
          </motion.div>
        )}

        {/* End of Feed */}
        {!hasMore && items.length > 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full">
              <span className="text-2xl">🎉</span>
              <span className="font-mono text-sm text-neutral-600">
                You're all caught up!
              </span>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-xl text-ink mb-2">
              No posts yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Be the first to share something with your campus!
            </p>
            <button
              onClick={() => {
                setPostModalTab('TEXT');
                setIsPostModalOpen(true);
              }}
              className="btn-neo btn-primary"
            >
              Create First Post
            </button>
          </motion.div>
        )}

        {/* Mobile Bottom Navigation */}
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
            // Refresh handled by context
          }}
        />
      </motion.div>
    </DashboardLayout>
  );
}

export default function DashboardClient() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
