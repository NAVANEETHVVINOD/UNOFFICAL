"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ErrorBoundary, LoadingState } from '../components/ErrorBoundary';
import Link from 'next/link';

function DashboardContent() {
    const { isAuthenticated, user, loading } = useAuth();
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

    const firstName = user?.profile?.fullName?.split(' ')[0] || 'STUDENT';

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex justify-between items-end mb-12"
                    >
                        <div>
                            <p className="font-pixel text-xl text-gray-500 mb-2 uppercase">
                                WELCOME_BACK_{firstName}
                            </p>
                            <h1 className="font-display text-5xl md:text-7xl font-black">DASHBOARD</h1>
                        </div>
                        <div className="text-right hidden md:block">
                            <Badge className="bg-green-400 text-black border-black">ONLINE</Badge>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Column (Left) */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Welcome Section */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative mt-4"
                            >
                                <Staple />
                                <NewspaperCard className="bg-gradient-to-br from-accent-yellow/20 to-accent-pink/20 p-8 border-black">
                                    <div className="flex items-start gap-6">
                                        <div className="hidden md:block w-24 shrink-0">
                                            <Doodle src="/doodles/sun.jpg" className="w-full animate-spin-slow" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-3xl italic mb-4">
                                                Good Day, {firstName}.
                                            </h2>
                                            <p className="text-lg mb-6 leading-relaxed">
                                                Welcome to your campus command center. Explore <strong className="bg-accent-blue/30 px-1">clubs</strong>, join <strong className="bg-accent-pink/30 px-1">events</strong>, and connect with your community.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <Link href="/events">
                                                    <RetroButton className="text-sm bg-accent-blue text-white border-black">
                                                        VIEW EVENTS
                                                    </RetroButton>
                                                </Link>
                                                <Link href="/feed">
                                                    <RetroButton variant="outline" className="text-sm bg-white border-black">
                                                        BROWSE FEED
                                                    </RetroButton>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </motion.div>

                            {/* Recent Updates */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="font-bold text-xl uppercase mb-6 flex items-center gap-2 border-b-4 border-black w-fit pb-1">
                                    <span className="w-3 h-3 bg-accent-blue border border-black"></span>
                                    Latest Headlines
                                </h3>
                                <div className="space-y-6">
                                    <Link href="/clubs">
                                        <NewspaperCard className="hover:bg-white transition-all cursor-pointer p-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" noShadow>
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-100 border-2 border-black shrink-0 flex items-center justify-center group-hover:bg-accent-pink/20 transition-colors">
                                                    <span className="text-3xl">🎭</span>
                                                </div>
                                                <div>
                                                    <div className="flex gap-2 mb-2">
                                                        <Badge className="text-[10px] py-0 px-2 bg-black text-white">CLUBS</Badge>
                                                        <span className="text-xs font-mono text-gray-500 mt-1">2 hours ago</span>
                                                    </div>
                                                    <h4 className="font-bold text-xl leading-tight mb-2 group-hover:underline decoration-2 decoration-accent-pink">Join Campus Clubs</h4>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        Explore student organizations and find your community. From coding to photography, there's something for everyone.
                                                    </p>
                                                </div>
                                            </div>
                                        </NewspaperCard>
                                    </Link>

                                    <Link href="/notes">
                                        <NewspaperCard className="hover:bg-white transition-all cursor-pointer p-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" noShadow>
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-100 border-2 border-black shrink-0 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                                                    <span className="text-3xl">📚</span>
                                                </div>
                                                <div>
                                                    <div className="flex gap-2 mb-2">
                                                        <Badge className="text-[10px] py-0 px-2 bg-white border-black text-black">RESOURCES</Badge>
                                                        <span className="text-xs font-mono text-gray-500 mt-1">5 hours ago</span>
                                                    </div>
                                                    <h4 className="font-bold text-xl leading-tight mb-2 group-hover:underline decoration-2 decoration-accent-blue">Study Materials Available</h4>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        Access shared notes and study materials from your peers. Upload your own to help others succeed.
                                                    </p>
                                                </div>
                                            </div>
                                        </NewspaperCard>
                                    </Link>

                                    <Link href="/marketplace">
                                        <NewspaperCard className="hover:bg-white transition-all cursor-pointer p-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" noShadow>
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-gray-100 border-2 border-black shrink-0 flex items-center justify-center group-hover:bg-accent-yellow/20 transition-colors">
                                                    <span className="text-3xl">🛍️</span>
                                                </div>
                                                <div>
                                                    <div className="flex gap-2 mb-2">
                                                        <Badge className="text-[10px] py-0 px-2 bg-accent-yellow border-black text-black">MARKETPLACE</Badge>
                                                        <span className="text-xs font-mono text-gray-500 mt-1">1 day ago</span>
                                                    </div>
                                                    <h4 className="font-bold text-xl leading-tight mb-2 group-hover:underline decoration-2 decoration-accent-yellow">Campus Marketplace</h4>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        Buy and sell textbooks, electronics, and more. Your one-stop shop for campus deals.
                                                    </p>
                                                </div>
                                            </div>
                                        </NewspaperCard>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar (Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-8"
                        >
                            {/* Quick Actions */}
                            <div className="relative">
                                <Tape className="absolute -top-3 -right-3 rotate-12 z-10" />
                                <NewspaperCard className="bg-black text-white p-6 rotate-1">
                                    <h3 className="font-pixel text-xl text-accent-yellow mb-6 border-b border-gray-800 pb-2">&gt; QUICK_ACTIONS</h3>
                                    <ul className="space-y-3">
                                        <li>
                                            <Link href="/events/create" className="block w-full text-left py-3 px-2 border-b border-gray-800 hover:text-black hover:bg-accent-blue transition-all font-mono text-sm flex justify-between group">
                                                <span>[+] Create New Event</span>
                                                <span className="opacity-0 group-hover:opacity-100">&lt;-</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/notes/upload" className="block w-full text-left py-3 px-2 border-b border-gray-800 hover:text-black hover:bg-accent-pink transition-all font-mono text-sm flex justify-between group">
                                                <span>[+] Upload Notes</span>
                                                <span className="opacity-0 group-hover:opacity-100">&lt;-</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/marketplace/create" className="block w-full text-left py-3 px-2 border-b border-gray-800 hover:text-black hover:bg-accent-yellow transition-all font-mono text-sm flex justify-between group">
                                                <span>[+] Sell Item</span>
                                                <span className="opacity-0 group-hover:opacity-100">&lt;-</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/feed/create" className="block w-full text-left py-3 px-2 hover:text-black hover:bg-green-400 transition-all font-mono text-sm flex justify-between group">
                                                <span>[+] New Post</span>
                                                <span className="opacity-0 group-hover:opacity-100">&lt;-</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </NewspaperCard>
                            </div>

                            {/* Upcoming */}
                            <NewspaperCard className="p-6 bg-paper">
                                <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-black pb-2 flex justify-between items-center">
                                    Up Next
                                    <span className="text-2xl">📅</span>
                                </h3>
                                <div className="space-y-4">
                                    <Link href="/events" className="flex gap-3 items-start group cursor-pointer">
                                        <div className="bg-accent-pink border-2 border-black px-3 py-2 text-center shrink-0 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-none transition-all">
                                            <p className="text-xs font-bold">NOV</p>
                                            <p className="font-bold text-xl leading-none">24</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm group-hover:underline">Campus Events</p>
                                            <p className="text-xs text-gray-500 font-mono">Check upcoming events</p>
                                        </div>
                                    </Link>
                                    <Link href="/events" className="flex gap-3 items-start group cursor-pointer">
                                        <div className="bg-accent-blue border-2 border-black px-3 py-2 text-center shrink-0 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-none transition-all">
                                            <p className="text-xs font-bold">DEC</p>
                                            <p className="font-bold text-xl leading-none">01</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm group-hover:underline">View All Events</p>
                                            <p className="text-xs text-gray-500 font-mono">Browse calendar</p>
                                        </div>
                                    </Link>
                                </div>
                            </NewspaperCard>

                            {/* Profile Card */}
                            <Link href="/profile">
                                <NewspaperCard className="p-6 bg-white border-dashed border-2 border-gray-400 hover:bg-gray-50 hover:border-black transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-100 border-2 border-black overflow-hidden">
                                            <img
                                                src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.profile?.fullName || 'User'}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-lg group-hover:underline">{user.profile?.fullName}</p>
                                            <p className="text-xs font-mono text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <RetroButton className="w-full text-sm bg-accent-blue text-white border-black">
                                        VIEW PROFILE
                                    </RetroButton>
                                </NewspaperCard>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}

export default function DashboardPage() {
    return (
        <ErrorBoundary>
            <DashboardContent />
        </ErrorBoundary>
    );
}
