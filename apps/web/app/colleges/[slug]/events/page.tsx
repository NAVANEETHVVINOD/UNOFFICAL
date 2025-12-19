"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../../../lib/api";
import { EventTicket } from "../../../components/ui/SocialComponents";
import { Calendar, Sparkles, Users, Plus } from "lucide-react";
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

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await api.getEvents(slug);
        setEvents(data);
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
    user?.role === "PLATFORM_ADMIN" ||
    user?.role === "STUDENT";

  return (
    <motion.div
      className="min-h-screen pb-20"
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
      {/* Local Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {[
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
              <span className={`font-display font-bold text-sm uppercase tracking-wide ${tab.id === 'events' ? 'text-ink' : 'text-neutral-500'}`}>
                {tab.label}
              </span>
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

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-paper rounded-xl border-2 border-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <EventTicket event={event} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-paper rounded-xl border-2 border-dashed border-neutral-300">
          <Calendar className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
          <h3 className="font-bold text-lg text-neutral-600">No Events Scheduled</h3>
          <p className="text-neutral-400 text-sm">Check back later for updates.</p>
        </div>
      )}
    </motion.div>
  );
}
