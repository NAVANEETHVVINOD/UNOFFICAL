"use client"

import { motion } from "framer-motion"

export const PaperclipDoodle = () => (
  <motion.svg
    width="48"
    height="64"
    viewBox="0 0 48 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -right-4 bottom-1/4"
    animate={{ 
      x: [0, -10, 0],
      rotate: [0, -5, 0]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <path
      d="M40 0C31.2 0 24 7.2 24 16v32c0 4.4 3.6 8 8 8s8-3.6 8-8V16c0-2.2-1.8-4-4-4s-4 1.8-4 4v24"
      stroke="#95A5A6"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </motion.svg>
)

export const PushpinDoodle = () => (
  <motion.svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute -left-4 top-1/2"
    animate={{ 
      x: [0, 10, 0],
      rotate: [0, 5, 0]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <path
      d="M24 4L44 24M24 44L4 24M24 4L4 24M44 24L24 44"
      stroke="#E74C3C"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="24" cy="24" r="4" fill="#E74C3C" />
  </motion.svg>
)

export const SparklesDoodle = () => (
  <motion.svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{ 
      scale: [1, 1.2, 1],
      rotate: [0, 180, 360]
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <path
      d="M16 0L20 12L32 16L20 20L16 32L12 20L0 16L12 12L16 0Z"
      fill="#FFD700"
    />
  </motion.svg>
)

export const NotebookDoodle = () => (
  <motion.div
    className="w-full h-full absolute inset-0 pointer-events-none z-0"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3Cpath d='M10 10h10v10H10zM30 10h10v10H30zM50 10h10v10H50zM10 30h10v10H10zM30 30h10v10H30zM50 30h10v10H50z' stroke='%2393B5C6' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
      opacity: 0.1
    }}
  />
)