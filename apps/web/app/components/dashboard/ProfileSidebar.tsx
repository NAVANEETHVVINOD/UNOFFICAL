"use client";

import { useAuth } from "../../context/AuthContext";
import { User, Settings, Zap, Award } from "lucide-react";
import Link from "next/link";

export default function ProfileSidebar() {
    const { user, loading } = useAuth();

    if (loading) return <ProfileSkeleton />;
    if (!user) return null;

    return (
        <div className="bg-white p-4 border-thick border-black shadow-neo-lg rotate-1 transition-transform hover:rotate-0">

            {/* Polaroid Image Area */}
            <div className="bg-gray-100 border-2 border-black aspect-square mb-4 relative overflow-hidden group">
                {user.profile?.avatarUrl ? (
                    <img src={user.profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-accent-blue/10">
                        <User className="w-12 h-12 text-black/20" />
                    </div>
                )}

                {/* Quick Edit Overlay */}
                <Link
                    href="/settings"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Settings className="text-white w-6 h-6" />
                </Link>
            </div>

            {/* Info */}
            <div className="text-center space-y-1 mb-4">
                <h3 className="font-display font-black text-xl truncate">{user.profile?.fullName || 'Anonymous'}</h3>
                <p className="font-mono text-xs text-gray-500">
                    {user.profile?.college?.name || 'No Campus Selected'}
                </p>
            </div>

            {/* Stats / Actions */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-accent-yellow/20 border-2 border-black p-2 text-center rounded">
                    <div className="flex justify-center mb-1"><Zap className="w-4 h-4" /></div>
                    <span className="font-display font-bold text-sm">LVL {user.profile?.level || 1}</span>
                </div>
                <div className="bg-accent-purple/20 border-2 border-black p-2 text-center rounded">
                    <div className="flex justify-center mb-1"><Award className="w-4 h-4" /></div>
                    <span className="font-display font-bold text-sm">{user.profile?.karma || 0} REP</span>
                </div>
            </div>

            <Link href="/my-college">
                <button className="w-full py-2 bg-black text-white font-bold font-display uppercase hover:bg-gray-800 transition-colors">
                    My Campus Hub →
                </button>
            </Link>

        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="bg-white p-4 border-thick border-black h-96 animate-pulse">
            <div className="bg-gray-200 w-full aspect-square mb-4 border-2 border-gray-100"></div>
            <div className="h-6 bg-gray-200 w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 w-1/2 mx-auto mb-6"></div>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 w-full mt-auto"></div>
        </div>
    )
}
