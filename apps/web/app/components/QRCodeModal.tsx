"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, Camera, Share2, Download, Copy, Check, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import QRCode from "qrcode";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "my-qr" | "scan";

export default function QRCodeModal({ isOpen, onClose }: QRCodeModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("my-qr");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Generate QR code for current user
  useEffect(() => {
    if (isOpen && user?.id) {
      const profileUrl = `${window.location.origin}/profile/${user.id}`;
      QRCode.toDataURL(profileUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR generation failed:", err));
    }
  }, [isOpen, user?.id]);

  // Start camera for scanning
  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
      scanQRCode();
    } catch (err) {
      console.error("Camera access denied:", err);
      alert("Camera access is required to scan QR codes");
    }
  };

  // Stop camera
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setScanning(false);
  };

  // Scan QR code from video
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scan = () => {
      if (!scanning || !streamRef.current) return;

      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Use jsQR library if available, otherwise use BarcodeDetector API
        if ("BarcodeDetector" in window) {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ["qr_code"],
          });
          barcodeDetector
            .detect(canvas)
            .then((barcodes: any[]) => {
              if (barcodes.length > 0) {
                handleQRResult(barcodes[0].rawValue);
              }
            })
            .catch(console.error);
        }
      }

      requestAnimationFrame(scan);
    };

    scan();
  };

  // Handle scanned QR result
  const handleQRResult = (result: string) => {
    stopScanning();
    
    // Check if it's a valid profile URL
    const profileMatch = result.match(/\/profile\/([a-zA-Z0-9-]+)/);
    if (profileMatch) {
      window.location.href = result;
    } else {
      alert("Invalid QR code. Please scan a LINKER profile QR code.");
    }
  };

  // Copy profile link
  const copyProfileLink = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download QR code
  const downloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `linker-${user?.profile?.fullName || "profile"}-qr.png`;
    link.href = qrDataUrl;
    link.click();
  };

  // Share profile
  const shareProfile = async () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user?.profile?.fullName}'s LINKER Profile`,
          text: "Connect with me on LINKER!",
          url: profileUrl,
        });
      } catch (err) {
        copyProfileLink();
      }
    } else {
      copyProfileLink();
    }
  };

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      stopScanning();
      setActiveTab("my-qr");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-sm bg-white border-4 border-ink shadow-neo-lg rounded-2xl overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-ink bg-primary/10">
            <h2 className="font-display font-bold text-lg">LINKER Connect</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-ink/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b-2 border-ink">
            <button
              onClick={() => {
                setActiveTab("my-qr");
                stopScanning();
              }}
              className={`flex-1 py-3 px-4 font-bold text-sm transition-colors ${
                activeTab === "my-qr"
                  ? "bg-primary text-ink"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <QrCode className="w-4 h-4 inline-block mr-2" />
              My QR
            </button>
            <button
              onClick={() => setActiveTab("scan")}
              className={`flex-1 py-3 px-4 font-bold text-sm transition-colors border-l-2 border-ink ${
                activeTab === "scan"
                  ? "bg-primary text-ink"
                  : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Camera className="w-4 h-4 inline-block mr-2" />
              Scan
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "my-qr" ? (
              <div className="text-center">
                {/* User Info */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full border-2 border-ink overflow-hidden bg-neutral-100">
                    {user?.profile?.avatarUrl ? (
                      <img
                        src={user.profile.avatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{user?.profile?.fullName || "User"}</p>
                    <p className="text-sm text-neutral-500">
                      {user?.profile?.college?.name || "LINKER User"}
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-xl border-2 border-ink shadow-neo inline-block mb-4">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Profile QR Code" className="w-64 h-64" />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-neutral-100">
                      <div className="animate-spin w-8 h-8 border-4 border-ink border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>

                <p className="text-sm text-neutral-500 mb-4">
                  Scan this QR code to connect with me
                </p>

                {/* Actions */}
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={copyProfileLink}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium text-sm transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>
                  <button
                    onClick={downloadQR}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={shareProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 rounded-lg font-medium text-sm transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Scanner */}
                <div className="relative bg-black rounded-xl overflow-hidden mb-4 aspect-square">
                  {scanning ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      {/* Scan overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 border-4 border-primary rounded-2xl relative">
                          <motion.div
                            className="absolute left-0 right-0 h-1 bg-primary"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-8">
                      <Camera className="w-16 h-16 mb-4 opacity-50" />
                      <p className="text-sm opacity-70 mb-4">
                        Point your camera at a LINKER QR code
                      </p>
                      <button
                        onClick={startScanning}
                        className="px-6 py-3 bg-primary text-ink font-bold rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        Start Scanning
                      </button>
                    </div>
                  )}
                </div>

                {scanning && (
                  <button
                    onClick={stopScanning}
                    className="px-6 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg font-medium text-sm transition-colors"
                  >
                    Stop Scanning
                  </button>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}