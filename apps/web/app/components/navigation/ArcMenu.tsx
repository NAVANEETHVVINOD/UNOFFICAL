"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ArcMenu({ onCompose }: { onCompose: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const menuItems = [
        { icon: Calendar, label: "Events", href: "/events", color: "bg-accent-blue" },
        { icon: ShoppingBag, label: "Market", href: "/marketplace", color: "bg-accent-green" },
        { icon: User, label: "Profile", href: "/profile", color: "bg-accent-yellow" },
        // { icon: Plus, label: "Create", action: onCompose, color: "bg-black text-white" } // Compose is now central or handled separately?
        // User asked for 4 remaining options around Home.
        // Let's add 'Campus' as the 4th
        { icon: Home, label: "Campus", href: "/my-college", color: "bg-accent-pink" },
    ];

    // Radial flush positions (semi-circle above)
    // -60deg, -20deg, +20deg, +60deg (roughly)
    const positions = [
        { x: -70, y: -40 },
        { x: -30, y: -75 },
        { x: 30, y: -75 },
        { x: 70, y: -40 },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
                    />
                )}
            </AnimatePresence>

            <div className="relative z-10">
                {/* Fan Items */}
                <AnimatePresence>
                    {isOpen && menuItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                            animate={{
                                x: positions[i].x,
                                y: positions[i].y,
                                scale: 1,
                                opacity: 1
                            }}
                            exit={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                            transition={{ type: "spring", damping: 12, stiffness: 200, delay: i * 0.05 }}
                            className="absolute top-0 left-0 -ml-6 -mt-6" // Center origin
                        >
                            {item.href ? (
                                <Link href={item.href}>
                                    <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center shadow-neo-sm ${item.color}`}>
                                        <item.icon className="w-5 h-5 text-black" />
                                    </div>
                                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-black text-white px-1 rounded opacity-0 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                                        {item.label}
                                    </span>
                                </Link>
                            ) : (
                                <div className={`w-12 h-12 rounded-full border-2 border-black flex items-center justify-center shadow-neo-sm ${item.color}`}>
                                    <item.icon className="w-5 h-5 text-black" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Main Trigger Button */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(!isOpen)}
                    // onLongPress could be simulated with touch events, but click toggle is safer for web
                    className={`
                        w-16 h-16 rounded-full border-thick border-black flex items-center justify-center shadow-neo-lg relative
                        ${isOpen ? 'bg-red-500 rotate-45' : 'bg-black'}
                        transition-colors duration-300
                    `}
                >
                    {isOpen ? (
                        <X className="w-8 h-8 text-white" />
                    ) : (
                        <Home className="w-7 h-7 text-white" />
                    )}
                </motion.button>
            </div>
        </div>
    )
}
