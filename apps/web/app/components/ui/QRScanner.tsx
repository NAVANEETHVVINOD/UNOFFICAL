"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { RetroButton, NewspaperCard } from "./NewspaperUI";
import { Camera, X, RefreshCw, AlertTriangle } from "lucide-react";

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function QRScanner({ 
  onScan, 
  onClose, 
  title = "SCAN QR CODE",
  subtitle = "Point camera at a QR code"
}: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = useCallback(async () => {
    if (scannerRef.current) return;
    
    setIsInitializing(true);
    setError(null);
    
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      
      // Create scanner instance
      const html5QrCode = new Html5Qrcode("qr-scanner-element");
      scannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          // Stop scanner before calling onScan to prevent multiple scans
          stopScanner();
          onScan(decodedText);
        },
        () => {} // Ignore QR not found errors during scanning
      );
      
      setIsScanning(true);
      setIsInitializing(false);
    } catch (err: any) {
      console.error("Failed to start QR scanner:", err);
      setIsInitializing(false);
      
      if (err.message?.includes("Permission denied") || err.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (err.message?.includes("not found") || err.name === "NotFoundError") {
        setError("No camera found. Please ensure your device has a camera.");
      } else {
        setError("Failed to start camera. Please try again.");
      }
    }
  }, [onScan]);

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const handleRetry = useCallback(() => {
    stopScanner();
    setTimeout(() => startScanner(), 100);
  }, [stopScanner, startScanner]);

  // Start scanner on mount
  useEffect(() => {
    startScanner();
    
    return () => {
      stopScanner();
    };
  }, [startScanner, stopScanner]);

  const handleClose = () => {
    stopScanner();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <NewspaperCard className="w-full max-w-md p-4 relative">
        <button
          onClick={handleClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 border-2 border-black rounded-full text-white font-bold flex items-center justify-center hover:scale-110 transition-transform z-10"
          aria-label="Close scanner"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black font-display text-center mb-4">
          {title}
        </h2>

        <div 
          ref={containerRef}
          className="border-4 border-black rounded-lg overflow-hidden bg-black relative"
          style={{ minHeight: '300px' }}
        >
          {/* Scanner element */}
          <div id="qr-scanner-element" className="w-full" />
          
          {/* Initializing overlay */}
          {isInitializing && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
              <Camera className="w-12 h-12 text-gray-400 mb-4 animate-pulse" />
              <p className="text-white font-mono text-sm">Starting camera...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
              <p className="text-white font-mono text-sm text-center mb-4">{error}</p>
              <RetroButton
                onClick={handleRetry}
                className="bg-primary text-white border-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </RetroButton>
            </div>
          )}
        </div>

        <p className="text-center mt-4 font-mono text-sm text-gray-600">
          {subtitle}
        </p>
      </NewspaperCard>
    </div>
  );
}
