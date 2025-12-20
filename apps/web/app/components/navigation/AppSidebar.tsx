"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Calendar, ShoppingBag, MessageCircle, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function AppSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const collegeSlug = user?.profile?.college?.slug;
    const campusHref = collegeSlug ? `/colleges/${collegeSlug}` : '/my-college';

    const navItems = [
        { label: 'Home', href: '/dashboard', icon: Home },
        { label: 'Campus', href: campusHref, icon: Building2 }, // Using Building2 for generic campus/college
        { label: 'Events', href: '/events', icon: Calendar },
        { label: 'Market', href: '/marketplace', icon: ShoppingBag },
        { label: 'Chat', href: '/messages', icon: MessageCircle },
    ];

    return (
        <motion.div
            className="bg-paper border-2 border-ink shadow-neo rounded-card-lg overflow-hidden p-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
        >
            <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all group
                ${isActive
                                    ? 'bg-primary border-ink shadow-neo-sm'
                                    : 'bg-transparent border-transparent hover:bg-neutral-100 hover:border-ink/10'
                                }
              `}
                        >
                            <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center border-2 transition-colors
                ${isActive
                                    ? 'bg-black border-black text-primary'
                                    : 'bg-white border-ink text-ink group-hover:scale-110'
                                }
              `}>
                                <Icon className="w-4 h-4" />
                            </div>

                            <span className={`
                font-display font-bold text-base tracking-wide
                ${isActive ? 'text-black' : 'text-neutral-500 group-hover:text-ink'}
              `}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </motion.div>
    );
}
