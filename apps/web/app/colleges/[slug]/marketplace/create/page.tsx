"use client"

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { NewspaperCard, RetroButton, Badge, Tape } from '../../../../components/ui/NewspaperUI';
import Doodle from '../../../../components/ui/Doodle';
import { api } from '../../../../../lib/api';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function CreateListingPage({ params }: PageProps) {
    const router = useRouter();
    const { slug } = use(params);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'ITEM',
        scope: 'COLLEGE'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.createMarketplaceListing({
                ...formData,
                price: parseFloat(formData.price),
                collegeSlug: slug
            });
            router.push(`/colleges/${slug}/marketplace`);
        } catch (error) {
            console.error('Failed to create listing:', error);
            alert('Failed to create listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-2xl mx-auto">
                <NewspaperCard className="p-8 relative bg-white">
                    <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />

                    <div className="text-center mb-8">
                        <Badge className="mb-2 bg-accent-green text-black border-black">SELL / TRADE</Badge>
                        <h1 className="font-display text-4xl font-black">LIST AN ITEM</h1>
                        <p className="font-serif text-gray-600 mt-2">
                            One man's trash is another student's treasure.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-bold text-sm mb-2">ITEM TITLE</label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                placeholder="e.g. Drafter (Barely Used)"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-sm mb-2">PRICE (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                    placeholder="0 for Free"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-sm mb-2">CATEGORY</label>
                                <select
                                    className="w-full p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow bg-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="ITEM">Item for Sale</option>
                                    <option value="SERVICE">Service (Freelance/Help)</option>
                                    <option value="RENT">For Rent</option>
                                    <option value="DONATION">Donation / Free</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">DESCRIPTION</label>
                            <textarea
                                required
                                rows={4}
                                className="w-full p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                placeholder="Condition, details, reason for selling..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-sm mb-2">VISIBILITY</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="COLLEGE"
                                        checked={formData.scope === 'COLLEGE'}
                                        onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                        className="w-4 h-4 accent-black"
                                    />
                                    <span className="font-serif">College Only</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="scope"
                                        value="STATE"
                                        checked={formData.scope === 'STATE'}
                                        onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                                        className="w-4 h-4 accent-black"
                                    />
                                    <span className="font-serif">All Kerala</span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <RetroButton
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={() => router.back()}
                            >
                                CANCEL
                            </RetroButton>
                            <RetroButton
                                type="submit"
                                className="flex-1 bg-black text-white hover:bg-accent-green hover:text-black"
                                disabled={loading}
                            >
                                {loading ? 'POSTING...' : 'POST LISTING'}
                            </RetroButton>
                        </div>
                    </form>
                </NewspaperCard>
            </div>

            <Doodle src="/doodles/shopping-bag.svg" className="fixed bottom-10 right-10 w-32 h-32 opacity-20 -rotate-12 pointer-events-none" />
        </div>
    );
}
