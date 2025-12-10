"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { RetroButton } from "./ui/NewspaperUI";
import { useState } from "react";
import { Bell, Search, Menu, User } from "lucide-react";
import TiltedTicker from "./ui/TiltedTicker";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-navbar h-[15vh] bg-paper flex flex-col relative shadow-neo-lg transition-all">

            {/* Top Bar */}
            <div className="flex-1 flex items-center justify-between px-4 lg:px-8 relative z-20 bg-paper border-b-thick border-black">

                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-2xl rotate-3 group-hover:rotate-0 transition-transform">
                        L
                    </div>
                    <span className="font-display font-black text-3xl tracking-tighter uppercase hidden md:block">
                        LINKER
                        <span className="text-accent-blue text-4xl">.</span>
                    </span>
                </Link>

                {/* Desktop Nav (Hidden on Mobile) */}
                <nav className="hidden md:flex items-center gap-8 font-bold font-display uppercase tracking-wider text-sm">
                    <Link href="/dashboard" className="hover:text-accent-blue hover:underline decoration-wavy">Home</Link>
                    <Link href="/my-college" className="hover:text-accent-pink hover:underline decoration-wavy">Campus</Link>
                    <Link href="/events" className="hover:text-accent-green hover:underline decoration-wavy">Events</Link>
                    <Link href="/marketplace" className="hover:text-accent-yellow hover:underline decoration-wavy">Market</Link>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">

                    {/* Dark/CRT Mode Toggle (Moved to Header) */}
                    <div className="hidden md:block">
                        {/* Trigger global event for CRT toggle since component is isolated */}
                        <button
                            onClick={() => document.dispatchEvent(new Event('toggle-crt'))}
                            className="p-2 hover:bg-gray-100 rounded-full border-2 border-transparent hover:border-black transition-all"
                            title="Toggle CRT Mode"
                        >
                            <div className="w-5 h-5 bg-gray-800 rounded-full border border-gray-600"></div>
                        </button>
                    </div>

                    <div className="relative">
                        <Bell className="w-6 h-6 hover:rotate-12 transition-transform cursor-pointer" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    </div>

                    <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-black overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                        {user?.profile?.avatarUrl ? (
                            <img src={user.profile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-accent-blue/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-black/50" />
                            </div>
                        )}
                    </div>

                </div>

            </div>

            {/* Tilted Ticker (Visual Flair) */}
            <TiltedTicker />

        </header>
    );
}

