"use client";

import { Plus, PenTool } from "lucide-react";
import { motion } from "framer-motion";

export default function FloatingCreateButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            onClick={onClick}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Create new post"
            className="md:hidden fixed bottom-20 right-4 z-floating w-14 h-14 bg-accent-yellow border-2 border-black rounded-full shadow-neo flex items-center justify-center"
        >
            <Plus className="w-8 h-8 text-black" aria-hidden="true" />
            <span className="sr-only">Create Post</span>

            {/* Decorative Pencil (absolute) */}
            <div className="absolute -top-1 -right-1 bg-white border border-black rounded-full p-1">
                <PenTool className="w-3 h-3 text-black" />
            </div>
        </motion.button>
    );
}
