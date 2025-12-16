"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { usePathname } from "next/navigation";
import { pageVariants, containerVariants, itemVariants } from "../../lib/animations";

// Page transition wrapper with AnimatePresence
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// Animated page wrapper that handles route changes
export function AnimatedPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered list container
export function StaggeredList({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered list item
export function StaggeredItem({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// Fade in on scroll using intersection observer
export function FadeInOnScroll({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale on hover wrapper
export function ScaleOnHover({ 
  children, 
  scale = 1.02,
  className = "" 
}: { 
  children: React.ReactNode;
  scale?: number;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
