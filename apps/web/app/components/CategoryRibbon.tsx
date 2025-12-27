"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  GraduationCap,
  Compass,
  MessageCircle,
  Users,
} from "lucide-react";
import { 
  GLOBAL_CATEGORIES, 
  COLLEGE_CATEGORIES,
  type NavBoxVariant 
} from "../../lib/navbox-categories";

interface CategoryRibbonProps {
  variant?: NavBoxVariant;
  className?: string;
}

export default function CategoryRibbon({ variant = 'global', className = "" }: CategoryRibbonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const collegeSlug = user?.profile?.college?.slug;
  const tempCollegeId = (user?.profile?.socials as any)?.tempCollegeId;
  const collegeHref = collegeSlug 
    ? `/colleges/${collegeSlug}` 
    : tempCollegeId 
      ? `/colleges/${tempCollegeId}`
      : '/my-college';

  // Get categories based on variant and resolve dynamic paths
  const baseCategories = variant === 'college' ? COLLEGE_CATEGORIES : GLOBAL_CATEGORIES;
  const CATEGORIES = baseCategories.map(cat => ({
    ...cat,
    path: cat.pathTemplate.replace('{{collegeHref}}', collegeHref)
  }));

  const getActiveCategory = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'home';
    if (pathname.startsWith('/colleges') || pathname.startsWith('/my-college')) return 'college';
    if (pathname.startsWith('/explore') || pathname.startsWith('/events') || pathname.startsWith('/resources') || pathname.startsWith('/marketplace') || pathname.startsWith('/collabo')) return 'explore';
    if (pathname.startsWith('/messages')) return 'chat';
    if (pathname.startsWith('/clubs')) return 'clubs';
    return 'home';
  };

  const active = getActiveCategory();

  return (
    <div className={`w-full hidden md:block ${className}`}>
      {/* Desktop View - No rotation/tilt, consistent styling */}
      <div className="flex items-center gap-2 p-1.5 bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border rounded-xl shadow-neo">
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
                  : 'text-neutral-600 dark:text-dark-text-muted hover:bg-neutral-100 dark:hover:bg-dark-border'
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
                  layoutId={`activeTab-${variant}`}
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
