"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import Navigation from '../components/layout/Navigation';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <>
            <Navigation />
            <PageTransition>
                <Container>
                    <div className="py-12">
                        <div className="max-w-2xl mx-auto">
                            <div className="text-center mb-8">
                                <h1 className="h1-display">STUDENT PROFILE</h1>
                                <p className="font-hand text-gray-600">"Who are you, again?"</p>
                            </div>

                            {/* ID Card */}
                            <div className="relative mb-12">
                                <Tape className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20" />
                                <NewspaperCard className="border-4 p-0 overflow-hidden relative">
                                    {/* Header */}
                                    <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-white rounded-full"></div>
                                            <span className="font-bold tracking-widest">LINKER ID</span>
                                        </div>
                                        <span className="font-mono text-sm">#882910</span>
                                    </div>

                                    <div className="p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
                                        {/* Photo */}
                                        <div className="shrink-0 relative">
                                            <div className="w-32 h-40 bg-gray-200 border-2 border-black flex items-center justify-center overflow-hidden">
                                                <Doodle src="/doodles/students-hero.svg" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute -bottom-3 -right-3 bg-accent-yellow border-2 border-black px-2 py-1 text-xs font-bold transform -rotate-6">
                                                ACTIVE
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 w-full space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase">Name</label>
                                                <p className="font-display text-2xl">ALEXANDER SMITH</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase">Major</label>
                                                    <p className="font-bold">Computer Science</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-500 uppercase">Year</label>
                                                    <p className="font-bold">Junior (2025)</p>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase">Bio</label>
                                                <p className="font-hand text-lg leading-tight">
                                                    "I code, I coffee, I conquer (sometimes). Looking for a study buddy for Algorithms."
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-gray-100 p-4 border-t-4 border-black flex justify-between items-center">
                                        <div className="h-8 w-32 bg-black opacity-20"></div> {/* Barcode placeholder */}
                                        <p className="text-xs font-bold text-gray-500">VALID THRU 2026</p>
                                    </div>
                                </NewspaperCard>
                            </div>

                            {/* Stats / Activity */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <NewspaperCard className="text-center py-4 bg-accent-blue/10">
                                    <p className="text-3xl font-display">12</p>
                                    <p className="text-xs font-bold uppercase">Events</p>
                                </NewspaperCard>
                                <NewspaperCard className="text-center py-4 bg-accent-yellow/10">
                                    <p className="text-3xl font-display">5</p>
                                    <p className="text-xs font-bold uppercase">Clubs</p>
                                </NewspaperCard>
                                <NewspaperCard className="text-center py-4 bg-green-100">
                                    <p className="text-3xl font-display">8</p>
                                    <p className="text-xs font-bold uppercase">Notes</p>
                                </NewspaperCard>
                            </div>

                            <div className="flex justify-center gap-4">
                                <RetroButton>EDIT PROFILE</RetroButton>
                                <RetroButton className="bg-white text-black border-2 border-black">SETTINGS</RetroButton>
                            </div>
                        </div>
                    </div>
                </Container>
            </PageTransition>
        </>
    );
}
