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

export default function CreatePostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            await api.createPost({ content });
            router.push('/feed');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to post. Please try again.');
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
                        <RetroButton onClick={() => router.push('/feed')} variant="outline" className="mb-8 text-sm">
                            &lt;- BACK TO FEED
                        </RetroButton>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
                            <NewspaperCard className="p-8 border-4">
                                <div className="text-center mb-8">
                                    <h1 className="font-display text-4xl font-black mb-2">NEW POST</h1>
                                    <p className="font-hand text-xl text-gray-600">
                                        Share your thoughts with the campus.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <textarea
                                            required
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="w-full p-4 border-2 border-black font-mono text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow h-64 resize-none"
                                            placeholder="What's on your mind? (Markdown supported)"
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <RetroButton
                                            type="submit"
                                            disabled={loading || !content.trim()}
                                            className="bg-black text-white px-8 py-3"
                                        >
                                            {loading ? 'POSTING...' : 'PUBLISH'}
                                        </RetroButton>
                                    </div>
                                </form>
                            </NewspaperCard>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
