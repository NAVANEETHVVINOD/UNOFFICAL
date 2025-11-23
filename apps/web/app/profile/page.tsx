"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary, LoadingState } from '../components/ErrorBoundary';
import Link from 'next/link';

function ProfileContent() {
    const { user, isAuthenticated, logout, loading } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router, loading, mounted]);

    if (!mounted || loading) {
        return <LoadingState />;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    <div className="max-w-4xl mx-auto mt-12 space-y-8">
                        {/* Main Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-2 z-10" />
                            <NewspaperCard className="p-8 md:p-12 bg-white border-4 border-black relative overflow-hidden">
                                <Doodle src="/doodles/sparkle.svg" className="absolute -top-8 -right-8 w-32 h-32 opacity-10 animate-spin-slow" />

                                {/* ID Card Header */}
                                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
                                    <div>
                                        <h1 className="font-display text-4xl md:text-5xl font-black uppercase">Student ID</h1>
                                        <p className="font-mono text-sm text-gray-500">LINKER_OS // VERIFIED_USER</p>
                                    </div>
                                    <Badge className="bg-green-400 text-black border-black">ACTIVE</Badge>
                                </div>

                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                    {/* Avatar Section */}
                                    <div className="shrink-0 flex flex-col items-center gap-4">
                                        <div className="w-48 h-48 bg-gray-100 border-4 border-black overflow-hidden relative">
                                            <img
                                                src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.profile?.fullName || 'User'}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 inset-x-0 bg-black text-white text-center text-[10px] py-1 font-mono">
                                                IMG_REF_{user.id.substring(0, 4).toUpperCase()}
                                            </div>
                                        </div>
                                        <Badge className="bg-accent-blue text-white border-black uppercase">
                                            {user.role}
                                        </Badge>
                                    </div>

                                    {/* Details Section */}
                                    <div className="flex-1 w-full space-y-6">
                                        <div>
                                            <label className="font-bold text-xs uppercase text-gray-500 block mb-1">Full Name</label>
                                            <p className="font-serif text-3xl italic border-b-2 border-gray-200 pb-2">
                                                {user.profile?.fullName || 'Unknown Student'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="font-bold text-xs uppercase text-gray-500 block mb-1">Email Address</label>
                                            <p className="font-mono text-lg border-b-2 border-gray-200 pb-2">
                                                {user.email}
                                            </p>
                                        </div>

                                        {user.profile?.bio && (
                                            <div>
                                                <label className="font-bold text-xs uppercase text-gray-500 block mb-1">Bio</label>
                                                <p className="text-lg leading-relaxed border-b-2 border-gray-200 pb-2">
                                                    {user.profile.bio}
                                                </p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-bold text-xs uppercase text-gray-500 block mb-1">College ID</label>
                                                <p className="font-mono text-lg border-b-2 border-gray-200 pb-2">
                                                    {user.profile?.collegeId || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="font-bold text-xs uppercase text-gray-500 block mb-1">User ID</label>
                                                <p className="font-mono text-sm border-b-2 border-gray-200 pb-2">
                                                    {user.id.substring(0, 12)}...
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Actions */}
                                <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="text-xs font-mono text-gray-400">
                                        MEMBER_SINCE_{new Date().getFullYear()}
                                    </div>
                                    <div className="flex gap-3">
                                        <Link href="/profile/edit">
                                            <RetroButton className="bg-accent-blue text-white border-black">
                                                EDIT PROFILE
                                            </RetroButton>
                                        </Link>
                                        <RetroButton
                                            onClick={logout}
                                            className="bg-red-600 hover:bg-red-700 text-white border-black"
                                        >
                                            LOGOUT
                                        </RetroButton>
                                    </div>
                                </div>
                            </NewspaperCard>
                        </motion.div>

                        {/* Interests & Social Links */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Interests */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Staple className="mb-2" />
                                <NewspaperCard className="p-6 border-4 bg-accent-yellow/10">
                                    <h3 className="font-display text-2xl font-black mb-4 flex items-center gap-2">
                                        <span>⭐</span> INTERESTS
                                    </h3>
                                    {user.profile?.tags && user.profile.tags.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {user.profile.tags.map((tag, i) => (
                                                <Badge key={i} className="bg-white border-black">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 font-mono text-sm">No interests added yet.</p>
                                    )}
                                </NewspaperCard>
                            </motion.div>

                            {/* Social Links */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Staple className="mb-2" />
                                <NewspaperCard className="p-6 border-4 bg-accent-pink/10">
                                    <h3 className="font-display text-2xl font-black mb-4 flex items-center gap-2">
                                        <span>🔗</span> SOCIALS
                                    </h3>
                                    <div className="space-y-3">
                                        {user.profile?.githubUrl ? (
                                            <a
                                                href={user.profile.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            >
                                                <span className="font-bold">GitHub</span>
                                                <span className="text-sm text-gray-600 truncate">{user.profile.githubUrl}</span>
                                            </a>
                                        ) : null}
                                        {user.profile?.instagram ? (
                                            <a
                                                href={`https://instagram.com/${user.profile.instagram.replace('@', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            >
                                                <span className="font-bold">Instagram</span>
                                                <span className="text-sm text-gray-600">{user.profile.instagram}</span>
                                            </a>
                                        ) : null}
                                        {!user.profile?.githubUrl && !user.profile?.instagram && (
                                            <p className="text-gray-500 font-mono text-sm">No social links added yet.</p>
                                        )}
                                    </div>
                                </NewspaperCard>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}

export default function ProfilePage() {
    return (
        <ErrorBoundary>
            <ProfileContent />
        </ErrorBoundary>
    );
}
