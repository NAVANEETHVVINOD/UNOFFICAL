"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RetroButton } from "./ui/NewspaperUI";

export default function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-[1400px] mx-auto">
        <div className="h-16 flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-10 h-10 bg-primary border-2 border-ink flex items-center justify-center font-display font-black text-xl shadow-neo-sm rounded-lg text-ink group-hover:bg-ink group-hover:text-primary transition-colors duration-300"
              whileHover={{ rotate: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              L
            </motion.div>
            <span className="font-display font-black text-2xl tracking-tight text-ink">
              LINKER
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <motion.button
                className="px-4 py-2 font-bold text-sm text-ink hover:text-primary transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Login
              </motion.button>
            </Link>
            <Link href="/register">
              <RetroButton
                variant="secondary"
                className="px-5 py-2.5 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5"
              >
                Get Started
              </RetroButton>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
