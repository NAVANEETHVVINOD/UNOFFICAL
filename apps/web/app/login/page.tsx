"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';

export default function LoginPage() {
    const router = useRouter();
    const { login, user, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (isAuthenticated && user) {
        router.replace('/dashboard');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard'); // Or redirect to college hub if we had that info
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="w-full max-w-md relative">
                    {/* Decorative Elements */}
                    <Doodle src="/doodles/sparkle.svg" className="absolute -top-12 -left-12 w-24 h-24 text-accent-yellow animate-pulse" />
                    <Doodle src="/doodles/arrow-curly.svg" className="absolute -bottom-8 -right-16 w-32 h-32 text-black rotate-12 hidden md:block" />

                    <NewspaperCard className="p-8 md:p-12 relative bg-white">
                        <Tape className="absolute -top-4 left-1/2 -translate-x-1/2" />

                        <div className="absolute top-4 left-4">
                            <Link href="/" className="font-black text-xl tracking-tighter hover:underline decoration-2 decoration-accent-orange">
                                LINKER.
                            </Link>
                        </div>

                        <div className="text-center mb-8">
                            <h1 className="font-display text-4xl font-black mb-2">WELCOME BACK</h1>
                            <p className="text-gray-600 font-serif italic">"Ready for another day of chaos?"</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm transform -rotate-1">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                    placeholder="student@college.edu"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <RetroButton
                                type="submit"
                                className="w-full py-4 text-lg"
                                disabled={loading}
                            >
                                {loading ? 'LOGGING IN...' : 'ENTER THE VOID ->'}
                            </RetroButton>
                        </form>

                        <div className="mt-8 text-center space-y-4">
                            <p className="text-sm text-gray-600">
                                New here?{' '}
                                <Link href="/register" className="font-bold underline decoration-2 decoration-accent-blue hover:text-accent-blue">
                                    Create an account
                                </Link>
                            </p>
                            <p className="text-xs text-gray-400">
                                Forgot password? <span className="line-through">Good luck.</span> (Coming soon)
                            </p>
                        </div>
                    </NewspaperCard>
                </div>
            </div>
        </Container>
    );
}
