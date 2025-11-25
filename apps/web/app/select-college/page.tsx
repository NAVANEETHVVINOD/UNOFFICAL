"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';

interface College {
    id: string;
    name: string;
    slug: string;
    location: string;
}

export default function SelectCollegePage() {
    const router = useRouter();
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const data = await api.getColleges();
            setColleges(data);
        } catch (error) {
            console.error('Failed to fetch colleges:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredColleges = colleges.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.location.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (slug: string) => {
        // Save selected college to local storage or context if needed
        // For now, just navigate to the college hub
        router.push(`/colleges/${slug}`);
    };

    return (
        <Container>
            <div className="min-h-screen py-12 flex flex-col items-center">
                <div className="text-center mb-12">
                    <Badge className="mb-4 bg-accent-yellow text-black border-black">STEP 01</Badge>
                    <h1 className="font-display text-5xl font-black mb-4">SELECT YOUR CAMPUS</h1>
                    <p className="text-xl text-gray-600 font-serif italic">"Where the chaos begins."</p>
                </div>

                <div className="w-full max-w-2xl mb-8">
                    <input
                        type="text"
                        placeholder="Search for your college..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-4 text-xl font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <Doodle src="/doodles/loading.svg" className="w-16 h-16 animate-spin" />
                    </div>
                ) : (
                    <div className="grid gap-6 w-full max-w-2xl">
                        {filteredColleges.map((college) => (
                            <NewspaperCard
                                key={college.id}
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors group relative overflow-hidden"
                                onClick={() => handleSelect(college.slug)}
                            >
                                <div className="absolute top-0 right-0 bg-accent-blue text-white px-3 py-1 font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                    ENTER -&gt;
                                </div>
                                <h3 className="font-display text-2xl font-black mb-2">{college.name}</h3>
                                <p className="text-gray-600 font-mono text-sm">📍 {college.location}</p>
                            </NewspaperCard>
                        ))}

                        {filteredColleges.length === 0 && (
                            <div className="text-center p-8 border-4 border-black border-dashed bg-gray-100">
                                <p className="font-bold text-gray-500">No colleges found.</p>
                                <p className="text-sm text-gray-400 mt-2">Is your campus not listed? Too bad.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Container>
    );
}
