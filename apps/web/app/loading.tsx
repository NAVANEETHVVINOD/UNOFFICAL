"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft gradient circles */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-coral/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <div className="text-center z-10">
        {/* Logo animation */}
        <motion.div
          className="relative w-28 h-28 mx-auto mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-4 border-ink/20 rounded-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner card with logo */}
          <motion.div
            className="absolute inset-2 bg-gradient-to-br from-primary via-yellow-400 to-primary rounded-2xl border-3 border-ink shadow-neo flex items-center justify-center"
            animate={{
              boxShadow: [
                "4px 4px 0px 0px rgba(0,0,0,1)",
                "6px 6px 0px 0px rgba(0,0,0,1)",
                "4px 4px 0px 0px rgba(0,0,0,1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span
              className="font-display text-4xl font-black text-ink"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              L
            </motion.span>
          </motion.div>

          {/* Accent dot */}
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-ink rounded-full"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-1 bg-primary rounded-full" />
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-2xl font-black tracking-wider text-ink mb-4">
            LINKER
          </h2>
          
          {/* Loading bar */}
          <div className="w-40 h-1.5 bg-ink/10 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent-coral to-primary rounded-full"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: '60%' }}
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="font-mono text-xs text-neutral-400 mt-6 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          The Campus Collective
        </motion.p>
      </div>
    </div>
  );
}
