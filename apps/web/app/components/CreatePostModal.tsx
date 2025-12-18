"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, Paperclip, Loader2, EyeOff, AlertTriangle, BarChart2, Calendar, Users, Flag, MapPin, Clock, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
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
    initialTab?: string;
}

const postSchema = z.object({
    content: z.string().min(1, "Post cannot be empty").max(500, "Max 500 chars"),
});

type PostFormValues = z.infer<typeof postSchema>;
type FeatureType = 'poll' | 'event' | 'collab' | 'report';

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const { user } = useAuth();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<PostFormValues>({
        resolver: zodResolver(postSchema)
    });

    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showAnonWarning, setShowAnonWarning] = useState(false);
    const [activeFeatures, setActiveFeatures] = useState<Set<FeatureType>>(new Set());
    
    // Poll state
    const [pollQuestion, setPollQuestion] = useState("");
    const [pollOptions, setPollOptions] = useState(["", ""]);
    
    // Event state
    const [eventTitle, setEventTitle] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [eventTime, setEventTime] = useState("");
    const [eventLocation, setEventLocation] = useState("");
    
    // Collab state
    const [collabTitle, setCollabTitle] = useState("");
    const [collabDescription, setCollabDescription] = useState("");
    
    // Report state
    const [reportCategory, setReportCategory] = useState("");

    const toggleFeature = (feature: FeatureType) => {
        const newFeatures = new Set(activeFeatures);
        if (newFeatures.has(feature)) {
            newFeatures.delete(feature);
        } else {
            newFeatures.add(feature);
        }
        setActiveFeatures(newFeatures);
    };

    if (!isOpen) return null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selected = e.target.files[0];
            if (selected.size > 200 * 1024) {
                toast("File too large! Max 200kb.", "error");
                return;
            }
            setFile(selected);
        }
    };

    const onSubmit = async (data: PostFormValues) => {
        setIsSubmitting(true);
        try {
            let imageUrl;
            if (file) {
                const uploadRes = await api.uploadFile(file);
                imageUrl = uploadRes.url;
            }

            const postData: any = {
                content: data.content,
                image: imageUrl,
                type: activeFeatures.has('poll') ? 'poll' : 'post',
                collegeSlug: user?.profile?.college?.slug,
                isAnonymous,
            };

            if (activeFeatures.has('poll') && pollQuestion) {
                postData.pollOptions = pollOptions.filter(o => o.trim());
                postData.content = pollQuestion || data.content;
            }

            if (activeFeatures.has('event')) {
                postData.eventData = { title: eventTitle, date: eventDate, time: eventTime, location: eventLocation };
            }

            if (activeFeatures.has('collab')) {
                postData.collabData = { title: collabTitle, description: collabDescription };
            }

            if (activeFeatures.has('report')) {
                postData.reportData = { category: reportCategory };
            }

            await api.createPost(postData);
            toast("Posted successfully!", "success");
            onPostCreated?.();
            reset();
            setFile(null);
            setActiveFeatures(new Set());
            onClose();
        } catch (e: any) {
            toast(e.message || "Failed to post.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const featureButtons = [
        { id: 'poll' as FeatureType, icon: BarChart2, label: 'Poll', color: 'bg-accent-blue' },
        { id: 'event' as FeatureType, icon: Calendar, label: 'Event', color: 'bg-accent-coral' },
        { id: 'collab' as FeatureType, icon: Users, label: 'Collab', color: 'bg-accent-mint' },
        { id: 'report' as FeatureType, icon: Flag, label: 'Report', color: 'bg-accent-purple' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-paper border-2 border-ink shadow-neo-lg relative z-10 flex flex-col max-h-[90vh] rounded-card-xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-ink text-white px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="font-display font-black text-ink">+</span>
                        </div>
                        <span className="font-display font-bold text-lg">Create Post</span>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 overflow-y-auto">
                    <textarea
                        {...register("content")}
                        placeholder="What's on your mind?"
                        className="w-full h-32 resize-none border-2 border-neutral-200 bg-paper-light p-4 rounded-card focus:outline-none focus:border-ink"
                    />
                    {errors.content && <p className="text-accent-coral text-xs mt-1">{errors.content.message}</p>}

                    {file && (
                        <div className="relative inline-block mt-3 border-2 border-ink rounded-lg overflow-hidden">
                            <img src={URL.createObjectURL(file)} className="h-24 w-auto object-cover" alt="Preview" />
                            <button onClick={() => setFile(null)} className="absolute top-1 right-1 bg-accent-coral text-white rounded-full p-1">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {/* Feature Toggles */}
                    <div className="mt-4">
                        <p className="text-xs font-bold text-neutral-500 uppercase mb-2">Add to your post</p>
                        <div className="flex flex-wrap gap-2">
                            {featureButtons.map((f) => {
                                const Icon = f.icon;
                                const isActive = activeFeatures.has(f.id);
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => toggleFeature(f.id)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-card border-2 transition-all ${
                                            isActive ? `${f.color} border-ink shadow-neo-sm` : 'border-neutral-200 hover:border-neutral-400 bg-paper'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{f.label}</span>
                                        {isActive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3 text-neutral-400" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Poll Section */}
                    <AnimatePresence>
                        {activeFeatures.has('poll') && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="mt-4 p-4 bg-accent-blue/10 border-2 border-accent-blue/30 rounded-card">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BarChart2 className="w-4 h-4 text-accent-blue" />
                                        <span className="font-bold text-sm">Poll Options</span>
                                    </div>
                                    <input value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} className="w-full border-2 border-neutral-200 bg-paper p-2 rounded-lg mb-3 focus:outline-none focus:border-ink" placeholder="Ask a question..." />
                                    <div className="space-y-2">
                                        {pollOptions.map((opt, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input value={opt} onChange={(e) => { const newOpts = [...pollOptions]; newOpts[i] = e.target.value; setPollOptions(newOpts); }} className="flex-1 border-b-2 border-neutral-200 p-2 focus:border-ink outline-none bg-transparent" placeholder={`Option ${i + 1}`} />
                                                {pollOptions.length > 2 && <button onClick={() => setPollOptions(pollOptions.filter((_, idx) => idx !== i))} className="text-neutral-400 hover:text-accent-coral"><Trash2 className="w-4 h-4" /></button>}
                                            </div>
                                        ))}
                                        <button onClick={() => setPollOptions([...pollOptions, ""])} className="text-sm font-bold text-accent-blue hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Add Option</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Event Section */}
                    <AnimatePresence>
                        {activeFeatures.has('event') && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="mt-4 p-4 bg-accent-coral/10 border-2 border-accent-coral/30 rounded-card">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar className="w-4 h-4 text-accent-coral" />
                                        <span className="font-bold text-sm">Event Details</span>
                                    </div>
                                    <div className="space-y-3">
                                        <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} className="w-full border-2 border-neutral-200 bg-paper p-2 rounded-lg focus:outline-none focus:border-ink" placeholder="Event title" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center gap-2 border-2 border-neutral-200 bg-paper rounded-lg p-2">
                                                <Calendar className="w-4 h-4 text-neutral-400" />
                                                <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="flex-1 bg-transparent focus:outline-none text-sm" />
                                            </div>
                                            <div className="flex items-center gap-2 border-2 border-neutral-200 bg-paper rounded-lg p-2">
                                                <Clock className="w-4 h-4 text-neutral-400" />
                                                <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} className="flex-1 bg-transparent focus:outline-none text-sm" />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 border-2 border-neutral-200 bg-paper rounded-lg p-2">
                                            <MapPin className="w-4 h-4 text-neutral-400" />
                                            <input value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="flex-1 bg-transparent focus:outline-none" placeholder="Location" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Collab Section */}
                    <AnimatePresence>
                        {activeFeatures.has('collab') && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="mt-4 p-4 bg-accent-mint/10 border-2 border-accent-mint/30 rounded-card">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users className="w-4 h-4 text-accent-mint" />
                                        <span className="font-bold text-sm">Collaboration Request</span>
                                    </div>
                                    <div className="space-y-3">
                                        <input value={collabTitle} onChange={(e) => setCollabTitle(e.target.value)} className="w-full border-2 border-neutral-200 bg-paper p-2 rounded-lg focus:outline-none focus:border-ink" placeholder="Project title" />
                                        <textarea value={collabDescription} onChange={(e) => setCollabDescription(e.target.value)} className="w-full border-2 border-neutral-200 bg-paper p-2 rounded-lg h-20 resize-none focus:outline-none focus:border-ink" placeholder="Describe your project..." />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Report Section */}
                    <AnimatePresence>
                        {activeFeatures.has('report') && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="mt-4 p-4 bg-accent-purple/10 border-2 border-accent-purple/30 rounded-card">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Flag className="w-4 h-4 text-accent-purple" />
                                        <span className="font-bold text-sm">Report / Feedback</span>
                                    </div>
                                    <select value={reportCategory} onChange={(e) => setReportCategory(e.target.value)} className="w-full border-2 border-neutral-200 bg-paper p-2 rounded-lg focus:outline-none focus:border-ink">
                                        <option value="">Select category...</option>
                                        <option value="feedback">General Feedback</option>
                                        <option value="issue">Report Issue</option>
                                        <option value="suggestion">Suggestion</option>
                                        <option value="safety">Safety Concern</option>
                                    </select>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Anonymous Toggle */}
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => !isAnonymous ? setShowAnonWarning(true) : setIsAnonymous(false)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-card border-2 transition-all ${isAnonymous ? "border-accent-purple bg-accent-purple/10" : "border-neutral-200 hover:border-neutral-400"}`}
                        >
                            <EyeOff className="w-4 h-4" />
                            <span className="font-medium text-sm">Post Anonymously</span>
                        </button>
                    </div>

                    {showAnonWarning && (
                        <div className="mt-3 bg-primary/20 border-2 border-primary p-4 rounded-card">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-ink flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-ink mb-1">Community Guidelines</h4>
                                    <p className="text-sm text-ink/70 mb-3">Anonymous posts are still subject to community guidelines.</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setIsAnonymous(true); setShowAnonWarning(false); }} className="px-3 py-1.5 bg-ink text-white text-sm font-bold rounded-lg">I Understand</button>
                                        <button onClick={() => setShowAnonWarning(false)} className="px-3 py-1.5 bg-paper text-sm font-bold border-2 border-neutral-300 rounded-lg">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 bg-paper-dark border-t-2 border-ink flex justify-between items-center">
                    <div className="flex gap-2">
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-neutral-200 rounded-lg"><ImageIcon className="w-5 h-5" /></button>
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-neutral-200 rounded-lg"><Paperclip className="w-5 h-5" /></button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/png, image/jpeg, image/gif" onChange={handleFileSelect} />
                    </div>
                    <RetroButton disabled={isSubmitting} onClick={handleSubmit(onSubmit)} className={`px-6 py-2 ${isSubmitting ? 'opacity-80' : ''}`}>
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Post"}
                    </RetroButton>
                </div>
            </motion.div>
        </div>
    );
}
