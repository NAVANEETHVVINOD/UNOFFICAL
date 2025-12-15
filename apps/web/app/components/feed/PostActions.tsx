"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    Copy,
    Twitter,
    Send,
    Check,
} from "lucide-react";
import { likeVariants, bookmarkSlideVariants, dropdownVariants } from "../../../lib/animations";

interface PostActionsProps {
    postId: string;
    initialLiked?: boolean;
    initialSaved?: boolean;
    likeCount?: number;
    commentCount?: number;
    onLike?: (postId: string, liked: boolean) => Promise<void>;
    onComment?: (postId: string) => void;
    onSave?: (postId: string, saved: boolean) => Promise<void>;
    onShare?: (postId: string) => void;
    compact?: boolean;
}

export default function PostActions({
    postId,
    initialLiked = false,
    initialSaved = false,
    likeCount = 0,
    commentCount = 0,
    onLike,
    onComment,
    onSave,
    onShare,
    compact = false,
}: PostActionsProps) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleLike = useCallback(async () => {
        if (isLiking) return;

        setIsLiking(true);
        const newLikedState = !isLiked;

        // Optimistic update
        setIsLiked(newLikedState);
        setCurrentLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

        try {
            await onLike?.(postId, newLikedState);
        } catch (error) {
            // Revert on error
            setIsLiked(!newLikedState);
            setCurrentLikeCount((prev) => (newLikedState ? prev - 1 : prev + 1));
            console.error("Failed to like post:", error);
        } finally {
            setIsLiking(false);
        }
    }, [isLiked, isLiking, onLike, postId]);

    const handleSave = useCallback(async () => {
        if (isSaving) return;

        setIsSaving(true);
        const newSavedState = !isSaved;

        // Optimistic update
        setIsSaved(newSavedState);

        try {
            await onSave?.(postId, newSavedState);
        } catch (error) {
            // Revert on error
            setIsSaved(!newSavedState);
            console.error("Failed to save post:", error);
        } finally {
            setIsSaving(false);
        }
    }, [isSaved, isSaving, onSave, postId]);

    const handleComment = useCallback(() => {
        onComment?.(postId);
    }, [onComment, postId]);

    const handleCopyLink = useCallback(async () => {
        const url = `${window.location.origin}/posts/${postId}`;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy link:", error);
        }
    }, [postId]);

    const handleShareTwitter = useCallback(() => {
        const url = `${window.location.origin}/posts/${postId}`;
        const text = "Check out this post on LINKER!";
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            "_blank"
        );
        setIsShareOpen(false);
    }, [postId]);

    const handleShareWhatsApp = useCallback(() => {
        const url = `${window.location.origin}/posts/${postId}`;
        const text = "Check out this post on LINKER!";
        window.open(
            `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
            "_blank"
        );
        setIsShareOpen(false);
    }, [postId]);

    const buttonClass = compact
        ? "p-1.5 rounded-full hover:bg-gray-100 transition-colors"
        : "flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors";

    return (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
                {/* Like Button */}
                <motion.button
                    onClick={handleLike}
                    className={buttonClass}
                    variants={likeVariants}
                    animate={isLiked ? "liked" : "unliked"}
                    whileTap={{ scale: 0.9 }}
                    disabled={isLiking}
                    aria-label={isLiked ? "Unlike" : "Like"}
                >
                    <Heart
                        className={`w-5 h-5 transition-colors ${
                            isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                    />
                    {!compact && currentLikeCount > 0 && (
                        <span className={`text-sm font-medium ${isLiked ? "text-red-500" : "text-gray-600"}`}>
                            {currentLikeCount}
                        </span>
                    )}
                </motion.button>

                {/* Comment Button */}
                <motion.button
                    onClick={handleComment}
                    className={buttonClass}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Comment"
                >
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    {!compact && commentCount > 0 && (
                        <span className="text-sm font-medium text-gray-600">{commentCount}</span>
                    )}
                </motion.button>

                {/* Share Button */}
                <div className="relative">
                    <motion.button
                        onClick={() => setIsShareOpen(!isShareOpen)}
                        className={buttonClass}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Share"
                    >
                        <Share2 className="w-5 h-5 text-gray-600" />
                    </motion.button>

                    {/* Share Dropdown */}
                    <AnimatePresence>
                        {isShareOpen && (
                            <>
                                {/* Backdrop */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsShareOpen(false)}
                                />
                                <motion.div
                                    className="absolute bottom-full left-0 mb-2 bg-white border-2 border-black shadow-neo rounded-lg overflow-hidden z-50 min-w-[160px]"
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <button
                                        onClick={handleCopyLink}
                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <Copy className="w-4 h-4" />
                                        )}
                                        <span className="text-sm">{copied ? "Copied!" : "Copy Link"}</span>
                                    </button>
                                    <button
                                        onClick={handleShareTwitter}
                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        <span className="text-sm">Twitter</span>
                                    </button>
                                    <button
                                        onClick={handleShareWhatsApp}
                                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span className="text-sm">WhatsApp</span>
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Save Button */}
            <motion.button
                onClick={handleSave}
                className={buttonClass}
                variants={bookmarkSlideVariants}
                animate={isSaved ? "saved" : "unsaved"}
                whileTap={{ scale: 0.9 }}
                disabled={isSaving}
                aria-label={isSaved ? "Unsave" : "Save"}
            >
                <Bookmark
                    className={`w-5 h-5 transition-colors ${
                        isSaved ? "fill-black text-black" : "text-gray-600"
                    }`}
                />
            </motion.button>
        </div>
    );
}

// Compact version for use in lists
export function PostActionsCompact(props: Omit<PostActionsProps, "compact">) {
    return <PostActions {...props} compact />;
}