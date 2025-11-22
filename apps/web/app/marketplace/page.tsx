"use client"

import Navigation from '../components/layout/Navigation'
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MarketplacePage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <>
            <Navigation />
            <PageTransition>
                <Container>
                    <div className="py-12">
                        <div className="text-center mb-12">
                            <h1 className="h1-display inline-block border-b-4 border-black px-8 pb-2">THE MARKET</h1>
                            <p className="mt-4 font-body text-gray-600">One student's trash is another student's treasure.</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {/* Item 1 */}
                            <div className="group cursor-pointer">
                                <NewspaperCard className="p-2 hover:-translate-y-1 transition-transform">
                                    <div className="aspect-square bg-gray-100 mb-3 border border-black relative">
                                        <div className="absolute top-2 right-2 bg-accent-yellow text-black font-bold px-2 py-1 text-xs border border-black z-10">
                                            $50
                                        </div>
                                        <Doodle src="/doodles/book.svg" className="w-full h-full p-8" />
                                    </div>
                                    <h3 className="font-bold text-sm uppercase truncate">Calculus Textbook (Barely Used)</h3>
                                    <p className="text-xs text-gray-500 mt-1">Seller: Alex M.</p>
                                </NewspaperCard>
                            </div>

                            {/* Item 2 */}
                            <div className="group cursor-pointer">
                                <NewspaperCard className="p-2 hover:-translate-y-1 transition-transform bg-accent-blue/5">
                                    <div className="aspect-square bg-white mb-3 border border-black relative">
                                        <div className="absolute top-2 right-2 bg-black text-white font-bold px-2 py-1 text-xs z-10">
                                            $120
                                        </div>
                                        <Doodle src="/doodles/shopping-bag.svg" className="w-full h-full p-8" />
                                    </div>
                                    <h3 className="font-bold text-sm uppercase truncate">Graphing Calculator</h3>
                                    <p className="text-xs text-gray-500 mt-1">Seller: Sarah J.</p>
                                </NewspaperCard>
                            </div>

                            {/* Item 3 */}
                            <div className="group cursor-pointer">
                                <NewspaperCard className="p-2 hover:-translate-y-1 transition-transform">
                                    <div className="aspect-square bg-gray-100 mb-3 border border-black relative">
                                        <div className="absolute top-2 right-2 bg-accent-yellow text-black font-bold px-2 py-1 text-xs border border-black z-10">
                                            FREE
                                        </div>
                                        <Doodle src="/doodles/calendar.svg" className="w-full h-full p-8" />
                                    </div>
                                    <h3 className="font-bold text-sm uppercase truncate">Lab Coat (Slightly Stained)</h3>
                                    <p className="text-xs text-gray-500 mt-1">Seller: Mike T.</p>
                                </NewspaperCard>
                            </div>

                            {/* Sell Button */}
                            <div className="flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                                        <span className="text-white text-4xl font-display">+</span>
                                    </div>
                                    <p className="font-bold uppercase">Sell Item</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </PageTransition>
        </>
    );
}
