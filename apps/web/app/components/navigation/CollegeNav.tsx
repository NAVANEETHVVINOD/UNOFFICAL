"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Calendar, Users } from "lucide-react";

interface CollegeNavProps {
    collegeSlug: string;
}

export default function CollegeNav({ collegeSlug }: CollegeNavProps) {
    const pathname = usePathname();

    // Determine active tab based on pathname
    // Feed is active if we are exactly at /colleges/[slug]
    const isFeedActive = pathname === `/colleges/${collegeSlug}`;
    const isEventsActive = pathname.includes(`/colleges/${collegeSlug}/events`);
    const isClubsActive = pathname.includes(`/colleges/${collegeSlug}/clubs`);

    const tabs = [
        { id: 'home', label: 'Home', icon: Home, path: '/dashboard', active: false },
        { id: 'feed', label: 'Feed', icon: Sparkles, path: `/colleges/${collegeSlug}`, active: isFeedActive },
        { id: 'events', label: 'Events', icon: Calendar, path: `/colleges/${collegeSlug}/events`, active: isEventsActive },
        { id: 'clubs', label: 'Clubs', icon: Users, path: `/colleges/${collegeSlug}/clubs`, active: isClubsActive }
    ];

    return (
        <div className="flex items-center gap-2 mb-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {tabs.map((tab) => (
                <Link key={tab.id} href={tab.path} className="flex-1 min-w-[100px] md:min-w-0">
                    <div className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all whitespace-nowrap ${tab.active
                        ? 'bg-primary border-ink shadow-neo-sm'
                        : 'bg-paper border-ink/10 hover:border-ink/30 hover:bg-neutral-50'
                        }`}>
                        <tab.icon className={`w-4 h-4 ${tab.active ? 'text-black' : ''}`} />
                        <span className={`font-display font-bold text-sm uppercase tracking-wide ${tab.active ? 'text-black' : 'text-neutral-500'}`}>
                            {tab.label}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
