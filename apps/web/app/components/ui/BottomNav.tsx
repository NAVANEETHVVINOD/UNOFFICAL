"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  const collegeSlug = user?.profile?.college?.slug;
  const collegeHref = collegeSlug ? `/colleges/${collegeSlug}` : '/my-college';

  const items = [
    {
      href: "/dashboard",
      label: "Home",
      icon: "📢", // Using emoji/text for now or simple SVG. Let's use simple SVGs for consistency if possible, or just the labels. User said "doodle bubbles".
      // Let's stick to the existing SVG style or text for simplicity in this pass, OR import doodles.
      // Given the file size, I will use simplified SVGs or Emoji as placeholders for "doodles" if I can't import Doodle easily.
      // Actually, I can use the same SVGs as before but updated.
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
      )
    },
    {
      href: collegeHref,
      label: "Campus",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="9" y1="22" x2="9" y2="2" /><line x1="15" y1="22" x2="15" y2="2" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
      )
    },
    {
      href: "/events",
      label: "Events",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
      )
    },
    {
      href: "/marketplace",
      label: "Market",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
      )
    },
    {
      href: "/messages",
      label: "Messages",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
      )
    },
    {
      href: "/resources",
      label: "Resources",
      svg: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
      )
    }
  ];

  return (
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
      </div>
    </nav>
  );
}
