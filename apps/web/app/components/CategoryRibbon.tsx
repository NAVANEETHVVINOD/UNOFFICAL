"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  School,
  Calendar,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";

const CATEGORIES = [
  { id: 'feed', label: 'Home', icon: Home, color: 'bg-primary', path: '/dashboard' },
  { id: 'campus', label: 'Campus', icon: School, color: 'bg-accent-blue', path: '/my-college' },
  { id: 'events', label: 'Events', icon: Calendar, color: 'bg-accent-coral', path: '/events' },
  { id: 'market', label: 'Market', icon: ShoppingBag, color: 'bg-accent-mint', path: '/marketplace' },
  { id: 'messages', label: 'Chat', icon: MessageCircle, color: 'bg-accent-purple', path: '/messages' },
];

interface CategoryRibbonProps {
  className?: string;
}

export default function CategoryRibbon({ className = "" }: CategoryRibbonProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getActiveCategory = () => {
    if (pathname === '/dashboard' || pathname === '/') return 'feed';
    if (pathname.startsWith('/my-college') || pathname.startsWith('/colleges')) return 'campus';
    if (pathname.startsWith('/events')) return 'events';
    if (pathname.startsWith('/marketplace')) return 'market';
    if (pathname.startsWith('/messages')) return 'messages';
    return 'feed';
  };

  const active = getActiveCategory();

  return (
    <div className={`w-full hidden md:block ${className}`}>
      {/* Desktop View - Hidden on mobile, ArcMenu handles navigation */}
      <div className="flex items-center gap-2 p-1 bg-paper border-2 border-ink rounded-card shadow-neo">
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
