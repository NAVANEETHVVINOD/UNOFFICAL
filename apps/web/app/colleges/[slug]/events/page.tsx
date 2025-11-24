"use client"

import { useState, useEffect } from 'react';
import { NewspaperCard, RetroButton, Badge } from '../../../components/ui/NewspaperUI';
import Doodle from '../../../components/ui/Doodle';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '../../../../lib/api';

interface Event {
    id: string;
    title: string;
    description: string | null;
    startsAt: string;
    venue: string | null;
    club?: {
        name: string;
    };
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default function CollegeEventsPage({ params }: PageProps) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { slug } = params;

    useEffect(() => {
        // In a real app, we would fetch events specific to this college slug
        fetchEvents();
    }, [slug]);

    const fetchEvents = async () => {
        try {
            // TODO: Add college filter to API
            const data = await api.getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
            time: date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 flex justify-between items-end"
            >
                <div>
                    <h1 className="font-display text-4xl md:text-6xl font-black mb-2">CAMPUS EVENTS</h1>
                    <p className="font-serif text-xl text-gray-600">
                        What's happening at {slug.replace(/-/g, ' ').toUpperCase()}
                    </p>
                </div>
                <Link href={`/colleges/${slug}/events/create`}>
                    <RetroButton className="bg-black text-white hover:bg-accent-yellow hover:text-black">
                        + SUBMIT EVENT
                    </RetroButton>
                </Link>
            </motion.div>

            {/* Events List */}
            {loading ? (
                <div className="text-center py-20">
                    <Doodle src="/doodles/loading.svg" className="w-16 h-16 mx-auto animate-spin" />
                    <p className="font-mono mt-4">Loading events...</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {events.map((event, index) => {
                        const { day, month, time } = formatDate(event.startsAt);
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <Link href={`/events/${event.id}`}>
                                    <NewspaperCard className="hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-white p-0 overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Date Column */}
                                            <div className="bg-accent-blue text-white p-6 flex flex-col items-center justify-center min-w-[120px] border-b-2 md:border-b-0 md:border-r-2 border-black">
                                                <span className="text-sm font-bold tracking-widest">{month}</span>
                                                <span className="text-5xl font-black">{day}</span>
                                                <span className="text-xs font-mono mt-2">{time}</span>
                                            </div>

                                            {/* Content Column */}
                                            <div className="p-6 flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <Badge className="bg-accent-yellow text-black border-black text-[10px]">
                                                        {event.club?.name || 'CAMPUS EVENT'}
                                                    </Badge>
                                                    {event.venue && (
                                                        <span className="font-mono text-xs text-gray-500 flex items-center gap-1">
                                                            📍 {event.venue}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-2xl mb-2 group-hover:underline decoration-2 decoration-accent-blue">{event.title}</h3>
                                                <p className="text-gray-600 line-clamp-2 font-body text-sm mb-4">
                                                    {event.description || "No description available."}
                                                </p>
                                                <div className="flex justify-end">
                                                    <span className="font-bold text-sm group-hover:translate-x-1 transition-transform">GET TICKETS / RSVP -&gt;</span>
                                                </div>
                                            </div>
                                        </div>
                                    </NewspaperCard>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {!loading && events.length === 0 && (
                <div className="text-center py-20">
                    <Doodle src="/doodles/sad-face.svg" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                    <h3 className="font-bold text-2xl mb-2">No Events Scheduled</h3>
                    <p className="text-gray-600">Looks like a quiet week. Check back later!</p>
                </div>
            )}
        </div>
    );
}
