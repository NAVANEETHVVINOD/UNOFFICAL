"use client"

import Link from 'next/link';
import { RetroButton } from './NewspaperUI';
import { useAuth } from '../../context/AuthContext';

export default function DashboardNavbar() {
    const { logout } = useAuth();

    return (
        <nav className="flex justify-between items-center mb-12 border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
                <Link href="/dashboard" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xl group-hover:rotate-12 transition-transform">
                        L
                    </div>
                    <span className="font-pixel text-2xl tracking-widest hidden md:block">LINKER_OS</span>
                </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
                <Link href="/dashboard">
                    <RetroButton variant="ghost">Dashboard</RetroButton>
                </Link>
                <Link href="/events">
                    <RetroButton variant="ghost">Events</RetroButton>
                </Link>
                <Link href="/clubs">
                    <RetroButton variant="ghost">Clubs</RetroButton>
                </Link>
                <Link href="/marketplace">
                    <RetroButton variant="ghost">Market</RetroButton>
                </Link>
                <Link href="/feed">
                    <RetroButton variant="ghost">Feed</RetroButton>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/profile">
                    <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-black overflow-hidden hover:scale-105 transition-transform">
                        {/* Placeholder Avatar */}
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </Link>
                <button
                    onClick={logout}
                    className="hidden md:block font-mono text-sm hover:underline text-red-600"
                >
                    [LOGOUT]
                </button>
            </div>
        </nav>
    );
}
