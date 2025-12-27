"use client";

import { useAuth } from "../../context/AuthContext";
import { User, Settings, Zap, MapPin, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProfileSidebarSkeleton } from "../ui/Skeleton";
import { ThemeToggleInline } from "../ThemeToggle";

export default function ProfileSidebar() {
  const { user, loading } = useAuth();

  if (loading) return <ProfileSidebarSkeleton />;
  if (!user) return null;

  const level = user.profile?.level || 1;
  const karma = user.profile?.karma || 0;
  
  // Get college name from multiple sources (direct college, or temp college from socials)
  const collegeName = user.profile?.college?.name 
    || (user.profile?.socials as any)?.tempCollegeName 
    || "No Campus Selected";

  // Calculate level progress (example: 100 karma per level)
  const progress = Math.min((karma % 100) / 100 * 100, 100);

  return (
    <motion.div
      className="bg-paper border-2 border-ink shadow-neo overflow-hidden rounded-card-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="h-20 bg-primary relative overflow-hidden">
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
          }}
        />
        {/* Zig Zag Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-4">
          <svg className="absolute bottom-0 w-full h-3 text-paper" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" />
            <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" opacity=".5" />
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" fill="#FDF6E3" />
          </svg>
        </div>

        {/* Edit button */}
        <Link
          href="/profile/edit"
          className="absolute top-2 right-2 w-8 h-8 bg-white border-2 border-ink rounded flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-neo-sm z-20"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </div>

      {/* Avatar - Overlapping banner */}
      <div className="px-4 -mt-10 relative z-10">
        <Link href="/profile" className="block">
          <motion.div
            className="w-20 h-20 bg-white border-3 border-ink rounded-xl overflow-hidden shadow-neo"
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {user.profile?.avatarUrl ? (
              <img
                src={user.profile.avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                <User className="w-8 h-8 text-neutral-400" />
              </div>
            )}
          </motion.div>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-4 pt-3 pb-4">
        <Link href="/profile" className="block group">
          <h3 className="font-display text-lg text-ink group-hover:text-primary transition-colors truncate">
            {user.profile?.fullName || "Anonymous"}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-neutral-500 mt-1">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <p className="text-sm truncate">{collegeName}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="bg-primary/20 border border-ink/10 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="font-display text-lg">{level}</span>
            </div>
            <span className="text-xs text-neutral-600 uppercase tracking-wide">Level</span>
          </div>

          <div className="bg-accent-coral/10 border border-ink/10 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Star className="w-4 h-4 text-accent-coral" />
              <span className="font-display text-lg">{karma}</span>
            </div>
            <span className="text-xs text-neutral-600 uppercase tracking-wide">Karma</span>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
            <span>Level {level}</span>
            <span>{karma % 100}/{100} XP</span>
          </div>
          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden border border-ink/10">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-4 space-y-2">
          <Link href="/my-college">
            <motion.div
              className="flex items-center justify-between p-3 bg-ink text-white rounded-lg hover:bg-neutral-800 transition-colors"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-medium text-sm">My Campus</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>

          <Link href="/profile">
            <motion.div
              className="flex items-center justify-between p-3 border-2 border-ink rounded-lg hover:bg-neutral-50 transition-colors"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-medium text-sm">View Profile</span>
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          </Link>

          <div className="flex items-center justify-between p-3 border-2 border-ink rounded-lg bg-paper dark:bg-dark-surface hover:bg-neutral-50 dark:hover:bg-dark-elevated transition-colors">
            <span className="font-medium text-sm dark:text-dark-text">Dark Mode</span>
            <ThemeToggleInline />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
