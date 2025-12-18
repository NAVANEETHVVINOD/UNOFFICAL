"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper overflow-hidden">
      {/* Animated background with colored dots */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary yellow dots */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, #FFEB3B 3px, transparent 3px)`,
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '25px 25px'],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        {/* Secondary coral dots */}
        <motion.div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #FF6B6B 2px, transparent 2px)`,
            backgroundSize: '80px 80px',
            backgroundPosition: '40px 40px',
          }}
          animate={{
            backgroundPosition: ['40px 40px', '0px 0px'],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        {/* Blue accent dots */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, #4ECDC4 2px, transparent 2px)`,
            backgroundSize: '60px 60px',
            backgroundPosition: '30px 0px',
          }}
          animate={{
            backgroundPosition: ['30px 0px', '0px 30px'],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/80 via-transparent to-paper/80" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-16 left-16 w-20 h-20 bg-primary/30 rounded-2xl border-2 border-ink/10"
        animate={{
          y: [0, -25, 0],
          rotate: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-24 right-16 w-16 h-16 bg-accent-coral/30 rounded-xl border-2 border-ink/10"
        animate={{
          y: [0, 20, 0],
          rotate: [45, 90, 45],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/4 right-1/4 w-10 h-10 bg-accent-blue/30 rounded-full border-2 border-ink/10"
        animate={{
          x: [0, 15, 0],
          y: [0, -15, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-accent-mint/40 rounded-lg border-2 border-ink/10"
        animate={{
          x: [0, -10, 0],
          y: [0, 10, 0],
          rotate: [0, -15, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main content */}
      <div className="text-center z-10">
        {/* Logo animation */}
        <motion.div
          className="relative w-32 h-32 mx-auto mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 border-4 border-ink rounded-3xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Secondary ring */}
          <motion.div
            className="absolute inset-2 border-2 border-primary/50 rounded-2xl"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner card with logo */}
          <motion.div
            className="absolute inset-4 bg-gradient-to-br from-primary via-primary to-yellow-400 rounded-xl border-3 border-ink shadow-neo flex items-center justify-center"
            animate={{
              boxShadow: [
                "4px 4px 0px 0px rgba(0,0,0,1)",
                "8px 8px 0px 0px rgba(0,0,0,1)",
                "4px 4px 0px 0px rgba(0,0,0,1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.span
              className="font-display text-5xl font-black text-ink"
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              L
            </motion.span>
          </motion.div>

          {/* Decorative orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-ink rounded-full"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [
                  Math.cos((i * Math.PI) / 2) * 70,
                  Math.cos((i * Math.PI) / 2 + Math.PI / 2) * 70,
                  Math.cos((i * Math.PI) / 2 + Math.PI) * 70,
                  Math.cos((i * Math.PI) / 2 + (3 * Math.PI) / 2) * 70,
                  Math.cos((i * Math.PI) / 2) * 70,
                ],
                y: [
                  Math.sin((i * Math.PI) / 2) * 70,
                  Math.sin((i * Math.PI) / 2 + Math.PI / 2) * 70,
                  Math.sin((i * Math.PI) / 2 + Math.PI) * 70,
                  Math.sin((i * Math.PI) / 2 + (3 * Math.PI) / 2) * 70,
                  Math.sin((i * Math.PI) / 2) * 70,
                ],
                scale: [1, 1.3, 1, 0.7, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.25,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Loading text with typewriter effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2
            className="font-display text-3xl font-black tracking-widest text-ink mb-3"
            animate={{ 
              opacity: [1, 0.6, 1],
              letterSpacing: ['0.1em', '0.15em', '0.1em'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            LINKER
          </motion.h2>
          
          {/* Animated loading bar */}
          <div className="w-48 h-2 bg-ink/10 rounded-full mx-auto mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent-coral to-primary rounded-full"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: '50%' }}
            />
          </div>
          
          {/* Animated loading dots */}
          <div className="flex items-center justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-ink rounded-full"
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Tagline with fade */}
        <motion.p
          className="font-mono text-sm text-neutral-500 mt-6 uppercase tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1] }}
          transition={{ delay: 0.8, duration: 2, repeat: Infinity }}
        >
          The Campus Collective
        </motion.p>
      </div>
    </div>
  );
}