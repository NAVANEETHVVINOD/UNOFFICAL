"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F2F2F2]">
      {/* Background Pattern - Smooth tilted grid */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #E0E0E0 25%, transparent 25%), 
              linear-gradient(-45deg, #E0E0E0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #E0E0E0 75%), 
              linear-gradient(-45deg, transparent 75%, #E0E0E0 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 0, 10px -10px, 0px 10px'
          }}
        />
      </div>

      <div className="relative text-center z-10">
        <motion.div
          className="w-20 h-20 mx-auto mb-8 bg-black border-2 border-black rounded-xl flex items-center justify-center shadow-2xl"
          initial={{ scale: 0.8, rotate: -10, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="font-display text-4xl font-black text-primary">L</span>
        </motion.div>

        <h2 className="font-display text-2xl font-bold tracking-tight text-ink mb-2">
          LINKER
        </h2>

        <div className="w-48 h-1 bg-neutral-200 rounded-full mx-auto overflow-hidden mt-6">
          <motion.div
            className="h-full bg-black rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}
