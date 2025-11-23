"use client"

import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    <div className="max-w-2xl mx-auto mt-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-2 z-10" />
                            <NewspaperCard className="p-8 md:p-12 bg-white border-4 border-black relative overflow-hidden">
                                {/* ID Card Header */}
                                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
                                    <div>
                                        <h1 className="font-display text-4xl font-black uppercase">Student ID</h1>
                                        <p className="font-mono text-sm text-gray-500">LINKER_OS // VERIFIED_USER</p>
                                    </div>
                                    <Doodle src="/doodles/sparkle.svg" className="w-12 h-12 animate-spin-slow" />
                                </div>

                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                    {/* Avatar Section */}
                                    <div className="shrink-0 flex flex-col items-center gap-4">
                                        <div className="w-40 h-40 bg-gray-100 border-4 border-black overflow-hidden relative">
                                            <img
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile?.fullName || 'User'}`}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute bottom-0 inset-x-0 bg-black text-white text-center text-[10px] py-1 font-mono">
                                                IMG_REF_01
                                            </div>
                                        </div>
                                        <Badge className="bg-accent-blue text-white border-black">STUDENT</Badge>
                                    </div>

                                    {/* Details Section */}
                                    <div className="flex-1 w-full space-y-6">
                                        <div>
                                            <label className="font-bold text-xs uppercase text-gray-500 block mb-1">Full Name</label>
                                            <p className="font-serif text-2xl italic border-b-2 border-gray-200 pb-1">
                                                {user?.profile?.fullName || 'Unknown Student'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="font-bold text-xs uppercase text-gray-500 block mb-1">Email Address</label>
                                            <p className="font-mono text-lg border-b-2 border-gray-200 pb-1">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-bold text-xs uppercase text-gray-500 block mb-1">College ID</label>
                                                <p className="font-mono text-lg border-b-2 border-gray-200 pb-1">
                                                    {user?.profile?.collegeId || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="font-bold text-xs uppercase text-gray-500 block mb-1">Role</label>
                                                <p className="font-mono text-lg border-b-2 border-gray-200 pb-1 uppercase">
                                                    {user?.role || 'USER'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Actions */}
                                <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300 flex justify-between items-center">
                                    <div className="text-xs font-mono text-gray-400">
                                        ID: {user?.id?.substring(0, 8)}...
                                    </div>
                                    <RetroButton
                                        onClick={logout}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                        LOGOUT
                                    </RetroButton>
                                </div>
                            </NewspaperCard>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </PageTransition>
    );
}
