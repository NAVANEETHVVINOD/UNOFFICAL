"use client";

import Link from "next/link";
import Container from "./components/ui/Container";
import {
    NewspaperCard,
    RetroButton,
    Badge,
    Staple,
    EventRow,
    Marquee,
    Tape,
    HangingCard,
    Sticker,
} from "./components/ui/NewspaperUI";
import Doodle from "./components/ui/Doodle";
import BottomNav from "./components/ui/BottomNav";
import Navbar from "./components/Navbar";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";

export default function Home() {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated && user) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, user, router]);

    return (

        <Container>
            <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden -z-10">
                <img
                    src="/doodles/header-vangof.jpg"
                    alt="Header Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white"></div>
            </div>
            <Container>
                <div className="py-8 pb-24 md:pb-8">
                    {/* Custom Landing Navbar */}
                    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-gray-200">
                        <Container className="py-4 flex justify-between items-center">
                            {/* Logo */}
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

                    <div className="pt-24">
                        <h1 className="text-center mb-6">
                            <span
                                className="block uppercase moo-lah-lah-regular transform -rotate-2 hover:rotate-0 transition-transform duration-500 text-hero-moo"
                                style={{
                                    fontSize: "clamp(2.5rem, 8vw, 5rem)",
                                    letterSpacing: "3px",
                                    lineHeight: 1.2,
                                }}
                            >
                                THE OPERATING
                                <br />
                                SYSTEM FOR CAMPUS.
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-serif italic px-4 text-center">
                            Because colleges still run on WhatsApp groups.
                            <br />
                            <span className="font-bold text-black">
                                We thought… maybe don't.
                            </span>
                        </p>

                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Link href="/register">
                                <RetroButton
                                    variant="secondary"
                                    className="px-10 py-4 text-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                                >
                                    Get Early Access
                                </RetroButton>
                            </Link>
                            <Link href="/dashboard">
                                <RetroButton
                                    variant="outline"
                                    className="px-10 py-4 text-base"
                                >
                                    Deploy to Campus
                                </RetroButton>
                            </Link>
                        </div>
                    </div>

                    {/* Right Content (Visual Stack - Monochrome) */}
                    <div className="absolute top-32 -right-10 md:top-24 md:right-12 z-20 scale-[0.6] md:scale-100 origin-top-right w-80 h-80 hidden md:block">
                        {/* Card 1 (Back - Events) */}
                        <div className="absolute top-0 right-0 w-64 h-64 rotate-6 hover:rotate-12 transition-all duration-500 z-10">
                            <NewspaperCard className="bg-black text-white p-6 h-full flex flex-col justify-between">
                                <div className="text-xs font-mono border border-white/30 rounded px-2 py-1 self-start">MODULE_01</div>
                                <h3 className="font-display text-4xl">EVENTS</h3>
                                <Doodle src="/doodles/calendar.svg" className="w-12 h-12 text-white/50 self-end" />
                            </NewspaperCard>
                        </div>

                        {/* Card 2 (Middle - Market) */}
                        <div className="absolute top-4 right-4 w-64 h-64 -rotate-3 hover:-rotate-6 transition-all duration-500 z-20">
                            <NewspaperCard className="bg-white border-2 border-black p-6 h-full flex flex-col justify-between">
                                <div className="text-xs font-mono border border-black/30 rounded px-2 py-1 self-start">MODULE_02</div>
                                <h3 className="font-display text-4xl">MARKET</h3>
                                <Doodle src="/doodles/shopping-bag.svg" className="w-12 h-12 text-black/50 self-end" />
                            </NewspaperCard>
                        </div>

                        {/* Card 3 (Front - Clubs) */}
                        <div className="absolute top-8 right-8 w-64 h-64 bg-accent-yellow rotate-2 hover:rotate-0 transition-all duration-300 z-30 shadow-2xl">
                            <NewspaperCard className="bg-transparent border-0 p-6 h-full flex flex-col justify-between">
                                <div className="text-xs font-mono border border-black/30 rounded px-2 py-1 self-start bg-white/50">MODULE_03</div>
                                <h3 className="font-display text-4xl">CLUBS</h3>
                                <Doodle src="/doodles/group.svg" className="w-12 h-12 text-black self-end" />
                            </NewspaperCard>
                        </div>
                    </div>

                    {/* Marquee Section (Full Width) */}
                    <div className="mb-24 mt-24 w-screen relative left-1/2 right-1/2 ml-[-50vw] mr-[-50vw] overflow-hidden bg-black py-6 border-y-4 border-black transform -rotate-1">
                        <Marquee speed={40} direction="left">
                            <span className="text-white font-pixel text-3xl mx-12">
                                /// OPERATING_SYSTEM_FOR_CAMPUS ///
                            </span>
                            <span className="text-accent-yellow font-serif italic text-3xl mx-12">
                                Zero Chaos.
                            </span>
                            <span className="text-white font-pixel text-3xl mx-12">
                                /// VERTICAL_SAAS_V2.0 ///
                            </span>
                            <span className="text-accent-blue font-serif italic text-3xl mx-12">
                                Less WhatsApp. More Life.
                            </span>
                        </Marquee>
                    </div>

                    {/* Feature 1: The Problem */}
                    <div className="grid md:grid-cols-12 gap-8 mb-24">
                        <div className="md:col-span-12">
                            <div className="text-center mb-12">
                                <Badge className="mb-4 bg-red-500 text-white border-black">
                                    THE_PROBLEM
                                </Badge>
                                <h2 className="font-display text-5xl font-black mb-4">
                                    COLLEGES RUN ON WHATSAPP.
                                </h2>
                                <p className="text-xl text-gray-600 font-serif italic">
                                    (It's 2025. Please stop.)
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-6 md:col-start-4">
                            <NewspaperCard
                                variant="curved"
                                className="h-full p-8 md:p-12 bg-white relative overflow-hidden rotate-1 hover:rotate-0 transition-transform"
                            >
                                <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />
                                <h2 className="font-display text-3xl font-bold mb-6">
                                    Current Status: <span className="text-red-500">CHAOS</span>
                                </h2>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-red-100 rounded text-red-500 flex items-center justify-center text-xs font-bold">X</div>
                                        <span className="text-gray-600">Communication is scattered</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-red-100 rounded text-red-500 flex items-center justify-center text-xs font-bold">X</div>
                                        <span className="text-gray-600">Clubs are unstructured</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-red-100 rounded text-red-500 flex items-center justify-center text-xs font-bold">X</div>
                                        <span className="text-gray-600">Events are manual</span>
                                    </li>
                                </ul>
                            </NewspaperCard>
                        </div>
                    </div>

                    {/* Feature 2: The Solution (Modules) */}
                    <div className="mb-32">
                        <div className="text-center mb-12">
                            <Badge className="mb-4 bg-accent-green text-black border-black">
                                THE_SOLUTION
                            </Badge>
                            <h2 className="font-display text-5xl font-black mb-4">
                                LINKER OS
                            </h2>
                            <p className="text-xl text-gray-600 font-serif italic">
                                Vertical SaaS for the modern university.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Module 1 */}
                            <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                    01
                                </div>
                                <h3 className="font-bold text-xl mb-2">Social Feed</h3>
                                <p className="text-sm text-gray-600">
                                    Posts, polls, and collabs. The campus town square, digitized.
                                </p>
                            </NewspaperCard>

                            {/* Module 2 */}
                            <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                    02
                                </div>
                                <h3 className="font-bold text-xl mb-2">Events Protocol</h3>
                                <p className="text-sm text-gray-600">
                                    Automated scheduling, QR check-ins, and analytics.
                                </p>
                            </NewspaperCard>

                            {/* Module 3 */}
                            <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                    03
                                </div>
                                <h3 className="font-bold text-xl mb-2">Asset Market</h3>
                                <p className="text-sm text-gray-600">
                                    Decentralized exchange for notes, drafters, and coupons.
                                </p>
                            </NewspaperCard>
                        </div>
                    </div>

                    {/* Bottom Motivation Marquee */}
                    <div className="mb-24 -mx-4 md:-mx-8 transform rotate-1">
                        <div className="bg-white py-4 border-y-4 border-black shadow-xl">
                            <Marquee speed={40} direction="right">
                                <span className="text-black font-pixel text-4xl mx-8 uppercase">
                                    Link. Learn. Live.
                                </span>
                                <span className="text-gray-400 font-serif italic text-3xl mx-8">
                                    &quot;Sleep is for the weak (and the graduated)&quot;
                                </span>
                                <span className="text-black font-pixel text-4xl mx-8 uppercase">
                                    Link. Learn. Live.
                                </span>
                                <span className="text-gray-400 font-serif italic text-3xl mx-8">
                                    &quot;Coffee: The real MVP&quot;
                                </span>
                            </Marquee>
                        </div>
                    </div>
                </div>

                {/* Mobile Bottom Navigation */}
                <BottomNav />
            </Container>
        </Container>
    );
}
