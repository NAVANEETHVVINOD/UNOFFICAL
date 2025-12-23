"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import ProfileSidebar from "../../components/dashboard/ProfileSidebar";
import CreatePostModal from "../../components/CreatePostModal";

import FeedComposer from "../../components/feed/FeedComposer";
import ArcMenu from "../../components/navigation/ArcMenu";
import CollegeNav from "../../components/navigation/CollegeNav";
import { PostCard, EventTicket } from "../../components/ui/SocialComponents";
import { FeedSkeleton } from "../../components/ui/Skeleton";
import FeedItemFactory from "../../components/FeedItemFactory";
import type { FeedItemData } from "../../hooks/useInfiniteFeed";

// Icons
import {
    Calendar,
    Home,
    Users,
    BookOpen,
    Bell,
    TrendingUp,
    Megaphone,
    Sparkles,
    Zap,
    ArrowUpRight,
    Hash,
    PenSquare,
    FileText,
    Bookmark,
    Star,
    ChevronRight,
    MapPin,
    Clock,
    AlertCircle,
    Info,
    CheckCircle,
} from "lucide-react";

// Animation variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
};

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
    memberCount?: number;
}

interface Announcement {
    id: number;
    title: string;
    date: string;
    type: "warning" | "info" | "success";
}

// Quick Actions data (without marketplace)
const quickActions = [
    { icon: PenSquare, label: "New Post", color: "bg-primary", action: "post" },
    { icon: Calendar, label: "Events", color: "bg-accent-coral", href: "events" },
    { icon: FileText, label: "Notes", color: "bg-accent-blue", href: "/notes" },
    { icon: Bookmark, label: "Saved", color: "bg-accent-purple", href: "/saved" },
    { icon: Users, label: "Clubs", color: "bg-accent-orange", href: "clubs" },
    { icon: Bell, label: "Alerts", color: "bg-accent-mint", href: "#alerts" },
];

// Trending topics (campus-specific)
const trendingTopics = [
    { tag: "CampusFest", posts: 156, trending: true },
    { tag: "Placements", posts: 124, trending: true },
    { tag: "ClubActivities", posts: 89, trending: false },
    { tag: "StudyNotes", posts: 67, trending: false },
];

export default function CollegeFeed({
    collegeSlug,
    initialEvents,
}: {
    collegeSlug: string;
    initialEvents: any[];
}) {
    const router = useRouter();
    const [feedItems, setFeedItems] = useState<FeedItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [postModalTab, setPostModalTab] = useState<
        "TEXT" | "POLL" | "MARKET" | "EVENT"
    >("TEXT");
    const [stats, setStats] = useState<CollegeStats | null>(null);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [announcements] = useState<Announcement[]>([
        {
            id: 1,
            title: "Campus closed for maintenance",
            date: "Dec 20",
            type: "warning",
        },
        {
            id: 2,
            title: "New semester registration open",
            date: "Jan 5",
            type: "info",
        },
        { id: 3, title: "Library hours extended", date: "Dec 18", type: "success" },
    ]);

    const getAnnouncementBg = (type: string) => {
        switch (type) {
            case "warning": return "bg-accent-orange/20 text-accent-orange";
            case "success": return "bg-green-500/20 text-green-600";
            case "info": return "bg-blue-500/20 text-blue-600";
            default: return "bg-gray-100 text-gray-600";
        }
    };

    const getAnnouncementIcon = (type: string) => {
        switch (type) {
            case "warning": return <AlertCircle className="w-5 h-5" />;
            case "success": return <CheckCircle className="w-5 h-5" />;
            case "info": return <Info className="w-5 h-5" />;
            default: return <Megaphone className="w-5 h-5" />;
        }
    };

    // Listen for create modal events
    useEffect(() => {
        const handleOpenModal = (e: any) => {
            setPostModalTab(e.detail?.type || "TEXT");
            setIsPostModalOpen(true);
        };
        document.addEventListener("open-create-modal", handleOpenModal);
        return () =>
            document.removeEventListener("open-create-modal", handleOpenModal);
    }, []);

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
            const eventsPromise = reset
                ? api.getEvents(collegeSlug)
                : Promise.resolve([]);
            const statsPromise = reset
                ? api.getCollegeStats(collegeSlug)
                : Promise.resolve(null);
            const clubsPromise = reset
                ? api.getClubs({ collegeSlug })
                : Promise.resolve([]);

            const [postsRes, events, statsData, clubsData] = await Promise.all([
                postsPromise.catch(() => ({ data: [], meta: { lastPage: 0 } })),
                eventsPromise.catch(() => []),
                statsPromise.catch(() => null),
                clubsPromise.catch(() => []),
            ]);

            if (statsData) setStats(statsData);
            if (Array.isArray(clubsData)) setClubs(clubsData.slice(0, 5));

            const postsData = postsRes.data || [];

            // Combine and sort
            // Combine and sort
            const newItems: FeedItemData[] = [
                ...postsData.map((p: any) => ({
                    id: `post-${p.id}`,
                    type: "post" as const,
                    data: p,
                    createdAt: p.createdAt,
                })),
                ...(Array.isArray(events) ? events : []).map((e: any) => ({
                    id: `event-${e.id}`,
                    type: "event" as const,
                    data: e,
                    createdAt: e.createdAt,
                })),
            ];

            setFeedItems((prev) => {
                const combined = reset ? newItems : [...prev, ...newItems];
                const unique = Array.from(
                    new Map(combined.map((item) => [item.id, item])).values()
                );
                return unique.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            });
        } catch (error) {
            console.error("Failed to load feed:", error);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    };
    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT SIDEBAR - Desktop Only */}
            <motion.aside
                className="hidden lg:block w-80 shrink-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="sticky top-24 space-y-6">
                    {/* Clubs Widget */}
                    {clubs.length > 0 && (
                        <motion.div className="bg-white border-2 border-black shadow-neo rounded-xl overflow-hidden">
                            <div className="p-4 border-b-2 border-black bg-accent-orange/10">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Active Clubs
                                </h3>
                            </div>
                            <div className="divide-y-2 divide-black/5">
                                {clubs.map((club) => (
                                    <Link key={club.id} href={`/clubs/${club.id}`}>
                                        <div className="px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer group">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm">{club.name}</span>
                                                <ChevronRight className="w-4 h-4 text-neutral-300" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={`/clubs?college=${collegeSlug}`}
                                className="block px-4 py-3 bg-neutral-50 text-center hover:bg-neutral-100 transition-colors"
                            >
                                <span className="text-sm font-medium text-ink">
                                    View All Clubs →
                                </span>
                            </Link>
                        </motion.div>
                    )}

                    {/* Footer */}
                    <div className="text-center py-4">
                        <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                            LINKER v3.0 • Campus Feed
                        </p>
                    </div>
                </div>
            </motion.aside>

            {/* CENTER FEED */}
            < motion.main
                className="flex-1 min-w-0 pb-32 lg:pb-8"
                variants={itemVariants}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={(_, info) => {
                    // Swipe Left (dragged content left) -> Go to Events
                    if (info.offset.x < -100) {
                        router.push(`/colleges/${collegeSlug}/events`);
                    }
                }}
            >
                {/* Local Navigation Tabs */}
                {/* Local Navigation Tabs */}
                <CollegeNav collegeSlug={collegeSlug} />

                {/* Upcoming Events Ribbon */}
                {
                    initialEvents.length > 0 && (
                        <motion.div
                            className="mt-6 mb-8 transform -rotate-1 origin-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-accent-coral border-2 border-ink rounded-lg flex items-center justify-center shadow-neo-sm">
                                        <Calendar className="w-4 h-4 text-ink" />
                                    </div>
                                    <h3 className="font-display text-sm uppercase tracking-wide">
                                        Upcoming Events
                                    </h3>
                                </div>
                                <Link
                                    href={`/colleges/${collegeSlug}/events`}
                                    className="text-sm font-medium text-neutral-500 hover:text-ink transition-colors flex items-center gap-1"
                                >
                                    View All <ArrowUpRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto pb-4 -mx-4 px-4 flex gap-4 scrollbar-hide">
                                {initialEvents.map((event: any, index: number) => (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        className="min-w-[240px] shrink-0"
                                    >
                                        <motion.div
                                            className="bg-paper border-2 border-ink rounded-card-lg overflow-hidden shadow-neo hover:shadow-neo-lg transition-all h-full"
                                            whileHover={{ scale: 1.02, rotate: -1, y: -4 }}
                                            whileTap={{ scale: 0.98 }}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <div className="h-2 bg-gradient-to-r from-accent-coral to-accent-pink" />
                                            <div className="p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="px-2 py-1 bg-primary/20 rounded text-[10px] font-bold uppercase">
                                                        {new Date(event.startsAt).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                weekday: "short",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(event.startsAt).toLocaleTimeString(
                                                            "en-US",
                                                            {
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                                <h4 className="font-display text-base leading-tight mb-2 line-clamp-2">
                                                    {event.title}
                                                </h4>
                                                {event.venue && (
                                                    <div className="flex items-center gap-1 text-xs text-neutral-500">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate">{event.venue}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )
                }

                {/* Feed Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary border-2 border-ink rounded-lg flex items-center justify-center shadow-neo-sm">
                            <Sparkles className="w-5 h-5 text-ink" />
                        </div>
                        <div>
                            <h1 className="font-display text-2xl text-ink leading-tight">
                                Campus Feed
                            </h1>
                            <p className="text-sm text-neutral-500">
                                What's happening on campus
                            </p>
                        </div>
                    </div>

                    {/* Live indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-paper border-2 border-ink rounded-full shadow-neo-sm">
                        <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse" />
                        <span className="font-mono text-xs uppercase">Live</span>
                    </div>
                </div>

                {/* Feed Composer */}
                <FeedComposer />

                {/* Loading State */}
                {
                    loading && (
                        <div className="mt-6">
                            <FeedSkeleton count={3} />
                        </div>
                    )
                }

                {/* Feed Items */}
                <AnimatePresence mode="popLayout">
                    <motion.div className="space-y-4 mt-6" variants={containerVariants}>
                        {feedItems.map((item) => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                layout
                                className="transform-gpu"
                            >
                                <FeedItemFactory item={item} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Loading More */}
                {
                    isLoadingMore && (
                        <div className="mt-6">
                            <FeedSkeleton count={2} />
                        </div>
                    )
                }

                {/* Load More Button */}
                {
                    !loading && feedItems.length > 0 && hasMore && !isLoadingMore && (
                        <motion.div
                            className="flex justify-center py-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <button
                                onClick={() => loadFeed(false)}
                                className="btn-neo btn-primary px-6 py-3 text-sm rounded-card"
                            >
                                Load More Posts
                            </button>
                        </motion.div>
                    )
                }

                {/* End of Feed */}
                {
                    !hasMore && feedItems.length > 0 && (
                        <motion.div
                            className="text-center py-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full">
                                <span className="text-2xl">🎉</span>
                                <span className="font-mono text-sm text-neutral-600">
                                    You're all caught up!
                                </span>
                            </div>
                        </motion.div>
                    )
                }

                {/* Empty State */}
                {
                    feedItems.length === 0 && !loading && (
                        <motion.div
                            className="text-center py-16"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="font-display text-xl text-ink mb-2">No posts yet</h3>
                            <p className="text-neutral-500 mb-6">
                                Be the first to share something with your campus!
                            </p>
                            <button
                                onClick={() => {
                                    setPostModalTab("TEXT");
                                    setIsPostModalOpen(true);
                                }}
                                className="btn-neo btn-primary rounded-card"
                            >
                                Create First Post
                            </button>
                        </motion.div>
                    )
                }
            </motion.main >

            {/* RIGHT SIDEBAR - Desktop Only */}
            < motion.aside
                className="hidden xl:block w-[280px] flex-shrink-0"
                variants={itemVariants}
            >
                <div className="sticky top-24 space-y-4">
                    {/* Announcements */}
                    <motion.div
                        className="bg-paper border-2 border-ink shadow-neo overflow-hidden rounded-card-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="px-4 py-3 bg-primary/10 border-b border-ink/10 flex items-center gap-2">
                            <Megaphone className="w-4 h-4" />
                            <h3 className="font-display text-sm uppercase tracking-wide">
                                Announcements
                            </h3>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {announcements.map((ann, index) => (
                                <motion.div
                                    key={ann.id}
                                    className="px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer group"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * index }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getAnnouncementBg(ann.type)}`}
                                        >
                                            {getAnnouncementIcon(ann.type)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-ink leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                {ann.title}
                                            </p>
                                            <span className="text-xs text-neutral-500 mt-1 block">
                                                {ann.date}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Trending Topics */}
                    <motion.div
                        className="bg-paper border-2 border-ink shadow-neo overflow-hidden rounded-card-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="px-4 py-3 bg-accent-coral/10 border-b border-ink/10 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <h3 className="font-display text-sm uppercase tracking-wide">
                                Trending
                            </h3>
                        </div>
                        <div className="divide-y divide-neutral-100">
                            {trendingTopics.map((topic, index) => (
                                <motion.div
                                    key={topic.tag}
                                    className="px-4 py-3 hover:bg-neutral-50 transition-colors cursor-pointer group"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-neutral-400" />
                                            <span className="font-medium text-sm group-hover:text-primary transition-colors">
                                                {topic.tag}
                                            </span>
                                            {topic.trending && (
                                                <span className="px-1.5 py-0.5 bg-accent-coral/20 text-accent-coral text-[10px] font-bold rounded">
                                                    HOT
                                                </span>
                                            )}
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-primary transition-colors" />
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1 ml-6">
                                        {topic.posts} posts
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                        <div className="px-4 py-3 bg-neutral-50 text-center hover:bg-neutral-100 transition-colors cursor-pointer">
                            <span className="text-sm font-medium text-ink">
                                Explore More →
                            </span>
                        </div>
                    </motion.div>

                    {/* Study Notes Promo */}
                    <motion.div
                        className="bg-paper border-2 border-ink shadow-neo p-4 rounded-card-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-accent-blue" />
                            </div>
                            <h3 className="font-display text-sm uppercase tracking-wide">
                                Study Notes
                            </h3>
                        </div>
                        <p className="text-xs text-neutral-600 mb-4">
                            {stats?.totalNotes || 0} notes shared by students. Access study
                            materials and previous year papers.
                        </p>
                        <Link
                            href="/notes"
                            className="btn-neo bg-accent-blue/20 text-ink px-4 py-2 text-sm w-full block text-center hover:bg-accent-blue/30 transition-colors rounded-lg"
                        >
                            Browse Notes
                        </Link>
                    </motion.div>
                </div>
            </motion.aside >

            {/* Create Post Modal */}
            < CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                initialTab={postModalTab}
                onPostCreated={() => loadFeed(true)}
            />

            < ArcMenu onCompose={() => {
                setPostModalTab('TEXT');
                setIsPostModalOpen(true);
            }} />
        </div >
    );
}
