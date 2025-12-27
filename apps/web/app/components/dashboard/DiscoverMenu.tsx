"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Compass,
  Calendar,
  ShoppingBag,
  BookOpen,
  ChevronDown,
  Users,
} from "lucide-react";

interface DiscoverMenuItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

const DISCOVER_ITEMS: DiscoverMenuItem[] = [
  {
    id: "events",
    label: "Events",
    description: "Campus happenings",
    icon: Calendar,
    path: "/events",
    color: "bg-accent-coral",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Buy & sell",
    icon: ShoppingBag,
    path: "/marketplace",
    color: "bg-accent-mint",
  },
  {
    id: "resources",
    label: "Resources",
    description: "Notes & guides",
    icon: BookOpen,
    path: "/resources",
    color: "bg-accent-purple",
  },
  {
    id: "collabo",
    label: "Collaborations",
    description: "Find teammates",
    icon: Users,
    path: "/collabo",
    color: "bg-accent-blue",
  },
];

interface DiscoverMenuProps {
  variant?: "sidebar" | "mobile";
}

export default function DiscoverMenu({ variant = "sidebar" }: DiscoverMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === "mobile") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
            isExpanded ? "bg-primary text-ink" : "text-ink/60 hover:text-ink"
          }`}
        >
          <Compass className="w-6 h-6" />
          <span className="text-[10px] font-bold">More</span>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 z-40"
                onClick={() => setIsExpanded(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white border-2 border-ink rounded-xl shadow-neo-lg overflow-hidden z-50"
              >
                {DISCOVER_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => setIsExpanded(false)}
                      className="flex items-center gap-3 p-3 hover:bg-neutral-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <Icon className="w-4 h-4 text-ink" />
                      </div>
                      <div>
                        <span className="font-bold text-sm block">
                          {item.label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Sidebar variant
  return (
    <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl shadow-neo overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-dark-border transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Compass className="w-5 h-5 text-ink" />
          </div>
          <span className="font-display font-bold">Discover</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        </motion.div>
      </button>

      {/* Expandable Menu */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-2 pt-0 space-y-1">
              {DISCOVER_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.path}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors group"
                    >
                      <div
                        className={`p-2 rounded-lg ${item.color} transition-transform group-hover:scale-110`}
                      >
                        <Icon className="w-4 h-4 text-ink" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-sm block group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
