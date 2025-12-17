"use client";

import { motion } from "framer-motion";
import { Calendar, Briefcase, GraduationCap, Heart, FolderOpen } from "lucide-react";

export type ProfileTabId = "activities" | "projects" | "experience" | "education" | "volunteering";

interface ProfileTab {
  id: ProfileTabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: ProfileTab[] = [
  { id: "activities", label: "Activities", icon: Calendar },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "volunteering", label: "Volunteering", icon: Heart },
];

interface ProfileTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="border-b border-ink/10 bg-paper sticky top-16 z-20">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors whitespace-nowrap ${
                  isActive 
                    ? "text-ink" 
                    : "text-neutral-500 hover:text-ink"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export { tabs };
