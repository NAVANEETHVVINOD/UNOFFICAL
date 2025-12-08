"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { RetroButton, Badge } from "./ui/NewspaperUI";
import { useState } from "react";

export default function Navbar({ showLinks = true }: { showLinks?: boolean }) {
    const { user, isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navLinks = [
        { label: "Feed", href: "/dashboard" },
        { label: "My College", href: user?.profile?.college?.slug ? `/colleges/${user.profile.college.slug}` : '/my-college' },
        { label: "Events", href: "/events" },
        { label: "Messages", href: "/messages" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-paper border-b-2 border-black shadow-neo-sm px-4 py-3 md:px-8">
            {/* Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* LEFT: Logo & Links */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-accent-yellow border-2 border-black flex items-center justify-center font-black text-lg transform group-hover:rotate-12 transition-transform">
                            L
                        </div>
                        <span className="font-display font-black text-xl tracking-tight hidden md:block">LINKER</span>
                    </Link>

                    {isAuthenticated && showLinks && (
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map(link => {
                                const active = pathname === link.href;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={`font-bold uppercase text-sm tracking-wide transition-colors ${active ? 'text-black decoration-2 underline underline-offset-4 decoration-accent-blue' : 'text-gray-500 hover:text-black'}`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* CENTER: Search Bar */}
                <div className={`hidden md:flex items-center flex-1 max-w-lg transition-all ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Search for students, clubs, chaos..."
                            className="w-full bg-white border-2 border-black rounded-full py-2 pl-10 pr-4 font-mono text-sm focus:outline-none focus:shadow-neo-sm transition-shadow"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                        />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            {/* Mobile Search Icon */}
                            <button className="md:hidden p-2">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-gray-100 rounded-full border-2 border-transparent hover:border-black transition-all">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-3 h-3 bg-accent-red rounded-full border border-white"></span>
                            </button>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-10 h-10 rounded-full border-2 border-black overflow-hidden hover:scale-105 transition-transform"
                                >
                                    <img
                                        src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.id}`}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border-2 border-black shadow-neo-sm p-2 animate-in fade-in zoom-in-95 duration-100">
                                        <div className="p-2 border-b border-gray-100 mb-2">
                                            <p className="font-bold text-sm truncate">{user?.profile?.fullName}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <Link href="/profile" className="block p-2 hover:bg-gray-50 text-sm font-bold">Profile</Link>
                                        <Link href="/settings" className="block p-2 hover:bg-gray-50 text-sm font-bold">Settings</Link>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left p-2 hover:bg-red-50 text-red-600 text-sm font-bold"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <RetroButton variant="secondary" className="text-sm px-4 py-1">Login</RetroButton>
                            </Link>
                            <Link href="/register">
                                <RetroButton variant="primary" className="text-sm px-4 py-1">Join</RetroButton>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
