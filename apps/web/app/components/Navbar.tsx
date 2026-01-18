"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useNotifications, formatNotificationTime, NOTIFICATION_ICONS } from "../context/NotificationContext";
import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, User, Search, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlobalSearch from "./GlobalSearch";
import QRCodeModal from "./QRCodeModal";

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const { filteredNotifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Handle notification click
  const handleNotificationClick = useCallback(async (notificationId: string, actionUrl?: string) => {
    await markAsRead(notificationId);
    setIsNotificationOpen(false);
    if (actionUrl) {
      router.push(actionUrl);
    }
  }, [markAsRead, router]);

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

  // Keyboard shortcut for search
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper dark:bg-[#121212] border-b-2 border-ink dark:border-[#333333]">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Navbar */}
        <div className="h-14 md:h-16 flex items-center justify-between px-3 md:px-4 lg:px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 md:gap-3 group">
            <motion.div
              className="w-9 h-9 md:w-10 md:h-10 bg-primary border-2 border-ink flex items-center justify-center font-display font-black text-lg md:text-xl shadow-neo-sm rounded-lg text-ink group-hover:bg-ink group-hover:text-primary transition-colors duration-300"
              whileHover={{ rotate: -6, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              L
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-display font-black text-2xl tracking-tight text-ink">
                LINKER
              </span>
              <span className="hidden md:inline text-xs text-neutral-500 ml-2 font-mono">
                beta
              </span>
            </div>
          </Link>

          {/* Center - Desktop Navigation (4 items) */}
          <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <Link
              href="/dashboard"
              className="text-sm font-bold text-ink dark:text-dark-text hover:text-primary dark:hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className="text-sm font-bold text-ink dark:text-dark-text hover:text-primary dark:hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              href="/messages"
              className="text-sm font-bold text-ink dark:text-dark-text hover:text-primary dark:hover:text-primary transition-colors"
            >
              Messages
            </Link>
            <Link
              href="/profile"
              className="text-sm font-bold text-ink dark:text-dark-text hover:text-primary dark:hover:text-primary transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* Right Actions - Search, QR, Notifications, Profile */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Search - Always visible */}
            <motion.button
              className="p-2 md:p-2.5 hover:bg-neutral-100 dark:hover:bg-dark-elevated rounded-xl transition-colors"
              onClick={() => setIsSearchOpen(true)}
              whileTap={{ scale: 0.95 }}
              aria-label="Search"
            >
              <Search className="w-5 h-5 dark:text-dark-text" />
            </motion.button>

            {/* QR Code Button - Prominent on mobile */}
            <motion.button
              className="p-2 md:p-2.5 hover:bg-primary/20 rounded-xl transition-colors bg-primary/10"
              onClick={() => setIsQRModalOpen(true)}
              whileTap={{ scale: 0.95 }}
              aria-label="QR Code - Connect with others"
            >
              <QrCode className="w-5 h-5 dark:text-dark-text" />
            </motion.button>



            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <motion.button
                className="relative p-2 md:p-2.5 hover:bg-primary/20 rounded-xl transition-colors"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                whileTap={{ scale: 0.95 }}
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 dark:text-dark-text" />
                {unreadCount > 0 && (
                  <motion.span
                    className="absolute top-0 right-0 min-w-[18px] h-[18px] bg-accent-coral text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-paper dark:border-dark-bg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-[calc(100vw-24px)] sm:w-96 max-w-[380px] bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border shadow-neo-lg dark:shadow-neo-dark-lg z-50 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {/* Header */}
                    <div className="p-4 border-b-2 border-ink dark:border-dark-border bg-primary/10 flex justify-between items-center">
                      <h4 className="font-display font-bold text-sm uppercase dark:text-dark-text">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="px-2 py-1 bg-ink dark:bg-primary text-white dark:text-ink text-xs font-bold rounded-full">
                          {unreadCount} New
                        </span>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="w-12 h-12 mx-auto mb-3 bg-neutral-100 dark:bg-dark-elevated rounded-xl flex items-center justify-center">
                            <Bell className="w-6 h-6 text-neutral-400 dark:text-dark-text-muted" />
                          </div>
                          <p className="text-sm text-neutral-500 dark:text-dark-text-muted">No notifications yet</p>
                        </div>
                      ) : (
                        filteredNotifications.map((notification) => (
                          <motion.div
                            key={notification.id}
                            className={`p-4 border-b border-neutral-100 dark:border-dark-border hover:bg-primary/5 dark:hover:bg-dark-elevated cursor-pointer flex gap-3 ${!notification.read ? "bg-accent-blue/5 dark:bg-primary/5" : ""
                              }`}
                            onClick={() => handleNotificationClick(notification.id, notification.actionUrl)}
                            whileHover={{ x: 4 }}
                          >
                            <div className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0 bg-neutral-100 dark:bg-dark-elevated rounded-lg">
                              {NOTIFICATION_ICONS[notification.type] || "🔔"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium leading-tight text-ink dark:text-dark-text">
                                {notification.title}
                              </p>
                              <p className="text-sm text-neutral-600 dark:text-dark-text-muted leading-tight line-clamp-2 mt-0.5">
                                {notification.message}
                              </p>
                              <span className="text-[10px] text-neutral-400 dark:text-dark-text-subtle font-mono mt-1 block">
                                {formatNotificationTime(notification.createdAt)}
                              </span>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-accent-coral rounded-full flex-shrink-0 mt-2" />
                            )}
                          </motion.div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {filteredNotifications.length > 0 && (
                      <button
                        className="w-full p-3 text-center border-t-2 border-ink dark:border-dark-border bg-neutral-50 dark:bg-dark-elevated hover:bg-neutral-100 dark:hover:bg-dark-border transition-colors"
                        onClick={markAllAsRead}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider dark:text-dark-text">
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
                className="w-8 h-8 md:w-10 md:h-10 bg-neutral-100 dark:bg-dark-elevated rounded-xl border-2 border-ink dark:border-dark-border overflow-hidden cursor-pointer shadow-neo-sm dark:shadow-neo-dark-sm"
                whileHover={{ scale: 1.05, rotate: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {user?.profile?.avatarUrl ? (
                  <img
                    src={user.profile.avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-ink/50 dark:text-dark-text-muted" />
                  </div>
                )}
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Announcement Bar - Black/Yellow Theme with // decorators */}
        <div className="hidden md:block bg-ink dark:bg-dark-surface border-t-2 border-primary dark:border-primary/50">
          <div className="overflow-hidden">
            <motion.div
              className="flex items-center gap-6 py-2.5 px-4 whitespace-nowrap"
              animate={{ x: [0, -1200] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              {[
                "Welcome to LINKER - Your Campus Social Hub",
                "Share notes and help your peers",
                "Check out upcoming campus events",
                "Connect with students from your college",
                "Buy & sell in the marketplace",
                "Join clubs and communities",
              ].map((text, i) => (
                <span key={i} className="flex items-center gap-6">
                  <span className="text-sm font-bold text-primary uppercase tracking-wide">
                    {text}
                  </span>
                  <span className="text-primary/60 font-mono text-lg">{"//"}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* QR Code Modal */}
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
    </header>
  );
}
