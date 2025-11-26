"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';

export default function RegisterPage() {
    const router = useRouter();
    const { login, user, isAuthenticated } = useAuth();

    if (isAuthenticated && user) {
        router.replace('/dashboard');
    }

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Register
            await api.register(
                formData.email,
                formData.password,
                formData.fullName,
                '' // College ID is now handled in onboarding
            );

            // 2. Auto Login
            await login(formData.email, formData.password);

            // 3. Redirect to Onboarding
            router.push('/onboarding');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="w-full max-w-lg relative">
                    {/* Decorative Elements */}
                    <Doodle src="/doodles/sparkle.svg" className="absolute -top-8 -right-8 w-20 h-20 text-accent-pink animate-spin-slow" />

                    <NewspaperCard className="p-8 md:p-12 relative bg-white">
                        <Tape className="absolute -top-4 left-1/2 -translate-x-1/2" />

                        <div className="absolute top-4 left-4">
                            <Link href="/" className="font-black text-xl tracking-tighter hover:underline decoration-2 decoration-accent-orange">
                                LINKER.
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-bold mb-1 uppercase text-xs tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 uppercase text-xs tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                    placeholder="student@college.edu"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-1 uppercase text-xs tracking-wider">Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <RetroButton
                                    type="submit"
                                    className="w-full py-4 text-lg bg-accent-green text-black"
                                    disabled={loading}
                                >
                                    {loading ? 'REGISTERING...' : 'START ONBOARDING ->'}
                                </RetroButton>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 mt-2">
                                Already have an account?{' '}
                                <Link href="/login" className="font-bold underline hover:text-accent-blue">
                                    Login
                                </Link>
                            </p>
                        </div>
                    </NewspaperCard>
                </div>
            </div>
        </Container>
    );
}
