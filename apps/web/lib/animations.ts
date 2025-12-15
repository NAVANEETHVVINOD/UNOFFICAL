/**
 * Framer Motion Animation Variants Library
 * Centralized animation definitions for consistent animations across the app
 */

import { Variants, Transition } from "framer-motion";

// ============================================
// TRANSITIONS
// ============================================

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 24,
};

export const smoothTransition: Transition = {
  duration: 0.4,
  ease: "easeOut",
};

export const quickTransition: Transition = {
  duration: 0.2,
  ease: "easeInOut",
};

// ============================================
// PAGE TRANSITIONS
// ============================================

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

export const slideInFromRight: Variants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0, transition: smoothTransition },
  exit: { opacity: 0, x: -50, transition: quickTransition },
};

export const slideInFromLeft: Variants = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0, transition: smoothTransition },
  exit: { opacity: 0, x: 50, transition: quickTransition },
};

// ============================================
// STAGGERED LIST ANIMATIONS
// ============================================

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const fastContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const feedItemVariants: Variants = {
  hidden: { opacity: 0, y: 30, rotate: -1 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// ============================================
// CARD ANIMATIONS
// ============================================

export const cardHoverVariants: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
    boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
  },
  hover: {
    scale: 1.02,
    rotate: -0.5,
    boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
  tap: { scale: 0.98 },
};

export const cardTiltVariants: Variants = {
  rest: { rotate: 0 },
  hover: {
    rotate: [-1, 1, -0.5, 0.5, 0],
    transition: { duration: 0.5 },
  },
};

export const newspaperCardVariants: Variants = {
  hidden: { opacity: 0, y: 20, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  hover: {
    y: -4,
    boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
};

// ============================================
// BUTTON & INTERACTIVE ANIMATIONS
// ============================================

export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 17 } },
  tap: { scale: 0.95 },
};

export const iconButtonVariants: Variants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.1, rotate: 5, transition: { type: "spring", stiffness: 400, damping: 17 } },
  tap: { scale: 0.9 },
};

// ============================================
// MICRO-INTERACTIONS
// ============================================

export const likeVariants: Variants = {
  unliked: { scale: 1 },
  liked: {
    scale: [1, 1.4, 1],
    transition: { duration: 0.3, times: [0, 0.5, 1] },
  },
};

export const heartPopVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: { duration: 0.4, times: [0, 0.6, 1] },
  },
};

export const bookmarkSlideVariants: Variants = {
  unsaved: { y: 0 },
  saved: {
    y: [0, -8, 0],
    transition: { duration: 0.3, times: [0, 0.5, 1] },
  },
};

export const shareRippleVariants: Variants = {
  initial: { scale: 0, opacity: 0.5 },
  animate: {
    scale: 2,
    opacity: 0,
    transition: { duration: 0.5 },
  },
};

// ============================================
// MODAL & OVERLAY ANIMATIONS
// ============================================

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

export const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15 } },
};

export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { x: "100%", transition: { duration: 0.2 } },
};

// ============================================
// SKELETON & LOADING ANIMATIONS
// ============================================

export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
  },
};

export const pulseVariants: Variants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};

export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" },
  },
};

// ============================================
// DECORATIVE & FLOATING ANIMATIONS
// ============================================

export const floatVariants: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};

export const wiggleVariants: Variants = {
  animate: {
    rotate: [-2, 2, -2],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

export const bounceVariants: Variants = {
  animate: {
    y: [0, -5, 0],
    transition: { duration: 0.6, repeat: Infinity, ease: "easeOut" },
  },
};

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

export const scrollRevealVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const scrollScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scrollSlideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const scrollSlideRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ============================================
// NOTIFICATION ANIMATIONS
// ============================================

export const notificationVariants: Variants = {
  initial: { opacity: 0, x: 100, scale: 0.9 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

export const badgePulseVariants: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    transition: { duration: 0.5, repeat: 2 },
  },
};

// ============================================
// TOOLTIP ANIMATIONS
// ============================================

export const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 5, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15 },
  },
  exit: { opacity: 0, y: 5, scale: 0.95, transition: { duration: 0.1 } },
};
