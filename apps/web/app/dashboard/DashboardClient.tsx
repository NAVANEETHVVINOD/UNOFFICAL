"use client";

import { useAuth } from "../context/AuthContext";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Navigation
import Navbar from "../components/Navbar";
import CategoryRibbon from "../components/CategoryRibbon";
import ArcMenu from "../components/navigation/ArcMenu";

// Sidebars
import ProfileSidebar from "../components/dashboard/ProfileSidebar";

// Feed
import { useInfiniteFeed } from "../hooks/useInfiniteFeed";
import FeedItemFactory from "../components/FeedItemFactory";
import FeedComposer from "../components/feed/FeedComposer";

// Components
import CreatePostModal from "../components/CreatePostModal";
import { FeedSkeleton } from "../components/ui/Skeleton";

// Icons
import { Sparkles, TrendingUp, Zap, PenSquare, Calendar, ShoppingBag, FileText, Bookmark, Users, Hash, ArrowUpRight } from "lucide-react";
import Link from "next/link";

// Animation variants with proper typing
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

// Quick Actions data
const quickActions = [
  { icon: PenSquare, label: "New Post", color: "bg-primary", action: "post" },
  { icon: Calendar, label: "Events", color: "bg-accent-coral", href: "/events" },
  { icon: ShoppingBag, label: "Market", color: "bg-accent-mint", href: "/marketplace" },
  { icon: FileText, label: "Notes", color: "bg-accent-blue", href: "/notes" },
  { icon: Bookmark, label: "Saved", color: "bg-accent-purple", href: "/saved" },
  { icon: Users, label: "Clubs", color: "bg-accent-orange", href: "/clubs" },
];

// Trending topics data
const trendingTopics = [
  { tag: "CampusFest2024", posts: 234, trending: true },
  { tag: "ExamSeason", posts: 189, trending: true },
  { tag: "ClubRecruitment", posts: 156, trending: false },
  { tag: "StudyGroup", posts: 98, trending: false },
];

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

  // Loading State (includes onboarding check)
  if (loading || !onboardingComplete) return (
    <div className="min-h-screen bg-white bg-grid flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 bg-primary rounded-lg animate-pulse" />
          <div className="absolute inset-2 bg-white rounded border-2 border-ink flex items-center justify-center">
            <Zap className="w-6 h-6 text-ink animate-pulse" />
          </div>
        </div>
        <p className="font-display text-xl text-ink">Loading your feed...</p>
        <p className="text-sm text-neutral-500 mt-1">Hang tight!</p>
      </motion.div>
    </div>
  );

  if (!user) return null;

  return (
    <motion.div
      className="min-h-screen bg-paper relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />
        {/* Yellow accent dots */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #FFEB3B 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '16px 16px'
          }}
        />
      </div>

      {/* Fixed Header */}
      <Navbar />

      {/* Main Layout */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-6">
        <div className="flex gap-6 pt-4">
          
          {/* LEFT SIDEBAR - Desktop Only */}
          <motion.aside 
            className="hidden lg:block w-[280px] flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="sticky top-24 space-y-4">
              <ProfileSidebar />
              
              {/* Quick Actions */}
              <motion.div
                className="bg-paper border-2 border-ink shadow-neo p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-display text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.map((item, index) => {
                    const Icon = item.icon;
                    const content = (
                      <motion.div
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border border-ink/10 cursor-pointer hover:border-ink hover:shadow-neo-sm transition-all ${item.action === 'post' ? 'bg-primary/10' : 'bg-neutral-50'}`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center mb-1.5`}>
                          <Icon className="w-4 h-4 text-ink" />
                        </div>
                        <span className="text-[10px] font-medium text-neutral-700 text-center">{item.label}</span>
                      </motion.div>
                    );
                    if (item.action === 'post') {
                      return (
                        <button key={index} onClick={() => { setPostModalTab('TEXT'); setIsPostModalOpen(true); }} className="text-left">
                          {content}
                        </button>
                      );
                    }
                    return <Link key={index} href={item.href || '#'}>{content}</Link>;
                  })}
                </div>
              </motion.div>

              {/* Trending Widget */}
              <motion.div
                className="bg-paper border-2 border-ink shadow-neo overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="px-4 py-3 bg-primary/10 border-b border-ink/10 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <h3 className="font-display text-sm uppercase tracking-wide">Trending</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {trendingTopics.map((topic, index) => (
                    <motion.div
                      key={topic.tag}
                      className="px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-neutral-400" />
                          <span className="font-medium text-sm group-hover:text-primary transition-colors">{topic.tag}</span>
                          {topic.trending && (
                            <span className="px-1.5 py-0.5 bg-accent-coral/20 text-accent-coral text-[10px] font-bold rounded">HOT</span>
                          )}
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 ml-6">{topic.posts} posts</p>
                    </motion.div>
                  ))}
                </div>
                <Link href="/explore" className="block">
                  <div className="px-4 py-3 bg-neutral-50 text-center hover:bg-neutral-100 transition-colors">
                    <span className="text-sm font-medium text-ink">Explore More →</span>
                  </div>
                </Link>
              </motion.div>
              
              {/* Footer */}
              <div className="text-center py-4">
                <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                  LINKER v3.0 • Made with 💛
                </p>
              </div>
            </div>
          </motion.aside>

          {/* CENTER FEED */}
          <motion.main
            className="flex-1 min-w-0 pb-32 lg:pb-8"
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
          </motion.main>

          {/* RIGHT SIDEBAR - Desktop Only (Optional) */}
          <motion.aside 
            className="hidden xl:block w-[280px] flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <div className="sticky top-24 space-y-4">
              {/* Upcoming Events Widget */}
              <div className="card-neo p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4" />
                  <h3 className="font-display text-sm uppercase">Upcoming</h3>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 p-2 hover:bg-neutral-50 rounded transition-colors cursor-pointer">
                      <div className="w-12 h-12 bg-primary/20 border border-ink rounded flex flex-col items-center justify-center flex-shrink-0">
                        <span className="font-display text-xs">DEC</span>
                        <span className="font-display text-lg leading-none">{15 + i}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">Campus Event {i}</p>
                        <p className="text-xs text-neutral-500">Main Hall • 6PM</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="/events" className="block mt-4 text-center text-sm font-medium text-ink hover:text-primary transition-colors">
                  View All Events →
                </a>
              </div>


            </div>
          </motion.aside>
        </div>
      </div>

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
  );
}

export default function DashboardClient() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
