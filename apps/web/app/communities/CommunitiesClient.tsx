"use client";

import { useState, useEffect } from "react";
import Container from "../components/ui/Container";
import {
    NewspaperCard,
    RetroButton,
    Badge,
    Tape,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import { PageTransition } from "../providers/AnimationProvider";
import Navbar from "../components/Navbar";
import BottomNav from "../components/ui/BottomNav";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import Link from "next/link";
import { Users } from "lucide-react";

interface Club {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    collegeId: string | null;
    _count?: {
        members: number;
    };
}

export default function CommunitiesClient() {
    const [communities, setCommunities] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const data = await api.getClubs({ type: "COMMUNITY" });
            setCommunities(data);
        } catch (error) {
            console.error("Failed to fetch communities:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCommunities = communities.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.description?.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-paper">
                {/* Background Pattern */}
                <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
                    <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
                </div>

                <Navbar />
                <Container>
                    <div className="pt-24 md:pt-36 pb-24 md:pb-8 relative z-10">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8 md:mb-12 text-center relative mt-4"
                        >
                            <Users
                                className="w-20 h-20 md:w-24 md:h-24 absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 -z-10 opacity-10 text-primary"
                            />
                            <h1 className="font-display text-3xl md:text-5xl lg:text-7xl font-black mb-2 md:mb-4">
                                COMMUNITIES
                            </h1>
                            <p className="font-hand text-base md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                                Connect with like-minded peers across specific interests.
                            </p>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-xl mx-auto mb-12 relative"
                        >
                            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
                            <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search communities..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-grow p-2 font-mono focus:outline-none"
                                />
                                <RetroButton className="py-2 px-6">SEARCH</RetroButton>
                            </div>
                        </motion.div>

                        {/* Grid */}
                        {loading ? (
                            <div className="text-center py-20">
                                <Doodle
                                    src="/doodles/loading.svg"
                                    className="w-16 h-16 mx-auto animate-spin"
                                />
                                <p className="font-mono mt-4">Loading communities...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                                {filteredCommunities.map((community, index) => (
                                    <motion.div
                                        key={community.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Link href={`/clubs/${community.id}`}>
                                            <NewspaperCard className="h-full hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-white">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="w-12 h-12 bg-gray-100 border-2 border-black flex items-center justify-center group-hover:bg-accent-blue transition-colors">
                                                        <span className="font-display font-black text-xl">
                                                            {community.name[0]}
                                                        </span>
                                                    </div>
                                                    <Badge className="bg-black text-white">
                                                        {community._count?.members || 0} MEMBERS
                                                    </Badge>
                                                </div>
                                                <h3 className="font-bold text-2xl mb-2 group-hover:underline decoration-2 decoration-accent-blue">
                                                    {community.name}
                                                </h3>
                                                <p className="text-gray-600 line-clamp-3 mb-4 font-body text-sm">
                                                    {community.description || "No description available."}
                                                </p>
                                                <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                                                    <span className="font-mono text-xs text-gray-500">
                                                        OPEN GROUP
                                                    </span>
                                                    <span className="font-bold text-sm group-hover:translate-x-1 transition-transform">
                                                        JOIN -&gt;
                                                    </span>
                                                </div>
                                            </NewspaperCard>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {!loading && filteredCommunities.length === 0 && (
                            <div className="text-center py-20">
                                <Users className="w-24 h-24 mx-auto mb-4 opacity-20" />
                                <h3 className="font-bold text-2xl mb-2">No Communities Found</h3>
                                <p className="text-gray-600">
                                    Be the first to create one!
                                </p>
                            </div>
                        )}
                    </div>
                </Container>
                <BottomNav />
            </div>
        </PageTransition>
    );
}
