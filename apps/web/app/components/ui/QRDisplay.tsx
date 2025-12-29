"use client";

import { NewspaperCard } from "./NewspaperUI";
import { X, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface QRDisplayProps {
  qrCodeUrl: string;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  showDownload?: boolean;
  showShare?: boolean;
}

export default function QRDisplay({ 
  qrCodeUrl, 
  onClose,
  title = "YOUR QR CODE",
  subtitle = "Let others scan to connect",
  showDownload = true,
  showShare = true,
}: QRDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "my-linker-qr.png";
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Fetch the QR code image and convert to blob for sharing
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], "my-linker-qr.png", { type: "image/png" });
        
        await navigator.share({
          title: "My Linker QR Code",
          text: "Scan this QR code to connect with me on Linker!",
          files: [file],
        });
      } catch (error) {
        // Fallback to sharing just the text
        try {
          await navigator.share({
            title: "Connect with me on Linker",
            text: "Scan my QR code to connect with me on Linker!",
          });
        } catch {
          // User cancelled or share failed
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <NewspaperCard className="w-full max-w-sm p-8 relative">
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 border-2 border-black rounded-full text-white font-bold flex items-center justify-center hover:scale-110 transition-transform z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-3xl font-black font-display mb-2">{title}</h2>
            <p className="font-mono text-sm text-gray-500 mb-6">
              {subtitle}
            </p>

            <div className="bg-white p-4 border-4 border-black inline-block rounded-lg">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-48 h-48"
                loading="eager"
              />
            </div>

            {/* Action Buttons */}
            {(showDownload || showShare) && (
              <div className="flex justify-center gap-3 mt-6">
                {showDownload && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-ink text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </button>
                )}
                {showShare && typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/80 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                )}
              </div>
            )}

            <p className="mt-6 font-bold text-xs uppercase tracking-widest text-gray-400">
              Scan to connect on Linker
            </p>
          </div>
        </NewspaperCard>
      </motion.div>
    </div>
  );
}
