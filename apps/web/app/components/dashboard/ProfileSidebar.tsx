"use client";

import { useAuth } from "../../context/AuthContext";
import { User, Settings, Zap, MapPin, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProfileSidebarSkeleton } from "../ui/Skeleton";

export default function ProfileSidebar() {
  const { user, loading } = useAuth();

  if (loading) return <ProfileSidebarSkeleton />;
  if (!user) return null;

  const level = user.profile?.level || 1;
  const karma = user.profile?.karma || 0;
  const collegeName = user.profile?.college?.name || "No Campus Selected";

  // Calculate level progress (example: 100 karma per level)
  const progress = Math.min((karma % 100) / 100 * 100, 100);

  return (
    <motion.div
      className="bg-white border-2 border-ink shadow-neo overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Yellow Header Banner */}
      <div className="h-16 bg-primary relative overflow-hidden">
        {/* Decorative pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)'
          }}
        />
        {/* Edit button */}
        <Link
          href="/profile/edit"
          className="absolute top-2 right-2 w-8 h-8 bg-white border-2 border-ink rounded flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-neo-sm"
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
        </div>
      </div>
    </motion.div>
  );
}
