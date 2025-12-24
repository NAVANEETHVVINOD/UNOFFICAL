"use client";

import React, { useState, useEffect } from "react";
import { api } from "../../../lib/api";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Components
import CreatePostModal from "../../components/CreatePostModal";

import FeedComposer from "../../components/feed/FeedComposer";
import ArcMenu from "../../components/navigation/ArcMenu";
import CollegeNav from "../../components/navigation/CollegeNav"; // Kept for local tabs logic if needed, but we implemented custom tabs
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
    Info as InfoIcon
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
    college,
}: {
    collegeSlug: string;
    initialEvents: any[];
    college: any;
}) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'feed' | 'official' | 'about'>('feed');
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
        const iconMap: Record<string, any> = {
            warning: AlertCircle,
            success: CheckCircle,
            info: Info,
        };
        const Icon = iconMap[type] || Megaphone;
        return <Icon className="w-5 h-5" />;
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

    // Effect to reload feed when tab changes
    useEffect(() => {
        if (activeTab === 'feed' || activeTab === 'official') {
            loadFeed(true);
        }
    }, [activeTab]);

    const loadFeed = async (reset = false) => {
        const currentPage = reset ? 1 : page;
        if (reset) {
            setLoading(true);
            setError(null);
            setPage(1); // Ensure page is reset
        } else {
            setIsLoadingMore(true);
        }

        try {
            // Determine if fetching official only
            const isOfficial = activeTab === 'official';

            const postsPromise = api.getPosts(collegeSlug, currentPage, 10, 'college', isOfficial);

            const eventsPromise = reset && activeTab === 'feed' // Only show events in main feed for now
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
            let newItems: FeedItemData[] = postsData.map((p: any) => ({
                id: `post-${p.id}`,
                type: "post" as const,
                data: p,
                createdAt: p.createdAt,
            }));

            if (activeTab === 'feed') {
                const eventItems = (Array.isArray(events) ? events : []).map((e: any) => ({
                    id: `event-${e.id}`,
                    type: "event" as const,
                    data: e,
                    createdAt: e.createdAt,
                }));
                newItems = [...newItems, ...eventItems];
            }

            setFeedItems((prev) => {
                const combined = reset ? newItems : [...prev, ...newItems];
                const unique = Array.from(
                    new Map(combined.map((item) => [item.id, item])).values()
                );
                return unique.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            });

            setHasMore(postsData.length === 10);
            if (!reset && postsData.length > 0) {
                setPage(prev => prev + 1);
            } else if (reset && postsData.length > 0) {
                setPage(2);
            }

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
                    {/* College Info Card */}
                    <div className="bg-white border-2 border-black shadow-neo rounded-xl overflow-hidden p-4 text-center">
                        <div className="w-20 h-20 mx-auto bg-primary border-2 border-black rounded-full mb-3 flex items-center justify-center">
                            <Home className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="font-display text-xl font-bold mb-1">{college?.name || collegeSlug}</h2>
                        {college?.city && <p className="text-sm text-neutral-500">{college.city}, {college.state}</p>}
                    </div>

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
            <motion.main
                className="flex-1 min-w-0 pb-32 lg:pb-8"
                variants={itemVariants}
            >
                {/* Local Navigation Tabs - Replaced CollegeNav with Custom Tabs */}
                <div className="flex overflow-x-auto gap-2 pb-2 mb-4 scrollbar-hide border-b-2 border-neutral-100">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'feed'
                            ? 'bg-primary text-ink shadow-neo-sm border-2 border-ink'
                            : 'bg-white text-neutral-500 border-2 border-transparent hover:bg-neutral-100'
                            }`}
                    >
                        🏠 Feed
                    </button>
                    <button
                        onClick={() => setActiveTab('official')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'official'
                            ? 'bg-accent-blue text-white shadow-neo-sm border-2 border-ink'
                            : 'bg-white text-neutral-500 border-2 border-transparent hover:bg-neutral-100'
                            }`}
                    >
                        📢 Official Updates
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === 'about'
                            ? 'bg-ink text-white shadow-neo-sm border-2 border-ink'
                            : 'bg-white text-neutral-500 border-2 border-transparent hover:bg-neutral-100'
                            }`}
                    >
                        ℹ️ About
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'about' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-paper border-2 border-ink rounded-xl p-6 shadow-neo"
                    >
                        <h2 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
                            <InfoIcon className="w-6 h-6" /> About {college?.name}
                        </h2>
                        {college?.description ? (
                            <div className="prose prose-sm max-w-none font-medium leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: college.description.replace(/\n/g, '<br/>') }}
                            />
                        ) : (
                            <div className="text-center py-8 text-neutral-500 italic">
                                No description available for this campus yet.
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t-2 border-dashed border-neutral-200 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-neutral-50 rounded-lg">
                                <h4 className="font-bold text-neutral-400 text-xs uppercase mb-1">City</h4>
                                <p className="font-medium text-lg">{college?.city || 'Unknown'}</p>
                            </div>
                            <div className="p-4 bg-neutral-50 rounded-lg">
                                <h4 className="font-bold text-neutral-400 text-xs uppercase mb-1">State</h4>
                                <p className="font-medium text-lg">{college?.state || 'Unknown'}</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Feed Header */}
                        <div className="flex items-center justify-between mb-4 mt-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 border-2 border-ink rounded-lg flex items-center justify-center shadow-neo-sm ${activeTab === 'official' ? 'bg-accent-blue' : 'bg-primary'}`}>
                                    {activeTab === 'official' ? <Megaphone className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-ink" />}
                                </div>
                                <div>
                                    <h1 className="font-display text-2xl text-ink leading-tight">
                                        {activeTab === 'official' ? 'Official Updates' : 'Campus Feed'}
                                    </h1>
                                    <p className="text-sm text-neutral-500">
                                        {activeTab === 'official' ? 'Important announcements from admin' : "What's happening on campus"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feed Composer - Only on regular feed or if admin? For now simplify */}
                        {activeTab === 'feed' && <FeedComposer />}

                        {/* Loading State */}
                        {loading && (
                            <div className="mt-6">
                                <FeedSkeleton count={3} />
                            </div>
                        )}

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
                        {isLoadingMore && (
                            <div className="mt-6">
                                <FeedSkeleton count={2} />
                            </div>
                        )}

                        {/* Load More Button */}
                        {!loading && feedItems.length > 0 && hasMore && !isLoadingMore && (
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
                        )}

                        {/* Empty State */}
                        {feedItems.length === 0 && !loading && (
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
                                    {activeTab === 'official' ? 'No official announcements yet.' : 'Be the first to share something!'}
                                </p>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.main>

            {/* RIGHT SIDEBAR - Desktop Only */}
            <motion.aside
                className="hidden xl:block w-[280px] flex-shrink-0"
                variants={itemVariants}
            >
                <div className="sticky top-24 space-y-4">
                    {/* Upcoming Events Ribbon (Moved to sidebar for cleaner feed) */}
                    {initialEvents.length > 0 && (
                        <motion.div
                            className="bg-paper border-2 border-ink shadow-neo overflow-hidden rounded-card-lg mb-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="px-4 py-3 bg-accent-coral/10 border-b border-ink/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <h3 className="font-display text-sm uppercase tracking-wide">
                                        Upcoming
                                    </h3>
                                </div>
                                <Link href={`/colleges/${collegeSlug}/events`} className="text-xs font-bold hover:underline">View All</Link>
                            </div>
                            <div className="p-2 space-y-2">
                                {initialEvents.slice(0, 3).map((event: any) => (
                                    <Link key={event.id} href={`/events/${event.id}`}>
                                        <div className="p-2 hover:bg-neutral-50 rounded-lg transition-colors border border-transparent hover:border-black/5">
                                            <p className="font-bold text-sm leading-tight line-clamp-1">{event.title}</p>
                                            <p className="text-xs text-neutral-500">
                                                {new Date(event.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}

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
                            {stats?.totalNotes || 0} notes shared by students.
                        </p>
                        <Link
                            href="/notes"
                            className="btn-neo bg-accent-blue/20 text-ink px-4 py-2 text-sm w-full block text-center hover:bg-accent-blue/30 transition-colors rounded-lg"
                        >
                            Browse Notes
                        </Link>
                    </motion.div>
                </div>
            </motion.aside>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isPostModalOpen}
                onClose={() => setIsPostModalOpen(false)}
                initialTab={postModalTab}
                onPostCreated={() => loadFeed(true)}
            />

            <ArcMenu onCompose={() => {
                setPostModalTab('TEXT');
                setIsPostModalOpen(true);
            }} />
        </div>
    );
}
