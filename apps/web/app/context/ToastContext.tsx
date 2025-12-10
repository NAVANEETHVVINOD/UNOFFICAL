"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a RetroToastProvider");
    }
    return context;
}

export function RetroToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <RetroToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function RetroToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const bgColors = {
        success: "bg-accent-green",
        error: "bg-accent-red",
        info: "bg-accent-yellow",
        warning: "bg-accent-pink",
    };

    const rotation = Math.random() * 4 - 2; // Random rotation between -2 and 2

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotate: 10 }}
            animate={{ opacity: 1, y: 0, rotate: rotation }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto w-72 p-4 shadow-neo border-card border-black ${bgColors[toast.type]} relative font-display text-black`}
            style={{ transformOrigin: "bottom right" }}
        >
            {/* Tape Effect */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/50 rotate-2"></div>

            <div className="flex justify-between items-start">
                <p className="font-bold text-sm leading-tight pr-4">{toast.message}</p>
                <button onClick={onDismiss} className="hover:scale-110 transition-transform">
                    <X className="w-4 h-4 text-black" />
                </button>
            </div>
            <div className="absolute bottom-1 right-2 text-[10px] opacity-60 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </motion.div>
    );
}
