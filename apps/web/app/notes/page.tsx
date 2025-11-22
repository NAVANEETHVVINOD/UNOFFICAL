"use client"

import Navigation from '../components/layout/Navigation'
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotesPage() {
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
                        <div className="flex items-center gap-4 mb-8">
                            <h1 className="h1-display">NOTES & RESOURCES</h1>
                            <Doodle src="/doodles/arrow-scribble.svg" className="w-16 h-16 transform rotate-90" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Sidebar / Binder Tabs */}
                            <div className="w-full md:w-64 shrink-0">
                                <div className="bg-white border-4 border-black p-4 sticky top-8">
                                    <h3 className="font-bold text-xl mb-4 uppercase border-b-2 border-black pb-2">Departments</h3>
                                    <ul className="space-y-2 font-hand text-lg">
                                        <li className="cursor-pointer hover:text-accent-blue">→ Computer Science</li>
                                        <li className="cursor-pointer hover:text-accent-blue">→ Mechanical Eng.</li>
                                        <li className="cursor-pointer hover:text-accent-blue">→ Business</li>
                                        <li className="cursor-pointer hover:text-accent-blue">→ Arts & Design</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 grid gap-6">
                                {/* Note Item */}
                                <NewspaperCard className="flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-12 h-16 bg-gray-200 border border-black shrink-0 flex items-center justify-center">
                                        <span className="font-bold text-xs">PDF</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">Data Structures & Algorithms - Unit 1</h3>
                                        <p className="text-sm text-gray-600 mb-2">Uploaded by Prof. Smith • 2 days ago</p>
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-black text-white px-2 py-0.5">CS101</span>
                                            <span className="text-xs border border-black px-2 py-0.5">Lecture Notes</span>
                                        </div>
                                    </div>
                                    <div className="self-center">
                                        <RetroButton className="text-xs px-3 py-1">DOWNLOAD</RetroButton>
                                    </div>
                                </NewspaperCard>

                                {/* Note Item */}
                                <NewspaperCard className="flex items-start gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="w-12 h-16 bg-gray-200 border border-black shrink-0 flex items-center justify-center">
                                        <span className="font-bold text-xs">IMG</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg">Engineering Mechanics - Solved Problems</h3>
                                        <p className="text-sm text-gray-600 mb-2">Uploaded by Topper Tom • 1 week ago</p>
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-black text-white px-2 py-0.5">ME202</span>
                                            <span className="text-xs border border-black px-2 py-0.5">Practice</span>
                                        </div>
                                    </div>
                                    <div className="self-center">
                                        <RetroButton className="text-xs px-3 py-1">DOWNLOAD</RetroButton>
                                    </div>
                                </NewspaperCard>
                            </div>
                        </div>
                    </div>
                </Container>
            </PageTransition>
        </>
    );
}
