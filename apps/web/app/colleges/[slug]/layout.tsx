import { ReactNode } from 'react';
import Link from 'next/link';
import Container from '../../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Tape } from '../../components/ui/NewspaperUI';

interface CollegeLayoutProps {
    children: ReactNode;
    params: Promise<{
        slug: string;
    }>;
}

export default async function CollegeLayout({ children, params }: CollegeLayoutProps) {
    const { slug } = await params;
    const collegeName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="min-h-screen bg-[#f0f0f0] pb-20">
            {/* College Header */}
            <div className="bg-black text-white pt-24 pb-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('/doodles/header-vangof.jpg')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/50 to-black"></div>

                <Container className="relative z-10">
                    <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                        <div className="w-32 h-32 bg-white rounded-xl border-4 border-white shadow-xl overflow-hidden rotate-[-3deg]">
                            <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${slug}`}
                                alt={collegeName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <Badge className="bg-accent-yellow text-black mb-2 border-white">OFFICIAL_HUB</Badge>
                            <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-none mb-2">
                                {collegeName}
                            </h1>
                            <p className="font-serif italic text-xl text-gray-300">
                                "The place where dreams are debugged."
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/dashboard">
                                <RetroButton variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                                    Exit Hub
                                </RetroButton>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <Link href={`/colleges/${slug}`}>
                            <RetroButton variant="secondary" className="rounded-b-none border-b-0 translate-y-1">
                                Overview
                            </RetroButton>
                        </Link>
                        <Link href={`/colleges/${slug}/events`}>
                            <RetroButton variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                Events
                            </RetroButton>
                        </Link>
                        <Link href={`/colleges/${slug}/clubs`}>
                            <RetroButton variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                Clubs
                            </RetroButton>
                        </Link>
                        <Link href={`/colleges/${slug}/marketplace`}>
                            <RetroButton variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                                Marketplace
                            </RetroButton>
                        </Link>
                    </div>
                </Container>
            </div>

            {/* Main Content */}
            <Container className="pt-8">
                {children}
            </Container>
        </div>
    );
}
