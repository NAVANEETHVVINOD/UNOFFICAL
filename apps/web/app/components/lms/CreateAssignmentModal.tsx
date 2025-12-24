"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { X, Loader2, Calendar } from "lucide-react";
import { api } from "../../../lib/api";

interface CreateAssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    classroomId: string;
}

export default function CreateAssignmentModal({
    isOpen,
    onClose,
    onSuccess,
    classroomId
}: CreateAssignmentModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        points: 100,
        dueDate: ""
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.createAssignment(classroomId, {
                ...formData,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
            });
            setFormData({ title: "", description: "", points: 100, dueDate: "" });
            onSuccess();
        } catch (err: any) {
            setError(err.message || "Failed to create assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl w-full bg-white dark:bg-dark-surface border-2 border-ink p-0 overflow-hidden shadow-neo-lg rounded-xl">
                <DialogHeader className="p-6 border-b border-neutral-100 bg-neutral-50 dark:bg-dark-bg/50 flex flex-row items-center justify-between">
                    <DialogTitle className="font-display text-xl font-bold">Create Assignment</DialogTitle>
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
                        <label className="block text-sm font-bold text-neutral-700 mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg"
                            placeholder="Assignment Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1">Instructions (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg resize-none h-32"
                            placeholder="Instructions for the assignment..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-1">Points</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg"
                                value={formData.points}
                                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-neutral-700 mb-1">Due Date</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                />
                                <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
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
                            Assign
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
