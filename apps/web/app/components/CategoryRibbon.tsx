"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  GraduationCap, // College icon
  Compass, // Explore icon
  MessageCircle,
} from "lucide-react";

interface CategoryRibbonProps {
  className?: string;
}

export default function CategoryRibbon({ className = "" }: CategoryRibbonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const collegeSlug = user?.profile?.college?.slug;
  const collegeHref = collegeSlug ? `/colleges/${collegeSlug}` : '/my-college';

  // Desktop Nav Box: 4 items - Home, College, Explore, Chat
  const CATEGORIES = [
    { id: 'feed', label: 'Home', icon: Home, color: 'bg-primary', path: '/dashboard' },
    { id: 'college', label: 'College', icon: GraduationCap, color: 'bg-accent-coral', path: collegeHref },
    { id: 'explore', label: 'Explore', icon: Compass, color: 'bg-accent-blue', path: '/explore' },
    { id: 'messages', label: 'Chat', icon: MessageCircle, color: 'bg-accent-orange', path: '/messages' },
  ];

  const getActiveCategory = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'feed';
    if (pathname.startsWith('/colleges') || pathname.startsWith('/my-college')) return 'college';
    if (pathname.startsWith('/explore') || pathname.startsWith('/events') || pathname.startsWith('/clubs') || pathname.startsWith('/resources') || pathname.startsWith('/marketplace')) return 'explore';
    if (pathname.startsWith('/messages')) return 'messages';
    return 'feed';
  };

  const active = getActiveCategory();

  return (
    <div className={`w-full hidden md:block ${className}`}>
      {/* Desktop View - Hidden on mobile, BottomNav handles navigation */}
      <div
        className="flex items-center gap-2 p-1.5 bg-paper border-2 border-ink rounded-xl shadow-neo"
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          const Icon = cat.icon;

          return (
            <motion.button
              key={cat.id}
              onClick={() => router.push(cat.path)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-lg
                font-medium text-sm transition-all
                ${isActive
                  ? `${cat.color} text-ink border-2 border-ink shadow-neo-sm`
                  : 'text-neutral-600 hover:bg-neutral-100'
                }
              `}
              whileHover={{ scale: isActive ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>

              {isActive && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-2 h-2 bg-ink rounded-full"
                  layoutId="activeTab"
                  style={{ x: '-50%' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}
