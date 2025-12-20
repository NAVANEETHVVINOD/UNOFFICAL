"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import { EventTicket } from "../../../components/ui/SocialComponents";
import { Calendar, Sparkles, Users, Plus, History, Home } from "lucide-react";
import { FeedSkeleton } from "../../../components/ui/Skeleton";
import { useAuth } from "../../../context/AuthContext";

interface Event {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  venue: string | null;
  club?: {
    name: string;
  };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CollegeEventsPage({ params }: PageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const { user } = useAuth();

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await api.getEvents(slug);
        const now = new Date();

        const upcoming = data.filter((e: Event) => new Date(e.startsAt) >= now);
        const past = data.filter((e: Event) => new Date(e.startsAt) < now);

        // Sort upcoming by soonest first
        upcoming.sort((a: Event, b: Event) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

        // Sort past by most recent first
        past.sort((a: Event, b: Event) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime());

        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [slug]);

  const canCreateEvent =
    user?.role === "COLLEGE_ADMIN" ||
    user?.role === "CLUB_ADMIN" ||
    user?.role === "PLATFORM_ADMIN";

  const displayedEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <motion.div
      className="min-h-screen bg-paper dark:bg-dark-bg relative transition-colors duration-300 pb-20 pt-24 md:pt-36 px-4 lg:px-6 max-w-[1400px] mx-auto"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          // Swipe Right -> Feed
          router.push(`/colleges/${slug}`);
        } else if (info.offset.x < -100) {
          // Swipe Left -> Clubs
          router.push(`/colleges/${slug}/clubs`);
        }
      }}
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
        <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
      </div>

      {/* Local Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
        {[
          { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
          { id: 'feed', label: 'Feed', icon: Sparkles, path: `/colleges/${slug}` },
          { id: 'events', label: 'Events', icon: Calendar, path: `/colleges/${slug}/events` },
          { id: 'clubs', label: 'Clubs', icon: Users, path: `/colleges/${slug}/clubs` }
        ].map((tab) => (
          <Link key={tab.id} href={tab.path} className="flex-1">
            <div className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all ${tab.id === 'events'
              ? 'bg-accent-coral text-ink border-ink shadow-neo-sm'
              : 'bg-paper border-ink/10 hover:border-ink/30 hover:bg-neutral-50'
              }`}>
              <tab.icon className="w-4 h-4" />
              <span className={`font-display font-bold text-sm uppercase tracking-wide ${tab.id === 'events' ? 'text-ink' : 'text-neutral-500'} hidden sm:inline`}>
                {tab.label}
              </span>
              {/* Mobile label icon only or short */}
            </div>
          </Link>
        ))}
      </div>

      {/* Header & Action */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl font-black text-ink">Campus Events</h1>
          <p className="text-neutral-500">Don't miss out on upcoming activities.</p>
        </div>
        {canCreateEvent && (
          <Link href={`/colleges/${slug}/events/create`}>
            <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-bold hover:bg-neutral-800 transition-colors shadow-neo-sm">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Event</span>
            </button>
          </Link>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b-2 border-dashed border-neutral-200 pb-1">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === "upcoming"
            ? "border-accent-coral text-ink"
            : "border-transparent text-neutral-400 hover:text-ink"
            }`}
        >
          UPCOMING ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 font-bold text-sm border-b-2 transition-colors ${activeTab === "past"
            ? "border-neutral-500 text-ink"
            : "border-transparent text-neutral-400 hover:text-ink"
            }`}
        >
          PAST EVENTS ({pastEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-paper rounded-xl border-2 border-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : displayedEvents.length > 0 ? (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2"
        >
          {displayedEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className={activeTab === "past" ? "opacity-75 grayscale hover:grayscale-0 transition-all" : ""}>
                <EventTicket event={event} />
              </div>
            </Link>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-paper rounded-xl border-2 border-dashed border-neutral-300">
          {activeTab === "upcoming" ? (
            <Calendar className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
          ) : (
            <History className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
          )}
          <h3 className="font-bold text-lg text-neutral-600">
            {activeTab === "upcoming" ? "No Events Scheduled" : "No Past Events"}
          </h3>
          <p className="text-neutral-400 text-sm">
            {activeTab === "upcoming" ? "Check back later for updates." : "Events will appear here after they finish."}
          </p>
        </div>
      )}
    </motion.div>
  );
}
