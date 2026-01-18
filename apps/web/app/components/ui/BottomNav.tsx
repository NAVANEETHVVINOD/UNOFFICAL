"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useUserType } from "../../context/UserTypeContext";
import { UserType } from "../../../lib/userTypes";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { userType } = useUserType();

  if (!isAuthenticated) return null;

  // Mobile Bottom Nav: 4 items - Home, Events, Chat, Profile
  const items = [
    {
      href: "/dashboard",
      label: "Home",
      isActive: pathname === "/dashboard",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
      )
    },
    {
      href: "/events",
      label: "Events",
      isActive: pathname.startsWith('/events'),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
      )
    },
    {
      href: "/messages",
      label: "Chat",
      isActive: pathname.startsWith('/messages'),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      )
    },
    {
      href: "/profile",
      label: "Profile",
      isActive: pathname === "/profile" || pathname.startsWith('/profile/'),
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
      )
    },
  ];

  // Show FAB only for ORGANIZER userType
  const showFAB = userType === UserType.ORGANIZER;

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink dark:border-[#333333] bg-paper/95 dark:bg-[#121212]/95 backdrop-blur-sm md:hidden shadow-[0_-4px_8px_rgba(0,0,0,0.1)] pb-safe">
        <div className="mx-auto flex max-w-[480px] items-center justify-around px-2 py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                item.isActive 
                  ? "bg-ink text-white dark:bg-primary dark:text-[#121212]" 
                  : "text-[#757575] dark:text-[#9E9E9E] hover:text-ink dark:hover:text-white"
              }`}
            >
              <span className="text-lg">{item.svg}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Floating Action Button (FAB) - Only for ORGANIZER */}
      {showFAB && (
        <motion.button
          onClick={handleCreateEvent}
          className="fixed bottom-20 right-4 z-50 w-14 h-14 bg-primary border-2 border-ink rounded-full shadow-neo-lg flex items-center justify-center md:hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500 }}
          aria-label="Create Event"
        >
          <Plus className="w-6 h-6 text-ink" strokeWidth={3} />
        </motion.button>
      )}
    </>
  );
}
