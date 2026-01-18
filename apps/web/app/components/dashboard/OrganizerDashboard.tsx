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
  Plus,
  ExternalLink,
  QrCode,
  BarChart3,
  UserCheck,
  DollarSign,
  Eye,
  Edit,
  TrendingUp,
  CheckCircle2,
  FileText,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileSidebar from "./ProfileSidebar";
import UpcomingEventsWidget from "./UpcomingEventsWidget";
import { FeedSkeleton } from "../ui/Skeleton";

/**
 * OrganizerDashboard Component
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
 * 
 * An event management dashboard for organizers that displays:
 * - "Your Events" section with Create Event button
 * - EventCard in organizer mode (registrations, attendance %, revenue, status)
 * - Events sorted by status: Live > Draft > Ended
 * - Quick access to Scanner, Analytics, Attendee list
 * - Empty state with "Create Your First Event" CTA
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
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "ENDED";
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
    checkIns?: number;
  };
  college?: {
    name: string;
    slug: string;
  };
}

// Organizer-specific event data
interface OrganizerEventData extends Event {
  registrations: number;
  attendancePercentage: number;
  revenue: number | null;
  displayStatus: "LIVE" | "DRAFT" | "ENDED";
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

export default function OrganizerDashboard() {
  const { user, loading: authLoading } = useAuth();

  // State
  const [events, setEvents] = useState<OrganizerEventData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch organizer's events
  useEffect(() => {
    if (!user) return;

    const fetchOrganizerEvents = async () => {
      setLoading(true);
      try {
        // Fetch events created by the user
        const response = await api.getUserEvents(user.id);
        const eventsArray = Array.isArray(response) ? response : response?.events || [];
        
        // Transform events to include organizer-specific data
        const transformedEvents: OrganizerEventData[] = eventsArray.map((event: Event) => {
          const registrations = event._count?.registrations || 0;
          const checkIns = event._count?.checkIns || 0;
          const attendancePercentage = registrations > 0 
            ? Math.round((checkIns / registrations) * 100) 
            : 0;
          
          // Calculate revenue from tickets
          const revenue = event.tickets.reduce((total, ticket) => {
            return total + (ticket.price * ticket.quantitySold);
          }, 0);

          // Determine display status (Requirement 6.3)
          let displayStatus: "LIVE" | "DRAFT" | "ENDED";
          const now = new Date();
          const eventEnd = new Date(event.endsAt);
          
          if (event.status === "DRAFT") {
            displayStatus = "DRAFT";
          } else if (eventEnd < now || event.status === "ENDED" || event.status === "CANCELLED") {
            displayStatus = "ENDED";
          } else {
            displayStatus = "LIVE";
          }

          return {
            ...event,
            registrations,
            attendancePercentage,
            revenue: revenue > 0 ? revenue : null,
            displayStatus,
          };
        });

        // Sort events by status: Live > Draft > Ended (Requirement 6.5)
        const sortedEvents = transformedEvents.sort((a, b) => {
          const statusOrder = { LIVE: 0, DRAFT: 1, ENDED: 2 };
          return statusOrder[a.displayStatus] - statusOrder[b.displayStatus];
        });

        setEvents(sortedEvents);
      } catch (error) {
        console.error("Failed to fetch organizer events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizerEvents();
  }, [user]);

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
        {/* Header with Create Event Button (Requirement 6.2) */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-black mb-2 dark:text-dark-text">
              Your Events
            </h1>
            <p className="text-neutral-600 dark:text-dark-text-muted font-mono text-sm">
              Create and manage your events
            </p>
          </div>
          <Link href="/events/create">
            <button className="btn-neo btn-primary flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create Event</span>
            </button>
          </Link>
        </motion.div>

        {/* Events List */}
        {events.length > 0 ? (
          <motion.section variants={itemVariants}>
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <OrganizerEventCard key={event.id} event={event} />
              ))}
            </div>
          </motion.section>
        ) : (
          /* Empty State (Requirement 6.6) */
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-paper dark:bg-dark-surface border-2 border-dashed border-ink/20 dark:border-dark-border rounded-card-lg"
          >
            {/* Megaphone/stage doodle illustration */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <img
                src="/doodles/megaphone.svg"
                alt="Megaphone illustration"
                className="w-full h-full object-contain opacity-60 dark:opacity-40"
              />
            </div>
            <h3 className="font-display text-2xl font-black text-ink dark:text-dark-text mb-3">
              You haven't hosted any events yet
            </h3>
            <p className="text-neutral-500 dark:text-dark-text-muted mb-8 max-w-md mx-auto font-mono text-sm">
              Create your first event and start building your community
            </p>
            <Link href="/events/create">
              <button className="btn-neo btn-primary px-8 py-3 text-base font-bold flex items-center gap-2 mx-auto">
                <Plus className="w-5 h-5" />
                Create Your First Event
              </button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}

/**
 * OrganizerEventCard Component - Organizer Mode
 * 
 * Requirements: 6.3, 6.4
 * 
 * Displays event information with organizer-focused data:
 * - Registrations count
 * - Attendance percentage
 * - Revenue (if paid event)
 * - Status (Draft/Live/Ended)
 * - Quick access to Scanner, Analytics, Attendee list
 */
function OrganizerEventCard({ event }: { event: OrganizerEventData }) {
  const eventDate = new Date(event.startsAt);
  const isPaid = event.tickets.some(t => t.price > 0);

  // Status badge styling
  const getStatusBadge = () => {
    switch (event.displayStatus) {
      case "LIVE":
        return (
          <span className="px-2 py-1 bg-accent-mint text-ink text-[10px] font-bold uppercase rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Live
          </span>
        );
      case "DRAFT":
        return (
          <span className="px-2 py-1 bg-neutral-300 dark:bg-dark-elevated text-ink dark:text-dark-text text-[10px] font-bold uppercase rounded flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Draft
          </span>
        );
      case "ENDED":
        return (
          <span className="px-2 py-1 bg-neutral-400 dark:bg-dark-elevated text-white dark:text-dark-text-muted text-[10px] font-bold uppercase rounded flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Ended
          </span>
        );
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark-lg transition-all group overflow-hidden rounded-card-lg"
    >
      {/* Event Cover */}
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
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>

        {/* Category Badge */}
        {event.category && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-ink dark:bg-primary text-white dark:text-ink text-[10px] font-bold uppercase rounded">
              {event.category}
            </span>
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/events/${event.id}`}>
          <h3 className="font-display text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary dark:text-dark-text dark:group-hover:text-primary transition-colors cursor-pointer">
            {event.title}
          </h3>
        </Link>

        {/* Event Details */}
        <div className="space-y-1.5 mb-4">
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

        {/* Organizer Stats (Requirement 6.3) */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-ink/10 dark:border-dark-border">
          {/* Registrations */}
          <div className="bg-neutral-50 dark:bg-dark-elevated p-3 rounded-lg border border-ink/10 dark:border-dark-border">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold uppercase text-neutral-500 dark:text-dark-text-muted">
                Registrations
              </span>
            </div>
            <p className="text-xl font-black text-ink dark:text-dark-text">
              {event.registrations}
            </p>
          </div>

          {/* Attendance % */}
          <div className="bg-neutral-50 dark:bg-dark-elevated p-3 rounded-lg border border-ink/10 dark:border-dark-border">
            <div className="flex items-center gap-2 mb-1">
              <UserCheck className="w-4 h-4 text-accent-mint" />
              <span className="text-[10px] font-bold uppercase text-neutral-500 dark:text-dark-text-muted">
                Attendance
              </span>
            </div>
            <p className="text-xl font-black text-ink dark:text-dark-text">
              {event.attendancePercentage}%
            </p>
          </div>

          {/* Revenue (if paid event) */}
          {isPaid && event.revenue !== null && (
            <div className="col-span-2 bg-accent-mint/20 dark:bg-accent-mint/10 p-3 rounded-lg border border-accent-mint/30 dark:border-accent-mint/20">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-accent-mint" />
                <span className="text-[10px] font-bold uppercase text-neutral-600 dark:text-dark-text-muted">
                  Revenue
                </span>
              </div>
              <p className="text-xl font-black text-ink dark:text-dark-text">
                ₹{(event.revenue / 100).toFixed(0)}
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions (Requirement 6.4) */}
        <div className="grid grid-cols-3 gap-2">
          {/* QR Scanner */}
          <Link href={`/events/${event.id}/checkin`}>
            <button
              className="w-full p-2 border-2 border-ink dark:border-dark-border bg-paper dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors rounded flex flex-col items-center gap-1"
              title="QR Scanner"
            >
              <QrCode className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-neutral-600 dark:text-dark-text-muted">
                Scanner
              </span>
            </button>
          </Link>

          {/* Analytics */}
          <Link href={`/events/${event.id}/analytics`}>
            <button
              className="w-full p-2 border-2 border-ink dark:border-dark-border bg-paper dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors rounded flex flex-col items-center gap-1"
              title="Analytics"
            >
              <BarChart3 className="w-4 h-4 text-accent-blue" />
              <span className="text-[10px] font-bold text-neutral-600 dark:text-dark-text-muted">
                Analytics
              </span>
            </button>
          </Link>

          {/* Attendees */}
          <Link href={`/events/${event.id}/attendees`}>
            <button
              className="w-full p-2 border-2 border-ink dark:border-dark-border bg-paper dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors rounded flex flex-col items-center gap-1"
              title="Attendee List"
            >
              <Users className="w-4 h-4 text-accent-coral" />
              <span className="text-[10px] font-bold text-neutral-600 dark:text-dark-text-muted">
                Attendees
              </span>
            </button>
          </Link>
        </div>

        {/* Edit Button */}
        {event.displayStatus !== "ENDED" && (
          <Link href={`/events/${event.id}/edit`}>
            <button className="w-full mt-3 btn-neo btn-secondary text-xs py-2 flex items-center justify-center gap-2">
              <Edit className="w-3.5 h-3.5" />
              Edit Event
            </button>
          </Link>
        )}

        {/* View Details for Ended Events */}
        {event.displayStatus === "ENDED" && (
          <Link href={`/events/${event.id}`}>
            <button className="w-full mt-3 btn-neo btn-secondary text-xs py-2 flex items-center justify-center gap-2">
              <Eye className="w-3.5 h-3.5" />
              View Details
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
