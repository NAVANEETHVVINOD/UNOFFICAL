"use client";

import { useAuth } from "../../context/AuthContext";
import { User, Settings, Zap, Award, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cardHoverVariants } from "../../../lib/animations";
import { ProfileSidebarSkeleton } from "../ui/Skeleton";

export default function ProfileSidebar() {
    const { user, loading } = useAuth();

    if (loading) return <ProfileSidebarSkeleton />;
    if (!user) return null;

    const level = user.profile?.level || 1;
    const karma = user.profile?.karma || 0;
    const collegeName = user.profile?.college?.name || "No Campus Selected";

    return (
        <motion.div
            className="bg-white p-3 border-2 border-black shadow-neo transition-all"
            variants={cardHoverVariants}
            initial="rest"
            whileHover="hover"
        >
            {/* Compact Header with Avatar */}
            <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="relative group flex-shrink-0">
                    <div className="w-14 h-14 bg-gray-100 border-2 border-black rounded-lg overflow-hidden">
                        {user.profile?.avatarUrl ? (
                            <img
                                src={user.profile.avatarUrl}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent-blue/10">
                                <User className="w-6 h-6 text-black/30" />
                            </div>
                        )}
                    </div>
                    {/* Edit Overlay */}
                    <Link
                        href="/profile/edit"
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                        <Settings className="text-white w-4 h-4" />
                    </Link>
                </div>

                {/* Name & College */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base truncate leading-tight">
                        {user.profile?.fullName || "Anonymous"}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <p className="font-mono text-[10px] truncate">{collegeName}</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-accent-yellow/20 border border-black/20 p-2 text-center rounded">
                    <div className="flex items-center justify-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span className="font-display font-bold text-xs">LVL {level}</span>
                    </div>
                </div>
                <div className="bg-accent-purple/20 border border-black/20 p-2 text-center rounded">
                    <div className="flex items-center justify-center gap-1">
                        <Award className="w-3 h-3" />
                        <span className="font-display font-bold text-xs">{karma} REP</span>
                    </div>
                </div>
            </div>

            {/* Campus Hub Button */}
            <Link href="/my-college" className="block">
                <motion.button
                    className="w-full py-2 px-3 bg-black text-white font-bold font-display text-sm uppercase flex items-center justify-center gap-1 hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    My Campus
                    <ChevronRight className="w-4 h-4" />
                </motion.button>
            </Link>
        </motion.div>
    );
}
