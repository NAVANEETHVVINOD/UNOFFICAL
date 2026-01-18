"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../../lib/api";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Sparkles,
  Building2,
  Globe,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileSidebar from "./ProfileSidebar";
import UpcomingEventsWidget from "./UpcomingEventsWidget";
import { FeedSkeleton } from "../ui/Skeleton";

/**
 * StudentDashboard Component
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.7
 * 
 * A clean, events-focused dashboard for students that displays:
 * - Upcoming Events (events the user has registered for)
 * - Campus Events (conditional - only if user has a linked college)
 * - Recommended Events (global events)
 * 
 * NO FeedComposer, NO social feed posts
 * Uses EventCard in attendee mode with RSVP, Save, Share, View Details actions
 */

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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();

  // State
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [campusEvents, setCampusEvents] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedEvents, setSavedEvents] = useState<Set<string>>(new Set());

  // Check if user has a linked college (Requirement 4.6, 4.7)
  const hasLinkedCollege = Boolean(user?.profile?.collegeId);

  // Fetch events
  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Fetch upcoming events (events user has registered for)
        // For now, we'll fetch recent events as a placeholder
        const upcomingData = await api.getEvents({ 
          dateRange: 'week',
          limit: 3 
        });
        const upcomingArray = upcomingData?.events || upcomingData || [];
        setUpcomingEvents(Array.isArray(upcomingArray) ? upcomingArray : []);

        // Fetch campus events only if user has a linked college (Requirement 4.6, 4.7)
        if (hasLinkedCollege) {
          const campusData = await api.getEvents({ 
            scope: 'campus',
            limit: 6 
          });
          const campusArray = campusData?.events || campusData || [];
          setCampusEvents(Array.isArray(campusArray) ? campusArray : []);
        }

        // Fetch recommended events (global events)
        const recommendedData = await api.getEvents({ 
          scope: 'global',
          limit: 6 
        });
        const recommendedArray = recommendedData?.events || recommendedData || [];
        setRecommendedEvents(Array.isArray(recommendedArray) ? recommendedArray : []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, hasLinkedCollege]);

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

  // Share event
  const shareEvent = async (event: Event, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: `${window.location.origin}/events/${event.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        // TODO: Show toast notification
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Get lowest ticket price
  const getLowestPrice = (tickets: EventTicket[]): number | null => {
    if (!tickets || tickets.length === 0) return null;
    const prices = tickets.map((t) => t.price);
    return Math.min(...prices);
  };

  // Format price display
  const formatPrice = (price: number | null): string => {
    if (price === null) return "Free";
    if (price === 0) return "Free";
    return `₹${(price / 100).toFixed(0)}`;
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <DashboardLayout
        leftSidebarContent={<ProfileSidebar />}
        rightSidebarContent={<UpcomingEventsWidget />}
      >
        <FeedSkeleton count={3} />
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout
      leftSidebarContent={<ProfileSidebar />}
      rightSidebarContent={<UpcomingEventsWidget />}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="font-display text-3xl md:text-4xl font-black mb-2 dark:text-dark-text">
            Discover Events
          </h1>
          <p className="text-neutral-600 dark:text-dark-text-muted font-mono text-sm">
            Find and attend events that interest you
          </p>
        </motion.div>

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold dark:text-dark-text flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Upcoming Events
              </h2>
              <Link 
                href="/events" 
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSaved={savedEvents.has(event.id)}
                  onToggleSave={toggleSaveEvent}
                  onShare={shareEvent}
                  getLowestPrice={getLowestPrice}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Campus Events Section - Conditional (Requirement 4.6, 4.7) */}
        {hasLinkedCollege && campusEvents.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold dark:text-dark-text flex items-center gap-2">
                <Building2 className="w-5 h-5 text-accent-blue" />
                Campus Events
              </h2>
              <Link 
                href="/events?scope=campus" 
                className="text-sm font-medium text-accent-blue hover:underline flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campusEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSaved={savedEvents.has(event.id)}
                  onToggleSave={toggleSaveEvent}
                  onShare={shareEvent}
                  getLowestPrice={getLowestPrice}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Recommended Events Section */}
        {recommendedEvents.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold dark:text-dark-text flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-coral" />
                Recommended Events
              </h2>
              <Link 
                href="/events?scope=global" 
                className="text-sm font-medium text-accent-coral hover:underline flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSaved={savedEvents.has(event.id)}
                  onToggleSave={toggleSaveEvent}
                  onShare={shareEvent}
                  getLowestPrice={getLowestPrice}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty State - When no events are available */}
        {upcomingEvents.length === 0 && 
         campusEvents.length === 0 && 
         recommendedEvents.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-paper dark:bg-dark-surface border-2 border-dashed border-ink/20 dark:border-dark-border rounded-card-lg"
          >
            {/* Calendar/events doodle illustration */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <img
                src="/doodles/calendar.svg"
                alt="Calendar illustration"
                className="w-full h-full object-contain opacity-60 dark:opacity-40"
              />
            </div>
            <h3 className="font-display text-2xl font-black text-ink dark:text-dark-text mb-3">
              No events yet — explore what's happening around you
            </h3>
            <p className="text-neutral-500 dark:text-dark-text-muted mb-8 max-w-md mx-auto font-mono text-sm">
              Discover exciting events to attend and connect with your community
            </p>
            <Link href="/events">
              <button className="btn-neo btn-primary px-8 py-3 text-base font-bold">
                Browse Events
              </button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}

/**
 * EventCard Component - Attendee Mode
 * 
 * Requirements: 4.4, 4.5
 * 
 * Displays event information with attendee-focused actions:
 * - RSVP (Register button)
 * - Save (Bookmark)
 * - Share
 * - View Details (link to event page)
 */
function EventCard({
  event,
  isSaved,
  onToggleSave,
  onShare,
  getLowestPrice,
  formatPrice,
}: {
  event: Event;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onShare: (event: Event, e: React.MouseEvent) => void;
  getLowestPrice: (tickets: EventTicket[]) => number | null;
  formatPrice: (price: number | null) => string;
}) {
  const attendeeCount = event._count?.registrations || 0;
  const isPast = new Date(event.startsAt) < new Date();
  const price = getLowestPrice(event.tickets);
  const eventDate = new Date(event.startsAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark-lg transition-all group cursor-pointer overflow-hidden rounded-card-lg"
    >
      <Link href={`/events/${event.id}`}>
        {/* Event Cover or Gradient */}
        <div className="h-40 bg-gradient-to-br from-primary/20 to-accent-coral/20 dark:from-primary/10 dark:to-accent-coral/10 relative overflow-hidden">
          {event.coverUrl ? (
            <img
              src={event.coverUrl}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-primary/40 dark:text-primary/20" />
            </div>
          )}
          
          {/* Category Badge */}
          {event.category && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-ink dark:bg-primary text-white dark:text-ink text-[10px] font-bold uppercase rounded">
                {event.category}
              </span>
            </div>
          )}

          {/* Price Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
              price === 0 || price === null
                ? 'bg-accent-mint text-ink'
                : 'bg-accent-coral text-white'
            }`}>
              {formatPrice(price)}
            </span>
          </div>

          {/* Scope Badge */}
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-1 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-ink dark:text-dark-text text-[10px] font-bold uppercase rounded flex items-center gap-1">
              {event.scope === 'COLLEGE' ? (
                <>
                  <Building2 className="w-3 h-3" />
                  Campus
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" />
                  Global
                </>
              )}
            </span>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-display text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary dark:text-dark-text dark:group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Event Details */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {eventDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {eventDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{event.venue || 'Online'}</span>
            </div>
          </div>

          {/* Organizer Info */}
          {event.createdBy?.profile?.fullName && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-ink/10 dark:border-dark-border">
              <div className="w-6 h-6 bg-neutral-200 dark:bg-dark-elevated rounded-full flex items-center justify-center overflow-hidden">
                {event.createdBy.profile.avatarUrl ? (
                  <img 
                    src={event.createdBy.profile.avatarUrl} 
                    alt={event.createdBy.profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-3 h-3 text-neutral-400 dark:text-dark-text-muted" />
                )}
              </div>
              <span className="text-xs text-neutral-500 dark:text-dark-text-muted">
                by {event.createdBy.profile.fullName}
              </span>
            </div>
          )}

          {/* Action Buttons - Attendee Mode (Requirement 4.5) */}
          <div className="flex items-center gap-2">
            {/* RSVP/Register Button */}
            {!isPast && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/events/${event.id}`;
                }}
                className="flex-1 btn-neo btn-primary text-xs py-2"
              >
                Register
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={(e) => onToggleSave(event.id, e)}
              className="p-2 border-2 border-ink dark:border-dark-border bg-paper dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors rounded"
              title={isSaved ? "Unsave" : "Save"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4 text-neutral-400 dark:text-dark-text-muted" />
              )}
            </button>

            {/* Share Button */}
            <button
              onClick={(e) => onShare(event, e)}
              className="p-2 border-2 border-ink dark:border-dark-border bg-paper dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors rounded"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-neutral-400 dark:text-dark-text-muted" />
            </button>
          </div>

          {/* Attendee Count */}
          {attendeeCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-dark-text-muted mt-3">
              <Users className="w-3.5 h-3.5" />
              <span>{attendeeCount} attending</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
