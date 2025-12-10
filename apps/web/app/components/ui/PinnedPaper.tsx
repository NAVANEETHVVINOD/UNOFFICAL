"use client";

import { motion } from "framer-motion";
import { Paperclip } from "lucide-react";

export default function PinnedPaper() {
    return (
        <div className="relative w-full max-w-2xl mx-auto mb-8 group perspective-1000">
            {/* Red Pin */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="w-8 h-8 rounded-full bg-red-600 shadow-md border-b-4 border-red-800 relative">
                    <div className="absolute top-2 left-2 w-2 h-2 bg-white/30 rounded-full blur-[1px]"></div>
                </div>
                <div className="w-1 h-3 bg-black/20 mx-auto -mt-1 blur-[1px]"></div>
            </div>

            <motion.div
                initial={{ rotateX: 10, y: -20, opacity: 0 }}
                animate={{ rotateX: 0, y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="relative bg-[#f8f5e6] p-2 pt-6 shadow-xl transform origin-top rotate-1 hover:rotate-0 transition-transform duration-500"
                style={{
                    backgroundImage: "url('/paper.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                {/* Content Container - Glass overlay to ensure text readability if paper is dark */}
                <div className="bg-white/60 backdrop-blur-[2px] p-6 border-2 border-dashed border-gray-400/50 min-h-[200px] flex flex-col items-center justify-center text-center">

                    <h2 className="font-display font-black text-3xl md:text-5xl uppercase text-black mb-2 tracking-tight">
                        Campus Classifieds
                    </h2>

                    <p className="font-hand text-xl md:text-2xl text-gray-800 rotate-[-1deg] max-w-lg mx-auto leading-relaxed">
                        "One man's trash is another student's treasure. Buy, Sell, and Barter your way to graduation."
                    </p>

                    <button className="mt-6 px-8 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-accent-red transition-colors shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transform duration-200">
                        View Listings
                    </button>

                </div>

                {/* Visual Fluff: Tape on corners */}
                <div className="absolute -top-3 -left-3 w-16 h-8 bg-yellow-200/80 rotate-[-45deg] shadow-sm backdrop-blur-sm"></div>
                <div className="absolute -bottom-3 -right-3 w-16 h-8 bg-yellow-200/80 rotate-[-45deg] shadow-sm backdrop-blur-sm"></div>

            </motion.div>
        </div>
    )
}
