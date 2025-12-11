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

                {/* Logo (Old Style: Simple L Box + Text) */}
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-accent-yellow border-2 border-black flex items-center justify-center font-black text-xl shadow-neo-sm group-hover:rotate-12 transition-transform">
                        L
                    </div>
                    <span className="font-display font-black text-2xl tracking-tight hidden md:block">
                        LINKER
                    </span>
                </Link>

                {/* Right Actions */}
                <div className="flex items-center gap-4">

                    {/* Dark/CRT Mode Toggle (Moved next to Notification) */}
                    <button
                        onClick={() => document.dispatchEvent(new Event('toggle-crt'))}
                        className="p-2 hover:bg-gray-100 rounded-full border-2 border-transparent hover:border-black transition-all"
                        title="Toggle CRT Mode"
                    >
                        <div className="w-5 h-5 bg-gray-800 rounded-full border border-gray-600"></div>
                    </button>

                    {/* Notifications */}
                    <div className="relative group">
                        <button className="relative p-2 hover:bg-yellow-50 rounded-full transition-colors">
                            <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-accent-red rounded-full border border-white animate-pulse"></span>
                        </button>

                        {/* Notification Dropdown */}
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white border-thick border-black shadow-neo-lg hidden group-hover:block hover:block z-50 animate-in fade-in zoom-in-95">
                            <div className="p-3 border-b-2 border-black bg-gray-50 flex justify-between items-center">
                                <h4 className="font-bold font-display uppercase text-sm">Notifications</h4>
                                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">3 New</span>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="p-3 border-b border-gray-100 hover:bg-yellow-50/50 cursor-pointer flex gap-3">
                                        <div className="w-2 h-2 mt-2 bg-accent-blue rounded-full"></div>
                                        <div>
                                            <p className="text-sm font-medium leading-tight">
                                                <span className="font-bold">Sarah</span> liked your post about <span className="italic">React Hooks</span>.
                                            </p>
                                            <span className="text-[10px] text-gray-400 font-mono">2m ago</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 text-center border-t-2 border-black bg-gray-50 hover:bg-gray-100 cursor-pointer">
                                <span className="text-xs font-bold uppercase tracking-wider">Mark all read</span>
                            </div>
                        </div>
                    </div>

                    {/* Profile */}
                    <Link href="/profile">
                        <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-black overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                            {user?.profile?.avatarUrl ? (
                                <img src={user.profile.avatarUrl} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-accent-blue/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-black/50" />
                                </div>
                            )}
                        </div>
                    </Link>

                </div>

            </div>

            {/* Tilted Ticker */}
            <TiltedTicker />

        </header>
    );
}

