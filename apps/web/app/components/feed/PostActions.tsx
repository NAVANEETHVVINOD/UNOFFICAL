"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, Copy, Check } from "lucide-react";
import { api } from "../../../lib/api";
import { likeVariants } from "../../../lib/animations";

interface PostActionsProps {
  postId: string;
  initialLikeCount: number;
  initialCommentCount: number;
  initialIsLiked?: boolean;
  initialIsSaved?: boolean;
  onCommentClick?: () => void;
  showCounts?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function PostActions({
  postId,
  initialLikeCount,
  initialCommentCount,
  initialIsLiked = false,
  initialIsSaved = false,
  onCommentClick,
  showCounts = true,
  size = "md",
}: PostActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const iconSize = size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5";
  const buttonPadding = size === "sm" ? "p-1.5" : size === "lg" ? "p-3" : "p-2";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  const handleLike = useCallback(async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const wasLiked = isLiked;
    
    // Optimistic update
    setIsLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      if (wasLiked) {
        await api.unlikePost(postId);
      } else {
        await api.likePost(postId);
      }
    } catch (error) {
      // Revert on error
      setIsLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  }, [postId, isLiked, isLiking]);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    const wasSaved = isSaved;
    
    // Optimistic update
    setIsSaved(!wasSaved);

    try {
      if (wasSaved) {
        await api.unsavePost(postId);
      } else {
        await api.savePost(postId);
      }
    } catch (error) {
      // Revert on error
      setIsSaved(wasSaved);
      console.error("Failed to toggle save:", error);
    } finally {
      setIsSaving(false);
    }
  }, [postId, isSaved, isSaving]);

  const handleShare = useCallback(() => {
    setShowShareMenu(!showShareMenu);
  }, [showShareMenu]);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/posts/${postId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [postId]);

  const handleNativeShare = useCallback(async () => {
    const url = `${window.location.origin}/posts/${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this post on LINKER",
          url,
        });
        setShowShareMenu(false);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
    }
  }, [postId]);

  return (
    <div className="flex items-center gap-1 relative">
      {/* Like Button */}
      <motion.button
        onClick={handleLike}
        disabled={isLiking}
        className={`${buttonPadding} rounded-lg flex items-center gap-1.5 transition-colors ${
          isLiked
            ? "text-red-500 bg-red-50 hover:bg-red-100"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        variants={likeVariants}
        animate={isLiked ? "liked" : "unliked"}
        whileTap={{ scale: 0.9 }}
        aria-label={isLiked ? "Unlike post" : "Like post"}
      >
        <Heart
          className={`${iconSize} ${isLiked ? "fill-current" : ""}`}
        />
        {showCounts && likeCount > 0 && (
          <span className={`${textSize} font-bold`}>{likeCount}</span>
        )}
      </motion.button>

      {/* Comment Button */}
      <motion.button
        onClick={onCommentClick}
        className={`${buttonPadding} rounded-lg flex items-center gap-1.5 text-gray-600 hover:bg-gray-100 transition-colors`}
        whileTap={{ scale: 0.9 }}
        aria-label="View comments"
      >
        <MessageCircle className={iconSize} />
        {showCounts && initialCommentCount > 0 && (
          <span className={`${textSize} font-bold`}>{initialCommentCount}</span>
        )}
      </motion.button>

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        className={`${buttonPadding} rounded-lg flex items-center gap-1.5 transition-colors ${
          isSaved
            ? "text-accent-blue bg-blue-50 hover:bg-blue-100"
            : "text-gray-600 hover:bg-gray-100"
        }`}
        whileTap={{ scale: 0.9 }}
        aria-label={isSaved ? "Unsave post" : "Save post"}
      >
        <Bookmark
          className={`${iconSize} ${isSaved ? "fill-current" : ""}`}
        />
      </motion.button>

      {/* Share Button */}
      <div className="relative">
        <motion.button
          onClick={handleShare}
          className={`${buttonPadding} rounded-lg flex items-center gap-1.5 text-gray-600 hover:bg-gray-100 transition-colors`}
          whileTap={{ scale: 0.9 }}
          aria-label="Share post"
        >
          <Share2 className={iconSize} />
        </motion.button>

        {/* Share Menu */}
        <AnimatePresence>
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full right-0 mb-2 bg-white border-2 border-black shadow-neo p-2 min-w-[160px] z-50"
            >
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold hover:bg-gray-100 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share...</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
