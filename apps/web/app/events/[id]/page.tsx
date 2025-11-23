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

interface Event {
    id: string;
    title: string;
    description: string | null;
    startsAt: string;
    endsAt: string;
    venue: string | null;
    club?: {
        name: string;
    };
    participants?: {
        userId: string;
        status: 'GOING' | 'INTERESTED' | 'NOT_GOING';
    }[];
}

export default function EventDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [rsvpStatus, setRsvpStatus] = useState<'GOING' | 'INTERESTED' | 'NOT_GOING' | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (id) {
            fetchEventDetails();
        }
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const data = await api.getEvent(id as string);
            setEvent(data);

            // Check if current user has RSVP'd
            if (user && data.participants) {
                const participant = data.participants.find((p: any) => p.userId === user.id);
                if (participant) {
                    setRsvpStatus(participant.status);
                }
            }
        } catch (error) {
            console.error('Failed to fetch event details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRSVP = async (status: 'GOING' | 'INTERESTED' | 'NOT_GOING') => {
        if (!event) return;
        setUpdating(true);
        try {
            await api.rsvpEvent(event.id, status);
            setRsvpStatus(status);
        } catch (error) {
            console.error('Failed to RSVP:', error);
            alert('RSVP failed. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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

    if (!event) {
        return (
            <Container>
                <div className="min-h-screen flex flex-col items-center justify-center text-center">
                    <h1 className="font-display text-4xl mb-4">EVENT NOT FOUND</h1>
                    <RetroButton onClick={() => router.push('/events')}>GO BACK</RetroButton>
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
                        <RetroButton onClick={() => router.push('/events')} variant="outline" className="mb-8 text-sm">
                            &lt;- BACK TO EVENTS
                        </RetroButton>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative"
                        >
                            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
                            <NewspaperCard className="p-0 overflow-hidden border-4">
                                {/* Event Header */}
                                <div className="bg-accent-blue p-8 text-white border-b-4 border-black relative overflow-hidden">
                                    <Doodle src="/doodles/sparkle.svg" className="absolute top-4 right-4 w-12 h-12 opacity-50" />
                                    <Badge className="bg-white text-black border-black mb-4">
                                        {event.club?.name || 'CAMPUS EVENT'}
                                    </Badge>
                                    <h1 className="font-display text-4xl md:text-6xl font-black mb-4 leading-tight">{event.title}</h1>
                                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 font-mono text-sm">
                                        <div className="flex items-center gap-2">
                                            <span>🕒</span>
                                            <span>{formatDate(event.startsAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span>📍</span>
                                            <span>{event.venue || 'TBA'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 grid md:grid-cols-3 gap-8">
                                    {/* Description */}
                                    <div className="md:col-span-2">
                                        <h3 className="font-bold text-xl uppercase mb-4 border-b-2 border-black pb-2">About Event</h3>
                                        <div className="prose font-body text-lg leading-relaxed text-gray-800">
                                            <p>{event.description || "No description provided."}</p>
                                        </div>
                                    </div>

                                    {/* RSVP Section */}
                                    <div className="bg-gray-50 p-6 border-2 border-black h-fit">
                                        <h3 className="font-bold text-lg uppercase mb-4 text-center">Will you be there?</h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleRSVP('GOING')}
                                                disabled={updating}
                                                className={`w-full py-3 border-2 border-black font-bold transition-all ${rsvpStatus === 'GOING'
                                                    ? 'bg-green-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                                                    : 'bg-white hover:bg-green-100'
                                                    }`}
                                            >
                                                GOING {rsvpStatus === 'GOING' && '✓'}
                                            </button>
                                            <button
                                                onClick={() => handleRSVP('INTERESTED')}
                                                disabled={updating}
                                                className={`w-full py-3 border-2 border-black font-bold transition-all ${rsvpStatus === 'INTERESTED'
                                                    ? 'bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                                                    : 'bg-white hover:bg-yellow-100'
                                                    }`}
                                            >
                                                INTERESTED {rsvpStatus === 'INTERESTED' && '✓'}
                                            </button>
                                            <button
                                                onClick={() => handleRSVP('NOT_GOING')}
                                                disabled={updating}
                                                className={`w-full py-3 border-2 border-black font-bold transition-all ${rsvpStatus === 'NOT_GOING'
                                                    ? 'bg-red-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                                                    : 'bg-white hover:bg-red-100'
                                                    }`}
                                            >
                                                NOT GOING {rsvpStatus === 'NOT_GOING' && '✓'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </NewspaperCard>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
