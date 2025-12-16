"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Calendar, ShoppingBag, MessageCircle, Plus, X, School } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ArcMenuProps {
  onCompose: () => void;
}

export default function ArcMenu({ onCompose }: ArcMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: School, label: "Campus", href: "/my-college", color: "bg-accent-blue" },
    { icon: Calendar, label: "Events", href: "/events", color: "bg-accent-coral" },
    { icon: ShoppingBag, label: "Market", href: "/marketplace", color: "bg-accent-mint" },
    { icon: MessageCircle, label: "Chat", href: "/messages", color: "bg-accent-purple" },
  ];

  // Radial positions for the fan menu
  const positions = [
    { x: -80, y: -30 },
    { x: -45, y: -70 },
    { x: 45, y: -70 },
    { x: 80, y: -30 },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-ink safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {/* Home */}
          <Link href="/dashboard" className="flex-1">
            <motion.div
              className={`flex flex-col items-center justify-center py-2 ${
                pathname === '/dashboard' ? 'text-ink' : 'text-neutral-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">Home</span>
              {pathname === '/dashboard' && (
                <motion.div 
                  className="absolute bottom-1 w-1 h-1 bg-primary rounded-full"
                  layoutId="bottomNavIndicator"
                />
              )}
            </motion.div>
          </Link>

          {/* Events */}
          <Link href="/events" className="flex-1">
            <motion.div
              className={`flex flex-col items-center justify-center py-2 ${
                isActive('/events') ? 'text-ink' : 'text-neutral-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">Events</span>
            </motion.div>
          </Link>

          {/* Create Button (Center) */}
          <div className="flex-1 flex justify-center -mt-6">
            <motion.button
              onClick={onCompose}
              className="w-14 h-14 bg-primary border-2 border-ink rounded-xl shadow-neo flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-7 h-7 text-ink" />
            </motion.button>
          </div>

          {/* Market */}
          <Link href="/marketplace" className="flex-1">
            <motion.div
              className={`flex flex-col items-center justify-center py-2 ${
                isActive('/marketplace') ? 'text-ink' : 'text-neutral-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">Market</span>
            </motion.div>
          </Link>

          {/* Messages */}
          <Link href="/messages" className="flex-1">
            <motion.div
              className={`flex flex-col items-center justify-center py-2 relative ${
                isActive('/messages') ? 'text-ink' : 'text-neutral-400'
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">Chat</span>
              {/* Unread indicator - can be connected to context */}
              {/* <span className="absolute top-1 right-1/4 w-2 h-2 bg-accent-coral rounded-full" /> */}
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Floating Action Button (Alternative - Hidden by default) */}
      {/* 
      <div className="md:hidden fixed bottom-24 right-4 z-50">
        <motion.button
          onClick={onCompose}
          className="w-14 h-14 bg-primary border-2 border-ink rounded-full shadow-neo-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-6 h-6 text-ink" />
        </motion.button>
      </div>
      */}
    </>
  );
}
