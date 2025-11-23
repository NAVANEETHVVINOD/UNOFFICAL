"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import DashboardNavbar from '../../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';
import { api } from '../../../lib/api';

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        venue: '',
        startsAt: '',
        endsAt: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.createEvent({
                ...formData,
                startsAt: new Date(formData.startsAt).toISOString(),
                endsAt: new Date(formData.endsAt).toISOString(),
            });
            router.push('/events');
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Failed to create event. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    <div className="max-w-2xl mx-auto mt-12">
                        <RetroButton onClick={() => router.push('/events')} variant="outline" className="mb-8 text-sm">
                            &lt;- BACK TO EVENTS
                        </RetroButton>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
                            <NewspaperCard className="p-8 border-4">
                                <div className="text-center mb-8">
                                    <h1 className="font-display text-4xl font-black mb-2">HOST AN EVENT</h1>
                                    <p className="font-hand text-xl text-gray-600">
                                        Gather the crowd. Make memories.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Event Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            placeholder="e.g. Hackathon 2024"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-bold mb-2 uppercase text-sm">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                required
                                                value={formData.startsAt}
                                                onChange={(e) => setFormData({ ...formData, startsAt: e.target.value })}
                                                className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold mb-2 uppercase text-sm">End Time</label>
                                            <input
                                                type="datetime-local"
                                                required
                                                value={formData.endsAt}
                                                onChange={(e) => setFormData({ ...formData, endsAt: e.target.value })}
                                                className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Venue</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.venue}
                                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            placeholder="e.g. Main Auditorium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow h-32"
                                            placeholder="What's happening?"
                                        />
                                    </div>

                                    <RetroButton
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-black text-white hover:bg-gray-800"
                                    >
                                        {loading ? 'CREATING...' : 'PUBLISH EVENT'}
                                    </RetroButton>
                                </form>
                            </NewspaperCard>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
