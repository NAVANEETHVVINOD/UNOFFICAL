"use client";

import { X, Send, Heart, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { RetroButton } from "../ui/NewspaperUI";

interface CommentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    postId?: string;
}

export default function CommentDrawer({ isOpen, onClose, postId }: CommentDrawerProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            // Simulate fetch
            setTimeout(() => {
                setComments([
                    { id: 1, author: "Gwen Stacy", text: "This is exactly what I needed! 🕸️", time: "2m ago" },
                    { id: 2, author: "Miles", text: "Classic chaos. Love it.", time: "5m ago" },
                ]);
                setLoading(false);
            }, 1000);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-paper border-l-thick border-black shadow-neo-lg h-full flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-4 border-b-2 border-black bg-white flex items-center justify-between">
                    <h3 className="font-display font-black text-xl">COMMENTS (2)</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex gap-3 animate-pulse">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 w-1/3"></div>
                                    <div className="h-4 bg-gray-200 w-3/4"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        comments.map(c => (
                            <div key={c.id} className="group flex gap-3">
                                <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-200 overflow-hidden flex-shrink-0">
                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${c.author}`} className="w-full h-full" />
                                </div>
                                <div className="flex-1 bg-white border-2 border-black rounded-r-xl rounded-bl-xl p-3 shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold font-display text-sm">{c.author}</span>
                                        <span className="text-[10px] font-mono text-gray-400">{c.time}</span>
                                    </div>
                                    <p className="text-sm font-medium">{c.text}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t-2 border-black">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Add your chaos..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border-2 border-black rounded-full focus:outline-none focus:shadow-neo font-mono text-sm"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-accent-yellow rounded-full transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
