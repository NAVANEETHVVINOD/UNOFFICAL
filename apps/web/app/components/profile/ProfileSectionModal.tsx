"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

type SectionType = "education" | "experience" | "project" | "volunteering";

interface ProfileSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (type: SectionType, data: any) => Promise<void>;
    type: SectionType;
}

export default function ProfileSectionModal({ isOpen, onClose, onSubmit, type }: ProfileSectionModalProps) {
    const [loading, setLoading] = useState(false);
    // Generic state - simplified for speed, ideally typed better
    const [formData, setFormData] = useState<any>({});

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(type, formData);
            onClose();
            setFormData({});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const getTitle = () => {
        switch (type) {
            case "education": return "Add Education";
            case "experience": return "Add Experience";
            case "project": return "Add Project";
            case "volunteering": return "Add Volunteering";
        }
    };

    const renderFields = () => {
        switch (type) {
            case "education":
                return (
                    <>
                        <Input name="school" label="School / University" required onChange={handleChange} />
                        <Input name="degree" label="Degree" required onChange={handleChange} />
                        <Input name="field" label="Field of Study" onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="startDate" label="Start Date" type="date" required onChange={handleChange} />
                            <Input name="endDate" label="End Date" type="date" onChange={handleChange} />
                        </div>
                        <Input name="grade" label="Grade / GPA" onChange={handleChange} />
                        <Textarea name="description" label="Description" onChange={handleChange} />
                    </>
                );
            case "experience":
                return (
                    <>
                        <Input name="title" label="Job Title" required onChange={handleChange} />
                        <Input name="company" label="Company" required onChange={handleChange} />
                        <Input name="location" label="Location" onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="startDate" label="Start Date" type="date" required onChange={handleChange} />
                            <Input name="endDate" label="End Date" type="date" onChange={handleChange} />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <input type="checkbox" name="isCurrentJob" id="isCurrentJob" onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                            <label htmlFor="isCurrentJob" className="text-sm font-medium">I currently work here</label>
                        </div>
                        <Textarea name="description" label="Description" onChange={handleChange} />
                    </>
                );
            case "project":
                return (
                    <>
                        <Input name="title" label="Project Title" required onChange={handleChange} />
                        <Input name="link" label="Project URL" type="url" onChange={handleChange} />
                        <Input name="imageUrl" label="Image URL" type="url" onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="startDate" label="Start Date" type="date" onChange={handleChange} />
                            <Input name="endDate" label="End Date" type="date" onChange={handleChange} />
                        </div>
                        <Input name="tags" label="Tags (comma separated)" placeholder="React, Node.js, AI" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, tags: e.target.value.split(',').map((t: string) => t.trim()) })} />
                        <Textarea name="description" label="Description" onChange={handleChange} />
                    </>
                );
            case "volunteering":
                return (
                    <>
                        <Input name="role" label="Role" required onChange={handleChange} />
                        <Input name="organization" label="Organization" required onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <Input name="startDate" label="Start Date" type="date" required onChange={handleChange} />
                            <Input name="endDate" label="End Date" type="date" onChange={handleChange} />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <input type="checkbox" id="vol_current" name="current" onChange={handleChange} className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                            <label htmlFor="vol_current" className="text-sm font-medium">I currently volunteer here</label>
                        </div>
                        <Textarea name="description" label="Description" onChange={handleChange} />
                    </>
                );
        }
    }

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                        <h3 className="font-bold text-lg font-display">{getTitle()}</h3>
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <form id="section-form" onSubmit={handleSubmit} className="space-y-4">
                            {renderFields()}
                        </form>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="section-form"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-black text-white dark:bg-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}

function Input({ label, name, type = "text", required, onChange, placeholder }: any) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{label} {required && "*"}</label>
            <input
                type={type}
                name={name}
                required={required}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-gray-200 dark:border-white/20 rounded-lg focus:border-black dark:focus:border-white outline-none transition-colors font-medium"
            />
        </div>
    );
}

function Textarea({ label, name, required, onChange }: any) {
    return (
        <div className="space-y-1">
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">{label} {required && "*"}</label>
            <textarea
                name={name}
                rows={3}
                required={required}
                onChange={onChange}
                className="w-full px-3 py-2 bg-white dark:bg-black border-2 border-gray-200 dark:border-white/20 rounded-lg focus:border-black dark:focus:border-white outline-none transition-colors font-medium resize-none"
            />
        </div>
    );
}
