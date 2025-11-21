'use client';
import { motion } from 'framer-motion';
import React from 'react';

export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, rotate: -1, y: 6 }}
            animate={{ opacity: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, rotate: 1, y: -6 }}
            transition={{ duration: 0.45 }}
        >
            {children}
        </motion.div>
    );
}
