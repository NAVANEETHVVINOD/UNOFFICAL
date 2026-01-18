"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserType, USER_TYPE_CONFIGS } from "../../../lib/userTypes";
import { useUserType } from "../../context/UserTypeContext";

/**
 * UserTypeSelector Component
 * 
 * Displays 4 user type options during onboarding for UX personalization.
 * Each option shows an icon, label, and description.
 * 
 * Requirements: 1.2, 1.6, 13.1, 13.2
 */

interface UserTypeSelectorProps {
  onComplete?: () => void;
  className?: string;
}

export default function UserTypeSelector({ onComplete, className = "" }: UserTypeSelectorProps) {
  const { setUserType, isLoading } = useUserType();
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = async (type: UserType) => {
    setSelectedType(type);
    setIsSubmitting(true);

    try {
      await setUserType(type);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to set user type:", error);
      setIsSubmitting(false);
      // Reset selection on error
      setSelectedType(null);
    }
  };

  // Get all user type options (excluding College Admin per Requirement 12.1)
  const userTypeOptions = Object.values(UserType).map(type => ({
    type,
    config: USER_TYPE_CONFIGS[type],
  }));

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-dark-text mb-3">
          Who are you?
        </h2>
        <p className="text-ink-light dark:text-dark-text-muted text-base md:text-lg">
          Choose your role to personalize your LINKER experience
        </p>
      </motion.div>

      {/* User Type Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {userTypeOptions.map((option, index) => {
          const isSelected = selectedType === option.type;
          const isDisabled = isSubmitting && !isSelected;

          return (
            <motion.button
              key={option.type}
              onClick={() => !isSubmitting && handleSelect(option.type)}
              disabled={isDisabled}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={!isSubmitting ? { scale: 1.02, y: -4 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className={`
                relative p-6 rounded-card-lg border-2 transition-all
                ${
                  isSelected
                    ? "bg-primary border-ink shadow-neo-lg"
                    : "bg-paper dark:bg-dark-surface border-ink/20 dark:border-dark-border hover:border-ink dark:hover:border-primary hover:shadow-neo"
                }
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${isSubmitting && isSelected ? "animate-pulse" : ""}
              `}
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`
                    text-5xl md:text-6xl
                    ${isSelected ? "animate-bounce-subtle" : ""}
                  `}
                >
                  {option.config.icon}
                </div>
              </div>

              {/* Label */}
              <h3 className="font-display text-xl md:text-2xl font-bold text-ink dark:text-dark-text mb-2">
                {option.config.label}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-ink-light dark:text-dark-text-muted">
                {option.config.description}
              </p>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  className="absolute top-4 right-4 w-6 h-6 bg-ink dark:bg-primary rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <svg
                    className="w-4 h-4 text-primary dark:text-ink"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              {/* Loading Spinner */}
              {isSubmitting && isSelected && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-card-lg">
                  <div className="w-8 h-8 border-4 border-ink border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Helper Text */}
      <motion.p
        className="text-center text-xs md:text-sm text-ink-light dark:text-dark-text-subtle mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Don't worry, you can change this later in settings
      </motion.p>
    </div>
  );
}
