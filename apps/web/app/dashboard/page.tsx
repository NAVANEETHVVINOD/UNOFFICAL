"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { isAuthenticated } = useAuth();
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
                <div className="py-12">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-12 border-b-2 border-black pb-6">
                        <div>
                            <p className="font-pixel text-xl text-gray-500 mb-2">WELCOME_BACK_USER_01</p>
                            <h1 className="font-display text-5xl font-black">DASHBOARD</h1>
                        </div>
                        <div className="text-right hidden md:block">
                            <Badge>ONLINE</Badge>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Main Column (Left) */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Welcome Section */}
                            <div className="relative mt-4">
                                <Staple />
                                <NewspaperCard className="bg-accent-yellow/10 p-8">
                                    <div className="flex items-start gap-6">
                                        <div className="hidden md:block w-24 shrink-0">
                                            <Doodle src="/doodles/sparkle.svg" className="w-full" />
                                        </div>
                                        <div>
                                            <h2 className="font-serif text-3xl italic mb-4">Good Morning, Alex.</h2>
                                            <p className="text-lg mb-6">
                                                You have <strong>3 classes</strong> today and <strong>1 event</strong> tonight.
                                                Don't forget to submit your assignment for CS101.
                                            </p>
                                            <RetroButton className="text-sm">VIEW SCHEDULE</RetroButton>
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </div>

                            {/* Recent Updates */}
                            <div>
                                <h3 className="font-bold text-xl uppercase mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-black"></span>
                                    Latest Headlines
                                </h3>
                                <div className="space-y-4">
                                    <NewspaperCard className="hover:bg-gray-50 transition-colors cursor-pointer p-6" noShadow>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 border border-black shrink-0 flex items-center justify-center">
                                                <Doodle src="/doodles/group.svg" className="w-8 h-8 opacity-50" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg leading-tight mb-2">Photography Club Meeting Rescheduled</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                    Due to rain, the outdoor shoot is cancelled. We will meet in Room 304 instead.
                                                </p>
                                                <p className="text-xs font-pixel text-gray-400">2 hours ago • Clubs</p>
                                            </div>
                                        </div>
                                    </NewspaperCard>

                                    <NewspaperCard className="hover:bg-gray-50 transition-colors cursor-pointer p-6" noShadow>
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-100 border border-black shrink-0 flex items-center justify-center">
                                                <Doodle src="/doodles/book.svg" className="w-8 h-8 opacity-50" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg leading-tight mb-2">New Notes Added: Physics 101</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                                    Sarah J. uploaded her handwritten notes for Chapter 4: Thermodynamics.
                                                </p>
                                                <p className="text-xs font-pixel text-gray-400">5 hours ago • Resources</p>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar (Right) */}
                        <div className="space-y-8">
                            {/* Quick Actions */}
                            <NewspaperCard className="bg-black text-white p-6">
                                <h3 className="font-pixel text-xl text-accent-yellow mb-6">&gt; QUICK_ACTIONS</h3>
                                <ul className="space-y-3">
                                    <li>
                                        <button className="w-full text-left py-2 border-b border-gray-800 hover:text-accent-blue transition-colors font-mono text-sm">
                                            [+] Create New Event
                                        </button>
                                    </li>
                                    <li>
                                        <button className="w-full text-left py-2 border-b border-gray-800 hover:text-accent-blue transition-colors font-mono text-sm">
                                            [+] Upload Notes
                                        </button>
                                    </li>
                                    <li>
                                        <button className="w-full text-left py-2 hover:text-accent-blue transition-colors font-mono text-sm">
                                            [+] Sell Item
                                        </button>
                                    </li>
                                </ul>
                            </NewspaperCard>

                            {/* Upcoming */}
                            <NewspaperCard className="p-6">
                                <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-black pb-2">Up Next</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-3 items-start">
                                        <div className="bg-accent-pink border border-black px-2 py-1 text-center shrink-0 text-white">
                                            <p className="text-xs font-bold">NOV</p>
                                            <p className="font-bold text-lg leading-none">24</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Freshers' Night</p>
                                            <p className="text-xs text-gray-500">6:00 PM • Auditorium</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start">
                                        <div className="bg-accent-blue border border-black px-2 py-1 text-center shrink-0 text-white">
                                            <p className="text-xs font-bold">DEC</p>
                                            <p className="font-bold text-lg leading-none">01</p>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Code Chaos Hackathon</p>
                                            <p className="text-xs text-gray-500">All Day • CS Lab</p>
                                        </div>
                                    </div>
                                </div>
                            </NewspaperCard>
                        </div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
