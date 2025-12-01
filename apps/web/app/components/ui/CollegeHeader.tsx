"use client";

import { motion } from "framer-motion";
import { Badge, RetroButton } from "./NewspaperUI";
import Link from "next/link";
import Container from "./Container";

interface CollegeHeaderProps {
  slug: string;
  collegeName: string;
}

export default function CollegeHeader({
  slug,
  collegeName,
}: CollegeHeaderProps) {
  return (
    <div className="bg-black text-white pt-24 pb-12 relative overflow-hidden min-h-[400px] flex items-end">
      {/* Animated Background */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[url('/doodles/header-vangof.jpg')] bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      {/* Floating Shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-32 h-32 bg-accent-yellow rounded-full blur-3xl opacity-20"
      />
      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-10 w-48 h-48 bg-accent-pink rounded-full blur-3xl opacity-20"
      />

      <Container className="relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-end gap-8 mb-8">
          {/* Logo Card */}
          <motion.div
            initial={{ y: 50, opacity: 0, rotate: -10 }}
            animate={{ y: 0, opacity: 1, rotate: -3 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl border-4 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] overflow-hidden shrink-0"
          >
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${slug}`}
              alt={collegeName}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Text Content */}
          <div className="flex-1">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Badge className="bg-accent-yellow text-black mb-3 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                OFFICIAL_HUB
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-4 tracking-tight"
            >
              {collegeName}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-serif italic text-xl md:text-2xl text-gray-300 max-w-2xl"
            >
              "The place where dreams are debugged and coffee is compiled."
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-3"
          >
            <Link href="/dashboard">
              <RetroButton
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black backdrop-blur-sm"
              >
                ← Dashboard
              </RetroButton>
            </Link>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
