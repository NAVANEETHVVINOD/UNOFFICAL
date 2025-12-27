"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import NavBox, { NavBoxTab } from "../ui/NavBox";
import BottomNav from "../ui/BottomNav";

export interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showNavBox?: boolean;
  navBoxTabs?: NavBoxTab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  navBoxSticky?: boolean;
  showBottomNav?: boolean;
  headerRight?: ReactNode;
  className?: string;
  contentClassName?: string;
  animate?: boolean;
}

/**
 * PageLayout - Standard page wrapper component
 * 
 * Features:
 * - Standard header with optional back button
 * - NavBox integration for tab navigation
 * - BottomNav for mobile
 * - Framer Motion page transitions
 * - Consistent padding and max-width
 * 
 * @example
 * <PageLayout
 *   title="Settings"
 *   showBackButton
 *   showNavBox
 *   navBoxTabs={settingsTabs}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   navBoxSticky
 * >
 *   <SettingsContent />
 * </PageLayout>
 */
export default function PageLayout({
  children,
  title,
  showBackButton = false,
  onBackClick,
  showNavBox = false,
  navBoxTabs = [],
  activeTab = "",
  onTabChange,
  navBoxSticky = true,
  showBottomNav = true,
  headerRight,
  className = "",
  contentClassName = "",
  animate = true,
}: PageLayoutProps) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "easeInOut" as const,
    duration: 0.2,
  };

  const content = (
    <div className={`min-h-screen bg-neutral-100 dark:bg-[#121212] flex flex-col pt-16 md:pt-20 ${className}`}>
      {/* Header */}
      {(showBackButton || title || headerRight) && (
        <div className="max-w-3xl mx-auto w-full px-4 mb-4">
          <div className="flex justify-between items-center py-2">
            {showBackButton ? (
              <button
                onClick={handleBackClick}
                className="text-sm font-bold font-mono hover:text-primary flex items-center gap-1 min-h-[44px] min-w-[44px] -ml-2 px-2"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">BACK</span>
              </button>
            ) : (
              <div />
            )}
            
            {title && (
              <h1 className="font-display text-xl font-bold text-ink dark:text-white absolute left-1/2 -translate-x-1/2">
                {title}
              </h1>
            )}
            
            {headerRight ? (
              <div className="flex items-center gap-2">{headerRight}</div>
            ) : (
              <div />
            )}
          </div>
        </div>
      )}

      {/* NavBox */}
      {showNavBox && navBoxTabs.length > 0 && onTabChange && (
        <NavBox
          tabs={navBoxTabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          sticky={navBoxSticky}
          className="mb-6"
        />
      )}

      {/* Main Content */}
      <main className={`flex-1 max-w-3xl w-full mx-auto px-4 pb-20 ${contentClassName}`}>
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      {showBottomNav && <BottomNav />}
    </div>
  );

  if (!animate) {
    return content;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page-layout"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * PageHeader - Standalone header component for custom layouts
 */
export function PageHeader({
  title,
  showBackButton = false,
  onBackClick,
  headerRight,
}: Pick<PageLayoutProps, 'title' | 'showBackButton' | 'onBackClick' | 'headerRight'>) {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 mb-4">
      <div className="flex justify-between items-center py-2 relative">
        {showBackButton ? (
          <button
            onClick={handleBackClick}
            className="text-sm font-bold font-mono hover:text-primary flex items-center gap-1 min-h-[44px] min-w-[44px] -ml-2 px-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">BACK</span>
          </button>
        ) : (
          <div />
        )}
        
        {title && (
          <h1 className="font-display text-xl font-bold text-ink dark:text-white absolute left-1/2 -translate-x-1/2">
            {title}
          </h1>
        )}
        
        {headerRight ? (
          <div className="flex items-center gap-2">{headerRight}</div>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
