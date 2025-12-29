"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
import Carousel from "./components/ui/Carousel";
import Navbar from "./components/Navbar";
import LandingNavbar from "./components/LandingNavbar";
import Loading from "./loading";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import { checkOnboardingStatus } from "./hooks/useOnboardingGuard";

export default function Home() {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();
    const [showLanding, setShowLanding] = useState(false);

    // Force light mode on landing page only
    useEffect(() => {
        const root = document.documentElement;
        // Store current theme to restore later
        const hadDarkClass = root.classList.contains("dark");
        
        // Force light mode for landing page
        root.classList.remove("dark");
        
        // Cleanup: restore dark mode when leaving landing page if it was enabled
        return () => {
            const storedTheme = localStorage.getItem("linker-theme");
            if (storedTheme === "dark" || hadDarkClass) {
                root.classList.add("dark");
            }
        };
    }, []);

    useEffect(() => {
        // Wait for auth to finish loading
        if (loading) return;

        if (isAuthenticated && user) {
            // Check onboarding status and redirect accordingly
            const { isComplete, missingFields } = checkOnboardingStatus(user);
            
            if (!isComplete) {
                if (missingFields.includes("collegeId") && !missingFields.includes("fullName")) {
                    router.replace("/onboarding?step=college");
                } else {
                    router.replace("/onboarding");
                }
            } else {
                router.replace("/dashboard");
            }
        } else {
            // Not authenticated - show landing page
            setShowLanding(true);
        }
    }, [isAuthenticated, user, loading, router]);

    // Show loading while checking auth
    if (loading || (!showLanding && !isAuthenticated)) {
        return <Loading />;
    }

    // Show landing page for non-authenticated users
    return (

        <Container>
            {/* Landing Navbar */}
            <LandingNavbar />
            
            {/* Spacer for fixed navbar */}
            <div className="h-16" />
            
            <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden -z-10">
                <img
                    src="/doodles/header-vangof.jpg"
                    alt="Header Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white"></div>
            </div>
            <Container>
                <div className="py-8 pb-24 md:pb-8 pt-20">
                    {/* Navbar */}

                    <div>
                        {/* Enhanced Hero with Pixel Font */}
                        <motion.h1 
                            className="text-center mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                className="block uppercase font-pixel transform -rotate-2 hover:rotate-0 transition-transform duration-500 text-hero-moo tracking-wider"
                                style={{
                                    fontSize: "clamp(2rem, 6vw, 4rem)",
                                    letterSpacing: "4px",
                                    lineHeight: 1.3,
                                    textShadow: "3px 3px 0px rgba(0,0,0,0.1)",
                                }}
                            >
                                Academic Chaos as a Service.™
                            </span>
                        </motion.h1>

                        <motion.p 
                            className="text-lg md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-hand italic px-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Finally, a place where chaos meets structure.
                            <span className="bg-accent-yellow/30 px-2 rounded-md mx-1 not-italic font-bold">
                                (Barely.)
                            </span>
                        </motion.p>

                        <motion.div 
                            className="flex flex-col md:flex-row justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <Link href="/register">
                                <RetroButton
                                    variant="secondary"
                                    className="px-10 py-4 text-base shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                                >
                                    I&apos;m in.
                                </RetroButton>
                            </Link>
                            <Link href="/dashboard">
                                <RetroButton
                                    variant="outline"
                                    className="px-10 py-4 text-base"
                                >
                                    Show me around.
                                </RetroButton>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Left Card - Retro TV Style - Hidden on mobile */}
                    <div className="hidden md:block absolute top-4 left-4 z-20">
                        <HangingCard className="w-52 p-4 bg-gradient-to-br from-indigo-950 to-slate-900 text-white rotate-[-6deg] rounded-3xl shadow-xl border-2 border-indigo-800">
                            <Sticker
                                className="top-2 right-2 bg-accent-pink text-white"
                                rotate={12}
                            >
                                LIVE
                            </Sticker>
                            <div className="border-4 border-white/10 rounded-2xl p-2 bg-black/40 backdrop-blur-sm">
                                {/* TV Screen */}
                                <div className="bg-white rounded-xl overflow-hidden border-2 border-white/20 relative">
                                    <img
                                        src="/doodles/welcome.jpg"
                                        alt="Welcome"
                                        className="w-full h-48 object-cover"
                                        onError={(e) =>
                                            console.error("Failed to load welcome:", e)
                                        }
                                    />
                                    {/* TV Scanlines */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"></div>
                                </div>
                                {/* TV Base */}
                                <div className="h-2 bg-white/30 mt-2 rounded-full"></div>
                            </div>
                        </HangingCard>
                    </div>

                    {/* Right Card - CD Album Style - Hidden on mobile */}
                    <div className="hidden md:block absolute top-32 right-4 z-20">
                        <HangingCard className="w-48 p-4 bg-gradient-to-br from-gray-800 to-black text-white rotate-[6deg] border-4 border-accent-yellow animate-border-color relative overflow-visible rounded-3xl shadow-xl">
                            <Sticker
                                className="-bottom-3 -left-3 bg-accent-green text-black font-black"
                                rotate={-5}
                            >
                                LIVE
                            </Sticker>

                            <div className="aspect-square rounded-full mb-3 overflow-hidden border-4 border-accent-yellow flex items-center justify-center relative shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                                {/* CD Image with Spin */}
                                <img
                                    src="/doodles/CD.jpg"
                                    alt="CD"
                                    className="w-full h-full object-cover animate-spin-slow"
                                    style={{ animationDuration: "8s" }}
                                    onError={(e) => console.error("Failed to load CD:", e)}
                                />
                                {/* Center Hole */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 bg-black rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm font-pixel text-accent-yellow drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                                    GAME_ON.EXE
                                </span>
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </HangingCard>
                    </div>

                    {/* Marquee Section */}
                    <div className="mb-16 -mx-4 md:-mx-8 transform -rotate-1">
                        <div className="bg-black py-4 border-y-4 border-accent-yellow shadow-xl">
                            <Marquee speed={30}>
                                <span className="text-white font-pixel text-3xl mx-8">
                                    {"/// BREAKING_NEWS: HACKATHON REGISTRATIONS OPEN ///"}
                                </span>
                                <span className="text-accent-yellow font-hand italic text-3xl mx-8">
                                    Don&apos;t miss out!
                                </span>
                                <span className="text-white font-pixel text-3xl mx-8">
                                    {"/// NEW_CLUB_ALERT: ROBOTICS ///"}
                                </span>
                                <span className="text-accent-blue font-hand italic text-3xl mx-8">
                                    Join the revolution
                                </span>
                                <span className="text-white font-pixel text-3xl mx-8">
                                    {"/// EXAM_SCHEDULE_RELEASED ///"}
                                </span>
                                <span className="text-accent-pink font-hand italic text-3xl mx-8">
                                    Panic mode: ON
                                </span>
                            </Marquee>
                        </div>
                    </div>

                    {/* Featured Content Carousel */}
                    <div className="mb-24 -mx-4 md:-mx-8">
                        <div className="text-center mb-8">
                            <Badge className="mb-4 bg-accent-coral text-white border-black">
                                FEATURED
                            </Badge>
                            <h2 className="font-display text-3xl md:text-4xl font-black">
                                WHAT&apos;S HAPPENING
                            </h2>
                        </div>
                        <Carousel
                            items={[
                                <div key="slide1" className="px-4 md:px-8">
                                    <NewspaperCard variant="curved" className="bg-gradient-to-br from-accent-blue to-accent-purple p-8 text-white">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-4xl">🎉</span>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h3 className="font-display text-2xl md:text-3xl font-black mb-2">Freshers&apos; Week 2024</h3>
                                                <p className="text-white/80 font-body">Join us for a week of fun, games, and making new friends!</p>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </div>,
                                <div key="slide2" className="px-4 md:px-8">
                                    <NewspaperCard variant="curved" className="bg-gradient-to-br from-accent-pink to-accent-coral p-8 text-white">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                                                <span className="text-4xl">💻</span>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h3 className="font-display text-2xl md:text-3xl font-black mb-2">Code Chaos Hackathon</h3>
                                                <p className="text-white/80 font-body">24 hours of coding, pizza, and innovation!</p>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </div>,
                                <div key="slide3" className="px-4 md:px-8">
                                    <NewspaperCard variant="curved" className="bg-gradient-to-br from-accent-yellow to-accent-green p-8 text-black">
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className="w-24 h-24 bg-black/10 rounded-full flex items-center justify-center">
                                                <span className="text-4xl">🤖</span>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h3 className="font-display text-2xl md:text-3xl font-black mb-2">Robotics Club Launch</h3>
                                                <p className="text-black/70 font-body">Build the future, one bot at a time!</p>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </div>,
                            ]}
                            autoPlay
                            autoPlayInterval={5000}
                            showDots
                            showArrows
                            fullWidth
                            className="py-4"
                        />
                    </div>

                    {/* About Section */}
                    <div className="grid md:grid-cols-12 gap-8 mb-24">
                        <div className="md:col-span-7">
                            <NewspaperCard
                                variant="curved"
                                className="h-full p-8 md:p-12 bg-white relative overflow-hidden"
                            >
                                <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />
                                <Badge className="mb-6">ABOUT LINKER</Badge>
                                <h2 className="font-display text-4xl md:text-5xl font-black mb-6">
                                    NOT JUST ANOTHER
                                    <br />
                                    <span className="text-accent-blue">NOTICE BOARD.</span>
                                </h2>
                                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                    LINKER is a campus-wide digital platform that centralizes all
                                    student activities, academic resources, club operations,
                                    events, and campus interactions into one integrated system. It
                                    replaces scattered communication with a structured,
                                    accessible, role-based platform.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold mb-1">Student Ecosystem</h4>
                                        <p className="text-sm text-gray-500">
                                            Everything you need to survive college.
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <h4 className="font-bold mb-1">Community Hub</h4>
                                        <p className="text-sm text-gray-500">
                                            Connect, collaborate, and create.
                                        </p>
                                    </div>
                                </div>
                            </NewspaperCard>
                        </div>
                        <div className="md:col-span-5 flex flex-col gap-6">
                            <NewspaperCard
                                variant="curved"
                                className="flex-1 bg-accent-yellow p-8 flex flex-col justify-center relative overflow-hidden group"
                            >
                                <Doodle
                                    src="/doodles/megaphone.svg"
                                    className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20 group-hover:scale-110 transition-transform"
                                />
                                <h3 className="font-display text-6xl font-black mb-2">500+</h3>
                                <p className="font-serif italic text-2xl">Students Connected</p>
                            </NewspaperCard>
                            <NewspaperCard
                                variant="curved"
                                className="flex-1 bg-black text-white p-8 flex flex-col justify-center relative overflow-hidden"
                            >
                                <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <h3 className="font-pixel text-4xl mb-2 text-accent-pink">
                                    LIVE_FEED
                                </h3>
                                <p className="text-gray-400">
                                    Real-time updates from every club and department.
                                </p>
                            </NewspaperCard>
                        </div>
                    </div>

                    {/* The Ecosystem (Roles) */}
                    <div className="mb-32">
                        <div className="text-center mb-12">
                            <h2 className="font-display text-5xl font-black mb-4">
                                THE ECOSYSTEM
                            </h2>
                            <p className="text-xl text-gray-600 font-serif italic">
                                &quot;A role for everyone.&quot;
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Student */}
                            <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-accent-blue rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                    <Doodle
                                        src="/doodles/sparkle.svg"
                                        className="w-6 h-6 text-white"
                                    />
                                </div>
                                <h3 className="font-bold text-xl mb-2">STUDENTS</h3>
                                <ul className="text-sm space-y-2 text-gray-600 list-disc list-inside">
                                    <li>Access all events</li>
                                    <li>Join clubs & communities</li>
                                    <li>Download notes & papers</li>
                                    <li>Buy/Sell in Marketplace</li>
                                </ul>
                            </NewspaperCard>

                            {/* Teacher */}
                            <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-accent-pink rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                    <Doodle
                                        src="/doodles/book.svg"
                                        className="w-6 h-6 text-white"
                                    />
                                </div>
                                <h3 className="font-bold text-xl mb-2">TEACHERS</h3>
                                <ul className="text-sm space-y-2 text-gray-600 list-disc list-inside">
                                    <li>Upload study materials</li>
                                    <li>Post announcements</li>
                                    <li>Manage department events</li>
                                    <li>Approve student posts</li>
                                </ul>
                            </NewspaperCard>

                            {/* Club Leader */}
                            <NewspaperCard className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center mb-4 border-2 border-black">
                                    <Doodle
                                        src="/doodles/group.svg"
                                        className="w-6 h-6 text-black"
                                    />
                                </div>
                                <h3 className="font-bold text-xl mb-2">CLUB LEADERS</h3>
                                <ul className="text-sm space-y-2 text-gray-600 list-disc list-inside">
                                    <li>Create & edit events</li>
                                    <li>Manage club profile</li>
                                    <li>Recruit members</li>
                                    <li>Access event analytics</li>
                                </ul>
                            </NewspaperCard>
                        </div>
                    </div>

                    {/* FEATURE 1: EVENTS SYSTEM */}
                    <div className="mb-32">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <Badge className="mb-4 bg-accent-blue text-white border-black">
                                    MODULE_01
                                </Badge>
                                <h2 className="font-display text-5xl font-black mb-6">
                                    EVENTS SYSTEM
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    Never miss a beat. All college events in one place,
                                    automatically sorted and easy to join.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">Automatic sorting by date</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">Registration/RSVP system</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">
                                            Event details & attachments
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">Save & bookmark events</span>
                                    </li>
                                </ul>
                                <Link href="/events">
                                    <RetroButton variant="secondary">Explore Events</RetroButton>
                                </Link>
                            </div>
                            <div className="order-1 md:order-2">
                                <NewspaperCard
                                    variant="curved"
                                    className="bg-accent-blue p-8 rotate-2 hover:rotate-0 transition-transform"
                                >
                                    <div className="bg-white rounded-3xl p-6 shadow-lg">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="font-bold">UPCOMING_EVENTS</span>
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                                                <div className="w-12 h-12 bg-accent-yellow rounded-full flex items-center justify-center font-bold border border-black">
                                                    24
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">Freshers&apos; Night</h4>
                                                    <p className="text-xs text-gray-500">
                                                        Auditorium • 6 PM
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4">
                                                <div className="w-12 h-12 bg-accent-pink rounded-full flex items-center justify-center font-bold border border-black text-white">
                                                    01
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">Code Chaos</h4>
                                                    <p className="text-xs text-gray-500">
                                                        CS Lab • 9 AM
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </div>
                        </div>
                    </div>

                    {/* FEATURE 2: CLUBS SYSTEM */}
                    <div className="mb-32">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <NewspaperCard
                                    variant="curved"
                                    className="bg-accent-pink p-8 -rotate-2 hover:rotate-0 transition-transform"
                                >
                                    <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
                                        <div className="w-24 h-24 bg-black rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-accent-yellow">
                                            <Doodle
                                                src="/doodles/group.svg"
                                                className="w-12 h-12 text-white"
                                            />
                                        </div>
                                        <h3 className="font-display text-3xl font-black mb-2">
                                            ROBOTICS CLUB
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-6">
                                            Building the future, one bot at a time.
                                        </p>
                                        <div className="flex justify-center gap-2">
                                            <Badge className="bg-gray-100 border-gray-200">
                                                Tech
                                            </Badge>
                                            <Badge className="bg-gray-100 border-gray-200">
                                                Workshop
                                            </Badge>
                                        </div>
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <Link href="/clubs">
                                                <RetroButton className="w-full" variant="outline">
                                                    Join Club
                                                </RetroButton>
                                            </Link>
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </div>
                            <div>
                                <Badge className="mb-4 bg-accent-pink text-white border-black">
                                    MODULE_02
                                </Badge>
                                <h2 className="font-display text-5xl font-black mb-6">
                                    CLUBS DIRECTORY
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    Find your tribe. A complete directory of all college clubs
                                    with profiles, announcements, and member listings.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">
                                            Club profiles & descriptions
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">
                                            Club-specific announcements
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">Easy join requests</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">
                                            Member management for leaders
                                        </span>
                                    </li>
                                </ul>
                                <Link href="/clubs">
                                    <RetroButton variant="secondary">Browse Clubs</RetroButton>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* FEATURE 3: ACADEMIC NOTES */}
                    <div className="mb-32">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <Badge className="mb-4 bg-accent-yellow text-black border-black">
                                    MODULE_03
                                </Badge>
                                <h2 className="font-display text-5xl font-black mb-6">
                                    ACADEMIC NOTES
                                </h2>
                                <p className="text-xl text-gray-600 mb-8">
                                    No more begging for notes. Access study materials, previous
                                    year papers, and resources organized by department.
                                </p>
                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">
                                            Department & semester organization
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">
                                            PDF viewer & download system
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">Teacher & student uploads</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs">
                                            ✓
                                        </div>
                                        <span className="font-bold">
                                            Previous year question papers
                                        </span>
                                    </li>
                                </ul>
                                <Link href="/notes">
                                    <RetroButton variant="secondary">Find Notes</RetroButton>
                                </Link>
                            </div>
                            <div className="order-1 md:order-2">
                                <NewspaperCard
                                    variant="curved"
                                    className="bg-accent-yellow p-8 rotate-2 hover:rotate-0 transition-transform"
                                >
                                    <div className="bg-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-black text-white px-3 py-1 text-xs font-bold rounded-bl-xl">
                                            PDF
                                        </div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                                                <Doodle
                                                    src="/doodles/book.svg"
                                                    className="w-6 h-6 opacity-50"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold">Physics_101_Notes.pdf</h4>
                                                <p className="text-xs text-gray-500">
                                                    Uploaded by Prof. Smith
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-2 bg-gray-100 rounded-full w-full"></div>
                                            <div className="h-2 bg-gray-100 rounded-full w-5/6"></div>
                                            <div className="h-2 bg-gray-100 rounded-full w-4/6"></div>
                                        </div>
                                        <div className="mt-6 flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-400">
                                                2.4 MB
                                            </span>
                                            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                                                ↓
                                            </div>
                                        </div>
                                    </div>
                                </NewspaperCard>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Events List (Existing) */}
                    <div className="max-w-5xl mx-auto mb-24">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-accent-pink rounded-full border-2 border-black flex items-center justify-center">
                                <Doodle
                                    src="/doodles/calendar.svg"
                                    className="w-6 h-6 text-white"
                                />
                            </div>
                            <h2 className="font-display text-4xl font-black">
                                UPCOMING EVENTS
                            </h2>
                        </div>

                        <NewspaperCard variant="curved" className="p-0" noShadow>
                            <EventRow
                                date="Dec 01"
                                time="9:00 AM"
                                title="Hackathon: Code Chaos (24h)"
                                icon="/doodles/book.svg"
                                color="bg-accent-blue"
                            />
                            <EventRow
                                date="Dec 02"
                                time="4:00 PM"
                                title="Debate Club: Is Cereal Soup?"
                                icon="/doodles/megaphone.svg"
                                color="bg-accent-pink"
                            />
                            <EventRow
                                date="Dec 05"
                                time="2:00 PM"
                                title="Robotics Workshop: Building Bots"
                                icon="/doodles/group.svg"
                                color="bg-accent-purple"
                            />
                            <EventRow
                                date="Dec 10"
                                time="10:00 AM"
                                title="Campus Market Day"
                                icon="/doodles/shopping-bag.svg"
                                color="bg-accent-yellow"
                            />
                        </NewspaperCard>

                        <div className="text-center mt-8">
                            <Link href="/events">
                                <RetroButton variant="outline">View Full Calendar</RetroButton>
                            </Link>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="mb-24">
                        <div className="bg-gradient-to-r from-accent-yellow via-accent-pink to-accent-blue rounded-3xl p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden">
                            {/* Decorative doodles */}
                            <div className="absolute top-4 right-4 text-6xl opacity-20">📚</div>
                            <div className="absolute bottom-4 left-4 text-6xl opacity-20">🎉</div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                                <motion.div 
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0 }}
                                >
                                    <div className="text-4xl md:text-5xl font-hand font-black text-gray-900 mb-2">
                                        500+
                                    </div>
                                    <div className="text-sm md:text-base font-bold text-gray-800 font-body">
                                        Active Students
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="text-4xl md:text-5xl font-hand font-black text-gray-900 mb-2">
                                        50+
                                    </div>
                                    <div className="text-sm md:text-base font-bold text-gray-800 font-body">
                                        Campus Clubs
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="text-4xl md:text-5xl font-hand font-black text-gray-900 mb-2">
                                        100+
                                    </div>
                                    <div className="text-sm md:text-base font-bold text-gray-800 font-body">
                                        Events/Month
                                    </div>
                                </motion.div>
                                <motion.div 
                                    className="text-center"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="text-4xl md:text-5xl font-hand font-black text-gray-900 mb-2">
                                        1000+
                                    </div>
                                    <div className="text-sm md:text-base font-bold text-gray-800 font-body">
                                        Notes Shared
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Motivation Marquee */}
                    <div className="mb-24 -mx-4 md:-mx-8 transform rotate-1">
                        <div className="bg-white py-4 border-y-4 border-black shadow-xl">
                            <Marquee speed={40} direction="right">
                                <span className="text-black font-pixel text-4xl mx-8 uppercase">
                                    Link. Learn. Live.
                                </span>
                                <span className="text-gray-400 font-hand italic text-3xl mx-8">
                                    &quot;Sleep is for the weak (and the graduated)&quot;
                                </span>
                                <span className="text-black font-pixel text-4xl mx-8 uppercase">
                                    Link. Learn. Live.
                                </span>
                                <span className="text-gray-400 font-hand italic text-3xl mx-8">
                                    &quot;Coffee: The real MVP&quot;
                                </span>
                                <span className="text-black font-pixel text-4xl mx-8 uppercase">
                                    Link. Learn. Live.
                                </span>
                                <span className="text-gray-400 font-hand italic text-3xl mx-8">
                                    &quot;Is it too late to drop out?&quot;
                                </span>
                                <span className="text-black font-pixel text-4xl mx-8 uppercase">
                                    Link. Learn. Live.
                                </span>
                                <span className="text-gray-400 font-hand italic text-3xl mx-8">
                                    &quot;Due tomorrow? Do tomorrow.&quot;
                                </span>
                            </Marquee>
                        </div>
                    </div>
                </div>
            </Container>
        </Container>
    );
}
