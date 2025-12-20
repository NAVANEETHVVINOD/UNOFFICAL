"use client";

import { motion } from "framer-motion";

export const ModernLoading = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper safe-area-padding overflow-hidden">
            {/* Background Noise/Grid */}
            <div className="absolute inset-0 opacity-20 bg-grid" />

            <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                {/* Yellow Gas / Blob Animation */}
                <motion.div
                    className="absolute w-64 h-64 bg-primary blur-[80px] rounded-full opacity-60 mix-blend-multiply dark:mix-blend-normal dark:bg-primary/20"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [-20, 20, -20],
                        y: [-20, 20, -20],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute w-64 h-64 bg-accent-coral blur-[80px] rounded-full opacity-60 mix-blend-multiply dark:mix-blend-normal dark:bg-accent-coral/20"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [20, -20, 20],
                        y: [20, -20, 20],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                />

                {/* Text / Logo */}
                <div className="relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="font-display font-black text-6xl text-ink tracking-tighter"
                    >
                        LINKER
                    </motion.h1>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-2 bg-ink mt-2 mx-auto rounded-full"
                    />
                </div>
            </div>
        </div>
    );
};
