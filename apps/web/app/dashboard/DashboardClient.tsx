"use client";

import { useAuth } from "../context/AuthContext";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Navigation & Layout
import DashboardLayout from "../components/layouts/DashboardLayout";
import CategoryRibbon from "../components/CategoryRibbon";

// Sidebars
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import UpcomingEventsWidget from "../components/dashboard/UpcomingEventsWidget";

// Feed
import { useInfiniteFeed } from "../hooks/useInfiniteFeed";
import FeedItemFactory from "../components/FeedItemFactory";
import FeedComposer from "../components/feed/FeedComposer";

// Components
import CreatePostModal from "../components/CreatePostModal";
import { FeedSkeleton } from "../components/ui/Skeleton";

// Icons
import { Sparkles, AlertTriangle, RefreshCw } from "lucide-react";

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
  const [filter, setFilter] = useState<'all' | 'college'>('college');
  const { items, isLoading, loadMore, hasMore, error } = useInfiniteFeed({ category: 'feed', filter });

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

        {/* Category Navigation - Global variant with 4 items */}
        <CategoryRibbon variant="global" />

        {/* Sticky Feed Header & Filters */}
        <div className="sticky top-0 z-30 bg-paper/80 dark:bg-dark-bg/80 backdrop-blur-md pt-4 pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h1 className="font-display text-xl text-ink dark:text-dark-text hidden sm:block">Feed</h1>

            <div className="flex bg-paper dark:bg-dark-surface p-1 rounded-full border-2 border-ink dark:border-dark-border shadow-neo-sm dark:shadow-neo-dark-sm overflow-x-auto max-w-full">
              <button
                onClick={() => setFilter('college')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === 'college' ? 'bg-ink text-white dark:bg-primary dark:text-ink shadow-sm' : 'text-neutral-500 dark:text-dark-text-muted hover:text-ink dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-dark-elevated'}`}
              >
                My College
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${filter === 'all' ? 'bg-ink text-white dark:bg-primary dark:text-ink shadow-sm' : 'text-neutral-500 dark:text-dark-text-muted hover:text-ink dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-dark-elevated'}`}
              >
                All Posts
              </button>
            </div>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-dark-elevated rounded-full">
              <span className="text-2xl">🎉</span>
              <span className="font-mono text-sm text-neutral-600 dark:text-dark-text-muted">
                You're all caught up!
              </span>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && items.length === 0 && !error && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 dark:bg-primary/10 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-xl text-ink dark:text-dark-text mb-2">
              No posts yet
            </h3>
            <p className="text-neutral-500 dark:text-dark-text-muted mb-6">
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

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-accent-coral/20 dark:bg-accent-coral/10 border-2 border-dashed border-accent-coral rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-accent-coral" />
            </div>
            <h3 className="font-display text-xl text-ink dark:text-dark-text mb-2">
              Connection Error
            </h3>
            <p className="text-neutral-500 dark:text-dark-text-muted mb-6 max-w-md mx-auto">
              Unable to connect to the server. This might be because the server is waking up (takes ~30 seconds) or there's a network issue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-neo btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}

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
