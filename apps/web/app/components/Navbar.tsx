"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { Bell, User, Search, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TiltedTicker from "./ui/TiltedTicker";
import { dropdownVariants, iconButtonVariants, badgePulseVariants } from "../../lib/animations";

// Mock notifications - will be replaced with real data from NotificationContext
const mockNotifications = [
    { id: "1", type: "like", message: "Sarah liked your post about React Hooks", time: "2m ago", read: false },
    { id: "2", type: "comment", message: "Alex commented on your marketplace listing", time: "15m ago", read: false },
    { id: "3", type: "event", message: "Tech Talk: AI in 2025 starts in 1 hour", time: "1h ago", read: true },
];

export default function Navbar() {
    const { user, isAuthenticated } = useAuth();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState(mockNotifications);
    const notificationRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <header className="sticky top-0 z-50 bg-paper flex flex-col relative shadow-neo-lg transition-all">
            {/* Top Bar */}
            <div className="h-16 flex items-center justify-between px-4 lg:px-8 relative z-20 bg-paper border-b-2 border-black">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <motion.div
                        className="w-10 h-10 bg-accent-yellow border-2 border-black flex items-center justify-center font-black text-xl shadow-neo-sm"
                        whileHover={{ rotate: 12, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        L
                    </motion.div>
                    <span className="font-display font-black text-2xl tracking-tight hidden md:block">
                        LINKER
                    </span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Search Button (Mobile) */}
                    <motion.button
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                        variants={iconButtonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Search className="w-5 h-5" />
                    </motion.button>

                    {/* Notifications */}
                    <div className="relative" ref={notificationRef}>
                        <motion.button
                            className="relative p-2 hover:bg-yellow-50 rounded-full transition-colors"
                            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                            variants={iconButtonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            aria-label="Notifications"
                        >
                            <Bell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <motion.span
                                    className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                                    variants={badgePulseVariants}
                                    animate="animate"
                                >
                                    {unreadCount}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Notification Dropdown */}
                        <AnimatePresence>
                            {isNotificationOpen && (
                                <motion.div
                                    className="absolute right-0 top-full mt-2 w-80 bg-white border-2 border-black shadow-neo-lg z-50 overflow-hidden"
                                    variants={dropdownVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <div className="p-3 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                                        <h4 className="font-bold font-display uppercase text-sm">Notifications</h4>
                                        {unreadCount > 0 && (
                                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                                                {unreadCount} New
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="max-h-72 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-gray-400">
                                                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        ) : (
                                            notifications.map((notification) => (
                                                <motion.div
                                                    key={notification.id}
                                                    className={`p-3 border-b border-gray-100 hover:bg-yellow-50/50 cursor-pointer flex gap-3 ${
                                                        !notification.read ? "bg-blue-50/30" : ""
                                                    }`}
                                                    onClick={() => markAsRead(notification.id)}
                                                    whileHover={{ x: 4 }}
                                                >
                                                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                                                        notification.read ? "bg-gray-300" : "bg-accent-blue"
                                                    }`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm leading-tight line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 font-mono">
                                                            {notification.time}
                                                        </span>
                                                    </div>
                                                    {!notification.read && (
                                                        <button
                                                            className="p-1 hover:bg-gray-200 rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                        >
                                                            <Check className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>

                                    {notifications.length > 0 && (
                                        <button
                                            className="w-full p-2 text-center border-t-2 border-black bg-gray-50 hover:bg-gray-100 transition-colors"
                                            onClick={markAllAsRead}
                                        >
                                            <span className="text-xs font-bold uppercase tracking-wider">
                                                Mark all as read
                                            </span>
                                        </button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile */}
                    <Link href="/profile">
                        <motion.div
                            className="w-10 h-10 bg-gray-200 rounded-full border-2 border-black overflow-hidden cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {user?.profile?.avatarUrl ? (
                                <img
                                    src={user.profile.avatarUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-accent-blue/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-black/50" />
                                </div>
                            )}
                        </motion.div>
                    </Link>
                </div>
            </div>

            {/* Tilted Ticker */}
            <TiltedTicker />
        </header>
    );
}

