"use client";

import { motion } from "framer-motion";

export const PaperclipDoodle = () => (
  <motion.svg
    width="48"
    height="64"
    viewBox="0 0 48 64"
    className="absolute -right-4 bottom-1/4"
    animate={{
      x: [0, -10, 0],
      rotate: [0, -5, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M40 0C31.2 0 24 7.2 24 16v32c0 4.4 3.6 8 8 8s8-3.6 8-8V16c0-2.2-1.8-4-4-4s-4 1.8-4 4v24"
      stroke="var(--sky-deep)"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </motion.svg>
);

export const StickNoteDoodle = () => (
  <motion.div
    className="sticky-note"
    animate={{
      rotate: [2, -1, 2],
      y: [0, -5, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const StarDoodle = () => (
  <motion.svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    animate={{
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M16 0L20 12L32 16L20 20L16 32L12 20L0 16L12 12L16 0Z"
      fill="var(--sunshine-yellow)"
    />
  </motion.svg>
);

export const NotebookDoodles = () => (
  <motion.div
    className="fixed inset-0 pointer-events-none z-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.1 }}
    transition={{ duration: 1 }}
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M10 10h10v10H10zM30 10h10v10H30zM50 10h10v10H50zM10 30h10v10H10zM30 30h10v10H30z' stroke='%2387CEEB' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
);

export const PenDoodle = () => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="absolute right-2 top-2"
    animate={{
      rotate: [0, 10, 0],
      x: [0, 5, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83 3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75L3 17.25z"
      stroke="var(--color-ink)"
      strokeWidth="2"
      fill="none"
    />
  </motion.svg>
);
