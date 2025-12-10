"use client";

import { useAuth } from "../../context/AuthContext";
import { PenTool, BarChart2, Star, Megaphone, ShoppingBag, Plus, Flag } from "lucide-react";
import { motion } from "framer-motion";

export default function ToolsSidebar() {
    const { user, loading } = useAuth();

    if (loading) return <ToolsSidebarSkeleton />;

    return (
        <div className="space-y-6">

            {/* 1. Quick Composer (Removed per user request) */}
            {/* <div className="hidden">Sticky Note Removed</div> */}

            {/* 2. Pinned Quick Actions (Removed per V3 Request) */}
            <div className="hidden">
                {/* Quick Actions Removed */}
            </div>

        </div>
    );
}

function QuickActionItem({ icon: Icon, label, color, onClick }: any) {
    return (
        <motion.button
            whileHover={{ x: 5, scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                relative flex items-center gap-3 p-3 
                border-2 border-black shadow-neo-sm hover:shadow-neo 
                ${color} transition-all
            `}
        >
            {/* Torn Edge Left */}
            <div className="absolute -left-1 top-0 bottom-0 w-2 bg-black torn-edge-mask -scale-x-100"></div>

            <div className="bg-white border-2 border-black rounded-full p-1.5">
                <Icon className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm uppercase tracking-wider">{label}</span>
        </motion.button>
    )
}

function ToolsSidebarSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300"></div>
            <div className="space-y-3 pl-4 border-l-4 border-gray-200">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-12 bg-gray-200 rounded w-full"></div>
                ))}
            </div>
        </div>
    )
}
