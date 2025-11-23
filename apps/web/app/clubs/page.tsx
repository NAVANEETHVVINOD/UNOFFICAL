"use client"

import { useState, useEffect } from 'react';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import Link from 'next/link';

interface Club {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    collegeId: string;
    _count?: {
        members: number;
    };
}

export default function ClubsPage() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const data = await api.getClubs();
            setClubs(data);
        } catch (error) {
            console.error('Failed to fetch clubs:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClubs = clubs.filter(club =>
        club.name.toLowerCase().includes(search.toLowerCase()) ||
        club.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12 text-center relative"
                    >
                        <Doodle src="/doodles/group.svg" className="w-24 h-24 absolute -top-12 left-1/2 -translate-x-1/2 -z-10 opacity-20" />
                        <h1 className="font-display text-5xl md:text-7xl font-black mb-4">CAMPUS CLUBS</h1>
                        <p className="font-hand text-xl text-gray-600 max-w-2xl mx-auto">
                            Find your tribe. Join a community. Make some noise.
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
                                placeholder="Search for clubs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-grow p-2 font-mono focus:outline-none"
                            />
                            <RetroButton className="py-2 px-6">SEARCH</RetroButton>
                        </div>
                    </motion.div>

                    {/* Clubs Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <Doodle src="/doodles/loading.svg" className="w-16 h-16 mx-auto animate-spin" />
                            <p className="font-mono mt-4">Loading clubs...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredClubs.map((club, index) => (
                                <motion.div
                                    key={club.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <Link href={`/clubs/${club.id}`}>
                                        <NewspaperCard className="h-full hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-white">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 bg-gray-100 border-2 border-black flex items-center justify-center group-hover:bg-accent-yellow transition-colors">
                                                    <span className="font-display font-black text-xl">{club.name[0]}</span>
                                                </div>
                                                <Badge className="bg-black text-white">
                                                    {club._count?.members || 0} MEMBERS
                                                </Badge>
                                            </div>
                                            <h3 className="font-bold text-2xl mb-2 group-hover:underline decoration-2 decoration-accent-yellow">{club.name}</h3>
                                            <p className="text-gray-600 line-clamp-3 mb-4 font-body text-sm">
                                                {club.description || "No description available."}
                                            </p>
                                            <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                                                <span className="font-mono text-xs text-gray-500">EST. 2024</span>
                                                <span className="font-bold text-sm group-hover:translate-x-1 transition-transform">VISIT CLUB -&gt;</span>
                                            </div>
                                        </NewspaperCard>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredClubs.length === 0 && (
                        <div className="text-center py-20">
                            <Doodle src="/doodles/sad-face.svg" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                            <h3 className="font-bold text-2xl mb-2">No Clubs Found</h3>
                            <p className="text-gray-600">Try searching for something else or start your own!</p>
                        </div>
                    )}
                </div>
            </Container>
        </PageTransition>
    );
}
