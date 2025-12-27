"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import CreatePostModal from "../CreatePostModal";

export default function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  if (!isAuthenticated) return null;

  const collegeSlug = user?.profile?.college?.slug;
  const collegeHref = collegeSlug ? `/colleges/${collegeSlug}` : '/my-college';

  // Mobile Bottom Nav: 5 items - Home, College, Explore, Chat, Post
  const items = [
    {
      href: "/dashboard",
      label: "Home",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
      )
    },
    {
      href: collegeHref,
      label: "College",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
      )
    },
    {
      href: "/explore",
      label: "Explore",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>
      )
    },
    {
      href: "/messages",
      label: "Chat",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
      )
    },
  ];

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-black bg-paper/95 backdrop-blur-sm md:hidden shadow-[0_-4px_8px_rgba(0,0,0,0.1)] pb-safe">
        <div className="mx-auto flex max-w-[480px] items-center justify-around px-2 py-2">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${active ? "bg-black text-white" : "text-ink/60 hover:text-ink"
                  }`}
              >
                <span className="text-lg">{item.svg}</span>
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Post Button - Opens CreatePostModal */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all bg-primary text-ink hover:bg-primary/80"
          >
            <span className="text-lg">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </span>
            <span className="text-[10px] font-bold">Post</span>
          </button>
        </div>
      </nav>

      {/* Create Post Modal */}
      <CreatePostModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </>
  );
}
