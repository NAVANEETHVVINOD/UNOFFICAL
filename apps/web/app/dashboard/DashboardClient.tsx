"use client";

import { useAuth } from "../context/AuthContext";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { useState, useEffect } from "react";

// Navigation
import Navbar from "../components/Navbar";
import CategoryRibbon from "../components/CategoryRibbon";
import OrbitNav from "../components/navigation/OrbitNav";

// Sidebars
import ToolsSidebar from "../components/dashboard/ToolsSidebar";
import MarketplaceRail from "../components/dashboard/MarketplaceRail";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import NewsTicker from "../components/dashboard/NewsTicker";
import UpcomingEventsStack from "../components/dashboard/UpcomingEventsStack";

// Feed
import { useInfiniteFeed } from "../hooks/useInfiniteFeed";
import FeedItemFactory from "../components/FeedItemFactory";
import { RetroToastProvider } from "../context/ToastContext";

// New Components
import CreatePostModal from "../components/CreatePostModal";
import FloatingCreateButton from "../components/ui/FloatingCreateButton";
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
    <div className="bg-paper min-h-screen relative overflow-x-hidden selection:bg-accent-yellow selection:text-black">
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-halftone"></div>

      <Navbar />

      {/* Layout Container */}
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">

        <CategoryRibbon />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 pb-24">

          {/* --- LEFT SIDEBAR (Sticky) --- */}
          <aside className="hidden md:block md:col-span-3 lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-6">
              <ToolsSidebar />
              <MarketplaceRail />
            </div>
          </aside>

          {/* --- CENTER FEED (Wide) --- */}
          <main className="col-span-1 md:col-span-9 lg:col-span-6 min-h-[80vh]">
            <div className="space-y-6">
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
            </div>
          </main>

          {/* --- RIGHT SIDEBAR (Sticky) --- */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-24 space-y-6">
              <ProfileSidebar />
              <UpcomingEventsStack />
              <NewsTicker />
            </div>
          </aside>

        </div>
      </div>

      <OrbitNav />
      {/* Mobile Floating Action Button */}
      <FloatingCreateButton onClick={() => {
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
