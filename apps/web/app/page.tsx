"use client";

import Link from "next/link";
import Container from "./components/ui/Container";
import {
    NewspaperCard,
    RetroButton,
    Badge,
    Marquee,
    HangingCard,
    Sticker,
    Tape
} from "./components/ui/NewspaperUI";
import Doodle from "./components/ui/Doodle";
import BottomNav from "./components/ui/BottomNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { ArrowRight, CheckCircle2, ChevronRight, Terminal, Zap } from "lucide-react";

export default function Home() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, user, router]);

    return (
        <div className="min-h-screen bg-gray-100 relative overflow-x-hidden selection:bg-accent-yellow selection:text-black">
            {/* Dot Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}>
            </div>

            {/* Custom Landing Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-gray-200">
                <Container className="py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xl font-display transform -rotate-3">
                            L
                        </div>
                        <span className="font-display font-black text-xl tracking-tight">LINKER OS</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="hidden md:block font-bold text-sm hover:text-gray-600 transition-colors">
                            Log In
                        </Link>
                        <Link href="/register">
                            <RetroButton className="px-6 py-2 text-sm !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                Get Started
                            </RetroButton>
                        </Link>
                    </div>
                </Container>
            </nav>

            <main className="pt-32 relative z-10">
                <Container>
                    <div className="grid lg:grid-cols-12 gap-12 mb-24 items-center">
                        {/* Left Content (Hero Pitch) */}
                        <div className="lg:col-span-7 relative">
                            <Badge className="mb-6 bg-accent-yellow border-black animate-pulse">
                                v1.7 PUBLIC BETA
                            </Badge>

                            <h1 className="font-display font-black text-6xl md:text-8xl leading-[0.9] mb-8 tracking-tighter">
                                THE OPERATING
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-pink to-accent-yellow">
                                    SYSTEM
                                </span>
                                <br />
                                FOR CAMPUS.
                            </h1>

                            <p className="font-serif italic text-2xl md:text-3xl text-gray-500 mb-10 max-w-xl leading-relaxed">
                                Vertical SaaS for the modern university. Connecting students, clubs, and admin in one chaotic-good ecosystem.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/register">
                                    <RetroButton variant="primary" className="px-8 py-4 text-lg flex items-center gap-2 group">
                                        Deploy to Campus <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </RetroButton>
                                </Link>
                                <Link href="/login">
                                    <RetroButton variant="outline" className="px-8 py-4 text-lg bg-white">
                                        View Demo
                                    </RetroButton>
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-6 text-sm font-bold text-gray-500">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Free for Students
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Open Source
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" /> No Admin Required
                                </span>
                            </div>
                        </div>

                        {/* Right Content (Visual Stack) */}
                        <div className="lg:col-span-5 relative hidden lg:block h-[600px]">
                            {/* Card Stack Animation */}
                            <div className="relative w-full h-full">
                                {/* Card 3 (Back) */}
                                <div className="absolute top-12 right-0 w-80 rotate-6 hover:rotate-12 transition-all duration-500 z-10">
                                    <NewspaperCard className="bg-gray-900 border-gray-800 text-gray-400 p-6 h-64">
                                        <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
                                            <Terminal className="w-5 h-5" />
                                            <span className="font-mono text-xs">EVENTS_MODULE.exe</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                                            <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    </NewspaperCard>
                                </div>

                                {/* Card 2 (Middle) */}
                                <div className="absolute top-24 right-12 w-80 -rotate-3 hover:-rotate-6 transition-all duration-500 z-20">
                                    <NewspaperCard className="bg-gray-100 p-6 h-64 border-gray-300">
                                        <div className="flex justify-between items-center mb-4">
                                            <Badge className="bg-gray-200 text-gray-600 border-none">MARKETPLACE</Badge>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <h3 className="font-bold text-2xl mb-1">Textbook Exchange</h3>
                                        <p className="text-xs text-gray-500">P2P Asset Liquidation Protocol.</p>
                                    </NewspaperCard>
                                </div>

                                {/* Card 1 (Front - Hero) */}
                                <div className="absolute top-40 right-24 w-80 rotate-2 hover:rotate-0 transition-all duration-300 z-30">
                                    <NewspaperCard className="bg-accent-yellow p-6 h-64 shadow-2xl flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-display font-black text-4xl mb-1">LINKER</h3>
                                                <p className="font-mono text-xs uppercase tracking-widest opacity-60">Unified Dashboard</p>
                                            </div>
                                            <Sticker className="bg-black text-white" rotate={12}>CORE</Sticker>
                                        </div>

                                        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-xl border-2 border-black/10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
                                                    You
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm leading-none">Complete Control.</p>
                                                    <p className="text-[10px] uppercase font-mono mt-1 opacity-60">Status: Online</p>
                                                </div>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>

                {/* Full Width Marquee - Right to Left */}
                <div className="w-full bg-black py-6 border-y-4 border-black transform -rotate-1 mb-32 overflow-hidden relative left-[50%] -translate-x-[50%] w-screen">
                    <Marquee speed={50} direction="left">
                        <span className="text-white font-display text-4xl mx-12">ACADEMIC CHAOS AS A SERVICE™</span>
                        <Star />
                        <span className="text-accent-yellow font-display text-4xl mx-12">NOT JUST ANOTHER NOTICE BOARD</span>
                        <Star />
                        <span className="text-white font-display text-4xl mx-12">BUILT FOR THE MODERN CAMPUS</span>
                        <Star />
                        <span className="text-accent-pink font-display text-4xl mx-12">SLEEP IS OPTIONAL</span>
                        <Star />
                    </Marquee>
                </div>

                {/* Features Grid */}
                <Container className="mb-32">
                    <div className="text-center mb-16">
                        <Badge className="bg-white mb-4">PLATFORM MODULES</Badge>
                        <h2 className="font-display font-black text-4xl md:text-5xl">ENTERPRISE GRADE CHAOS.</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            title="Events API"
                            description="Automated scheduling protocol. Never miss a hackathon or a free pizza session again."
                            icon={<CalendarIcon />}
                            color="bg-accent-blue"
                        />
                        <FeatureCard
                            title="Club Infrastructure"
                            description="Member management and recruitment pipeline for the next generation of leaders."
                            icon={<GroupIcon />}
                            color="bg-accent-pink"
                        />
                        <FeatureCard
                            title="Asset Marketplace"
                            description="Decentralized exchange for notes, drafters, and questionable canteen coupons."
                            icon={<MarketIcon />}
                            color="bg-accent-yellow"
                        />
                    </div>
                </Container>

                {/* Bottom CTA */}
                <div className="border-t-2 border-dashed border-gray-300 bg-white py-24">
                    <Container className="text-center">
                        <h2 className="font-display font-black text-5xl md:text-7xl mb-8">
                            READY TO SYNC?
                        </h2>
                        <p className="font-serif italic text-2xl text-gray-500 mb-12">
                            Join 500+ students pretending to have it together.
                        </p>
                        <Link href="/register">
                            <RetroButton className="px-12 py-6 text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                                Launch Linker OS
                            </RetroButton>
                        </Link>
                    </Container>
                </div>

                {/* Footer */}
                <footer className="bg-black text-white py-12">
                    <Container className="flex flex-col md:flex-row justify-between items-center opacity-60 text-sm font-mono">
                        <p>© 2025 LINKER SYSTEMS. ALL RIGHTS RESERVED.</p>
                        <p>DESIGNED WITH <span className="text-red-500">♥</span> AND CAFFEINE.</p>
                    </Container>
                </footer>
            </main>
        </div>
    );
}

// Subcomponents for cleanliness

function FeatureCard({ title, description, icon, color }: any) {
    return (
        <NewspaperCard className="p-8 hover:-translate-y-2 transition-transform h-full flex flex-col">
            <div className={`w-16 h-16 ${color} rounded-2xl border-2 border-black flex items-center justify-center mb-6 shadow-neo-sm`}>
                {icon}
            </div>
            <h3 className="font-bold text-2xl mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                {description}
            </p>
        </NewspaperCard>
    )
}

function Star() {
    return <span className="text-accent-blue text-4xl">★</span>
}

function CalendarIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
    )
}

function GroupIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    )
}

function MarketIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    )
}
