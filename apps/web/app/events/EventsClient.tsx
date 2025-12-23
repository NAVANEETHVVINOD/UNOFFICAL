import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import Container from "../components/ui/Container";
import {
  RetroButton,
  Badge,
} from "../components/ui/NewspaperUI";
import CategoryRibbon from "../components/CategoryRibbon";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import Link from "next/link";
import { Search, Plus, Filter, Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react";
import { containerVariants, itemVariants, pageVariants } from "../../lib/animations";
import { PageTransition } from "../providers/AnimationProvider";
import BottomNav from "../components/ui/BottomNav";

// Layout & Components
import DashboardLayout from "../components/layouts/DashboardLayout";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import QuickActions from "../components/dashboard/QuickActions";
import UpcomingEventsWidget from "../components/dashboard/UpcomingEventsWidget";

interface Event {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  venue?: string;
  location?: string;
  capacity?: number;
  organizer: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  _count?: {
    attendees: number;
  };
  isRegistered?: boolean;
}

type EventFilter = "all" | "today" | "week" | "month" | "upcoming";

export default function EventsClient() {
  const { user } = useAuth();
  const { isReady: onboardingComplete } = useOnboardingGuard();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EventFilter>("upcoming");
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (rsvpLoading) return;

    setRsvpLoading(eventId);
    try {
      await api.rsvpEvent(eventId, "GOING");
      // Optimistic update or refetch
      setEvents(prev => prev.map(ev =>
        ev.id === eventId
          ? { ...ev, isRegistered: true, _count: { ...ev._count, attendees: (ev._count?.attendees || 0) + 1 } }
          : ev
      ));
      alert("You have successfully RSVP'd!");
    } catch (error) {
      console.error("RSVP failed:", error);
      alert("Failed to RSVP. Please try again.");
    } finally {
      setRsvpLoading(null);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use api.getEvents instead of mock
      // Note: api.getEvents might need parameters. Checking signature: (collegeId?, clubId?, limit?)
      // We will fetch all generic events for now.
      const data = await api.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      // Fallback to empty if fails, removing mock generation
      setError("Failed to load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    let result = events;

    // Search
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.venue?.toLowerCase().includes(query)
      );
    }

    // Date Filter (simplified logic)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (filter === "upcoming") {
      result = result.filter(e => new Date(e.startsAt) >= now);
    } else if (filter === "today") {
      result = result.filter(e => {
        const eventDate = new Date(e.startsAt);
        return eventDate >= today && eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      });
    } else if (filter === "week") {
      result = result.filter(e => {
        const eventDate = new Date(e.startsAt);
        return eventDate >= today && eventDate < endOfWeek;
      });
    }

    // Sort by date
    result.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    return result;
  }, [events, search, filter]);

  if (!onboardingComplete) return null;

  return (
    <PageTransition>
      <DashboardLayout
        leftSidebarContent={
          <>
            <ProfileSidebar />
            <QuickActions />
          </>
        }
        rightSidebarContent={
          <UpcomingEventsWidget />
        }
      >
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="w-full"
        >
          <Container>
            <CategoryRibbon className="mb-6 mt-4" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-4xl font-black mb-2">CAMPUS EVENTS</h1>
                <p className="text-gray-600 font-mono text-sm">Discover and join verified campus activities</p>
              </div>
              <Link href="/events/create">
                <motion.button
                  className="btn-neo btn-primary flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  Host Event
                </motion.button>
              </Link>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white border-2 border-black p-4 mb-8 shadow-neo-sm">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-black focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                  {(['upcoming', 'today', 'week', 'all'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-4 py-2 border-2 border-black font-bold text-xs uppercase whitespace-nowrap transition-all ${filter === f ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="text-center py-20">Loading events...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-black border-dashed">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-lg">No events found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => {
                  const attendeeCount = event._count?.attendees || 0;
                  const isPast = new Date(event.startsAt) < new Date();

                  return (
                    <motion.div
                      key={event.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border-2 border-black shadow-neo hover:shadow-neo-lg transition-all group cursor-pointer overflow-hidden"
                    >
                      <Link href={`/ events / ${event.id} `}>
                        <div className="flex">
                          {/* Date Column */}
                          <div className="w-20 bg-primary/10 border-r-2 border-black flex flex-col items-center justify-center p-2 text-center group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="font-black text-2xl leading-none">
                              {new Date(event.startsAt).getDate()}
                            </span>
                            <span className="font-bold text-xs uppercase mt-1">
                              {new Date(event.startsAt).toLocaleString('default', { month: 'short' })}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {event.organizer?.name || "Organizer"}
                              </span>
                            </div>

                            <h3 className="font-bold text-xl md:text-2xl mb-2 group-hover:underline decoration-2 decoration-accent-blue line-clamp-1">
                              {event.title}
                            </h3>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                                <Clock className="w-3 h-3" />
                                {new Date(event.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                                <MapPin className="w-3 h-3" />
                                {event.venue || "TBA"}
                              </div>
                            </div>

                            <p className="text-gray-600 line-clamp-2 text-sm mb-4">
                              {event.description || "No description available."}
                            </p>

                            <div className="flex flex-wrap justify-between items-center gap-2 border-t pt-3 border-gray-100">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Users className="w-4 h-4" />
                                <span>{attendeeCount} attending</span>
                                {event.capacity && (
                                  <span className="text-xs">/ {event.capacity} max</span>
                                )}
                              </div>

                              {!isPast && (
                                <motion.button
                                  className="px-4 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  details →
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="font-bold text-xl mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-4">
                  {search
                    ? "Try adjusting your search or filters"
                    : "Check back later for upcoming events!"}
                </p>
                {search && (
                  <RetroButton onClick={() => setSearch("")}>
                    Clear Search
                  </RetroButton>
                )}
              </motion.div>
            )}

            <BottomNav />
          </Container>
        </motion.div>
      </DashboardLayout>
    </PageTransition >
  );
}
