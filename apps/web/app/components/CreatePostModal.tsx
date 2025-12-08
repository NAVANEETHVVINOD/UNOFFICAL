"use client";

import React, { useState } from "react";
import { NewspaperCard, RetroButton } from "./ui/NewspaperUI";
import { api } from "../../lib/api";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated: () => void;
    initialTab?: 'TEXT' | 'POLL' | 'COLLAB';
};

type PostType = 'TEXT' | 'POLL' | 'COLLAB';

export default function CreatePostModal({ isOpen, onClose, onPostCreated, initialTab = 'TEXT' }: Props) {
    const [activeTab, setActiveTab] = useState<PostType>(initialTab);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState(""); // For Collab
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Reset tab when modal opens or initialTab changes
    React.useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const handleAddOption = () => {
        if (pollOptions.length < 6) setPollOptions([...pollOptions, ""]);
    };

    const handleOptionChange = (idx: number, val: string) => {
        const newOptions = [...pollOptions];
        newOptions[idx] = val;
        setPollOptions(newOptions);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            try {
                const res = await api.uploadFile(e.target.files[0]);
                setImageUrl(res.url); // Assumes backend returns { url: "..." }
            } catch (err) {
                console.error("Upload failed", err);
                alert("Failed to upload image");
            } finally {
                setUploading(false);
            }
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                type: activeTab,
                content,
                isAnonymous,
                imageUrl
            };

            if (activeTab === 'POLL') {
                payload.poll = {
                    question: pollQuestion,
                    options: pollOptions.filter(o => o.trim() !== "")
                };
                if (!payload.poll.question || payload.poll.options.length < 2) {
                    alert("Poll needs a question and at least 2 options");
                    setLoading(false);
                    return;
                }
            }

            if (activeTab === 'COLLAB') {
                payload.title = title;
                if (!title) {
                    alert("Collab needs a title");
                    setLoading(false);
                    return;
                }
            }

            await api.createPost(payload);

            // Reset form
            setContent("");
            setTitle("");
            setPollQuestion("");
            setPollOptions(["", ""]);
            setIsAnonymous(false);
            setImageUrl("");
            onPostCreated();
            onClose();
        } catch (error) {
            console.error("Failed to create post", error);
            alert("Failed to create post");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <NewspaperCard className="w-full max-w-lg relative" rotate={0}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 w-8 h-8 bg-black text-white font-bold border-2 border-white rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
                >
                    X
                </button>

                <h2 className="font-display font-black text-2xl uppercase mb-4 text-center">Broadcast Chaos</h2>

                {/* TABS */}
                <div className="flex border-b-2 border-black mb-4">
                    {['TEXT', 'POLL', 'COLLAB'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as PostType)}
                            className={`flex-1 py-2 font-bold font-mono text-sm uppercase transition-colors ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {activeTab === 'POLL' && (
                        <div className="space-y-2">
                            <input
                                className="w-full p-2 border-2 border-black font-bold font-display uppercase"
                                placeholder="Poll Question?"
                                value={pollQuestion}
                                onChange={e => setPollQuestion(e.target.value)}
                            />
                            {pollOptions.map((opt, idx) => (
                                <input
                                    key={idx}
                                    className="w-full p-2 border border-gray-300 font-mono text-sm"
                                    placeholder={`Option ${idx + 1}`}
                                    value={opt}
                                    onChange={e => handleOptionChange(idx, e.target.value)}
                                />
                            ))}
                            {pollOptions.length < 6 && (
                                <button type="button" onClick={handleAddOption} className="text-xs font-bold underline">+ Add Option</button>
                            )}
                        </div>
                    )}

                    {activeTab === 'COLLAB' && (
                        <div className="space-y-2">
                            <input
                                className="w-full p-2 border-2 border-black font-bold font-display uppercase"
                                placeholder="Project Title (e.g. Robotics Team)"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Media Upload (Available for TEXT and maybe POLL?) */}
                    {activeTab !== 'COLLAB' && (
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            {imageUrl ? (
                                <div className="relative mb-2 inline-block">
                                    <img src={imageUrl} alt="Preview" className="h-32 w-auto border-2 border-black object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl("")}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full font-bold border-2 border-black flex items-center justify-center hover:scale-110"
                                    >
                                        X
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 text-xs font-bold uppercase border border-dashed border-gray-400 p-2 hover:bg-gray-50 transition-colors"
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "📎 Attach Image"}
                                </button>
                            )}
                        </div>
                    )}

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={activeTab === 'POLL' ? "Add some context (optional)..." : (activeTab === 'COLLAB' ? "Describe the role and skills needed..." : "What's happening on campus?")}
                        className="w-full h-32 p-4 border-2 border-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none"
                    />

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div className={`w-5 h-5 border-2 border-black ${isAnonymous ? 'bg-black' : 'bg-white'}`}>
                                {isAnonymous && <span className="text-white flex justify-center items-center text-xs">✓</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} />
                            <span className="font-bold text-xs uppercase">Post Anonymously</span>
                        </label>

                        <div className="flex gap-2">
                            <RetroButton variant="ghost" onClick={onClose} type="button">Cancel</RetroButton>
                            <RetroButton variant="secondary" type="submit" disabled={loading}>
                                {loading ? "Posting..." : "POST IT"}
                            </RetroButton>
                        </div>
                    </div>
                </form>
            </NewspaperCard>
        </div>
    );
}
