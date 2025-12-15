"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
    School,
    Calendar,
    ShoppingBag,
    MessageCircle,
    Sparkles,
    Home
} from "lucide-react";
import { containerVariants, itemVariants } from "../../lib/animations";

const CATEGORIES = [
    { id: 'feed', label: 'Home', icon: Home, color: 'bg-accent-yellow', path: '/dashboard' },
    { id: 'campus', label: 'Campus', icon: School, color: 'bg-accent-blue', path: '/my-college' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'bg-accent-red', path: '/events' },
    { id: 'market', label: 'Market', icon: ShoppingBag, color: 'bg-accent-pink', path: '/marketplace' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, color: 'bg-accent-purple', path: '/messages' },
];

interface CategoryRibbonProps {
    className?: string;
}

export default function CategoryRibbon({ className = "" }: CategoryRibbonProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Determine active category based on current path
    const getActiveCategory = () => {
        if (pathname === '/dashboard' || pathname === '/') return 'feed';
        if (pathname.startsWith('/my-college') || pathname.startsWith('/colleges')) return 'campus';
        if (pathname.startsWith('/events')) return 'events';
        if (pathname.startsWith('/marketplace')) return 'market';
        if (pathname.startsWith('/messages')) return 'messages';
        return 'feed';
    };

    const active = getActiveCategory();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className={`w-full overflow-x-auto pb-2 pt-4 z-30 relative scrollbar-hide ${className}`}>
            {/* Scroll indicator for mobile */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none md:hidden z-10" />
            
            <motion.div
                className="flex gap-2 md:gap-3 px-1 min-w-max"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {CATEGORIES.map((cat, i) => {
                    const isActive = active === cat.id;
                    const Icon = cat.icon;

                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => handleNavigation(cat.path)}
                            variants={itemVariants}
                            initial={{ rotate: i % 2 === 0 ? -1 : 1 }}
                            whileHover={{ 
                                scale: 1.05, 
                                rotate: 0,
                                transition: { type: "spring", stiffness: 400, damping: 17 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                relative flex flex-col items-center justify-center
                                min-w-[72px] h-14 md:min-w-[80px] md:h-16 
                                rounded-lg border-2 border-black
                                shadow-neo transition-colors duration-200
                                ${isActive ? cat.color : 'bg-white hover:bg-gray-50'}
                            `}
                            aria-label={`Navigate to ${cat.label}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {/* Pin decoration */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black rounded-full shadow-sm z-20" />
                            
                            {/* String decoration */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-4 bg-black/20 z-0" />

                            <Icon 
                                className={`w-4 h-4 md:w-5 md:h-5 mb-0.5 transition-colors ${
                                    isActive ? 'text-black' : 'text-gray-600'
                                }`} 
                            />
                            <span 
                                className={`font-display text-[10px] md:text-xs font-bold transition-colors ${
                                    isActive ? 'text-black' : 'text-gray-500'
                                }`}
                            >
                                {cat.label}
                            </span>

                            {/* Active indicator dot */}
                            {isActive && (
                                <motion.div
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full"
                                    layoutId="activeIndicator"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
    );
}
