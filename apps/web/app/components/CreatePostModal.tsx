"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, Smile, BarChart2, Calendar, ShoppingBag, Paperclip, Loader2, Users, Flag, EyeOff, AlertTriangle } from "lucide-react";
import { RetroButton } from "./ui/NewspaperUI";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../../lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
    initialTab?: 'TEXT' | 'POLL' | 'MARKET' | 'EVENT' | 'COLLAB' | 'REPORT';
}

// Schemas
const postSchema = z.object({
    content: z.string().min(1, "Post cannot be empty").max(500, "Too much chaos (max 500 chars)"),
});

const pollSchema = z.object({
    question: z.string().min(5, "Question is too short"),
    options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "Need at least 2 options"),
});

const marketSchema = z.object({
    title: z.string().min(3, "Title required"),
    price: z.string().regex(/^\d+$/, "Price must be a number"), // Simple regex for now
    description: z.string().optional(),
});

type PostFormValues = z.infer<typeof postSchema>;

export default function CreatePostModal({ isOpen, onClose, onPostCreated, initialTab = 'TEXT' }: CreatePostModalProps) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { user } = useAuth();

    // Forms
    const { register: registerPost, handleSubmit: handlePostSubmit, reset: resetPost, formState: { errors: postErrors } } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema)
    });

    // Anonymous posting
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showAnonWarning, setShowAnonWarning] = useState(false);

    // Poll State (Simple controlled for now due to dynamic inputs complexity in quick prototype)
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);

    // Market State
    const [marketTitle, setMarketTitle] = useState("");
    const [marketPrice, setMarketPrice] = useState("");
    const [marketDesc, setMarketDesc] = useState("");

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            if (selected.size > 200 * 1024) { // 200kb limit
                toast("File too large! Max 200kb.", "error");
                return;
            }
            setFile(selected);
        }
    };

    const onSubmitPost = async (data: PostFormValues) => {
        setIsSubmitting(true);
        try {
            let imageUrl;
            if (file) {
                const uploadRes = await api.uploadFile(file);
                imageUrl = uploadRes.url;
            }

            await api.createPost({
                content: data.content,
                image: imageUrl,
                type: 'post',
                collegeSlug: user?.profile?.college?.slug, // Assuming context has this
                isAnonymous: isAnonymous,
            });

            toast("Chaos unleashed! 🚀", "success");
            onPostCreated?.();
            resetPost();
            setFile(null);
            onClose();
        } catch (e: any) {
            console.error(e);
            toast(e.message || "Failed to post.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmitPoll = async () => {
        if (!pollQuestion.trim()) return toast("Question missing", "error");
        if (pollOptions.some(o => !o.trim())) return toast("Fill all options", "error");

        setIsSubmitting(true);
        try {
            await api.createPost({
                content: pollQuestion, // Poll question is content
                type: 'poll',
                pollOptions: pollOptions,
                collegeSlug: user?.profile?.college?.slug
            });
            toast("Poll created!", "success");
            onPostCreated?.();
            onClose();
        } catch (e: any) {
            toast(e.message || "Failed to post poll.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Switch submit handler based on tab
    const handleMasterSubmit = () => {
        if (activeTab === 'TEXT') {
            handlePostSubmit(onSubmitPost)();
        } else if (activeTab === 'POLL') {
            onSubmitPoll();
        } else {
            toast("This feature is coming soon!", "warning");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-2xl bg-paper border-thick border-black shadow-neo-lg relative z-10 flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-black text-white p-3 flex justify-between items-center select-none cursor-move">
                    <span className="font-mono font-bold uppercase tracking-widest pl-2">Create Chaos.exe</span>
                    <button onClick={onClose} className="hover:text-accent-red transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b-2 border-black bg-gray-100 overflow-x-auto">
                    <TabButton icon={Smile} label="Post" active={activeTab === 'TEXT'} onClick={() => setActiveTab('TEXT')} />
                    <TabButton icon={BarChart2} label="Poll" active={activeTab === 'POLL'} onClick={() => setActiveTab('POLL')} />
                    <TabButton icon={ShoppingBag} label="Market" active={activeTab === 'MARKET'} onClick={() => setActiveTab('MARKET')}
                        disabled={typeof window !== 'undefined' && !window.location.pathname.includes('marketplace')}
                    />
                    <TabButton icon={Calendar} label="Event" active={activeTab === 'EVENT'} onClick={() => setActiveTab('EVENT')} />
                    <TabButton icon={Users} label="Collab" active={activeTab === 'COLLAB'} onClick={() => setActiveTab('COLLAB')} />
                    <TabButton icon={Flag} label="Report" active={activeTab === 'REPORT'} onClick={() => setActiveTab('REPORT')} />
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 overflow-y-auto bg-white min-h-[300px]">

                    {activeTab === 'TEXT' && (
                        <div className="space-y-4">
                            <textarea
                                {...registerPost("content")}
                                placeholder="What's happening on campus?"
                                className="w-full h-40 resize-none border-2 border-dashed border-gray-300 p-4 font-body text-lg focus:outline-none focus:border-black focus:bg-yellow-50/20 rounded-xl transition-all placeholder:text-gray-300"
                            ></textarea>
                            {postErrors.content && <p className="text-red-500 font-mono text-xs">{postErrors.content.message}</p>}

                            {/* Anonymous Toggle */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!isAnonymous) {
                                            setShowAnonWarning(true);
                                        } else {
                                            setIsAnonymous(false);
                                        }
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 border-2 transition-all ${
                                        isAnonymous 
                                            ? "border-purple-500 bg-purple-50 text-purple-700" 
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                    <EyeOff className="w-4 h-4" />
                                    <span className="font-bold text-sm">Post Anonymously</span>
                                </button>
                                {isAnonymous && (
                                    <span className="text-xs font-mono text-purple-600">
                                        Your identity will be hidden
                                    </span>
                                )}
                            </div>

                            {/* Anonymous Warning Modal */}
                            {showAnonWarning && (
                                <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-yellow-800 mb-1">Community Guidelines</h4>
                                            <p className="text-sm text-yellow-700 mb-3">
                                                Anonymous posts are still subject to community guidelines. 
                                                Harassment, hate speech, or illegal content may result in your 
                                                identity being revealed to moderators.
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setIsAnonymous(true);
                                                        setShowAnonWarning(false);
                                                    }}
                                                    className="px-3 py-1 bg-purple-600 text-white text-sm font-bold border-2 border-purple-700"
                                                >
                                                    I Understand
                                                </button>
                                                <button
                                                    onClick={() => setShowAnonWarning(false)}
                                                    className="px-3 py-1 bg-white text-sm font-bold border-2 border-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* File Preview */}
                            {file && (
                                <div className="relative inline-block border-2 border-black rotate-1">
                                    <img src={URL.createObjectURL(file)} className="h-24 w-auto object-cover" />
                                    <button onClick={() => setFile(null)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 border border-black">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'POLL' && (
                        <div className="space-y-4">
                            <input
                                value={pollQuestion}
                                onChange={(e) => setPollQuestion(e.target.value)}
                                className="w-full border-2 border-black p-3 font-bold font-display text-lg focus:shadow-neo outline-none"
                                placeholder="Ask a question..."
                            />
                            <div className="space-y-2 pl-4 border-l-4 border-gray-200">
                                {pollOptions.map((opt, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input
                                            value={opt}
                                            onChange={(e) => {
                                                const newOpts = [...pollOptions];
                                                newOpts[i] = e.target.value;
                                                setPollOptions(newOpts);
                                            }}
                                            className="w-full border-b-2 border-gray-300 p-2 focus:border-black outline-none bg-transparent"
                                            placeholder={`Option ${i + 1}`}
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => setPollOptions([...pollOptions, ""])}
                                    className="text-sm font-bold text-accent-blue hover:underline"
                                >
                                    + Add Option
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'MARKET' && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-200">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <input value={marketTitle} onChange={e => setMarketTitle(e.target.value)} className="w-full border-2 border-black p-2 font-display font-bold" placeholder="Item Title" />
                                    <input value={marketPrice} onChange={e => setMarketPrice(e.target.value)} className="w-full border-2 border-black p-2 font-mono" placeholder="Price (₹)" />
                                </div>
                            </div>
                            <textarea value={marketDesc} onChange={e => setMarketDesc(e.target.value)} className="w-full border-2 border-gray-300 p-2 h-24" placeholder="Description/Condition..."></textarea>
                        </div>
                    )}

                    {activeTab === 'EVENT' && (
                        <div className="text-center py-10 opacity-50">
                            <Calendar className="w-12 h-12 mx-auto mb-2" />
                            <p>Event Creation is locked for Level 1 users.</p>
                        </div>
                    )}

                    {activeTab === 'COLLAB' && (
                        <div className="space-y-4">
                            <input className="w-full border-2 border-black p-3 font-bold font-display text-lg" placeholder="Project Title" />
                            <textarea className="w-full border-2 border-gray-300 p-3 h-32" placeholder="Describe your project & what skills you need..."></textarea>
                            <div className="flex gap-2">
                                <span className="text-xs bg-gray-100 p-1 rounded">#React</span>
                                <span className="text-xs bg-gray-100 p-1 rounded">#Design</span>
                                <span className="text-xs text-blue-500 cursor-pointer">+ Add Tag</span>
                            </div>
                        </div>
                    )}

                    {activeTab === 'REPORT' && (
                        <div className="bg-red-50 p-6 border-2 border-red-200 rounded-xl">
                            <h3 className="flex items-center gap-2 font-bold text-red-700 mb-2">
                                <Flag className="w-5 h-5" /> Report Issue
                            </h3>
                            <p className="text-sm text-red-600 mb-4">Reports are anonymous and sent directly to campus admin.</p>
                            <textarea className="w-full border-2 border-red-100 p-3 h-32 bg-white" placeholder="What's going on?"></textarea>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t-2 border-black flex justify-between items-center">
                    <div className="flex gap-2">
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-200 rounded">
                            <ImageIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-200 rounded">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileSelect} />
                    </div>

                    <div className="flex gap-3">
                        <RetroButton
                            disabled={isSubmitting}
                            onClick={handleMasterSubmit}
                            className={`px-6 py-2 ${isSubmitting ? 'opacity-80' : ''}`}
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "POST IT"}
                        </RetroButton>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function TabButton({ icon: Icon, label, active, onClick, disabled }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                flex-1 flex items-center justify-center gap-2 py-3 font-bold font-display uppercase tracking-wide transition-colors
                ${active ? 'bg-white text-black border-b-2 border-white translate-y-[2px]' : 'text-gray-500 hover:bg-gray-200 hover:text-black'}
                ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-200 grayscale' : ''}
            `}
            title={disabled ? "Available only on Market page" : label}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    )
}
