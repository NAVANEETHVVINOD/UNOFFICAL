"use client";

import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { UserPlus, UserMinus, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

interface FollowButtonProps {
    userId: string;
    initialIsFollowing?: boolean;
    onToggle?: (isFollowing: boolean) => void;
    className?: string;
}

export default function FollowButton({ userId, initialIsFollowing = false, onToggle, className = "" }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);
    const [hovered, setHovered] = useState(false);

    // Sync with initial prop if changed externally, or fetch initial status? 
    // Let's rely on props for list views, and maybe fetch status for profile view if not provided.
    // For now specific to passed props or we check status on mount if not provided?

    useEffect(() => {
        // If we want to check status on mount
        const checkStatus = async () => {
            try {
                const status = await api.getFollowStatus(userId);
                setIsFollowing(status.isFollowing);
            } catch (e) {
                console.error("Failed to check follow status", e);
            }
        }
        if (initialIsFollowing === undefined) {
            checkStatus();
        } else {
            setIsFollowing(initialIsFollowing);
        }
    }, [userId, initialIsFollowing]);

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if in a link
        e.stopPropagation();

        if (loading) return;
        setLoading(true);

        const newState = !isFollowing;
        // Optimistic update
        setIsFollowing(newState);

        try {
            if (newState) {
                await api.followUser(userId);
            } else {
                await api.unfollowUser(userId);
            }
            onToggle?.(newState);
        } catch (error) {
            console.error("Failed to toggle follow status:", error);
            setIsFollowing(!newState); // Revert
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            onClick={handleToggle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className={`relative overflow-hidden font-bold text-sm px-4 py-2 border-2 border-black transition-all ${isFollowing
                    ? "bg-white text-black hover:bg-red-50 hover:border-red-500 hover:text-red-500"
                    : "bg-accent-blue text-white hover:bg-blue-600"
                } ${className}`}
        >
            <span className="flex items-center gap-2 relative z-10">
                {isFollowing ? (
                    hovered ? (
                        <>
                            <UserMinus className="w-4 h-4" />
                            Unfollow
                        </>
                    ) : (
                        <>
                            <UserCheck className="w-4 h-4" />
                            Following
                        </>
                    )
                ) : (
                    <>
                        <UserPlus className="w-4 h-4" />
                        Follow
                    </>
                )}
            </span>
        </motion.button>
    );
}
