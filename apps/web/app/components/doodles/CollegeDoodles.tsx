"use client";

import { motion } from "framer-motion";

// Individual Doodles
export const BookDoodle = ({ className = "" }) => (
  <motion.svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    whileHover={{ scale: 1.1, rotate: 5 }}
    animate={{
      y: [0, -10, 0],
      rotate: [0, -2, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M12 8h40v48H12c-2.2 0-4-1.8-4-4V12c0-2.2 1.8-4 4-4z"
      stroke="var(--sky-deep)"
      strokeWidth="2"
      fill="white"
      className="drop-shadow-sm"
    />
    <path
      d="M16 16h32M16 24h32M16 32h24"
      stroke="var(--sky-deep)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

export const PencilDoodle = ({ className = "w-8 h-8" }) => (
  <motion.svg
    width="64"
    height="64"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    drag
    dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
    whileDrag={{ scale: 1.2, cursor: "grabbing" }}
    animate={{
      rotate: [0, 360],
    }}
    transition={{
      rotate: {
        duration: 25,
        repeat: Infinity,
        ease: "linear",
      },
    }}
  >
    <path
      d="M16 48L48 16l4-4 4 4-4 4L20 52l-8-4z"
      fill="var(--sunshine-yellow)"
      stroke="var(--color-ink)"
      strokeWidth="2"
      className="drop-shadow-md"
    />
    <path d="M16 48l-4 8 8-4-4-4z" fill="var(--color-ink)" />
    <path
      d="M52 12l4 4-4 4-4-4 4-4z"
      fill="var(--sunshine-orange)"
      stroke="var(--color-ink)"
      strokeWidth="2"
    />
  </motion.svg>
);

export const CalculatorDoodle = ({ className = "" }) => (
  <motion.svg
    width="48"
    height="64"
    viewBox="0 0 48 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    whileHover={{ scale: 1.1 }}
    animate={{
      y: [0, 8, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <rect
      x="8"
      y="8"
      width="32"
      height="48"
      rx="4"
      fill="white"
      stroke="var(--sky-deep)"
      strokeWidth="2"
      className="drop-shadow-sm"
    />
    <rect x="12" y="12" width="24" height="12" fill="var(--sky-light)" />
    <circle cx="16" cy="32" r="3" fill="var(--sunshine-orange)" />
    <circle cx="24" cy="32" r="3" fill="var(--sunshine-orange)" />
    <circle cx="32" cy="32" r="3" fill="var(--sunshine-orange)" />
    <circle cx="16" cy="40" r="3" fill="var(--sunshine-orange)" />
    <circle cx="24" cy="40" r="3" fill="var(--sunshine-orange)" />
    <circle cx="32" cy="40" r="3" fill="var(--sunshine-orange)" />
    <circle cx="16" cy="48" r="3" fill="var(--sunshine-orange)" />
    <circle cx="24" cy="48" r="3" fill="var(--sunshine-orange)" />
    <circle cx="32" cy="48" r="3" fill="var(--sunshine-orange)" />
  </motion.svg>
);

export const CoffeeDoodle = ({ className = "" }) => (
  <motion.svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    whileHover={{ scale: 1.1, rotate: -5 }}
    animate={{
      rotate: [0, 5, 0],
      y: [0, -5, 0],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M12 16h24v20H12z"
      fill="white"
      stroke="var(--color-ink)"
      strokeWidth="2"
      className="drop-shadow-sm"
    />
    <path d="M10 36h28v4H10z" fill="var(--color-ink)" />
    <path
      d="M36 20h4v12h-4c-2.2 0-4-2.7-4-6s1.8-6 4-6z"
      fill="white"
      stroke="var(--color-ink)"
      strokeWidth="2"
    />
    <motion.path
      d="M16 8s0-4 8-4 8 4 8 4"
      stroke="var(--sunshine-orange)"
      strokeWidth="2"
      strokeLinecap="round"
      animate={{
        d: [
          "M16 8s0-4 8-4 8 4 8 4",
          "M16 6s0-4 8-4 8 4 8 4",
          "M16 8s0-4 8-4 8 4 8 4",
        ],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.svg>
);

export const LaptopDoodle = ({ className = "" }) => (
  <motion.svg
    width="64"
    height="48"
    viewBox="0 0 64 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    whileHover={{
      scale: 1.1,
      transition: { duration: 0.2 },
    }}
    animate={{
      y: [0, -6, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M8 8h48v24H8z"
      fill="white"
      stroke="var(--sky-deep)"
      strokeWidth="2"
      className="drop-shadow-sm"
    />
    <path d="M4 32h56v8H4z" fill="var(--sky-deep)" />
    <rect x="12" y="12" width="40" height="16" fill="var(--sky-light)" />
    <motion.circle
      cx="32"
      cy="36"
      r="2"
      fill="var(--sunshine-yellow)"
      animate={{
        opacity: [1, 0.5, 1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  </motion.svg>
);

export const BackpackDoodle = ({ className = "" }) => (
  <motion.svg
    width="48"
    height="64"
    viewBox="0 0 48 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute ${className}`}
    whileHover={{ scale: 1.1 }}
    animate={{
      rotate: [0, -3, 0],
      y: [0, 4, 0],
    }}
    transition={{
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M12 16h24v40H12z"
      fill="var(--sunshine-red)"
      stroke="var(--color-ink)"
      strokeWidth="2"
      className="drop-shadow-sm"
    />
    <path
      d="M16 8s0-4 8-4 8 4 8 4v8H16V8z"
      fill="var(--sunshine-orange)"
      stroke="var(--color-ink)"
      strokeWidth="2"
    />
    <path d="M12 36h24v4H12z" fill="var(--color-ink)" />
    <circle cx="24" cy="28" r="4" fill="white" />
  </motion.svg>
);

export const HeartDoodle = ({ className = "w-8 h-8" }) => (
  <motion.svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.2 }}
    animate={{
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M24 42C24 42 40 34 40 22C40 16.4772 35.5228 12 30 12C26.8395 12 24.0529 13.5649 22.3489 15.9995C20.645 13.5649 17.8584 12 14.6979 12C9.17513 12 4.69792 16.4772 4.69792 22C4.69792 34 20.6979 42 20.6979 42"
      stroke="var(--sunshine-red)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="var(--sunshine-red)"
      fillOpacity="0.2"
    />
  </motion.svg>
);

export const StarDoodle = ({ className = "w-8 h-8" }) => (
  <motion.svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.2 }}
    animate={{
      rotate: [0, 360],
      scale: [1, 1.2, 1],
    }}
    transition={{
      rotate: {
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      },
      scale: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }}
  >
    <path
      d="M24 4L29.2533 19.8192H45.7975L32.2721 29.3616L37.5254 45.1808L24 35.6384L10.4746 45.1808L15.7279 29.3616L2.20254 19.8192H18.7467L24 4Z"
      stroke="var(--sunshine-yellow)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="var(--sunshine-yellow)"
      fillOpacity="0.2"
    />
  </motion.svg>
);

export const RobotDoodle = ({ className = "w-8 h-8" }) => (
  <motion.svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1 }}
    animate={{
      y: [0, -3, 0],
      rotate: [0, 5, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <rect
      x="8"
      y="16"
      width="32"
      height="24"
      rx="2"
      stroke="var(--sky-deep)"
      strokeWidth="2"
      fill="white"
    />
    <circle
      cx="16"
      cy="28"
      r="4"
      stroke="var(--sky-deep)"
      strokeWidth="2"
      fill="white"
    />
    <circle
      cx="32"
      cy="28"
      r="4"
      stroke="var(--sky-deep)"
      strokeWidth="2"
      fill="white"
    />
    <path
      d="M24 8L24 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M8 36H40"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

export const BulbDoodle = ({ className = "w-8 h-8" }) => (
  <motion.svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1 }}
    animate={{
      opacity: [1, 0.6, 1],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M24 36C31.732 36 38 29.732 38 22C38 14.268 31.732 8 24 8C16.268 8 10 14.268 10 22C10 29.732 16.268 36 24 36Z"
      stroke="var(--sunshine-yellow)"
      strokeWidth="2"
      fill="var(--sunshine-yellow)"
      fillOpacity="0.2"
    />
    <path
      d="M24 36V44M18 44H30"
      stroke="var(--color-ink)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M24 4V8M36 24H40M8 24H12M34 14L37 11M14 34L11 37M34 34L37 37M14 14L11 11"
      stroke="var(--sunshine-orange)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </motion.svg>
);

export const SparklesDoodle = ({ className = "w-8 h-8" }) => (
  <motion.svg
    className={className}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1 }}
    animate={{
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    <path
      d="M24 4L26.4 16.8L36 12L29.6 24L40 28L26.4 31.2L36 36L24 44L12 36L21.6 31.2L8 28L18.4 24L12 12L21.6 16.8L24 4Z"
      stroke="var(--sunshine-yellow)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="white"
    />
  </motion.svg>
);

// Main Component to aggregate doodles
export const CollegeDoodles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <BookDoodle className="top-20 left-[10%] opacity-20" />
      <CalculatorDoodle className="top-40 right-[15%] opacity-20" />
      <CoffeeDoodle className="bottom-32 left-[20%] opacity-20" />
      <LaptopDoodle className="bottom-20 right-[10%] opacity-20" />
      <BackpackDoodle className="top-1/2 left-[5%] opacity-10" />

      {/* Floating small elements */}
      <PencilDoodle className="top-1/4 left-1/3 opacity-30 w-12 h-12" />
      <BulbDoodle className="top-1/3 right-1/4 opacity-30 w-10 h-10" />
      <StarDoodle className="bottom-1/3 left-1/4 opacity-30 w-8 h-8" />
      <HeartDoodle className="bottom-1/4 right-1/3 opacity-30 w-8 h-8" />
      <SparklesDoodle className="top-20 right-20 opacity-40 w-6 h-6" />
    </div>
  );
};
