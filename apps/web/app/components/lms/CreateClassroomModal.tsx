"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { X, Loader2 } from "lucide-react";
import { api } from "../../../lib/api";

interface CreateClassroomModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    collegeId: string;
}

export default function CreateClassroomModal({
    isOpen,
    onClose,
    onSuccess,
    collegeId
}: CreateClassroomModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        subject: "",
        description: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.createClassroom({
                ...formData,
                collegeId
            });
            setFormData({ name: "", subject: "", description: "" });
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to create classroom");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full bg-white dark:bg-dark-surface border-2 border-ink p-0 overflow-hidden shadow-neo-lg rounded-xl">
                <DialogHeader className="p-6 border-b border-neutral-100 bg-neutral-50 dark:bg-dark-bg/50 flex flex-row items-center justify-between">
                    <DialogTitle className="font-display text-xl font-bold">Create a Class</DialogTitle>
                    <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1">Class Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg"
                            placeholder="e.g. Introduction to Computer Science"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1">Subject / Section</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg"
                            placeholder="e.g. CS101 - Section A"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1">Description (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg resize-none h-24"
                            placeholder="What is this class about?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 font-bold text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-ink font-bold rounded-lg border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-neo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Class
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
