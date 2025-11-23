"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-between items-end mb-12"
                    >
                        <div>
                            <p className="font-pixel text-xl text-gray-500 mb-2 uppercase">
                                WELCOME_BACK_{user?.profile?.fullName?.split(' ')[0] || 'STUDENT'}
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
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                                className="relative mt-4"
                            >
                                <Staple />
                                <NewspaperCard className="bg-accent-yellow/20 p-8 border-black">
                                    <div className="flex items-start gap-6">
                                        <div className="hidden md:block w-24 shrink-0">
                                            <Doodle src="/doodles/sun.jpg" className="w-full animate-spin-slow" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-3xl italic mb-4">
                                                Good Morning, {user?.profile?.fullName?.split(' ')[0] || 'Friend'}.
                                            </h2>
                                            <p className="text-lg mb-6 leading-relaxed">
                                                You have <strong className="bg-accent-blue/30 px-1">3 classes</strong> today and <strong className="bg-accent-pink/30 px-1">1 event</strong> tonight.
                                                Don't forget to submit your assignment for CS101.
                                            </p>
                                            <div className="flex gap-3">
                                                <RetroButton className="text-sm">VIEW SCHEDULE</RetroButton>
                                                <RetroButton variant="outline" className="text-sm bg-white">MARK ATTENDANCE</RetroButton>
                                            </div>
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </motion.div>

                            {/* Recent Updates */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="font-bold text-xl uppercase mb-6 flex items-center gap-2 border-b-4 border-black w-fit pb-1">
                                    <span className="w-3 h-3 bg-accent-blue border border-black"></span>
                                    Latest Headlines
                                </h3>
                                <div className="space-y-6">
                                    <NewspaperCard className="hover:bg-white transition-all cursor-pointer p-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" noShadow>
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 border-2 border-black shrink-0 flex items-center justify-center group-hover:bg-accent-pink/20 transition-colors">
                                                <Doodle src="/doodles/group.svg" className="w-10 h-10 opacity-70" />
                                            </div>
                                            <div>
                                                <div className="flex gap-2 mb-2">
                                                    <Badge className="text-[10px] py-0 px-2 bg-black text-white">CLUBS</Badge>
                                                    <span className="text-xs font-mono text-gray-500 mt-1">2 hours ago</span>
                                                </div>
                                                <h4 className="font-bold text-xl leading-tight mb-2 group-hover:underline decoration-2 decoration-accent-pink">Photography Club Meeting Rescheduled</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    Due to rain, the outdoor shoot is cancelled. We will meet in Room 304 instead. Bring your cameras!
                                                </p>
                                            </div>
                                        </div>
                                    </NewspaperCard>

                                    <NewspaperCard className="hover:bg-white transition-all cursor-pointer p-6 group hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" noShadow>
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-gray-100 border-2 border-black shrink-0 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                                                <Doodle src="/doodles/book.svg" className="w-10 h-10 opacity-70" />
                                            </div>
                                            <div>
                                                <div className="flex gap-2 mb-2">
                                                    <Badge className="text-[10px] py-0 px-2 bg-white border-black text-black">RESOURCES</Badge>
                                                    <span className="text-xs font-mono text-gray-500 mt-1">5 hours ago</span>
                                                </div>
                                                <h4 className="font-bold text-xl leading-tight mb-2 group-hover:underline decoration-2 decoration-accent-blue">New Notes Added: Physics 101</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    Sarah J. uploaded her handwritten notes for Chapter 4: Thermodynamics. Download them now before the exam!
                                                </p>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar (Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="space-y-8"
                        >
                            {/* Quick Actions */}
                            <div className="relative">
                                <Tape className="absolute -top-3 -right-3 rotate-12 z-10" />
                                <NewspaperCard className="bg-black text-white p-6 rotate-1">
                                    <h3 className="font-pixel text-xl text-accent-yellow mb-6 border-b border-gray-800 pb-2">&gt; QUICK_ACTIONS</h3>
                                    <ul className="space-y-3">
                                        <li>
                                            <button className="w-full text-left py-3 px-2 border-b border-gray-800 hover:text-black hover:bg-accent-blue transition-all font-mono text-sm flex justify-between group">
                                                <span>[+] Create New Event</span>
                                                <span className="opacity-0 group-hover:opacity-100">&lt;-</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button className="w-full text-left py-3 px-2 border-b border-gray-800 hover:text-black hover:bg-accent-pink transition-all font-mono text-sm flex justify-between group">
                                                <span>[+] Upload Notes</span>
                                                <span className="opacity-0 group-hover:opacity-100">&lt;-</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button className="w-full text-left py-3 px-2 hover:text-black hover:bg-accent-yellow transition-all font-mono text-sm flex justify-between group">
                                                <span>[+] Sell Item</span>
                                                <span className="opacity-0 group-hover:opacity-100">&lt;-</span>
                                            </button>
                                        </li>
                                    </ul>
                                </NewspaperCard>
                            </div>

                            {/* Upcoming */}
                            <NewspaperCard className="p-6 bg-paper">
                                <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-black pb-2 flex justify-between items-center">
                                    Up Next
                                    <Doodle src="/doodles/calendar.svg" className="w-6 h-6" />
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start group cursor-pointer">
                                        <div className="bg-accent-pink border-2 border-black px-3 py-2 text-center shrink-0 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-none transition-all">
                                            <p className="text-xs font-bold">NOV</p>
                                            <p className="font-bold text-xl leading-none">24</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm group-hover:underline">Freshers' Night</p>
                                            <p className="text-xs text-gray-500 font-mono">6:00 PM • Auditorium</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start group cursor-pointer">
                                        <div className="bg-accent-blue border-2 border-black px-3 py-2 text-center shrink-0 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-none transition-all">
                                            <p className="text-xs font-bold">DEC</p>
                                            <p className="font-bold text-xl leading-none">01</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm group-hover:underline">Code Chaos Hackathon</p>
                                            <p className="text-xs text-gray-500 font-mono">All Day • CS Lab</p>
                                        </div>
                                    </div>
                                </div>
                            </NewspaperCard>

                            {/* Ad/Promo */}
                            <div className="relative group cursor-pointer">
                                <NewspaperCard className="bg-white p-4 border-dashed border-2 border-gray-400">
                                    <div className="absolute -top-2 -left-2 bg-accent-yellow text-xs font-bold px-2 py-1 border border-black rotate-[-6deg]">AD</div>
                                    <div className="text-center">
                                        <Doodle src="/doodles/shopping-bag.svg" className="w-16 h-16 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <h4 className="font-black text-lg">CAMPUS STORE SALE!</h4>
                                        <p className="text-xs text-gray-500">Get 20% off on all hoodies.</p>
                                    </div>
                                </NewspaperCard>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
