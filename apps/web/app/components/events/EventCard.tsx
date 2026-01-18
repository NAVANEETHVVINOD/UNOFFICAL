"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Share2,
  Building2,
  Globe,
  UserCheck,
  DollarSign,
  QrCode,
  BarChart3,
  Edit,
  Eye,
} from "lucide-react";

/**
 * EventCard Component
 * 
 * Requirements: 19.1, 19.2, 19.3, 19.4, 19.5
 * 
 * A reusable event card component that supports two display modes:
 * 
 * 1. Attendee Mode (mode="attendee"):
 *    - RSVP/Register button
 *    - Save/Bookmark button
 *    - Share button
 *    - View Details (link to event page)
 *    - Shows organizer info and attendee count
 * 
 * 2. Organizer Mode (mode="organizer"):
 *    - Registrations count
 *    - Attendance percentage
 *    - Revenue (if paid event)
 *    - Status badge (LIVE/DRAFT/ENDED)
 *    - Quick actions: QR Scanner, Analytics, Attendees
 *    - Edit/View Details button
 * 
 * Dark mode support using existing color palette
 */

// Types
export interface EventTicket {
  id: string;
  name: string;
  price: number;
  quantity: number | null;
  quantitySold: number;
}

export interface BaseEvent {
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
    checkIns?: number;
  };
  college?: {
    name: string;
    slug: string;
  };
}

export interface AttendeeEvent extends BaseEvent {
  isSaved?: boolean;
}

export interface OrganizerEvent extends BaseEvent {
  registrations: number;
  attendancePercentage: number;
  revenue: number | null;
  displayStatus: "LIVE" | "DRAFT" | "ENDED";
}

// Props for Attendee Mode
interface AttendeeCardProps {
  mode: "attendee";
  event: AttendeeEvent;
  isSaved?: boolean;
  onToggleSave?: (id: string, e: React.MouseEvent) => void;
  onShare?: (event: AttendeeEvent, e: React.MouseEvent) => void;
  getLowestPrice?: (tickets: EventTicket[]) => number | null;
  formatPrice?: (price: number | null) => string;
}

// Props for Organizer Mode
interface OrganizerCardProps {
  mode: "organizer";
  event: OrganizerEvent;
}

// Union type for all props
type EventCardProps = AttendeeCardProps | OrganizerCardProps;

/**
 * EventCard Component
 * 
 * Requirement 19.2: Support different display modes
 * Requirement 19.3: Attendee view shows RSVP, Save, Share, View Details
 * Requirement 19.4: Organizer view shows Registrations, Attendance %, Revenue, Status
 * Requirement 19.5: Dark mode support
 */
export default function EventCard(props: EventCardProps) {
  const { mode, event } = props;

  // Helper functions for attendee mode
  const getLowestPrice = (tickets: EventTicket[]): number | null => {
    if (!tickets || tickets.length === 0) return null;
    const prices = tickets.map((t) => t.price).filter((p) => p !== null);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const formatPrice = (price: number | null): string => {
    if (price === null || price === 0) return "FREE";
    return `₹${(price / 100).toFixed(0)}`;
  };

  const price = getLowestPrice(event.tickets);
  const eventDate = new Date(event.startsAt);
  const isPast = eventDate < new Date();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark-lg transition-all group overflow-hidden rounded-card-lg"
    >
      {mode === "attendee" ? (
        <AttendeeCardContent
          event={event as AttendeeEvent}
          isSaved={props.isSaved || false}
          onToggleSave={props.onToggleSave}
          onShare={props.onShare}
          price={price}
          formatPrice={formatPrice}
          eventDate={eventDate}
          isPast={isPast}
        />
      ) : (
        <OrganizerCardContent
          event={event as OrganizerEvent}
          price={price}
          formatPrice={formatPrice}
          eventDate={eventDate}
        />
      )}
    </motion.div>
  );
}

/**
 * Attendee Card Content
 * Requirement 19.3: RSVP, Save, Share, View Details actions
 */
function AttendeeCardContent({
  event,
  isSaved,
  onToggleSave,
  onShare,
  price,
  formatPrice,
  eventDate,
  isPast,
}: {
  event: AttendeeEvent;
  isSaved: boolean;
  onToggleSave?: (id: string, e: React.MouseEvent) => void;
  onShare?: (event: AttendeeEvent, e: React.MouseEvent) => void;
  price: number | null;
  formatPrice: (price: number | null) => string;
  eventDate: Date;
  isPast: boolean;
}) {
  const attendeeCount = event._count?.registrations || 0;

  return (
    <Link href={`/events/${event.id}`} className="block cursor-pointer">
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
          <span
            className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
              price === 0 || price === null
                ? "bg-accent-mint text-ink"
                : "bg-accent-coral text-white"
            }`}
          >
            {formatPrice(price)}
          </span>
        </div>

        {/* Scope Badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-ink dark:text-dark-text text-[10px] font-bold uppercase rounded flex items-center gap-1">
            {event.scope === "COLLEGE" ? (
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
              {eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.venue || "Online"}</span>
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

        {/* Action Buttons - Attendee Mode (Requirement 19.3) */}
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
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleSave(event.id, e);
              }}
              className="p-2 border-2 border-ink dark:border-dark-border bg-paper dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors rounded"
              title={isSaved ? "Unsave" : "Save"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4 text-neutral-400 dark:text-dark-text-muted" />
              )}
            </button>
          )}

          {/* Share Button */}
          {onShare && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShare(event, e);
              }}
              className="p-2 border-2 border-ink dark:border-dark-border bg-paper dark:bg-dark-surface hover:bg-neutral-100 dark:hover:bg-dark-elevated transition-colors rounded"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-neutral-400 dark:text-dark-text-muted" />
            </button>
          )}
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
  );
}

/**
 * Organizer Card Content
 * Requirement 19.4: Registrations, Attendance %, Revenue, Status
 */
function OrganizerCardContent({
  event,
  price,
  formatPrice,
  eventDate,
}: {
  event: OrganizerEvent;
  price: number | null;
  formatPrice: (price: number | null) => string;
  eventDate: Date;
}) {
  const isPaid = event.tickets.some((t) => t.price > 0);

  // Status badge colors
  const statusColors = {
    LIVE: "bg-accent-mint text-ink",
    DRAFT: "bg-accent-coral text-white",
    ENDED: "bg-neutral-400 text-white",
  };

  return (
    <div>
      {/* Event Cover */}
      <div className="h-40 bg-gradient-to-br from-primary/20 to-accent-blue/20 dark:from-primary/10 dark:to-accent-blue/10 relative overflow-hidden">
        {event.coverUrl ? (
          <img
            src={event.coverUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-primary/40 dark:text-primary/20" />
          </div>
        )}

        {/* Status Badge (Requirement 19.4) */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
              statusColors[event.displayStatus]
            }`}
          >
            {event.displayStatus}
          </span>
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
        <h3 className="font-display text-lg font-bold mb-2 line-clamp-2 dark:text-dark-text">
          {event.title}
        </h3>

        {/* Event Details */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {eventDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {eventDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.venue || "Online"}</span>
          </div>
        </div>

        {/* Organizer Stats (Requirement 19.4) */}
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

        {/* Quick Actions (Requirement 19.4) */}
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
    </div>
  );
}
