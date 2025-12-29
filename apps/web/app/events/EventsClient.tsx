"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useOnboardingGuard } from "../hooks/useOnboardingGuard";
import Container from "../components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import Link from "next/link";
import {
  Search,
  Plus,
  Calendar,
  MapPin,
  Clock,
  Users,
  Globe,
  Building2,
  Bookmark,
  BookmarkCheck,
  Filter,
  X,
} from "lucide-react";
import { pageVariants } from "../../lib/animations";
import { PageTransition } from "../providers/AnimationProvider";
import BottomNav from "../components/ui/BottomNav";
import DashboardLayout from "../components/layouts/DashboardLayout";
import ProfileSidebar from "../components/dashboard/ProfileSidebar";
import UpcomingEventsWidget from "../components/dashboard/UpcomingEventsWidget";

// Types
interface EventTicket {
  id: string;
  name: string;
  price: number;
  quantity: number | null;
  quantitySold: number;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  startsAt: string;
  endsAt: string;
  venue: string | null;
  category: string | null;
  scope: "COLLEGE" | "GLOBAL";
  visibility: "PUBLIC" | "INVITE_ONLY";
  status: string;
  createdBy: {
    id: string;
    profile?: {
      fullName: string;
      avatarUrl: string | null;
    };
  };
  tickets: EventTicket[];
  _count?: {
    registrations: number;
  };
  college?: {
    name: string;
    slug: string;
  };
  isSaved?: boolean;
}

type ScopeFilter = "campus" | "global";
type DateRangeFilter = "today" | "week" | "month" | "all";
type PriceTypeFilter = "free" | "paid" | "all";

const CATEGORIES = [
  "Workshop",
  "Hackathon",
  "Cultural",
  "Sports",
  "Tech Talk",
  "Networking",
  "Competition",
  "Other",
];

export default function EventsClient() {
  const { user } = useAuth();
  const { isReady: onboardingComplete } = useOnboardingGuard();

  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [scope, setScope] = useState<ScopeFilter>("campus");
  const [dateRange, setDateRange] = useState<DateRangeFilter>("all");
  const [priceType, setPriceType] = useState<PriceTypeFilter>("all");
  const [category, setCategory] = useState<string>("");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Saved events
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());

  // Fetch events when filters change
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEvents({
        scope,
        dateRange,
        priceType,
        category: category || undefined,
        search: search || undefined,
      });
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setError("Failed to load events. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [scope, dateRange, priceType, category, search]);

  // Fetch featured and trending events on mount
  useEffect(() => {
    const fetchFeaturedAndTrending = async () => {
      try {
        // For now, we'll use the regular events API with different params
        // In production, these would be separate endpoints
        const [featured, trending] = await Promise.all([
          api.getEvents({ limit: 3 }).catch(() => []),
          api.getEvents({ limit: 3 }).catch(() => []),
        ]);
        setFeaturedEvents(Array.isArray(featured) ? featured.slice(0, 3) : []);
        setTrendingEvents(Array.isArray(trending) ? trending.slice(0, 3) : []);
      } catch (err) {
        console.error("Failed to fetch featured/trending:", err);
      }
    };
    fetchFeaturedAndTrending();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Toggle save event
  const toggleSaveEvent = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newSaved = new Set(savedEvents);
    if (newSaved.has(eventId)) {
      newSaved.delete(eventId);
      // TODO: Call API to unsave
    } else {
      newSaved.add(eventId);
      // TODO: Call API to save
    }
    setSavedEvents(newSaved);
  };

  // Get lowest ticket price for an event
  const getLowestPrice = (tickets: EventTicket[]): number | null => {
    if (!tickets || tickets.length === 0) return null;
    const prices = tickets.map((t) => t.price);
    return Math.min(...prices);
  };

  // Format price display
  const formatPrice = (price: number | null): string => {
    if (price === null) return "Free";
    if (price === 0) return "Free";
    return `₹${(price / 100).toFixed(0)}`; // Convert from paise
  };

  // Check if event is sold out
  const isSoldOut = (tickets: EventTicket[]): boolean => {
    if (!tickets || tickets.length === 0) return false;
    return tickets.every(
      (t) => t.quantity !== null && t.quantitySold >= t.quantity
    );
  };

  if (!onboardingComplete) return null;

  return (
    <PageTransition>
      <DashboardLayout
        leftSidebarContent={<ProfileSidebar />}
        rightSidebarContent={<UpcomingEventsWidget />}
      >
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="w-full"
        >
          <Container>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 mt-4">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-black mb-1 dark:text-white">
                  EVENTS
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                  Discover and join campus activities
                </p>
              </div>
              <Link href="/events/create">
                <motion.button
                  className="btn-neo btn-primary flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-yellow-400 dark:text-black font-bold border-2 border-black dark:border-yellow-400"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                  Create Event
                </motion.button>
              </Link>
            </div>

            {/* Scope Toggle (Global/Campus) */}
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setScope("campus")}
                  className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all ${
                    scope === "campus"
                      ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Campus
                </button>
                <button
                  onClick={() => setScope("global")}
                  className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-all ${
                    scope === "global"
                      ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                      : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Global
                </button>
              </div>
            </div>

            {/* Featured Events Section */}
            {featuredEvents.length > 0 && !search && !category && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                    Featured Events
                  </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {featuredEvents.map((event) => (
                    <FeaturedEventCard
                      key={event.id}
                      event={event}
                      formatPrice={formatPrice}
                      getLowestPrice={getLowestPrice}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Trending Events Section */}
            {trendingEvents.length > 0 && !search && !category && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Trending Now
                  </h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                  {trendingEvents.map((event) => (
                    <TrendingEventCard
                      key={event.id}
                      event={event}
                      formatPrice={formatPrice}
                      getLowestPrice={getLowestPrice}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 p-4 mb-6 shadow-neo-sm dark:shadow-none">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-400 font-mono text-sm"
                  />
                </div>

                {/* Filter Toggle (Mobile) */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border-2 border-black dark:border-gray-600 font-bold text-sm"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {(dateRange !== "all" || priceType !== "all" || category) && (
                    <span className="w-2 h-2 bg-black dark:bg-yellow-400 rounded-full" />
                  )}
                </button>

                {/* Date Range Filter (Desktop) */}
                <div className="hidden md:flex gap-2">
                  {(["all", "today", "week", "month"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setDateRange(f)}
                      className={`px-3 py-2 border-2 border-black dark:border-gray-600 font-bold text-xs uppercase whitespace-nowrap transition-all ${
                        dateRange === f
                          ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {f === "all" ? "All" : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expanded Filters (Mobile) */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="md:hidden mt-4 pt-4 border-t-2 border-black dark:border-gray-600"
                  >
                    {/* Date Range */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold uppercase mb-2 text-gray-600 dark:text-gray-400">
                        Date Range
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(["all", "today", "week", "month"] as const).map(
                          (f) => (
                            <button
                              key={f}
                              onClick={() => setDateRange(f)}
                              className={`px-3 py-1 border-2 border-black dark:border-gray-600 font-bold text-xs uppercase ${
                                dateRange === f
                                  ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                                  : "bg-white dark:bg-gray-800"
                              }`}
                            >
                              {f}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Price Type */}
                    <div className="mb-4">
                      <label className="block text-xs font-bold uppercase mb-2 text-gray-600 dark:text-gray-400">
                        Price
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(["all", "free", "paid"] as const).map((f) => (
                          <button
                            key={f}
                            onClick={() => setPriceType(f)}
                            className={`px-3 py-1 border-2 border-black dark:border-gray-600 font-bold text-xs uppercase ${
                              priceType === f
                                ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                                : "bg-white dark:bg-gray-800"
                            }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold uppercase mb-2 text-gray-600 dark:text-gray-400">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-sm"
                      >
                        <option value="">All Categories</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop Additional Filters */}
              <div className="hidden md:flex gap-4 mt-4 pt-4 border-t-2 border-black dark:border-gray-600">
                {/* Price Type */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
                    Price:
                  </span>
                  {(["all", "free", "paid"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setPriceType(f)}
                      className={`px-3 py-1 border-2 border-black dark:border-gray-600 font-bold text-xs uppercase ${
                        priceType === f
                          ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Category */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">
                    Category:
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="px-3 py-1 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 font-mono text-xs"
                  >
                    <option value="">All</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                {(dateRange !== "all" ||
                  priceType !== "all" ||
                  category ||
                  search) && (
                  <button
                    onClick={() => {
                      setDateRange("all");
                      setPriceType("all");
                      setCategory("");
                      setSearch("");
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Events Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 h-48 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">{error}</div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 border-dashed">
                <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg dark:text-white">
                  No events found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {search
                    ? "Try adjusting your search or filters"
                    : scope === "campus"
                    ? "No campus events yet. Be the first to create one!"
                    : "No global events available right now."}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isSaved={savedEvents.has(event.id)}
                    onToggleSave={toggleSaveEvent}
                    getLowestPrice={getLowestPrice}
                    formatPrice={formatPrice}
                    isSoldOut={isSoldOut}
                  />
                ))}
              </div>
            )}

            <BottomNav />
          </Container>
        </motion.div>
      </DashboardLayout>
    </PageTransition>
  );
}

// Event Card Component
function EventCard({
  event,
  isSaved,
  onToggleSave,
  getLowestPrice,
  formatPrice,
  isSoldOut,
}: {
  event: Event;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  getLowestPrice: (tickets: EventTicket[]) => number | null;
  formatPrice: (price: number | null) => string;
  isSoldOut: (tickets: EventTicket[]) => boolean;
}) {
  const attendeeCount = event._count?.registrations || 0;
  const isPast = new Date(event.startsAt) < new Date();
  const soldOut = isSoldOut(event.tickets);
  const price = getLowestPrice(event.tickets);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none hover:shadow-neo-lg dark:hover:border-yellow-400 transition-all group cursor-pointer overflow-hidden"
    >
      <Link href={`/events/${event.id}`}>
        <div className="flex">
          {/* Date Column */}
          <div className="w-20 bg-gray-100 dark:bg-gray-900 border-r-2 border-black dark:border-gray-700 flex flex-col items-center justify-center p-2 text-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-yellow-400 dark:group-hover:text-black transition-colors">
            <span className="font-black text-2xl leading-none">
              {new Date(event.startsAt).getDate()}
            </span>
            <span className="font-bold text-xs uppercase mt-1">
              {new Date(event.startsAt).toLocaleString("default", {
                month: "short",
              })}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {event.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1">
                    {event.category}
                  </span>
                )}
                {price !== null && price > 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1">
                    {formatPrice(price)}
                  </span>
                )}
                {price === 0 && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1">
                    Free
                  </span>
                )}
              </div>
              <button
                onClick={(e) => onToggleSave(event.id, e)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {isSaved ? (
                  <BookmarkCheck className="w-5 h-5 text-black dark:text-yellow-400" />
                ) : (
                  <Bookmark className="w-5 h-5 text-gray-400 hover:text-black dark:hover:text-white" />
                )}
              </button>
            </div>

            <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:underline decoration-2 line-clamp-1 dark:text-white">
              {event.title}
            </h3>

            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(event.startsAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                <MapPin className="w-3 h-3" />
                {event.venue || "Online"}
              </div>
            </div>

            {event.description && (
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm mb-3">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap justify-between items-center gap-2 border-t pt-3 border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{attendeeCount}</span>
                </div>
                {event.createdBy?.profile?.fullName && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    by {event.createdBy.profile.fullName}
                  </span>
                )}
              </div>

              {!isPast && !soldOut && (
                <span className="px-3 py-1 bg-black text-white dark:bg-yellow-400 dark:text-black font-bold text-xs">
                  Register →
                </span>
              )}
              {soldOut && (
                <span className="px-3 py-1 bg-red-500 text-white font-bold text-xs">
                  Sold Out
                </span>
              )}
              {isPast && (
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold text-xs">
                  Past Event
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}


// Featured Event Card (larger, more prominent)
function FeaturedEventCard({
  event,
  formatPrice,
  getLowestPrice,
}: {
  event: Event;
  formatPrice: (price: number | null) => string;
  getLowestPrice: (tickets: EventTicket[]) => number | null;
}) {
  const price = getLowestPrice(event.tickets);

  return (
    <Link href={`/events/${event.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none overflow-hidden group cursor-pointer h-full"
      >
        {/* Cover Image or Gradient */}
        <div className="h-32 bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 relative">
          {event.coverUrl && (
            <img
              src={event.coverUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-yellow-400 text-black text-[10px] font-bold uppercase">
              Featured
            </span>
          </div>
          {price !== null && (
            <div className="absolute bottom-2 right-2">
              <span className="px-2 py-1 bg-black text-white dark:bg-white dark:text-black text-xs font-bold">
                {formatPrice(price)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:underline dark:text-white">
            {event.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            {new Date(event.startsAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Trending Event Card (horizontal scroll)
function TrendingEventCard({
  event,
  formatPrice,
  getLowestPrice,
}: {
  event: Event;
  formatPrice: (price: number | null) => string;
  getLowestPrice: (tickets: EventTicket[]) => number | null;
}) {
  const price = getLowestPrice(event.tickets);
  const attendeeCount = event._count?.registrations || 0;

  return (
    <Link href={`/events/${event.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="flex-shrink-0 w-64 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 shadow-neo-sm dark:shadow-none overflow-hidden group cursor-pointer"
      >
        <div className="flex">
          {/* Date Badge */}
          <div className="w-16 bg-red-500 text-white flex flex-col items-center justify-center p-2 text-center">
            <span className="font-black text-lg leading-none">
              {new Date(event.startsAt).getDate()}
            </span>
            <span className="font-bold text-[10px] uppercase">
              {new Date(event.startsAt).toLocaleString("default", {
                month: "short",
              })}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:underline dark:text-white">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <Users className="w-3 h-3" />
              {attendeeCount} going
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-green-600 dark:text-green-400">
                {formatPrice(price)}
              </span>
              <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Trending
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
