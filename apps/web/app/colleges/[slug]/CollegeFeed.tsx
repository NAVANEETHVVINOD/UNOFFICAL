"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { NewspaperCard, RetroButton, Badge, Sticker, Tape, Marquee, EventRow } from "../../components/ui/NewspaperUI";
import { MiniProfile, PostCard, EventTicket, PollCard, CollabCard } from "../../components/ui/SocialComponents";
import CreatePostModal from "../../components/CreatePostModal";
import Doodle from "../../components/ui/Doodle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants, cardHoverVariants } from "../../../lib/animations";
import { Calendar, Users, BookOpen, ShoppingBag, Bell, TrendingUp, Megaphone, Sparkles, Zap, ArrowRight, Hash } from "lucide-react";

interface CollegeStats {
    totalClubs: number;
    totalEvents: number;
    totalMarketplacePosts: number;
    totalNotes: number;
    totalMembers: number;
}

interface Club {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export default function CollegeFeed({ collegeSlug, initialEvents }: { collegeSlug: string, initialEvents: any[] }) {
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [stats, setStats] = useState<CollegeStats | null>(null);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [announcements] = useState([
        { id: 1, title: "Campus closed for maintenance", date: "Dec 20", type: "warning" },
        { id: 2, title: "New semester registration open", date: "Jan 5", type: "info" },
        { id: 3, title: "Library hours extended", date: "Dec 18", type: "success" },
    ]);

    const loadFeed = async (reset = false) => {
        const currentPage = reset ? 1 : page;
        if (reset) {
            setLoading(true);
            setError(null);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const postsPromise = api.getPosts(collegeSlug, currentPage);
            const eventsPromise = reset ? api.getEvents(collegeSlug) : Promise.resolve([]);
            const statsPromise = reset ? api.getCollegeStats(collegeSlug) : Promise.resolve(null);
            const clubsPromise = reset ? api.getClubs(collegeSlug) : Promise.resolve([]);

            const [postsRes, events, statsData, clubsData] = await Promise.all([
                postsPromise.catch(() => ({ data: [], meta: { lastPage: 0 } })),
                eventsPromise.catch(() => []),
                statsPromise.catch(() => null),
                clubsPromise.catch(() => [])
            ]);

            if (statsData) setStats(statsData);
            if (Array.isArray(clubsData)) setClubs(clubsData.slice(0, 5));

            const postsData = postsRes.data || [];

            // Combine and sort
            const newItems = [
                ...postsData.map((p: any) => ({ type: 'post', data: p, date: new Date(p.createdAt) })),
                ...(Array.isArray(events) ? events : []).map((e: any) => ({
                    type: 'event', data: e, date: new Date(e.createdAt)
                }))
            ];

            setFeedItems(prev => {
                const combined = reset ? newItems : [...prev, ...newItems];
                const unique = Array.from(new Map(combined.map(item => [item.data.id, item])).values());
                return unique.sort((a, b) => b.date.getTime() - a.date.getTime());
            });

            if (postsRes.meta) {
                setHasMore(currentPage < postsRes.meta.lastPage);
                setPage(currentPage + 1);
            } else {
                setHasMore(false);
            }

        } catch (e) {
            console.error("Feed error", e);
            setError("Failed to load feed. Please try again.");
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }

    useEffect(() => {
        loadFeed(true);
    }, [collegeSlug]);

    return (
        <motion.div
            className="grid md:grid-cols-12 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            onPanEnd={(e: any, info: any) => {
                if (window.innerWidth < 768) {
                    if (info.offset.x < -100) {
                        window.location.href = `/colleges/${collegeSlug}/events`;
                    } else if (info.offset.x > 100) {
                        window.location.href = '/dashboard';
                    }
                }
            }}
        >
            {/* LEFT SIDEBAR: Stats, Quick Actions, Clubs */}
            <motion.div className="md:col-span-3 hidden md:block" variants={itemVariants}>
                <div className="sticky top-24 space-y-4">
                    {/* College Stats Card */}
                    {stats && (
                        <NewspaperCard className="p-4" rotate={-1}>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4" />
                                <h3 className="font-black font-display text-sm uppercase">Campus Stats</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="bg-accent-yellow/20 rounded-lg p-2 border border-black/10">
                                    <div className="font-black text-lg">{stats.totalMembers}</div>
                                    <div className="text-xs text-gray-600">Students</div>
                                </div>
                                <div className="bg-accent-blue/20 rounded-lg p-2 border border-black/10">
                                    <div className="font-black text-lg">{stats.totalClubs}</div>
                                    <div className="text-xs text-gray-600">Clubs</div>
                                </div>
                                <div className="bg-accent-pink/20 rounded-lg p-2 border border-black/10">
                                    <div className="font-black text-lg">{stats.totalEvents}</div>
                                    <div className="text-xs text-gray-600">Events</div>
                                </div>
                                <div className="bg-green-100 rounded-lg p-2 border border-black/10">
                                    <div className="font-black text-lg">{stats.totalNotes}</div>
                                    <div className="text-xs text-gray-600">Notes</div>
                                </div>
                            </div>
                        </NewspaperCard>
                    )}

                    {/* Quick Actions */}
                    <NewspaperCard className="p-4 text-center">
                        <h3 className="font-black font-display text-sm uppercase mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                            <RetroButton onClick={() => setIsPostModalOpen(true)} className="w-full text-xs py-2">
                                + Create Post
                            </RetroButton>
                            <Link href="/notes">
                                <RetroButton variant="outline" className="w-full text-xs py-2">
                                    <BookOpen className="w-3 h-3" /> Notes
                                </RetroButton>
                            </Link>
                            <Link href={`/clubs?college=${collegeSlug}`}>
                                <RetroButton variant="outline" className="w-full text-xs py-2">
                                    <Users className="w-3 h-3" /> Clubs
                                </RetroButton>
                            </Link>
                        </div>
                    </NewspaperCard>

                    {/* Clubs List */}
                    {clubs.length > 0 && (
                        <NewspaperCard className="p-4" rotate={1}>
                            <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4" />
                                <h3 className="font-black font-display text-sm uppercase">Active Clubs</h3>
                            </div>
                            <ul className="space-y-2">
                                {clubs.map((club) => (
                                    <li key={club.id}>
                                        <Link 
                                            href={`/clubs/${club.id}`}
                                            className="text-sm font-serif hover:text-accent-blue transition-colors flex items-center gap-2"
                                        >
                                            <span className="w-2 h-2 bg-accent-yellow rounded-full" />
                                            {club.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <Link href={`/clubs?college=${collegeSlug}`} className="text-xs text-gray-500 hover:text-black mt-3 block">
                                View all clubs →
                            </Link>
                        </NewspaperCard>
                    )}
                </div>
            </motion.div>

            {/* CENTER: MAIN FEED */}
            <motion.div className="md:col-span-6" variants={itemVariants}>
                {/* Upcoming Events Ribbon */}
                {initialEvents.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Calendar className="w-4 h-4" />
                            <h3 className="font-black font-display text-sm uppercase">Upcoming Events</h3>
                        </div>
                        <div className="overflow-x-auto pb-4 -mx-4 px-4 flex gap-4 scrollbar-hide">
                            {initialEvents.map((event: any) => (
                                <Link key={event.id} href={`/events/${event.id}`} className="min-w-[220px] shrink-0">
                                    <motion.div whileHover={{ scale: 1.02, rotate: -1 }} whileTap={{ scale: 0.98 }}>
                                        <NewspaperCard className="p-4 bg-gradient-to-br from-accent-pink to-accent-blue text-white h-full">
                                            <div className="text-xs font-mono mb-1 opacity-80">
                                                {new Date(event.startsAt).toLocaleDateString('en-US', { 
                                                    weekday: 'short', 
                                                    month: 'short', 
                                                    day: 'numeric' 
                                                })}
                                            </div>
                                            <div className="font-bold leading-tight mb-2">{event.title}</div>
                                            {event.venue && (
                                                <div className="text-xs opacity-70">📍 {event.venue}</div>
                                            )}
                                        </NewspaperCard>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <NewspaperCard key={i} className="p-6 animate-pulse">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                                    </div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                            </NewspaperCard>
                        ))}
                    </div>
                )}

                {/* Feed Items */}
                <AnimatePresence mode="popLayout">
                    {feedItems.map((item, idx) => (
                        <motion.div
                            key={`${item.type}-${item.data.id}`}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, y: -20 }}
                            layout
                        >
                            {item.type === 'post' && <PostCard post={item.data} />}
                            {item.type === 'event' && <EventTicket event={item.data} />}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Load More */}
                {!loading && feedItems.length > 0 && (
                    <div className="text-center pt-8 pb-12">
                        {isLoadingMore ? (
                            <span className="font-mono text-gray-400 animate-pulse">Loading more...</span>
                        ) : hasMore ? (
                            <RetroButton onClick={() => loadFeed(false)} variant="outline">
                                Load More Posts
                            </RetroButton>
                        ) : (
                            <span className="font-mono text-gray-400 text-xs uppercase tracking-widest">
                                — End of feed —
                            </span>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {feedItems.length === 0 && !loading && (
                    <NewspaperCard className="text-center py-12">
                        <Doodle src="/doodles/tumbleweed.svg" className="w-24 h-24 mx-auto mb-4 opacity-50" />
                        <p className="font-serif text-gray-500 mb-4">No posts yet. Be the first to share!</p>
                        <RetroButton onClick={() => setIsPostModalOpen(true)} variant="secondary">
                            Create First Post
                        </RetroButton>
                    </NewspaperCard>
                )}
            </motion.div>

            {/* RIGHT SIDEBAR: Announcements, Trending */}
            <motion.div className="md:col-span-3 hidden md:block" variants={itemVariants}>
                <div className="sticky top-24 space-y-4">
                    {/* Announcements */}
                    <NewspaperCard className="p-4 bg-accent-yellow/10" rotate={1}>
                        <div className="flex items-center gap-2 mb-3">
                            <Megaphone className="w-4 h-4" />
                            <h3 className="font-black font-display text-sm uppercase">Announcements</h3>
                        </div>
                        <ul className="space-y-3">
                            {announcements.map((ann) => (
                                <li key={ann.id} className="border-b border-black/10 pb-2 last:border-0">
                                    <p className="text-sm font-serif">{ann.title}</p>
                                    <span className="text-xs text-gray-500">{ann.date}</span>
                                </li>
                            ))}
                        </ul>
                    </NewspaperCard>

                    {/* Trending Topics */}
                    <NewspaperCard className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="w-4 h-4" />
                            <h3 className="font-black font-display text-sm uppercase">Trending</h3>
                        </div>
                        <ul className="text-sm space-y-2 font-serif text-gray-600">
                            <li className="flex items-center gap-2">
                                <span className="text-accent-pink font-bold">#1</span>
                                Exam schedules released
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-accent-blue font-bold">#2</span>
                                Robotics club wins gold
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-accent-yellow font-bold">#3</span>
                                New cafeteria menu
                            </li>
                        </ul>
                    </NewspaperCard>

                    {/* Notes Promo */}
                    <NewspaperCard className="p-4 bg-gradient-to-br from-green-50 to-blue-50">
                        <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4" />
                            <h3 className="font-black font-display text-sm uppercase">Study Notes</h3>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                            {stats?.totalNotes || 0} notes shared by students
                        </p>
                        <Link href="/notes">
                            <RetroButton variant="outline" className="w-full text-xs py-2">
                                Browse Notes
                            </RetroButton>
                        </Link>
                    </NewspaperCard>
                </div>
            </motion.div>

            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onPostCreated={() => loadFeed(true)}
            />
        </motion.div>
    )
}
