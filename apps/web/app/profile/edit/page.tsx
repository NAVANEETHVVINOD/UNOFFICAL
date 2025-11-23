"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../../components/ui/NewspaperUI';
import Doodle from '../../components/ui/Doodle';
import { PageTransition } from '../../providers/AnimationProvider';
import DashboardNavbar from '../../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';
import { api } from '../../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function EditProfilePage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        githubUrl: '',
        instagram: '',
        tags: '', // Comma separated
    });

    useEffect(() => {
        if (user && user.profile) {
            setFormData({
                fullName: user.profile.fullName || '',
                bio: user.profile.bio || '',
                githubUrl: user.profile.githubUrl || '',
                instagram: user.profile.instagram || '',
                tags: user.profile.tags ? user.profile.tags.join(', ') : '',
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            await api.updateProfile({
                ...formData,
                tags: tagsArray,
            });

            await refreshUser();
            router.push('/profile');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
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
                        <RetroButton onClick={() => router.push('/profile')} variant="outline" className="mb-8 text-sm">
                            &lt;- BACK TO PROFILE
                        </RetroButton>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative"
                        >
                            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
                            <NewspaperCard className="p-8 border-4">
                                <div className="text-center mb-8">
                                    <h1 className="font-display text-4xl font-black mb-2">EDIT PROFILE</h1>
                                    <p className="font-hand text-xl text-gray-600">
                                        Update your student ID card.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Bio</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow h-24"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-bold mb-2 uppercase text-sm">Interests (Comma separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            placeholder="Coding, Music, Football..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-bold mb-2 uppercase text-sm">GitHub URL</label>
                                            <input
                                                type="url"
                                                value={formData.githubUrl}
                                                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                                className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-bold mb-2 uppercase text-sm">Instagram Handle</label>
                                            <input
                                                type="text"
                                                value={formData.instagram}
                                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                                className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                                                placeholder="@username"
                                            />
                                        </div>
                                    </div>

                                    <RetroButton
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-black text-white hover:bg-gray-800"
                                    >
                                        {loading ? 'SAVING...' : 'SAVE CHANGES'}
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
