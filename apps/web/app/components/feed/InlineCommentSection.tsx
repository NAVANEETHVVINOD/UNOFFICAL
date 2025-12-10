"use client";

import { useState } from "react";
import { Send, X, Smile } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function InlineCommentSection({ postId, onClose }: { postId: string, onClose: () => void }) {
    const { user } = useAuth();
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([
        { id: 1, author: "Alice", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice", text: "Is this still available?", time: "2m" },
        { id: 2, author: "Bob", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob", text: "Can I bring my cat?", time: "5m" }
    ]);

    const handleSend = () => {
        if (!comment.trim()) return;
        const newComment = {
            id: Date.now(),
            author: user?.profile?.fullName || "Me",
            avatar: user?.profile?.avatarUrl || "",
            text: comment,
            time: "Just now"
        };
        setComments([...comments, newComment]);
        setComment("");
        // Here we would sync with backend
    };

    return (
        <div className="border-t-2 border-black/10 bg-gray-50/50 p-4 animate-in fade-in slide-in-from-top-2 duration-300">

            {/* Header / Close */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold font-display text-sm uppercase text-gray-500">Comments ({comments.length})</h4>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* List */}
            <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 border border-black overflow-hidden flex-shrink-0">
                            {c.avatar ? <img src={c.avatar} className="w-full h-full" /> : null}
                        </div>
                        <div className="flex-1 bg-white p-2 rounded-lg border border-gray-200 shadow-sm text-sm">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold">{c.author}</span>
                                <span className="text-[10px] text-gray-400">{c.time}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{c.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Composer */}
            <div className="flex gap-2 items-end">
                <div className="w-8 h-8 rounded-full bg-black flex-shrink-0 overflow-hidden">
                    {user?.profile?.avatarUrl && <img src={user.profile.avatarUrl} className="w-full h-full" />}
                </div>
                <div className="flex-1 relative">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full bg-white border-2 border-black rounded-xl p-2 pr-10 text-sm focus:outline-none focus:shadow-neo transition-shadow resize-none h-10 min-h-[40px]"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                    />
                    <button className="absolute right-2 bottom-2 text-gray-400 hover:text-black">
                        <Smile className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={handleSend}
                    disabled={!comment.trim()}
                    className="p-2 bg-black text-white rounded-xl hover:bg-accent-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>

        </div>
    )
}
