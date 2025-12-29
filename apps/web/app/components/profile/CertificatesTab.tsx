"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Download, Calendar, ExternalLink, Eye, X, Building } from "lucide-react";
import Link from "next/link";

interface Certificate {
  id: string;
  eventId: string;
  userId: string;
  templateId: string;
  fileUrl: string;
  issuedAt: string;
  event?: {
    id: string;
    title: string;
    startsAt: string;
    club?: { name: string };
  };
}

interface CertificatesTabProps {
  certificates: Certificate[];
  isLoading?: boolean;
  isOwnProfile?: boolean;
}

export default function CertificatesTab({ certificates, isLoading, isOwnProfile = true }: CertificatesTabProps) {
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  const handleDownload = async (cert: Certificate) => {
    if (!cert.fileUrl) return;
    
    try {
      const response = await fetch(cert.fileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${cert.event?.title || cert.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download certificate:", error);
      // Fallback: open in new tab
      window.open(cert.fileUrl, "_blank");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!certificates || certificates.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
          <Award className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="font-display text-lg text-ink dark:text-white mb-2">
          {isOwnProfile ? "No certificates yet" : "No certificates to display"}
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
          {isOwnProfile 
            ? "Attend events and complete requirements to earn certificates"
            : "This user hasn't earned any certificates yet"
          }
        </p>
        {isOwnProfile && (
          <Link href="/events">
            <button className="px-6 py-2 bg-primary border-2 border-ink font-bold shadow-neo-sm hover:shadow-neo transition-all text-sm">
              Browse Events
            </button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl dark:text-white">
          Certificates ({certificates.length})
        </h2>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-gradient-to-br from-primary/10 via-accent-coral/5 to-accent-blue/10 dark:from-primary/20 dark:via-accent-coral/10 dark:to-accent-blue/20 rounded-xl border-2 border-ink/10 dark:border-white/10 overflow-hidden hover:border-ink/30 dark:hover:border-white/30 transition-all"
          >
            {/* Certificate Preview Area */}
            <div className="aspect-[4/3] relative bg-white dark:bg-neutral-900 flex items-center justify-center">
              {/* Decorative Border Pattern */}
              <div className="absolute inset-2 border-2 border-dashed border-primary/30 rounded-lg" />
              
              {/* Certificate Icon */}
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto text-primary mb-2" />
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Certificate of Participation
                </p>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-ink/80 dark:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => setPreviewCert(cert)}
                  className="p-3 bg-white dark:bg-neutral-800 rounded-full hover:scale-110 transition-transform"
                  title="Preview"
                >
                  <Eye className="w-5 h-5 text-ink dark:text-white" />
                </button>
                <button
                  onClick={() => handleDownload(cert)}
                  className="p-3 bg-primary rounded-full hover:scale-110 transition-transform"
                  title="Download"
                >
                  <Download className="w-5 h-5 text-ink" />
                </button>
              </div>
            </div>

            {/* Certificate Info */}
            <div className="p-4">
              <h3 className="font-bold text-ink dark:text-white truncate mb-1">
                {cert.event?.title || "Event Certificate"}
              </h3>
              <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                {cert.event?.club && (
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {cert.event.club.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setPreviewCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b dark:border-neutral-700">
                <div>
                  <h3 className="font-bold text-lg dark:text-white">
                    {previewCert.event?.title || "Certificate"}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Issued on {new Date(previewCert.issuedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(previewCert)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary border-2 border-ink font-bold text-sm shadow-neo-sm hover:shadow-neo transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => setPreviewCert(null)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 dark:text-white" />
                  </button>
                </div>
              </div>

              {/* Certificate Preview */}
              <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                {previewCert.fileUrl ? (
                  <iframe
                    src={previewCert.fileUrl}
                    className="w-full h-[600px] border-2 border-neutral-200 dark:border-neutral-700 rounded-lg"
                    title="Certificate Preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <div className="text-center">
                      <Award className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
                      <p className="text-neutral-500 dark:text-neutral-400">
                        Certificate preview not available
                      </p>
                      <Link
                        href={`/events/${previewCert.eventId}`}
                        className="inline-flex items-center gap-1 mt-4 text-primary hover:underline"
                      >
                        View Event <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
