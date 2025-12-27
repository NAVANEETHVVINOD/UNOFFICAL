"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizes = {
    sm: { button: "p-1.5", icon: "w-4 h-4" },
    md: { button: "p-2", icon: "w-5 h-5" },
    lg: { button: "p-3", icon: "w-6 h-6" },
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        ${sizes[size].button}
        rounded-xl border-2 
        transition-all duration-300
        ${isDark 
          ? "bg-dark-surface border-primary text-primary hover:bg-primary/20" 
          : "bg-paper border-ink text-ink hover:bg-neutral-100"
        }
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: isDark ? 1 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {isDark ? (
          <Moon className={`${sizes[size].icon} fill-current`} />
        ) : (
          <Sun className={`${sizes[size].icon}`} />
        )}
      </motion.div>
      
      {/* Glow effect in dark mode */}
      {isDark && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-primary/20 blur-md -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
}

// Compact inline toggle for settings/navbar
export function ThemeToggleInline({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center h-8 w-14 rounded-full
        border-2 transition-all duration-300
        ${isDark 
          ? "bg-dark-elevated border-primary" 
          : "bg-neutral-200 border-ink"
        }
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        className={`
          absolute w-6 h-6 rounded-full flex items-center justify-center
          ${isDark ? "bg-primary text-dark-bg" : "bg-paper text-ink border border-ink"}
        `}
        animate={{
          x: isDark ? 26 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5" />
        ) : (
          <Sun className="w-3.5 h-3.5" />
        )}
      </motion.div>
    </button>
  );
}
