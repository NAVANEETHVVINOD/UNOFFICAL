"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PenSquare, Calendar, ShoppingBag, FileText, Bookmark, Users, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import CreatePostModal from "../CreatePostModal";

interface QuickActionItem {
  icon: any;
  label: string;
  color: string;
  action?: "post";
  href?: string;
}

interface QuickActionsProps {
  collegeSlug?: string;
  className?: string; // Allow custom classNames for positioning if needed
}

export default function QuickActions({ collegeSlug, className = "" }: QuickActionsProps) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postModalTab, setPostModalTab] = useState<'TEXT' | 'POLL' | 'MARKET' | 'EVENT'>('TEXT');

  // If collegeSlug is present, we adjust links to be college-specific where appropriate
  // OR we can keep them global if that's the desired behavior.
  // Based on DashboardClient (Global) vs CollegeFeed (College):
  // Global: /events, /marketplace, /notes, /saved, /clubs
  // College: events (relative), /notes, /saved, clubs (relative), #alerts

  const actions: QuickActionItem[] = [
    { icon: PenSquare, label: "New Post", color: "bg-primary", action: "post" },
    {
      icon: Calendar,
      label: "Events",
      color: "bg-accent-coral",
      href: collegeSlug ? `/colleges/${collegeSlug}/events` : "/events"
    },
    // Marketplace is usually global, but if we have college specific marketplace logic later we can add it.
    // CollegeFeed didn't have Marketplace in the list, but Global did. 
    // The user asked to "make ui into componets as possible so they are reusable".
    // I will include Marketplace for consistency, or maybe make it optional?
    // CollegeFeed removed it. Let's include it but maybe conditionally? 
    // For now, I'll include it for everyone as it's a "Quick Action".
    {
      icon: ShoppingBag,
      label: "Market",
      color: "bg-accent-mint",
      href: "/marketplace"
    },
    {
      icon: FileText,
      label: "Notes",
      color: "bg-accent-blue",
      href: "/notes"
    },
    {
      icon: Bookmark,
      label: "Saved",
      color: "bg-accent-purple",
      href: "/saved"
    },
    {
      icon: Users,
      label: "Clubs",
      color: "bg-accent-orange",
      href: collegeSlug ? `/colleges/${collegeSlug}/clubs` : "/clubs"
    },
  ];

  // If in college view, maybe we want Alerts? Global uses generic ones. 
  // I will stick to the union of common items + smart routing.

  return (
    <>
      <motion.div
        className={`bg-paper border-2 border-ink shadow-neo p-4 rounded-card-lg ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
                <button key={index} onClick={() => { setPostModalTab('TEXT'); setIsPostModalOpen(true); }} className="text-left w-full">
                  {content}
                </button>
              );
            }

            return <Link key={index} href={item.href || '#'}>{content}</Link>;
          })}
        </div>
      </motion.div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        initialTab={postModalTab}
        onPostCreated={() => {
          // Ideally trigger a refresh if needed, or rely on SWR/global state
          // For now just close
          setIsPostModalOpen(false);
          // Dispatch event for other components to listen if needed
          document.dispatchEvent(new CustomEvent('post-created'));
        }}
        collegeSlug={collegeSlug}
      />
    </>
  );
}
