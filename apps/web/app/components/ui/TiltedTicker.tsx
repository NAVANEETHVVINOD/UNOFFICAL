"use client";

import { motion } from "framer-motion";

// SVG icons to replace emojis - larger size for better visibility
const BoltIcon = () => (
    <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
);

const StarIcon = () => (
    <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

const TagIcon = () => (
    <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <circle cx="7" cy="7" r="1.5"/>
    </svg>
);

const CalendarIcon = () => (
    <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
    </svg>
);

const UsersIcon = () => (
    <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

export default function TiltedTicker() {
    // Ticker content with SVG icons - more items for variety
    const tickerContent = (
        <>
            <span className="flex items-center gap-2">
                <BoltIcon /> CAMPUS LIVE
            </span>
            <span className="text-ink/30">•</span>
            <span className="flex items-center gap-2">
                <CalendarIcon /> EVENTS TONIGHT
            </span>
            <span className="text-ink/30">•</span>
            <span className="flex items-center gap-2">
                <TagIcon /> MARKET DEALS
            </span>
            <span className="text-ink/30">•</span>
            <span className="flex items-center gap-2">
                <UsersIcon /> CONNECT NOW
            </span>
            <span className="text-ink/30">•</span>
            <span className="flex items-center gap-2">
                <StarIcon /> TRENDING
            </span>
            <span className="text-ink/30">•</span>
        </>
    );

    return (
        <div className="relative bg-primary border-t-2 border-b-2 border-ink rotate-1 z-10 overflow-hidden py-4 shadow-neo mt-auto -mb-1">
            <div className="flex">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    className="whitespace-nowrap font-display font-black text-xl uppercase flex gap-10 will-change-transform tracking-wide"
                >
                    {/* Duplicate content for seamless loop */}
                    {[...Array(16)].map((_, i) => (
                        <span key={i} className="flex items-center gap-6">
                            {tickerContent}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
