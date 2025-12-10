"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { RetroButton } from "./ui/NewspaperUI";
import { useState } from "react";
import { Bell, Search, Menu, User } from "lucide-react";

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-navbar bg-paper border-b-thick border-black px-4 py-3 md:px-8">
            {/* Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* LEFT: Logo */}
                <div className="flex items-center gap-2 group">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-accent-yellow border-card border-black flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-neo-sm">
                            <span className="font-display font-black text-xl">L</span>
                        </div>
                        <span className="font-display font-black text-2xl tracking-tight hidden md:block">LINKER</span>
                    </Link>
                </div>

                {/* CENTER: Search Bar */}
                <div className="hidden md:flex items-center flex-1 max-w-lg mx-auto">
                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder="Search students, clubs, events..."
                            className="w-full bg-white border-2 border-black rounded-full py-2.5 pl-12 pr-4 font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:shadow-neo transition-all"
                        />
                        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" />

                        {/* Type Hints */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <span className="text-[10px] border border-gray-300 rounded px-1 text-gray-400">⌘K</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-3 md:gap-6">
                    {isAuthenticated ? (
                        <>
                            {/* Mobile Search */}
                            <button className="md:hidden p-2 hover:bg-gray-100 rounded-full">
                                <Search className="w-6 h-6" />
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-yellow-50 rounded-full transition-colors group">
                                <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-accent-red rounded-full border border-white animate-pulse"></span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-10 h-10 rounded-full border-2 border-black overflow-hidden hover:scale-110 transition-transform shadow-sm"
                                >
                                    {user?.profile?.avatarUrl ? (
                                        <img
                                            src={user.profile.avatarUrl}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-accent-blue flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                    )}
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-4 w-56 bg-white border-thick border-black shadow-neo p-0 animate-in fade-in zoom-in-95 duration-100 z-50">
                                        <div className="p-3 bg-gray-50 border-b-2 border-black">
                                            <p className="font-display font-bold text-sm truncate">{user?.profile?.fullName || 'Student'}</p>
                                            <p className="font-mono text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="p-1">
                                            <Link href="/profile" className="block p-2 hover:bg-accent-yellow/20 rounded font-bold text-sm">Profile</Link>
                                            <Link href="/settings" className="block p-2 hover:bg-accent-yellow/20 rounded font-bold text-sm">Settings</Link>
                                            <div className="h-px bg-gray-200 my-1"></div>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left p-2 hover:bg-red-50 text-red-600 font-bold text-sm rounded"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-3">
                            <Link href="/login">
                                <RetroButton variant="secondary" className="text-sm px-5 py-2">Login</RetroButton>
                            </Link>
                            <Link href="/register">
                                <RetroButton variant="primary" className="text-sm px-5 py-2">Join Chaos</RetroButton>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

