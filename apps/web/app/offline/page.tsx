"use client";

import { WifiOff, RefreshCw, Wifi } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <motion.div
        className="text-center z-10 max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className={`w-24 h-24 mx-auto mb-6 border-4 border-ink rounded-full flex items-center justify-center ${
            isOnline ? 'bg-green-100' : 'bg-neutral-100'
          }`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isOnline ? (
            <Wifi className="w-12 h-12 text-green-500" />
          ) : (
            <WifiOff className="w-12 h-12 text-neutral-400" />
          )}
        </motion.div>

        <h1 className="font-display text-3xl font-bold text-ink mb-4">
          {isOnline ? "You're Back Online!" : "You're Offline"}
        </h1>
        
        <p className="text-neutral-600 mb-4">
          {isOnline 
            ? "Your connection has been restored. Tap below to continue."
            : "It looks like you've lost your internet connection. Check your network and try again."
          }
        </p>

        {/* Connection Status Indicator */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${
          isOnline 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
          {isOnline ? 'Connected' : 'No Connection'}
        </div>

        <div className="block">
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary border-2 border-ink rounded-xl font-bold shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            {isOnline ? 'Continue to LINKER' : 'Try Again'}
          </button>
        </div>

        <p className="mt-8 text-sm text-neutral-400 font-mono">
          LINKER • The Campus Collective
        </p>
      </motion.div>
    </div>
  );
}
