"use client";

import { useAuth } from "../../context/AuthContext";
import { PenTool, BarChart2, Star, Megaphone, ShoppingBag, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function ToolsSidebar() {
    const { user, loading } = useAuth();

    if (loading) return <ToolsSidebarSkeleton />;

    return (
        <div className="space-y-6">

            {/* 1. Quick Composer (Sticky Note) */}
            <div className="relative transform hover:-rotate-1 transition-transform duration-300">
                <div className="bg-accent-yellow border-card border-black p-4 shadow-neo relative">
                    {/* Tape */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 rotate-1 backdrop-blur-sm border-white/20 border"></div>

                    <h3 className="font-hand text-2xl font-bold mb-2 transform -rotate-2">Quick Note</h3>

                    <button
                        onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal', { detail: { type: 'TEXT' } }))}
                        className="w-full bg-white/50 border-2 border-black border-dashed rounded-lg p-3 text-left hover:bg-white transition-colors group"
                    >
                        <span className="font-hand text-xl text-gray-600 group-hover:text-black">
                            Write something...
                        </span>
                        <PenTool className="w-4 h-4 absolute bottom-3 right-3 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* 2. Pinned Quick Actions (Corkboard Style) */}
            <div className="relative pl-2">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/10 rounded-full"></div>

                <div className="flex flex-col gap-3">
                    <QuickActionItem
                        icon={BarChart2}
                        label="Poll"
                        color="bg-accent-pink"
                        onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal', { detail: { type: 'POLL' } }))}
                    />
                    <QuickActionItem
                        icon={ShoppingBag}
                        label="Sell"
                        color="bg-accent-green"
                        onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal', { detail: { type: 'MARKET' } }))}
                    />
                    <QuickActionItem
                        icon={Megaphone}
                        label="Event"
                        color="bg-accent-blue"
                        onClick={() => document.dispatchEvent(new CustomEvent('open-create-modal', { detail: { type: 'EVENT' } }))}
                    />
                    <QuickActionItem
                        icon={Star}
                        label="Club"
                        color="bg-accent-purple"
                        onClick={() => alert("Club creation coming soon!")}
                    />
                </div>
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
