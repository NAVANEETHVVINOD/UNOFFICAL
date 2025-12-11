"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { NewspaperCard, RetroButton, Badge, Sticker, Tape, Marquee } from "../../components/ui/NewspaperUI";
import { MiniProfile, PostCard, EventTicket, PollCard, CollabCard } from "../../components/ui/SocialComponents";
import CreatePostModal from "../../components/CreatePostModal";
import Doodle from "../../components/ui/Doodle";

import { motion } from "framer-motion";

export default function CollegeFeed({ collegeSlug, initialEvents }: { collegeSlug: string, initialEvents: any[] }) {
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    const loadFeed = async (reset = false) => {
        const currentPage = reset ? 1 : page;

        if (reset) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const postsPromise = api.getPosts(collegeSlug, currentPage);
            const eventsPromise = reset ? api.getEvents(collegeSlug) : Promise.resolve([]);

            const [postsRes, events] = await Promise.all([
                postsPromise.catch(() => ({ data: [], meta: { lastPage: 0 } })),
                eventsPromise.catch(() => [])
            ]);

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
            onPanEnd={(e: any, info: any) => {
                if (window.innerWidth < 768) {
                    if (info.offset.x < -100) {
                        // Next -> Events
                        window.location.href = `/colleges/${collegeSlug}/events`;
                    } else if (info.offset.x > 100) {
                        // Prev -> Home
                        window.location.href = '/dashboard';
                    }
                }
            }}
        >
            {/* LEFT: Quick Actions / Nav */}
            <div className="md:col-span-3 hidden md:block">
                <div className="sticky top-8">
                    <NewspaperCard className="p-4 text-center mb-4" rotate={-1}>
                        <h3 className="font-black font-display text-xl uppercase mb-2">My College</h3>
                        <RetroButton onClick={() => setIsPostModalOpen(true)} className="w-full text-sm">
                            + Create Post
                        </RetroButton>
                    </NewspaperCard>
                </div>
            </div>

            {/* CENTER: FEED */}
            <div className="md:col-span-6">
                {/* Events Ribbon (Horizontal) */}
                {initialEvents.length > 0 && (
                    <div className="mb-8 overflow-x-auto pb-4 -mx-4 px-4 flex gap-4 scrollbar-hide">
                        {initialEvents.map((event: any) => (
                            <div key={event.id} className="min-w-[200px] shrink-0">
                                <NewspaperCard className="p-3 bg-accent-pink text-white h-full" rotate={1}>
                                    <div className="text-xs font-mono mb-1">{new Date(event.startsAt).toLocaleDateString()}</div>
                                    <div className="font-bold leading-tight">{event.title}</div>
                                </NewspaperCard>
                            </div>
                        ))}
                    </div>
                )}

                {feedItems.map((item, idx) => {
                    if (item.type === 'post') return <PostCard key={`post-${item.data.id}`} post={item.data} />;
                    if (item.type === 'event') return <EventTicket key={`event-${item.data.id}`} event={item.data} />;
                    return null;
                })}

                {/* Load More Button */}
                {!loading && feedItems.length > 0 && (
                    <div className="text-center pt-8 pb-12">
                        {isLoadingMore ? (
                            <span className="font-mono text-gray-400 animate-pulse">Loading more...</span>
                        ) : hasMore ? (
                            <RetroButton onClick={() => loadFeed(false)} variant="outline">Load More</RetroButton>
                        ) : (
                            <span className="font-mono text-gray-400 text-xs uppercase tracking-widest">--- You've reached the end ---</span>
                        )}
                    </div>
                )}

                {feedItems.length === 0 && !loading && (
                    <div className="text-center py-12 opacity-50">
                        <Doodle src="/doodles/tumbleweed.svg" className="w-24 h-24 mx-auto mb-4" />
                        <p className="font-serif">It's quiet... too quiet.</p>
                    </div>
                )}
            </div>

            {/* RIGHT: Widgets */}
            <div className="md:col-span-3 hidden md:block">
                <NewspaperCard className="bg-white p-4">
                    <h4 className="font-bold mb-2">Trending on Campus</h4>
                    <ul className="text-sm space-y-2 list-disc list-inside font-serif text-gray-600">
                        <li>Exam schedules released</li>
                        <li>Robotics club wins gold</li>
                        <li>Cafeteria pizza improvement</li>
                    </ul>
                </NewspaperCard>
            </div>

            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                onPostCreated={() => loadFeed(true)}
            />
        </motion.div>
    )
}
