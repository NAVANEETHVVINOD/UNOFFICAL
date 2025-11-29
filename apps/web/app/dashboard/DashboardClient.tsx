/**
 * DashboardClient
 * 
 * The main client-side component for the Global Dashboard (/dashboard).
 * Displays:
 * - "My Home Base" (User's College)
 * - Global Event Feed ("Happening Across Kerala")
 * - List of all colleges ("Explore Campuses")
 * - Network Stats
 */
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
    const [events, setEvents] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, router, loading]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.profile?.college?.slug) return;

            setLoadingData(true);
            try {
                console.log('DashboardClient: Fetching college data...');
                const eventsData = await api.getEvents(user.profile.college.slug);
                console.log('DashboardClient: Data fetched', { eventsData });
                setEvents(eventsData.slice(0, 5)); // Top 5 events
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoadingData(false);
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
    const myCollege = user?.profile?.college;

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
                                HELLO_{firstName}
                            </p>
                            <h1 className="font-display text-5xl md:text-7xl font-black">CAMPUS KERALA</h1>
                        </div>
                        <div className="text-right hidden md:block">
                            <Badge className="bg-accent-yellow text-black border-black">MY_CAMPUS</Badge>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Column (Left) */}
                        <div className="md:col-span-2 space-y-8">

                            {/* My College Card (Hero) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative mt-4"
                            >
                                <Staple />
                                <NewspaperCard className="bg-gradient-to-br from-accent-blue/20 to-accent-green/20 p-8 border-black">
                                    <div className="flex flex-col md:flex-row items-start gap-8">
                                        <div className="hidden md:block w-32 shrink-0">
                                            <Doodle src="/doodles/sun.jpg" className="w-full animate-spin-slow" />
                                        </div>
                                        <div className="flex-1">
                                            {myCollege ? (
                                                <>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge className="bg-black text-white">MY HOME BASE</Badge>
                                                    </div>
                                                    <h2 className="font-display text-4xl font-black mb-4 uppercase leading-none">
                                                        {myCollege.name}
                                                    </h2>
                                                    <p className="text-lg mb-6 leading-relaxed font-serif italic">
                                                        "Jump back into your campus hub. Events, clubs, and chaos await."
                                                    </p>
                                                    {myCollege.slug && (
                                                        <Link href={`/colleges/${myCollege.slug}`}>
                                                            <RetroButton className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg">
                                                                ENTER CAMPUS -&gt;
                                                            </RetroButton>
                                                        </Link>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <h2 className="font-display text-3xl font-black mb-4">
                                                        NO COLLEGE SELECTED
                                                    </h2>
                                                    <p className="text-lg mb-6">
                                                        You haven't joined a campus yet. Find your tribe below.
                                                    </p>
                                                    <Link href="/onboarding">
                                                        <RetroButton className="bg-black text-white">
                                                            JOIN A COLLEGE
                                                        </RetroButton>
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </motion.div>

                            {/* College Happenings */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <h3 className="font-bold text-xl uppercase mb-6 flex items-center gap-2 border-b-4 border-black w-fit pb-1">
                                    <span className="w-3 h-3 bg-accent-pink border border-black"></span>
                                    Happening at {myCollege?.name || 'Campus'}
                                </h3>

                                {loadingData ? (
                                    <div className="text-center py-8 font-mono">Loading campus feed...</div>
                                ) : events.length > 0 ? (
                                    <div className="space-y-6">
                                        {events.map((event) => (
                                            <Link href={`/events/${event.id}`} key={event.id}>
                                                <NewspaperCard className="hover:bg-white transition-all cursor-pointer p-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4" noShadow>
                                                    <div className="flex gap-4">
                                                        <div className="w-16 h-16 bg-accent-yellow border-2 border-black shrink-0 flex flex-col items-center justify-center text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                            <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                            <span className="text-xl font-black">{new Date(event.date).getDate()}</span>
                                                        </div>
                                                        <div>
                                                            <div className="flex gap-2 mb-1">
                                                                <Badge className="text-[10px] py-0 px-2 bg-white border-black text-black">
                                                                    {event.college?.name || 'CAMPUS'}
                                                                </Badge>
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
                                    </div>
                                ) : (
                                    <NewspaperCard className="p-8 text-center bg-gray-50 border-dashed">
                                        <p className="font-mono text-gray-500">No events found at your campus yet.</p>
                                    </NewspaperCard>
                                )}
                            </motion.div>
                        </div>

                        {/* Sidebar (Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-8"
                        >
                            {/* Quick Stats */}
                            <NewspaperCard className="p-6 bg-black text-white">
                                <h3 className="font-bold text-lg uppercase mb-4 border-b border-gray-700 pb-2">Campus Stats</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-sm">My Events</span>
                                        <span className="font-pixel text-accent-pink">{events.length}</span>
                                    </div>
                                </div>
                            </NewspaperCard>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}

export default function DashboardClient() {
    return (
        <ErrorBoundary>
            <DashboardContent />
        </ErrorBoundary>
    );
}
