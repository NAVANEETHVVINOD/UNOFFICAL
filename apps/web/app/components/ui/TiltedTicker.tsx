"use client";

import { motion } from "framer-motion";

// SVG icons to replace emojis
const BoltIcon = () => (
    <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
);

const StarIcon = () => (
    <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
);

const TagIcon = () => (
    <svg className="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
        <circle cx="7" cy="7" r="1.5"/>
    </svg>
);

export default function TiltedTicker() {
    // Calculate the width needed for seamless loop
    const tickerContent = (
        <>
            <span className="flex items-center gap-2">
                <BoltIcon /> CAMPUS LIVE
            </span>
            <span className="text-red-500">•</span>
            <span className="flex items-center gap-2">
                <StarIcon /> EVENTS TONIGHT
            </span>
            <span className="text-blue-500">•</span>
            <span className="flex items-center gap-2">
                <TagIcon /> MARKET DEALS
            </span>
            <span className="text-green-500">•</span>
        </>
    );

    return (
        <div className="relative bg-accent-yellow border-t-2 border-b-2 border-black rotate-1 z-10 overflow-hidden py-3 shadow-md mt-auto -mb-1">
            <div className="flex">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        duration: 25, 
                        repeat: Infinity, 
                        ease: "linear",
                        repeatType: "loop"
                    }}
                    className="whitespace-nowrap font-mono font-black text-lg uppercase flex gap-8 will-change-transform"
                >
                    {/* Duplicate content for seamless loop */}
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className="flex items-center gap-4">
                            {tickerContent}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
