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
    ArrowRight
} from "lucide-react";
import { EXPLORE_CARDS } from "../../lib/explore-cards";

export default function ExploreClient() {
    const router = useRouter();

    return (
        <PageTransition>
            <div className="min-h-screen bg-paper dark:bg-dark-bg">
                <Navbar />

                <Container>
                    <div className="pt-20 pb-24">
                        {/* NavBox at top - Desktop only, global variant */}
                        <div className="hidden md:block mb-6">
                            <CategoryRibbon variant="global" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-white dark:bg-dark-surface border-2 border-ink dark:border-dark-border rounded-xl shadow-neo-sm">
                                <Compass className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="font-display text-3xl md:text-4xl font-black uppercase text-ink dark:text-dark-text tracking-tight">
                                    Explore
                                </h1>
                                <p className="font-mono text-sm text-neutral-500 dark:text-dark-text-muted">
                                    Discover what&apos;s happening on campus
                                </p>
                            </div>
                        </div>

                        {/* 2x2 Grid - Mobile friendly */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {EXPLORE_CARDS.map((card, index) => {
                                const Icon = card.icon;

                                return (
                                    <motion.button
                                        key={card.id}
                                        onClick={() => router.push(card.path)}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            relative overflow-hidden group text-left
                                            bg-white dark:bg-dark-surface 
                                            border-2 border-ink dark:border-dark-border
                                            rounded-2xl shadow-neo transition-all
                                            hover:shadow-neo-lg
                                            p-6 min-h-[180px]
                                            ${card.hoverColor}
                                        `}
                                    >
                                        {/* Background Accent */}
                                        <div className={`
                                            absolute top-0 right-0 w-32 h-32 
                                            ${card.color} opacity-10 rounded-bl-full
                                            transform translate-x-8 -translate-y-8
                                            transition-transform group-hover:scale-150
                                        `} />

                                        <div className="relative z-10 h-full flex flex-col justify-between">
                                            <div className={`p-3 w-fit rounded-xl border-2 border-black/10 ${card.color} text-ink mb-4`}>
                                                <Icon className="w-6 h-6" />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-ink dark:text-dark-text group-hover:underline decoration-2 underline-offset-2">
                                                    {card.label}
                                                </h3>
                                                <p className="text-sm md:text-base text-neutral-600 dark:text-dark-text-muted leading-relaxed">
                                                    {card.description}
                                                </p>
                                            </div>

                                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
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
