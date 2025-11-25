"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';
import { useAuth } from '../context/AuthContext';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth(); // We'll auto-login after register

    const [collegeSlug, setCollegeSlug] = useState<string | null>(null);
    const [collegeName, setCollegeName] = useState<string>('');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        collegeId: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const slug = searchParams.get('college');
        if (slug) {
            setCollegeSlug(slug);
            fetchCollegeName(slug);
        } else {
            // If no college selected, redirect to select-college
            // Alternatively, we could show a "Select College" button here
        }
    }, [searchParams]);

    const fetchCollegeName = async (slug: string) => {
        try {
            const college = await api.getCollegeBySlug(slug);
            setCollegeName(college.name);
        } catch (err) {
            console.error('Invalid college:', err);
            setError('Invalid college selected.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!collegeSlug) {
            setError('Please select a college first.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            // 1. Register
            await api.register(
                formData.email,
                formData.password,
                formData.fullName,
                formData.collegeId // We might need to pass collegeSlug too if backend expects it, but backend usually infers from email domain or we need to update backend to accept collegeId/Slug
            );

            // 2. Auto Login
            await login(formData.email, formData.password);

            // 3. Redirect
            router.push(`/colleges/${collegeSlug}`);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (!collegeSlug) {
        return (
            <Container>
                <div className="min-h-screen flex flex-col items-center justify-center text-center">
                    <Doodle src="/doodles/confused.svg" className="w-32 h-32 mb-8 animate-bounce" />
                    <h1 className="font-display text-4xl font-black mb-4">WHO ARE YOU?</h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-md">
                        We need to know which campus you belong to before we can let you in.
                    </p>
                    <Link href="/select-college">
                        <RetroButton className="px-8 py-4 text-xl">
                            SELECT MY COLLEGE -&gt;
                        </RetroButton>
                    </Link>
                    <div className="mt-8">
                        <Link href="/login" className="text-sm font-bold underline">
                            Already have an account? Login
                        </Link>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="min-h-screen flex items-center justify-center py-12">
                <div className="w-full max-w-lg relative">
                    {/* Decorative Elements */}
                    <Doodle src="/doodles/star.svg" className="absolute -top-8 -right-8 w-20 h-20 text-accent-pink animate-spin-slow" />

                    <NewspaperCard className="p-8 md:p-12 relative bg-white">
                        <Tape className="absolute -top-4 left-1/2 -translate-x-1/2" />

                        <div className="absolute top-4 left-4">
                            <Link href="/" className="font-black text-xl tracking-tighter hover:underline decoration-2 decoration-accent-orange">
                                LINKER.
                            </Link>
                        </div>

                        <div className="text-center mb-8">
                            <Badge className="mb-4 bg-accent-green text-black border-black">JOINING {collegeName}</Badge>
                            <h1 className="font-display text-4xl font-black mb-2">NEW RECRUIT</h1>
                            <p className="text-gray-600 font-serif italic">"Abandon hope all ye who enter here."</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm transform rotate-1">
                                ⚠️ {error}
                            </div>
                        )}

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
                                <label className="block font-bold mb-1 uppercase text-xs tracking-wider">College ID / Roll No.</label>
                                <input
                                    type="text"
                                    value={formData.collegeId}
                                    onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                                    className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                                    placeholder="2023-CS-101"
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
                                    {loading ? 'REGISTERING...' : 'JOIN THE CHAOS ->'}
                                </RetroButton>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Wrong college?{' '}
                                <Link href="/select-college" className="font-bold underline hover:text-accent-blue">
                                    Switch Campus
                                </Link>
                            </p>
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
