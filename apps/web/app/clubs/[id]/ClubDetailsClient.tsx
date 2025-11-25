"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import DashboardNavbar from '../../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';
import { api } from '../../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface Club {
    id: string;
    name: string;
    description: string | null;
    _count?: {
        members: number;
    };
    members?: {
        userId: string;
        role: string;
    }[];
}

export default function ClubDetailsClient() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        if (id) {
            fetchClubDetails();
        }
    }, [id]);

    const fetchClubDetails = async () => {
        try {
            const clubId = Array.isArray(id) ? id[0] : id;
            const data = await api.getClub(clubId as string);
            setClub(data);

            // Check if current user is a member
            if (user && data.members) {
                const member = data.members.find((m: any) => m.userId === user.id);
                setIsMember(!!member);
            }
        } catch (error) {
            console.error('Failed to fetch club details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinLeave = async () => {
        if (!club) return;
        setJoining(true);
        try {
            if (isMember) {
                await api.leaveClub(club.id);
                setIsMember(false);
            } else {
                await api.joinClub(club.id);
                setIsMember(true);
            }
            // Refresh details to update member count
            fetchClubDetails();
        } catch (error) {
            console.error('Failed to join/leave club:', error);
            alert('Action failed. Please try again.');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <Container>
                <div className="min-h-screen flex items-center justify-center">
                    <Doodle src="/doodles/loading.svg" className="w-16 h-16 animate-spin" />
                </div>
            </Container>
        );
    }

    if (!club) {
        return (
            <Container>
                <div className="min-h-screen flex flex-col items-center justify-center text-center">
                    <h1 className="font-display text-4xl mb-4">CLUB NOT FOUND</h1>
                    <RetroButton onClick={() => router.push('/clubs')}>GO BACK</RetroButton>
                </div>
            </Container>
        );
    }

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    <div className="max-w-4xl mx-auto mt-12">
                        <RetroButton onClick={() => router.push('/clubs')} variant="outline" className="mb-8 text-sm">
                            &lt;- BACK TO CLUBS
                        </RetroButton>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Left Column: Info */}
                            <div className="md:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative"
                                >
                                    <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
                                    <NewspaperCard className="p-8 border-4">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-24 h-24 bg-black text-white flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                <span className="font-display font-black text-4xl">{club.name[0]}</span>
                                            </div>
                                            <div>
                                                <h1 className="font-display text-4xl md:text-5xl font-black mb-2">{club.name}</h1>
                                                <Badge className="bg-accent-yellow text-black border-black">
                                                    {club._count?.members || 0} MEMBERS
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="prose font-body text-lg leading-relaxed mb-8">
                                            <p>{club.description || "This club hasn't added a description yet."}</p>
                                        </div>

                                        <div className="flex gap-4 border-t-2 border-dashed border-gray-300 pt-6">
                                            <RetroButton
                                                onClick={handleJoinLeave}
                                                disabled={joining}
                                                className={isMember ? "bg-red-500 hover:bg-red-600 text-white" : "bg-black text-white"}
                                            >
                                                {joining ? 'UPDATING...' : (isMember ? 'LEAVE CLUB' : 'JOIN CLUB')}
                                            </RetroButton>
                                            <RetroButton variant="outline">CONTACT ADMIN</RetroButton>
                                        </div>
                                    </NewspaperCard>
                                </motion.div>
                            </div>

                            {/* Right Column: Sidebar */}
                            <div className="space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <NewspaperCard className="bg-accent-blue/10 p-6">
                                        <h3 className="font-bold text-xl uppercase mb-4 border-b-2 border-black pb-2">Upcoming Events</h3>
                                        <div className="text-center py-8 text-gray-500 font-mono text-sm">
                                            No upcoming events.
                                        </div>
                                    </NewspaperCard>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <NewspaperCard className="bg-white p-6">
                                        <h3 className="font-bold text-xl uppercase mb-4 border-b-2 border-black pb-2">Club Stats</h3>
                                        <ul className="space-y-2 font-mono text-sm">
                                            <li className="flex justify-between">
                                                <span>Founded:</span>
                                                <span className="font-bold">2024</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Events:</span>
                                                <span className="font-bold">0</span>
                                            </li>
                                            <li className="flex justify-between">
                                                <span>Active:</span>
                                                <span className="font-bold text-green-600">Yes</span>
                                            </li>
                                        </ul>
                                    </NewspaperCard>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
