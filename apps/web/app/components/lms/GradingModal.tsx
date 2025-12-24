"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { X, Loader2, CheckCircle } from "lucide-react";
import { api } from "../../../lib/api";

interface GradingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    submission: any;
}

export default function GradingModal({
    isOpen,
    onClose,
    onSuccess,
    submission
}: GradingModalProps) {
    const [loading, setLoading] = useState(false);
    const [grade, setGrade] = useState(submission?.grade || "");
    const [feedback, setFeedback] = useState(submission?.feedback || "");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await api.gradeSubmission(submission.id, Number(grade), feedback);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to submit grade");
        } finally {
            setLoading(false);
        }
    };

    if (!submission) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md w-full bg-white dark:bg-dark-surface border-2 border-ink p-0 overflow-hidden shadow-neo-lg rounded-xl">
                <DialogHeader className="p-6 border-b border-neutral-100 bg-neutral-50 dark:bg-dark-bg/50 flex flex-row items-center justify-between">
                    <DialogTitle className="font-display text-xl font-bold">Grade Submission</DialogTitle>
                    <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4 p-3 bg-neutral-100 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center font-bold text-lg">
                            {submission.student?.profile?.fullName?.[0] || "S"}
                        </div>
                        <div>
                            <p className="font-bold">{submission.student?.profile?.fullName}</p>
                            <a href={submission.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">View Attached Work</a>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1">Grade (Points)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg"
                            placeholder="e.g. 95"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1">Feedback (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-lg border-2 border-neutral-200 focus:border-black outline-none transition-colors bg-white dark:bg-dark-bg resize-none h-24"
                            placeholder="Great work, but..."
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
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
                            className="flex items-center gap-2 px-6 py-2 bg-black text-white font-bold rounded-lg border-2 border-black shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-neo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Submit Grade
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
