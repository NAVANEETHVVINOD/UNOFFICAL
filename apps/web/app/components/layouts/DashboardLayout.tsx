"use client";

import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
    children: ReactNode;
    leftSidebarContent?: ReactNode;
    rightSidebarContent?: ReactNode;
    showBackgroundPattern?: boolean;
}

export default function DashboardLayout({
    children,
    leftSidebarContent,
    rightSidebarContent,
    showBackgroundPattern = true,
}: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-paper dark:bg-dark-bg relative transition-colors duration-300">
            {/* Background Pattern */}
            {showBackgroundPattern && (
                <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
                    <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
                </div>
            )}

            {/* Fixed Header */}
            <Navbar />

            {/* Main Layout - with increased top padding for fixed navbar */}
            <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-6 pt-24 md:pt-36">
                <div className="flex gap-6 pt-4">

                    {/* LEFT SIDEBAR - Desktop Only */}
                    {leftSidebarContent && (
                        <motion.aside
                            className="hidden lg:block w-[280px] flex-shrink-0"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            <div className="sticky top-24 space-y-4">
                                {leftSidebarContent}
                            </div>
                        </motion.aside>
                    )}

                    {/* CENTER CONTENT */}
                    <motion.main
                        className="flex-1 min-w-0 pb-32 lg:pb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {children}
                    </motion.main>

                    {/* RIGHT SIDEBAR - Desktop Only */}
                    {rightSidebarContent && (
                        <motion.aside
                            className="hidden xl:block w-[280px] flex-shrink-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                        >
                            <div className="sticky top-24 space-y-4">
                                {rightSidebarContent}
                            </div>
                        </motion.aside>
                    )}
                </div>
            </div>
        </div>
    );
}
