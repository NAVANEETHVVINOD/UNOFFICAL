"use client";

import { motion } from "framer-motion";

export default function TiltedTicker() {
    return (
        <div className="relative bg-accent-yellow border-t-2 border-b-2 border-black rotate-1 z-10 overflow-hidden py-3 shadow-md mt-auto -mb-1">
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap font-mono font-black text-lg uppercase flex gap-8"
            >
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="flex items-center gap-2">
                        <span>⚡ CAMPUS LIVE</span>
                        <span className="text-red-500">•</span>
                        <span>EVENTS TONIGHT</span>
                        <span className="text-blue-500">•</span>
                        <span>MARKET DEALS</span>
                    </span>
                ))}
            </motion.div>
        </div>
    )
}
