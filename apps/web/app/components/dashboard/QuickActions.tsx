"use client";

import { motion } from "framer-motion";
import {
  PenSquare,
  Calendar,
  ShoppingBag,
  FileText,
  Bookmark,
  Users
} from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  onCreatePost?: () => void;
}

const actions = [
  { icon: PenSquare, label: "New Post", color: "bg-primary", action: "post" },
  { icon: Calendar, label: "Events", color: "bg-accent-coral", href: "/events" },
  { icon: ShoppingBag, label: "Market", color: "bg-accent-mint", href: "/marketplace" },
  { icon: FileText, label: "Notes", color: "bg-accent-blue", href: "/notes" },
  { icon: Bookmark, label: "Saved", color: "bg-accent-purple", href: "/saved" },
  { icon: Users, label: "Clubs", color: "bg-accent-orange", href: "/clubs" },
];

export default function QuickActions({ onCreatePost = () => { } }: QuickActionsProps) {
  return (
    <motion.div
      className="bg-white border-2 border-ink shadow-neo p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
    >
      <h3 className="font-display text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full" />
        Quick Actions
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {actions.map((item, index) => {
          const Icon = item.icon;

          const content = (
            <motion.div
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg
                border border-ink/10 cursor-pointer
                hover:border-ink hover:shadow-neo-sm transition-all
                ${item.action === 'post' ? 'bg-primary/10' : 'bg-neutral-50'}
              `}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center mb-1.5`}>
                <Icon className="w-4 h-4 text-ink" />
              </div>
              <span className="text-[10px] font-medium text-neutral-700 text-center">
                {item.label}
              </span>
            </motion.div>
          );

          if (item.action === 'post') {
            return (
              <button key={index} onClick={onCreatePost} className="text-left">
                {content}
              </button>
            );
          }

          return (
            <Link key={index} href={item.href || '#'}>
              {content}
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
