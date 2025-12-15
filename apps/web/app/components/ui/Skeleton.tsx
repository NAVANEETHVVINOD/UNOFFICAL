"use client";

import { cn } from "../../../lib/utils";
import { motion } from "framer-motion";

// Base Skeleton with shimmer effect
function Skeleton({
  className,
  shimmer = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { shimmer?: boolean }) {
  if (shimmer) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md bg-gray-200",
          className
        )}
        {...props}
      >
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
          animate={{ translateX: ["100%", "-100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

// Card Skeleton - for post cards, event cards, etc.
function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border-2 border-black p-4 shadow-neo", className)}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-40 w-full mb-4" />
      <div className="flex gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

// Profile Sidebar Skeleton
function ProfileSidebarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white p-4 border-2 border-black shadow-neo", className)}>
      <Skeleton className="w-full aspect-square mb-4" />
      <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
      <Skeleton className="h-4 w-1/2 mx-auto mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Skeleton className="h-14 rounded" />
        <Skeleton className="h-14 rounded" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

// Feed Skeleton - multiple cards
function FeedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// List Item Skeleton
function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 p-3", className)}>
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-8 w-20" />
    </div>
  );
}

// Conversation/Message Skeleton
function ConversationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 p-4 border-b border-gray-100", className)}>
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-28 mb-2" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="text-right">
        <Skeleton className="h-3 w-12 mb-2" />
        <Skeleton className="h-5 w-5 rounded-full ml-auto" />
      </div>
    </div>
  );
}

// Event Card Skeleton
function EventCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border-2 border-black p-4 shadow-neo", className)}>
      <Skeleton className="h-32 w-full mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// Marketplace Listing Skeleton
function ListingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border-2 border-black shadow-neo overflow-hidden", className)}>
      <Skeleton className="h-40 w-full" />
      <div className="p-3">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-6 w-20 mb-2" />
        <div className="flex items-center gap-2">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

// Notification Skeleton
function NotificationSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-3 p-3", className)}>
      <Skeleton className="w-2 h-2 rounded-full mt-2" />
      <div className="flex-1">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

// Table Row Skeleton
function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Stats Card Skeleton
function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("bg-white border-2 border-black p-4 shadow-neo", className)}>
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

// Full Page Loading Skeleton
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-paper p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-32" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <ProfileSidebarSkeleton />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <FeedSkeleton count={3} />
          </div>
        </div>
      </div>
    </div>
  );
}

export {
  Skeleton,
  CardSkeleton,
  ProfileSidebarSkeleton,
  FeedSkeleton,
  ListItemSkeleton,
  ConversationSkeleton,
  EventCardSkeleton,
  ListingSkeleton,
  NotificationSkeleton,
  TableRowSkeleton,
  StatsCardSkeleton,
  PageSkeleton,
};
