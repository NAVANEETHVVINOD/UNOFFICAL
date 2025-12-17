"use client";

import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Send } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { RetroButton } from "../ui/NewspaperUI";
import { motion, AnimatePresence } from "framer-motion";

import InlineCommentSection from "./InlineCommentSection";

export default function PostCard({ post }: { post: any }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(post.likes || 0);
    const [showComments, setShowComments] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        setLikes((prev: number) => liked ? prev - 1 : prev + 1);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-paper border-2 border-ink shadow-neo hover:shadow-neo-lg transition-all duration-300"
        >

            {/* Torn Paper Header Mask */}
            <div className="h-2 bg-black w-full torn-edge-mask opacity-20 absolute -top-2 left-0 rotate-180"></div>

            {/* Header */}
            <div className="p-4 flex items-start justify-between border-b-2 border-dashed border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border-2 border-black rounded-full overflow-hidden">
                        <img src={post.author?.avatar} alt={post.author?.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="font-bold font-display text-lg leading-tight">{post.author?.name}</h4>
                        <p className="font-mono text-xs text-gray-500">2h ago • Campus</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-black hover:rotate-90 transition-transform">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="font-body text-lg text-ink whitespace-pre-wrap mb-4 leading-relaxed">
                    {post.content}
                </p>

                {post.image && (
                    <div className="relative mb-4 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                        <div className="absolute inset-0 bg-black translate-x-1 translate-y-1"></div>
                        <div className="relative border-2 border-black overflow-hidden">
                            <img src={post.image} alt="Post Content" className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
                        </div>
                        {/* Tape */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/30 backdrop-blur-sm border border-white/40 rotate-2"></div>
                    </div>
                )}
            </div>

            {/* Footer / Actions */}
            <div className="px-4 py-3 bg-paper border-t-2 border-black flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <RetroButton
                        variant={liked ? "primary" : "ghost"}
                        className={`p-2 rounded-full !shadow-none ${liked ? 'bg-red-500 text-white border-black' : 'hover:bg-red-50'}`}
                        onClick={handleLike}
                    >
                        <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </RetroButton>
                    <span className="font-mono text-sm font-bold min-w-[20px]">{likes}</span>
                </div>

                <div className="flex items-center gap-1">
                    <RetroButton
                        variant="ghost"
                        className={`p-2 hover:bg-blue-50 ${showComments ? 'bg-blue-100' : ''}`}
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageSquare className="w-5 h-5" />
                    </RetroButton>
                    <span className="font-mono text-sm font-bold">{post.comments || 0}</span>
                </div>

                <div className="flex-1"></div>

                <RetroButton variant="ghost" className="p-2 hover:bg-yellow-50">
                    <Bookmark className="w-5 h-5" />
                </RetroButton>

                <RetroButton variant="ghost" className="p-2 hover:bg-green-50">
                    <Share2 className="w-5 h-5" />
                </RetroButton>
            </div>

            {/* Inline Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <InlineCommentSection postId={post.id} onClose={() => setShowComments(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}
