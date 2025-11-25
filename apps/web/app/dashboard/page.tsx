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
import { api } from '../../lib/api';

function DashboardContent() {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();
    const [recentEvents, setRecentEvents] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router, loading]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (user?.profile?.college?.slug) {
                setLoadingEvents(true);
                try {
                    const events = await api.getEvents(user.profile.college.slug);
                    setRecentEvents(events.slice(0, 3)); // Get top 3
                } catch (error) {
                    console.error("Failed to fetch dashboard events", error);
                } finally {
                    setLoadingEvents(false);
                }
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    if (loading) {
        return <LoadingState />;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    const firstName = user?.profile?.fullName?.split(' ')[0] || 'STUDENT';
    const college = user?.profile?.college;

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
                            {/* My College Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative mt-4"
                            >
                                <Staple />
                                <NewspaperCard className="bg-gradient-to-br from-accent-yellow/20 to-accent-pink/20 p-8 border-black">
                                    <div className="flex flex-col md:flex-row items-start gap-8">
                                        <div className="hidden md:block w-32 shrink-0">
                                            <Doodle src="/doodles/sun.jpg" className="w-full animate-spin-slow" />
                                        </div>
                                        <div className="flex-1">
                                            {college ? (
                                                <>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className="bg-black text-white">MY CAMPUS</Badge>
                                                    </div>
                                                    <h2 className="font-display text-4xl font-black mb-4 uppercase leading-none">
                                                        {college.name}
                                                    </h2>
                                                    <p className="text-lg mb-6 leading-relaxed font-serif italic">
                                                        "Your gateway to everything happening at {college.name}. Don't miss out on the latest buzz."
                                                    </p>
                                                    <div className="flex flex-wrap gap-3">
                                                        <Link href={`/colleges/${college.slug}`}>
                                                            <RetroButton className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg">
                                                                ENTER HUB -&gt;
                                                            </RetroButton>
                                                        </Link>
                                                        <Link href="/profile">
                                                            <RetroButton variant="outline" className="bg-white">
                                                                MY PROFILE
                                                            </RetroButton>
                                                        </Link>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <h2 className="font-display text-3xl font-black mb-4">
                                                        NO COLLEGE SELECTED
                                                    </h2>
                                                    <p className="text-lg mb-6">
                                                        Join a college to unlock the full experience.
                                                    </p>
                                                    <Link href="/select-college">
                                                        <RetroButton className="bg-black text-white">
                                                            SELECT COLLEGE
                                                        </RetroButton>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </motion.div>

                            {/* Campus Pulse (Recent Events) */}
                            {college && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3 className="font-bold text-xl uppercase mb-6 flex items-center gap-2 border-b-4 border-black w-fit pb-1">
                                        <span className="w-3 h-3 bg-accent-pink border border-black"></span>
                                        Campus Pulse
                                    </h3>

                                    {loadingEvents ? (
                                        <div className="text-center py-8 font-mono">Loading updates...</div>
                                    ) : recentEvents.length > 0 ? (
                                        <div className="space-y-6">
                                            {recentEvents.map((event) => (
                                                <Link href={`/events/${event.id}`} key={event.id}>
                                                    <NewspaperCard className="hover:bg-white transition-all cursor-pointer p-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4" noShadow>
                                                        <div className="flex gap-4">
                                                            <div className="w-16 h-16 bg-accent-pink border-2 border-black shrink-0 flex flex-col items-center justify-center text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                                <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                                <span className="text-xl font-black">{new Date(event.date).getDate()}</span>
                                                            </div>
                                                            <div>
                                                                <div className="flex gap-2 mb-1">
                                                                    <Badge className="text-[10px] py-0 px-2 bg-white border-black text-black">EVENT</Badge>
                                                                    <span className="text-xs font-mono text-gray-500 mt-1">@{event.venue}</span>
                                                                </div>
                                                                <h4 className="font-bold text-xl leading-tight mb-1 group-hover:underline decoration-2 decoration-accent-pink">
                                                                    {event.title}
                                                                </h4>
                                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                                    {event.description}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </NewspaperCard>
                                                </Link>
                                            ))}
                                            <Link href={`/colleges/${college.slug}/events`} className="block text-center font-bold underline decoration-2 decoration-accent-blue hover:text-accent-blue mt-4">
                                                VIEW ALL CAMPUS EVENTS
                                            </Link>
                                        </div>
                                    ) : (
                                        <NewspaperCard className="p-8 text-center bg-gray-50 border-dashed">
                                            <p className="font-mono text-gray-500 mb-4">No recent events found.</p>
                                            <Link href="/events/create">
                                                <RetroButton className="text-sm">CREATE AN EVENT</RetroButton>
                                            </Link>
                                        </NewspaperCard>
                                    )}
                                </motion.div>
                            )}
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

                            {/* Global Highlights */}
                            <NewspaperCard className="p-6 bg-paper">
                                <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-black pb-2 flex justify-between items-center">
                                    Explore
                                    <span className="text-2xl">🌍</span>
                                </h3>
                                <div className="space-y-4">
                                    <Link href="/marketplace" className="flex gap-3 items-center group cursor-pointer hover:bg-white p-2 -mx-2 rounded transition-colors">
                                        <div className="w-10 h-10 bg-accent-yellow border-2 border-black flex items-center justify-center shrink-0">
                                            🛍️
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm group-hover:underline">Marketplace</p>
                                            <p className="text-xs text-gray-500 font-mono">Buy & Sell</p>
                                        </div>
                                    </Link>
                                    <Link href="/notes" className="flex gap-3 items-center group cursor-pointer hover:bg-white p-2 -mx-2 rounded transition-colors">
                                        <div className="w-10 h-10 bg-accent-blue border-2 border-black flex items-center justify-center shrink-0">
                                            📚
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm group-hover:underline">Study Notes</p>
                                            <p className="text-xs text-gray-500 font-mono">Share resources</p>
                                        </div>
                                    </Link>
                                    <Link href="/clubs" className="flex gap-3 items-center group cursor-pointer hover:bg-white p-2 -mx-2 rounded transition-colors">
                                        <div className="w-10 h-10 bg-accent-pink border-2 border-black flex items-center justify-center shrink-0">
                                            🎭
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm group-hover:underline">All Clubs</p>
                                            <p className="text-xs text-gray-500 font-mono">Find communities</p>
                                        </div>
                                    </Link>
                                </div>
                            </NewspaperCard>
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
