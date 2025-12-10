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
    { id: 'feed', label: 'For You', icon: Sparkles, color: 'bg-accent-yellow' },
    { id: 'campus', label: 'Campus', icon: School, color: 'bg-accent-blue' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'bg-accent-red' },
    { id: 'market', label: 'Market', icon: ShoppingBag, color: 'bg-accent-pink' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, color: 'bg-accent-purple' },
];

export default function CategoryRibbon() {
    const [active, setActive] = useState('feed');

    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 -mt-4 z-30 relative scrollbar-hide">
            <div className="flex gap-4 px-4 min-w-max">
                {CATEGORIES.map((cat, i) => {
                    const isActive = active === cat.id;
                    const rotate = isActive ? 0 : (i % 2 === 0 ? -2 : 2);

                    return (
                        <motion.button
                            key={cat.id}
                            onClick={() => setActive(cat.id)}
                            initial={false}
                            animate={{
                                rotate: rotate,
                                y: isActive ? 4 : 0,
                                scale: isActive ? 1.05 : 1
                            }}
                            whileHover={{ rotate: 0, scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                relative flex flex-col items-center justify-center
                w-24 h-20 rounded-xl border-card border-black
                shadow-neo transition-colors duration-200
                ${isActive ? cat.color : 'bg-white hover:bg-gray-50'}
              `}
                        >
                            {/* Torn Edge Bottom */}
                            <div className="absolute -bottom-2 left-0 w-full h-2 bg-black torn-edge-mask opacity-20"></div>

                            <cat.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-black' : 'text-gray-600'}`} />
                            <span className={`font-display text-sm font-bold ${isActive ? 'text-black' : 'text-gray-500'}`}>
                                {cat.label}
                            </span>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pin"
                                    className="absolute -top-3 right-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border-2 border-black shadow-sm z-10"
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
