"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Flag } from "lucide-react";
import { NewspaperCard, RetroButton } from "./ui/NewspaperUI";
import { modalVariants } from "../../lib/animations";
import { api } from "../../lib/api";

export type ReportTargetType = "POST" | "COMMENT" | "USER" | "LISTING" | "NOTE";

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "INAPPROPRIATE"
  | "MISINFORMATION"
  | "HATE_SPEECH"
  | "VIOLENCE"
  | "OTHER";

const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: "SPAM", label: "Spam", description: "Unwanted promotional content or repetitive posts" },
  { value: "HARASSMENT", label: "Harassment", description: "Bullying, threats, or targeted attacks" },
  { value: "INAPPROPRIATE", label: "Inappropriate Content", description: "Adult content or offensive material" },
  { value: "MISINFORMATION", label: "Misinformation", description: "False or misleading information" },
  { value: "HATE_SPEECH", label: "Hate Speech", description: "Content promoting hatred or discrimination" },
  { value: "VIOLENCE", label: "Violence", description: "Content depicting or promoting violence" },
  { value: "OTHER", label: "Other", description: "Something else not listed above" },
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  targetName?: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetName,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createReport({
        targetType,
        targetId,
        reason: selectedReason,
        description: description.trim() || undefined,
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset state after close
        setTimeout(() => {
          setSubmitted(false);
          setSelectedReason(null);
          setDescription("");
        }, 300);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTargetLabel = () => {
    switch (targetType) {
      case "POST":
        return "post";
      case "COMMENT":
        return "comment";
      case "USER":
        return "user";
      case "LISTING":
        return "listing";
      case "NOTE":
        return "note";
      default:
        return "content";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <NewspaperCard className="p-6 relative">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>

                {submitted ? (
                  /* Success state */
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Flag className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-display text-2xl font-black mb-2">Report Submitted</h3>
                    <p className="text-gray-600">
                      Thank you for helping keep LINKER safe. Our team will review this report.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-black">Report {getTargetLabel()}</h3>
                        {targetName && (
                          <p className="text-sm text-gray-500">Reporting: {targetName}</p>
                        )}
                      </div>
                    </div>

                    {/* Reason selection */}
                    <div className="space-y-2 mb-6">
                      <label className="font-bold text-sm">Why are you reporting this?</label>
                      {REPORT_REASONS.map((reason) => (
                        <label
                          key={reason.value}
                          className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                            selectedReason === reason.value
                              ? "border-black bg-accent-yellow/20"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="reason"
                            value={reason.value}
                            checked={selectedReason === reason.value}
                            onChange={() => setSelectedReason(reason.value)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-bold">{reason.label}</p>
                            <p className="text-sm text-gray-500">{reason.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Additional details */}
                    <div className="mb-6">
                      <label className="font-bold text-sm block mb-2">
                        Additional details (optional)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide any additional context..."
                        className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none h-24 focus:border-black focus:outline-none"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-400 text-right">{description.length}/500</p>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border-2 border-black rounded-lg font-bold hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <RetroButton
                        onClick={handleSubmit}
                        disabled={!selectedReason || isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                      </RetroButton>
                    </div>
                  </>
                )}
              </NewspaperCard>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
