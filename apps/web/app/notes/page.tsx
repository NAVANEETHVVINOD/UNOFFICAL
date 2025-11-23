"use client"

import { useState, useEffect } from 'react';
import Container from '../components/ui/Container';
import { NewspaperCard, RetroButton, Badge, Staple, Tape } from '../components/ui/NewspaperUI';
import Doodle from '../components/ui/Doodle';
import { PageTransition } from '../providers/AnimationProvider';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import { motion } from 'framer-motion';
import { api } from '../../lib/api';
import Link from 'next/link';

interface Note {
    id: string;
    title: string;
    subject: string;
    description: string | null;
    author: {
        profile: {
            fullName: string;
        }
    };
    _count?: {
        likes: number;
    };
    createdAt: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const data = await api.getNotes();
            setNotes(data);
        } catch (error) {
            console.error('Failed to fetch notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <PageTransition>
            <Container>
                <div className="py-8 min-h-screen">
                    <DashboardNavbar />

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12 text-center relative"
                    >
                        <Doodle src="/doodles/bulb.svg" className="w-24 h-24 absolute -top-12 right-1/4 -z-10 opacity-20 rotate-12" />
                        <h1 className="font-display text-5xl md:text-7xl font-black mb-4">STUDY NOTES</h1>
                        <p className="font-hand text-xl text-gray-600 max-w-2xl mx-auto">
                            Share knowledge. Ace exams. Be a legend.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-xl mx-auto mb-12 relative"
                    >
                        <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 z-10" />
                        <div className="bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-2">
                            <input
                                type="text"
                                placeholder="Search by subject or topic..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-grow p-2 font-mono focus:outline-none"
                            />
                            <RetroButton className="py-2 px-6">FIND</RetroButton>
                        </div>
                    </motion.div>

                    {/* Notes List */}
                    {loading ? (
                        <div className="text-center py-20">
                            <Doodle src="/doodles/loading.svg" className="w-16 h-16 mx-auto animate-spin" />
                            <p className="font-mono mt-4">Loading notes...</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredNotes.map((note, index) => (
                                <motion.div
                                    key={note.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <Link href={`/notes/${note.id}`}>
                                        <NewspaperCard className="h-full hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group bg-white p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <Badge className="bg-accent-blue text-white border-black">
                                                    {note.subject}
                                                </Badge>
                                                <span className="font-mono text-xs text-gray-500">
                                                    {new Date(note.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-2xl mb-2 group-hover:underline decoration-2 decoration-accent-yellow">{note.title}</h3>
                                            <p className="text-gray-600 line-clamp-2 font-body text-sm mb-4">
                                                {note.description || "No description available."}
                                            </p>

                                            <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                        {note.author.profile.fullName[0]}
                                                    </div>
                                                    <span className="font-mono text-xs text-gray-600">
                                                        {note.author.profile.fullName}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm font-bold">
                                                    <span>❤️ {note._count?.likes || 0}</span>
                                                </div>
                                            </div>
                                        </NewspaperCard>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredNotes.length === 0 && (
                        <div className="text-center py-20">
                            <Doodle src="/doodles/sad-face.svg" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                            <h3 className="font-bold text-2xl mb-2">No Notes Found</h3>
                            <p className="text-gray-600">Be the first to share your wisdom!</p>
                            <div className="mt-6">
                                <RetroButton>UPLOAD NOTES</RetroButton>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </PageTransition>
    );
}
