"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav({ onCompose }: { onCompose: () => void }) {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Home", href: "/dashboard" },
        { icon: Search, label: "Search", href: "/search" }, // Placeholder search
        { icon: PlusSquare, label: "Create", action: onCompose, isPrimary: true },
        { icon: Calendar, label: "Events", href: "/events" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t-thick border-black pb-safe">
            <div className="flex justify-around items-end h-16 px-2">
                {navItems.map((item, index) => {
                    const isActive = item.href ? pathname === item.href : false;
                    const Icon = item.icon;

                    if (item.isPrimary) {
                        return (
                            <button
                                key={index}
                                onClick={item.action}
                                className="relative -top-6"
                            >
                                <div className="w-14 h-14 bg-accent-yellow border-2 border-black shadow-neo rounded-xl flex items-center justify-center transform transition-transform active:scale-95">
                                    <Icon className="w-7 h-7 text-black" />
                                </div>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={item.href || "#"}
                            className={`flex-1 flex flex-col items-center justify-center py-2 h-full transition-colors ${isActive ? "text-accent-blue" : "text-gray-400 hover:text-black"
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} />
                            <span className="text-[10px] font-bold mt-1 tracking-wide">{item.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="bottomNavIndicator"
                                    className="absolute bottom-1 w-1 h-1 bg-current rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
