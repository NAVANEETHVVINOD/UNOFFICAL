"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Container from "../components/ui/Container";
import Navbar from "../components/Navbar";
import CategoryRibbon from "../components/CategoryRibbon";
import BottomNav from "../components/ui/BottomNav";
import { PageTransition } from "../providers/AnimationProvider";
import {
    Compass,
    Users,
    Calendar,
    ShoppingBag,
    BookOpen,
    School,
    ArrowRight
} from "lucide-react";

const EXPLORE_ITEMS = [
    {
        id: 'events',
        label: 'Campus Events',
        description: 'Parties, workshops, and meetups happening nearby.',
        icon: Calendar,
        color: 'bg-accent-coral',
        path: '/events',
        colSpan: 'col-span-12 md:col-span-8',
        rowSpan: 'row-span-2'
    },
    {
        id: 'clubs',
        label: 'Student Clubs',
        description: 'Find your tribe. Join communities that match your vibe.',
        icon: Users,
        color: 'bg-accent-blue',
        path: '/clubs',
        colSpan: 'col-span-6 md:col-span-4',
        rowSpan: 'row-span-1'
    },
    {
        id: 'collabo',
        label: 'Collaborations',
        description: 'Find teammates for projects and hackathons.',
        icon: Users,
        color: 'bg-accent-mint',
        path: '/collabo',
        colSpan: 'col-span-6 md:col-span-4',
        rowSpan: 'row-span-1'
    },
    {
        id: 'market',
        label: 'Marketplace',
        description: 'Buy, sell, and trade with other students.',
        icon: ShoppingBag,
        color: 'bg-primary',
        path: '/marketplace',
        colSpan: 'col-span-6 md:col-span-4',
        rowSpan: 'row-span-1'
    },
    {
        id: 'resources',
        label: 'Resources',
        description: 'Notes, guides, and academic help.',
        icon: BookOpen,
        color: 'bg-accent-purple',
        path: '/resources',
        colSpan: 'col-span-6 md:col-span-4',
        rowSpan: 'row-span-1'
    },
    {
        id: 'colleges',
        label: 'All Colleges',
        description: 'Browse other campuses on Linker.',
        icon: School,
        color: 'bg-accent-yellow',
        path: '/colleges',
        colSpan: 'col-span-12 md:col-span-4',
        rowSpan: 'row-span-1'
    }
];

export default function ExploreClient() {
    const router = useRouter();

    return (
        <PageTransition>
            <div className="min-h-screen bg-paper dark:bg-dark-bg">
                <Navbar />

                <Container>
                    <div className="pt-20 pb-24">
                        {/* NavBox at top - Desktop only */}
                        <div className="hidden md:block mb-6">
                            <CategoryRibbon />
                        </div>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-white dark:bg-dark-surface border-2 border-ink rounded-xl shadow-neo-sm">
                                <Compass className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="font-display text-4xl font-black uppercase text-ink dark:text-dark-text tracking-tight">
                                    Explore Hub
                                </h1>
                                <p className="font-mono text-neutral-500 dark:text-dark-text-muted">
                                    Discover everything happening on campus.
                                </p>
                            </div>
                        </div>

                        {/* Bento Grid */}
                        <div className="grid grid-cols-12 gap-4 auto-rows-[180px]">
                            {EXPLORE_ITEMS.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => router.push(item.path)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 0.98 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                      ${item.colSpan} ${item.rowSpan}
                      relative overflow-hidden group text-left
                      bg-white dark:bg-dark-surface 
                      border-2 border-ink dark:border-dark-border
                      rounded-2xl shadow-neo transition-all
                      hover:shadow-neo-lg
                    `}
                                    >
                                        {/* Background Accent */}
                                        <div className={`
                      absolute top-0 right-0 w-32 h-32 
                      ${item.color} opacity-10 rounded-bl-full
                      transform translate-x-8 -translate-y-8
                      transition-transform group-hover:scale-150
                    `} />

                                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                            <div className={`p-3 w-fit rounded-lg border-2 border-black/10 ${item.color} text-ink`}>
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            <div>
                                                <h3 className="font-display text-2xl font-bold mb-1 group-hover:underline decoration-2 underline-offset-2">
                                                    {item.label}
                                                </h3>
                                                <p className="font-medium text-neutral-500 dark:text-dark-text-muted leading-tight max-w-[90%]">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                                                <div className="p-2 bg-ink text-paper rounded-full">
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </Container>

                <BottomNav />
            </div>
        </PageTransition>
    );
}
