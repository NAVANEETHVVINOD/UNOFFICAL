"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, HangingCard, Sticker, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import Link from 'next/link';

// Mock Data for Colleges
const COLLEGES = [
    {
        id: 'c1',
        name: 'Tech Institute',
        slug: 'tech-institute',
        type: 'Engineering',
        color: 'bg-accent-blue',
        icon: '/doodles/robot.svg', // Placeholder
        stats: '2.5k Students',
        slogan: 'Code. Sleep. Repeat.'
    },
    {
        id: 'c2',
        name: 'Arts Academy',
        slug: 'arts-academy',
        type: 'Arts & Design',
        color: 'bg-accent-pink',
        icon: '/doodles/paint.svg', // Placeholder
        stats: '1.2k Creatives',
        slogan: 'Create Chaos.'
    },
    {
        id: 'c3',
        name: 'Business School',
        slug: 'business-school',
        type: 'Management',
        color: 'bg-accent-yellow',
        icon: '/doodles/briefcase.svg', // Placeholder
        stats: '1.8k Leaders',
        slogan: 'Stonks only go up.'
    },
    {
        id: 'c4',
        name: 'Medical Campus',
        slug: 'medical-campus',
        type: 'Medical',
        color: 'bg-accent-purple',
        icon: '/doodles/heart.svg', // Placeholder
        stats: '900 Healers',
        slogan: 'Trust me, I\'m a doctor.'
    }
];

export default function SelectCollegePage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (slug: string) => {
        setSelected(slug);
        // Simulate loading/transition
        setTimeout(() => {
            router.push(`/login?college=${slug}`);
        }, 500);
    };

    return (
        <PageTransition>
            <div className="min-h-screen w-full bg-[#f0f0f0] relative overflow-hidden pb-20">
                {/* Background Doodles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute top-20 left-10 animate-float-slow">
                        <Doodle src="/doodles/cloud.svg" className="w-48 mix-blend-multiply" />
                    </div>
                    <div className="absolute bottom-40 right-20 animate-float-delayed">
                        <Doodle src="/doodles/star.svg" className="w-32 mix-blend-multiply" />
                    </div>
                </div>

                <Container>
                    <div className="pt-12 pb-8 text-center relative z-10">
                        <Link href="/" className="inline-block mb-8 transform hover:scale-105 transition-transform">
                            <div className="flex items-center gap-2 transform -rotate-2">
                                <div className="w-10 h-10 bg-accent-yellow border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-black font-black text-xl font-display">L</div>
                                <span className="font-display font-black text-2xl tracking-wide text-black drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">LINKER</span>
                            </div>
                        </Link>

                        <h1 className="font-display text-5xl md:text-7xl font-black mb-4 relative inline-block">
                            PICK YOUR <span className="text-accent-blue">BASE</span>
                            <Doodle src="/doodles/arrow-scribble.svg" className="absolute -right-16 -top-8 w-16 h-16 transform rotate-12 hidden md:block" />
                        </h1>
                        <p className="text-xl text-gray-600 font-serif italic max-w-2xl mx-auto">
                            Every campus has its own vibe. Find yours to enter the chaos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-4">
                        {COLLEGES.map((college, index) => (
                            <div
                                key={college.id}
                                className="relative group cursor-pointer"
                                onClick={() => handleSelect(college.slug)}
                                style={{ marginTop: index % 2 === 0 ? '0' : '3rem' }} // Staggered grid
                            >
                                <HangingCard
                                    className={`h-full transition-all duration-300 ${selected === college.slug ? 'scale-105 ring-4 ring-black ring-offset-4' : 'group-hover:-translate-y-2'}`}
                                    rotate={index % 2 === 0 ? -2 : 2}
                                >
                                    <div className={`h-32 ${college.color} relative overflow-hidden border-b-2 border-black`}>
                                        <div className="absolute inset-0 bg-black/10"></div>
                                        {/* Pattern overlay */}
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

                                        <Sticker className="top-2 right-2 bg-white" rotate={5}>{college.type}</Sticker>

                                        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <h3 className="font-display text-2xl font-black text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] leading-none uppercase">
                                                {college.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white">
                                        <p className="font-serif italic text-gray-500 mb-4 text-sm">"{college.slogan}"</p>

                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs font-bold uppercase tracking-wider">{college.stats}</span>
                                        </div>

                                        <RetroButton
                                            variant={selected === college.slug ? 'primary' : 'outline'}
                                            className="w-full text-xs py-2"
                                        >
                                            {selected === college.slug ? 'ENTERING...' : 'SELECT CAMPUS'}
                                        </RetroButton>
                                    </div>
                                </HangingCard>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-gray-500 font-pixel">
                            DON'T SEE YOUR COLLEGE? <a href="#" className="underline decoration-accent-pink decoration-2 font-bold text-black hover:text-accent-pink">REQUEST ACCESS</a>
                        </p>
                    </div>
                </Container>
            </div>
        </PageTransition>
    );
}
