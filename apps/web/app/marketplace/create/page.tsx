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

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.createMarketplaceListing({
                ...formData,
                price: parseInt(formData.price),
            });
            router.push('/marketplace');
        } catch (error) {
            console.error('Failed to create listing:', error);
            alert('Failed to create listing. Please try again.');
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
                        <RetroButton onClick={() => router.push('/marketplace')} variant="outline" className="mb-8 text-sm">
                            &lt;- BACK TO MARKET
                        </RetroButton>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
                            <NewspaperCard className="p-8 border-4">
                                <div className="text-center mb-8">
                                    <h1 className="font-display text-4xl font-black mb-2">SELL AN ITEM</h1>
                                    <p className="font-hand text-xl text-gray-600">
                                        One student's trash is another's treasure.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Item Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            placeholder="e.g. Engineering Physics Textbook"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            placeholder="e.g. 500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Description</label>
                                        <textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow h-32"
                                            placeholder="Condition, edition, etc."
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Image URL</label>
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            placeholder="https://..."
                                        />
                                        <p className="text-xs text-gray-500 mt-1 font-mono">
                                            * Image upload coming soon. Please provide a link.
                                        </p>
                                    </div>

                                    <RetroButton
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-black text-white hover:bg-gray-800"
                                    >
                                        {loading ? 'LISTING...' : 'POST LISTING'}
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
