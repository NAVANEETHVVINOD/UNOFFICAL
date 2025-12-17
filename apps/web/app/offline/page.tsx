"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon */}
        <motion.div
          className="w-24 h-24 mx-auto mb-8 bg-neutral-100 border-2 border-ink rounded-2xl flex items-center justify-center shadow-neo"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <WifiOff className="w-12 h-12 text-ink" />
        </motion.div>

        {/* Title */}
        <h1 className="font-display text-3xl font-bold text-ink mb-4">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-ink-light mb-8 leading-relaxed">
          It looks like you've lost your internet connection. 
          Check your connection and try again.
        </p>

        {/* Retry Button */}
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary border-2 border-ink rounded-lg shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all font-bold"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>

        {/* Footer */}
        <p className="mt-12 text-xs text-neutral-400 font-mono uppercase">
          LINKER • The Campus Collective
        </p>
      </motion.div>
    </div>
  );
}
