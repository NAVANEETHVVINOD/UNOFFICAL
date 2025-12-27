"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface NavBoxTab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface NavBoxProps {
  tabs: NavBoxTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  sticky?: boolean;
  stickyOffset?: string;
  className?: string;
}

/**
 * NavBox - A reusable horizontal scrollable tab navigation component
 * 
 * Features:
 * - Horizontal scrollable tabs on mobile
 * - Icons alongside labels
 * - Sticky positioning option
 * - Active tab highlighting with primary color
 * - Framer Motion tab transitions
 * - Auto-scrolls active tab into view
 * 
 * @example
 * <NavBox
 *   tabs={[
 *     { id: 'activities', label: 'Activities', icon: Calendar },
 *     { id: 'projects', label: 'Projects', icon: Star },
 *   ]}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   sticky
 * />
 */
export default function NavBox({
  tabs,
  activeTab,
  onTabChange,
  sticky = false,
  stickyOffset = "top-16 md:top-20",
  className = "",
}: NavBoxProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeButton = activeTabRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      
      // Check if button is outside visible area
      if (buttonRect.left < containerRect.left || buttonRect.right > containerRect.right) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeTab]);

  const stickyClasses = sticky
    ? `sticky ${stickyOffset} z-40 bg-neutral-100/95 dark:bg-[#121212]/95 backdrop-blur-sm border-b border-ink/10`
    : "";

  return (
    <div
      className={`${stickyClasses} ${className}`}
      role="tablist"
      aria-label="Navigation tabs"
    >
      <div className="max-w-3xl mx-auto w-full px-4 py-2">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide gap-2 pb-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                onClick={() => onTabChange(tab.id)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap flex-shrink-0 min-h-[44px] ${
                  isActive
                    ? "bg-primary border-ink text-black shadow-neo-sm"
                    : "bg-white dark:bg-[#2D2D2D] border-transparent dark:border-white/10 text-neutral-500 hover:border-ink/20 hover:text-ink dark:hover:text-white"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span className="text-sm font-bold font-display">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
