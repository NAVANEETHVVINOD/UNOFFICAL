"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import { PageTransition } from "../providers/AnimationProvider";
import Navbar from "../components/Navbar";
import BottomNav from "../components/ui/BottomNav";
import CategoryRibbon from "../components/CategoryRibbon";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import Link from "next/link";
import { Calendar, MapPin, Users, Clock, Filter, Search, ChevronDown } from "lucide-react";
import { containerVariants, itemVariants, pageVariants } from "../../lib/animations";
import { EventCardSkeleton } from "../components/ui/Skeleton";

interface Event {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt?: string;
  venue: string | null;
  bannerUrl?: string;
  maxAttendees?: number;
  club?: {
    id: string;
    name: string;
  };
  college?: {
    name: string;
  };
  _count?: {
    participants: number;
  };
  participants?: Array<{
    userId: string;
    status: string;
  }>;
}

type FilterType = "all" | "upcoming" | "today" | "this-week" | "past";
type CategoryType = "all" | "workshop" | "hackathon" | "cultural" | "sports" | "seminar";

export default function EventsClient() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<FilterType>("upcoming");
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvents();
      // Sort by date ascending
      const sorted = data.sort((a: Event, b: Event) => 
        new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
      );
      setEvents(sorted);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on search and filters
  const filteredEvents = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekEnd = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return events.filter((event) => {
      const eventDate = new Date(event.startsAt);

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.venue?.toLowerCase().includes(query) ||
          event.club?.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Date filter
      switch (dateFilter) {
        case "upcoming":
          if (eventDate < now) return false;
          break;
        case "today":
          if (eventDate < today || eventDate >= new Date(today.getTime() + 24 * 60 * 60 * 1000)) return false;
          break;
        case "this-week":
          if (eventDate < today || eventDate > weekEnd) return false;
          break;
        case "past":
          if (eventDate >= now) return false;
          break;
      }

      return true;
    });
  }, [events, searchQuery, dateFilter, categoryFilter]);

  const handleRSVP = useCallback(async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setRsvpLoading(eventId);
    try {
      await api.rsvpEvent(eventId, "GOING");
      // Refresh events to get updated count
      await fetchEvents();
    } catch (err) {
      console.error("Failed to RSVP:", err);
    } finally {
      setRsvpLoading(null);
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString("default", { month: "short" }).toUpperCase(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString("default", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      full: date.toLocaleDateString("default", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    };
  };

  const isEventPast = (dateString: string) => new Date(dateString) < new Date();

  return (
    <PageTransition>
      <motion.div
        className="bg-paper min-h-screen"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* Background Pattern */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-halftone opacity-30" />

        <Navbar />

        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8 relative z-10">
            <CategoryRibbon className="mb-6 mt-4" />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 md:mb-8 text-center"
            >
              <h1 className="font-display text-3xl md:text-5xl font-black mb-2">
                CAMPUS EVENTS
              </h1>
              <p className="font-mono text-xs md:text-sm text-gray-600">
                Don't miss out. Be there or be square.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-4xl mx-auto mb-8"
            >
              {/* Search Bar */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-3 border-2 border-black flex items-center gap-2 font-bold text-sm transition-colors ${
                    showFilters ? "bg-black text-white" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>

              {/* Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 p-4 bg-white border-2 border-black mb-4">
                      <span className="font-bold text-sm mr-2">Date:</span>
                      {(["all", "upcoming", "today", "this-week", "past"] as FilterType[]).map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setDateFilter(filter)}
                          className={`px-3 py-1 text-xs font-bold uppercase border-2 border-black transition-colors ${
                            dateFilter === filter
                              ? "bg-accent-yellow"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          {filter.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Count */}
              <div className="flex justify-between items-center text-sm font-mono text-gray-500">
                <span>{filteredEvents.length} events found</span>
                <span>Sorted by date</span>
              </div>
            </motion.div>

            {/* Events List */}
            {loading ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {[1, 2, 3].map((i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <RetroButton onClick={fetchEvents}>Try Again</RetroButton>
              </div>
            ) : (
              <motion.div
                className="max-w-4xl mx-auto space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence mode="popLayout">
                  {filteredEvents.map((event) => {
                    const { day, month, time, full } = formatDate(event.startsAt);
                    const isPast = isEventPast(event.startsAt);
                    const attendeeCount = event._count?.participants || 0;

                    return (
                      <motion.div
                        key={event.id}
                        variants={itemVariants}
                        layout
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <Link href={`/events/${event.id}`}>
                          <NewspaperCard
                            className={`hover:-translate-y-1 hover:shadow-neo-lg transition-all cursor-pointer group bg-white p-0 overflow-hidden ${
                              isPast ? "opacity-60" : ""
                            }`}
                          >
                            <div className="flex flex-col md:flex-row">
                              {/* Date Column */}
                              <div className={`${isPast ? "bg-gray-400" : "bg-accent-blue"} text-white p-4 md:p-6 flex flex-col items-center justify-center min-w-[100px] md:min-w-[120px] border-b-2 md:border-b-0 md:border-r-2 border-black`}>
                                <span className="text-xs font-bold tracking-widest">{month}</span>
                                <span className="text-4xl md:text-5xl font-black">{day}</span>
                                <span className="text-[10px] font-mono mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {time}
                                </span>
                              </div>

                              {/* Content Column */}
                              <div className="p-4 md:p-6 flex-grow">
                                <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                                  <Badge className={`${isPast ? "bg-gray-200" : "bg-accent-yellow"} text-black border-black text-[10px]`}>
                                    {event.club?.name || "CAMPUS EVENT"}
                                  </Badge>
                                  {event.venue && (
                                    <span className="font-mono text-xs text-gray-500 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {event.venue}
                                    </span>
                                  )}
                                </div>

                                <h3 className="font-bold text-xl md:text-2xl mb-2 group-hover:underline decoration-2 decoration-accent-blue line-clamp-1">
                                  {event.title}
                                </h3>

                                <p className="text-gray-600 line-clamp-2 text-sm mb-4">
                                  {event.description || "No description available."}
                                </p>

                                <div className="flex flex-wrap justify-between items-center gap-2">
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Users className="w-4 h-4" />
                                    <span>{attendeeCount} attending</span>
                                    {event.maxAttendees && (
                                      <span className="text-xs">/ {event.maxAttendees} max</span>
                                    )}
                                  </div>

                                  {!isPast && (
                                    <motion.button
                                      onClick={(e) => handleRSVP(event.id, e)}
                                      disabled={rsvpLoading === event.id}
                                      className="px-4 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      {rsvpLoading === event.id ? "..." : "RSVP →"}
                                    </motion.button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </NewspaperCard>
                        </Link>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
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
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Check back later for upcoming events!"}
                </p>
                {searchQuery && (
                  <RetroButton onClick={() => setSearchQuery("")}>
                    Clear Search
                  </RetroButton>
                )}
              </motion.div>
            )}
          </div>
        </Container>

        <BottomNav />
      </motion.div>
    </PageTransition>
  );
}
