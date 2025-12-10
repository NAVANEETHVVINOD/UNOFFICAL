"use client";

import { motion } from "framer-motion";
import {
    Newspaper,
    School,
    Calendar,
    ShoppingBag,
    MessageCircle,
    Sparkles
} from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
    { id: 'feed', label: 'Home', icon: Sparkles, color: 'bg-accent-yellow' },
    { id: 'campus', label: 'Campus', icon: School, color: 'bg-accent-blue' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'bg-accent-red' },
    { id: 'market', label: 'Market', icon: ShoppingBag, color: 'bg-accent-pink' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, color: 'bg-accent-purple' },
];

export default function CategoryRibbon() {
    const [active, setActive] = useState('feed');

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 -mt-4 z-30 relative scrollbar-hide">
            <div className="flex gap-3 px-4 min-w-max">
                {CATEGORIES.map((cat, i) => {
                    const isActive = active === cat.id;

                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => setActive(cat.id)}
                            initial={{ rotate: i % 2 === 0 ? -2 : 2 }}
                            animate={{
                                rotate: isActive ? 0 : [i % 2 === 0 ? -2 : 2, i % 2 === 0 ? 2 : -2],
                            }}
                            transition={{
                                rotate: {
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                    delay: i * 0.2
                                },
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                relative flex flex-col items-center justify-center
                w-20 h-16 rounded-lg border-2 border-black
                shadow-neo transition-all duration-200
                ${isActive ? cat.color : 'bg-white hover:bg-gray-50'}
              `}
                        >
                            {/* Pin Top */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full shadow-sm z-20"></div>
                            {/* String */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-black/20 z-0"></div>

                            <cat.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-black' : 'text-gray-600'}`} />
                            <span className={`font-display text-xs font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>
                                {cat.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
