"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Navbar from "../../components/Navbar";
import Container from "../../components/ui/Container";
import BottomNav from "../../components/ui/BottomNav";
import QRDisplay from "../../components/ui/QRDisplay";
import {
  Calendar, Clock, MapPin, Users, Ticket, Share2, Bookmark, BookmarkCheck,
  ChevronLeft, ExternalLink, QrCode, Download, Copy, Check, AlertCircle,
  Twitter, Facebook, Linkedin, Mail, Building, Tag, TrendingUp, Eye,
  Settings, BarChart3, UserCheck, List, Loader2, Heart, Star, Globe, Lock
} from "lucide-react";

// Types
interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  perUserLimit: number;
  salesStart?: string;
  salesEnd?: string;
}

interface Registration {
  id: string;
  status: string;
  qrToken?: string;
  ticketType?: TicketType;
  checkedInAt?: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  coverImage?: string;
  startsAt: string;
  endsAt: string;
  venue: string | null;
  onlineLink?: string;
  createdById: string;
  status: "DRAFT" | "PUBLISHED" | "REGISTRATION_CLOSED" | "ONGOING" | "COMPLETED" | "CANCELLED" | "ARCHIVED";
  scope: "CAMPUS" | "GLOBAL";
  visibility: "PUBLIC" | "INVITE_ONLY";
  category?: string;
  capacity?: number;
  registrationCount?: number;
  checkedInCount?: number;
  club?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  ticketTypes?: TicketType[];
  isFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  isSaved?: boolean;
  college?: {
    id: string;
    name: string;
  };
  agendaBlocks?: AgendaBlock[];
}

interface AgendaBlock {
  id: string;
  day: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
}

interface SimilarEvent {
  id: string;
  title: string;
  coverImage?: string;
  startsAt: string;
  venue?: string;
  isFree?: boolean;
  minPrice?: number;
}

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const generateICS = (event: Event) => {
  const start = new Date(event.startsAt).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(event.endsAt).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LINKER//Event//EN
BEGIN:VEVENT
UID:${event.id}@linker.app
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${event.description || ""}
LOCATION:${event.venue || "Online"}
END:VEVENT
END:VCALENDAR`;
  
  return ics;
};

export default function EventDetailsClient() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  // State
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [similarEvents, setSimilarEvents] = useState<SimilarEvent[]>([]);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeOrganizerTab, setActiveOrganizerTab] = useState<"attendees" | "analytics" | "settings">("attendees");
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  // Fetch event details
  const fetchEventDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [eventData, regData, roleData] = await Promise.allSettled([
        api.getEvent(id as string),
        user ? api.getUserRegistration(id as string) : Promise.resolve(null),
        user ? api.getMyEventRole(id as string) : Promise.resolve(null),
      ]);

      if (eventData.status === "fulfilled") {
        setEvent(eventData.value);
        setIsSaved(eventData.value.isSaved || false);
        
        // Fetch similar events based on category
        if (eventData.value.category) {
          try {
            const similar = await api.getEvents({ 
              category: eventData.value.category, 
              limit: 4 
            });
            setSimilarEvents(similar.events?.filter((e: any) => e.id !== id).slice(0, 3) || []);
          } catch (e) {
            console.error("Failed to fetch similar events:", e);
          }
        }
      }
      
      if (regData.status === "fulfilled" && regData.value) {
        setRegistration(regData.value);
      }
      
      if (roleData.status === "fulfilled" && roleData.value) {
        setUserRole(roleData.value.role);
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error);
      toast("Failed to load event details", "error");
    } finally {
      setLoading(false);
    }
  }, [id, user, toast]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  // Handlers
  const handleBookmark = async () => {
    if (!event || !user) {
      toast("Please log in to save events", "error");
      return;
    }
    
    setSavingBookmark(true);
    try {
      if (isSaved) {
        await api.unsaveEvent(event.id);
        setIsSaved(false);
        toast("Event removed from saved", "success");
      } else {
        await api.saveEvent(event.id);
        setIsSaved(true);
        toast("Event saved! We'll remind you before registration closes", "success");
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      toast("Failed to save event", "error");
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const text = `Check out ${event?.title} on LINKER!`;
    
    if (!platform && navigator.share) {
      try {
        await navigator.share({ title: event?.title, text, url });
        return;
      } catch (e) {
        // Fall through to copy
      }
    }
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      email: `mailto:?subject=${encodeURIComponent(event?.title || "Event")}&body=${encodeURIComponent(text + "\n\n" + url)}`,
    };
    
    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast("Link copied to clipboard!", "success");
      setTimeout(() => setCopiedLink(false), 2000);
    }
    setShowShareMenu(false);
  };

  const handleAddToCalendar = () => {
    if (!event) return;
    const ics = generateICS(event);
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Calendar event downloaded!", "success");
  };

  const handleShowQR = async () => {
    if (!event || !registration?.qrToken) return;
    try {
      const { qrCodeDataUrl } = await api.generateQr(event.id);
      setQrCodeUrl(qrCodeDataUrl);
      setShowQR(true);
    } catch (error) {
      console.error("Failed to generate QR:", error);
      toast("Failed to generate QR code", "error");
    }
  };

  // Handle manual payment verification for pending registrations
  // Requirement 25.2: "Verify Payment" manual sync button
  const handleVerifyPayment = async () => {
    if (!registration) return;
    setVerifyingPayment(true);
    try {
      // Get payment details to find the order ID
      const paymentDetails = await api.getPaymentDetails(registration.id);
      if (!paymentDetails?.razorpayOrderId) {
        toast("No payment found for this registration", "error");
        return;
      }
      
      const result = await api.manualVerifyPayment(paymentDetails.razorpayOrderId);
      if (result.success) {
        toast("Payment verified successfully!", "success");
        // Refresh registration data
        fetchEventDetails();
      } else {
        toast(result.error || "Payment verification failed", "error");
      }
    } catch (error) {
      console.error("Failed to verify payment:", error);
      toast("Failed to verify payment. Please contact support.", "error");
    } finally {
      setVerifyingPayment(false);
    }
  };

  // Computed values
  const isOrganizer = user && (
    user.id === event?.createdById || 
    userRole === "CREATOR" || 
    userRole === "CO_ORGANIZER" ||
    user.role === "ADMIN"
  );
  
  const isRegistered = registration && registration.status === "CONFIRMED";
  const isPendingPayment = registration && registration.status === "PENDING";
  const isCheckedIn = registration?.checkedInAt;
  const isPastEvent = event && new Date(event.endsAt) < new Date();
  const isRegistrationOpen = event && 
    event.status === "PUBLISHED" && 
    new Date() < new Date(event.startsAt);
  
  const availableTickets = event?.ticketTypes?.reduce((sum, t) => sum + (t.quantity - t.sold), 0) || 0;
  const totalCapacity = event?.ticketTypes?.reduce((sum, t) => sum + t.quantity, 0) || event?.capacity || 0;
  const attendeeCount = event?.registrationCount || 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-paper dark:bg-[#121212]">
        <Navbar />
        <Container>
          <div className="pt-20 pb-24 flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </Container>
      </div>
    );
  }

  // Not found state
  if (!event) {
    return (
      <div className="min-h-screen bg-paper dark:bg-[#121212]">
        <Navbar />
        <Container>
          <div className="pt-20 pb-24 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <h1 className="font-display text-3xl font-bold mb-2 dark:text-white">Event Not Found</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">This event doesn't exist or has been removed.</p>
            <Link href="/events">
              <button className="px-6 py-3 bg-primary border-2 border-ink font-bold shadow-neo hover:shadow-neo-lg transition-all">
                Browse Events
              </button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#121212]">
      <Navbar />
      
      <main className="pt-16 md:pt-20 pb-24">
        {/* Cover Image */}
        <div className="relative h-48 md:h-72 lg:h-96 bg-gradient-to-br from-primary via-accent-coral to-accent-blue overflow-hidden">
          {event.coverImage ? (
            <img 
              src={event.coverImage} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-halftone opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {/* Action buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleBookmark}
              disabled={savingBookmark}
              className="p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70 transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-primary" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-black/70 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              
              {/* Share Menu */}
              <AnimatePresence>
                {showShareMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 border-2 border-ink dark:border-neutral-700 rounded-xl shadow-neo overflow-hidden z-50"
                  >
                    <button onClick={() => handleShare("twitter")} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      <Twitter className="w-4 h-4 text-[#1DA1F2]" /> Twitter
                    </button>
                    <button onClick={() => handleShare("facebook")} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      <Facebook className="w-4 h-4 text-[#4267B2]" /> Facebook
                    </button>
                    <button onClick={() => handleShare("linkedin")} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      <Linkedin className="w-4 h-4 text-[#0077B5]" /> LinkedIn
                    </button>
                    <button onClick={() => handleShare("email")} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                      <Mail className="w-4 h-4" /> Email
                    </button>
                    <button onClick={() => handleShare()} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors border-t dark:border-neutral-700">
                      {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Status Badge */}
          {event.status !== "PUBLISHED" && (
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                event.status === "CANCELLED" ? "bg-red-500 text-white" :
                event.status === "COMPLETED" ? "bg-green-500 text-white" :
                event.status === "DRAFT" ? "bg-yellow-500 text-black" :
                "bg-neutral-500 text-white"
              }`}>
                {event.status.replace("_", " ")}
              </span>
            </div>
          )}
        </div>

        <Container>
          <div className="max-w-5xl mx-auto -mt-16 relative z-10">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Event Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#1E1E1E] border-2 border-ink dark:border-neutral-700 rounded-xl shadow-neo p-6"
                >
                  {/* Category & Scope */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {event.category && (
                      <span className="px-3 py-1 bg-primary/20 text-ink dark:text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {event.category}
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 ${
                      event.scope === "GLOBAL" 
                        ? "bg-accent-blue/20 text-accent-blue" 
                        : "bg-accent-mint/20 text-green-700 dark:text-green-400"
                    }`}>
                      {event.scope === "GLOBAL" ? <Globe className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                      {event.scope === "GLOBAL" ? "Global" : "Campus"}
                    </span>
                    {event.visibility === "INVITE_ONLY" && (
                      <span className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-xs font-bold rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Invite Only
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h1 className="font-display text-2xl md:text-4xl font-black text-ink dark:text-white mb-4 leading-tight">
                    {event.title}
                  </h1>
                  
                  {/* Organizer */}
                  {event.club && (
                    <Link href={`/clubs/${event.club.id}`} className="inline-flex items-center gap-3 mb-6 group">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 border-2 border-ink dark:border-neutral-600 overflow-hidden">
                        {event.club.logoUrl ? (
                          <img src={event.club.logoUrl} alt={event.club.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-lg">
                            {event.club.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Organized by</p>
                        <p className="font-bold text-ink dark:text-white group-hover:text-primary transition-colors">
                          {event.club.name}
                        </p>
                      </div>
                    </Link>
                  )}
                  
                  {/* Date, Time, Location */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-ink dark:text-white">{formatDate(event.startsAt)}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {formatTime(event.startsAt)} - {formatTime(event.endsAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent-coral/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-accent-coral" />
                      </div>
                      <div>
                        <p className="font-bold text-ink dark:text-white">{event.venue || "Online Event"}</p>
                        {event.onlineLink && (
                          <a href={event.onlineLink} target="_blank" rel="noopener noreferrer" 
                             className="text-sm text-primary hover:underline flex items-center gap-1">
                            Join Online <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Add to Calendar */}
                  <button
                    onClick={handleAddToCalendar}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-100 dark:bg-neutral-700 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Add to Calendar
                  </button>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-[#1E1E1E] border-2 border-ink dark:border-neutral-700 rounded-xl shadow-neo p-6"
                >
                  <h2 className="font-display text-xl font-bold mb-4 dark:text-white">About This Event</h2>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                      {event.description || "No description provided."}
                    </p>
                  </div>
                </motion.div>

                {/* Event Agenda */}
                {event.agendaBlocks && event.agendaBlocks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    className="bg-white dark:bg-[#1E1E1E] border-2 border-ink dark:border-neutral-700 rounded-xl shadow-neo p-6"
                  >
                    <h2 className="font-display text-xl font-bold mb-4 dark:text-white">Event Schedule</h2>
                    <div className="space-y-4">
                      {/* Group by day */}
                      {Array.from(new Set(event.agendaBlocks.map(b => b.day))).sort().map(day => {
                        const dayBlocks = event.agendaBlocks!.filter(b => b.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                        const dayDate = dayBlocks[0]?.date;
                        const formattedDate = dayDate ? new Date(dayDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        }) : `Day ${day}`;
                        
                        return (
                          <div key={day} className="border-l-4 border-primary pl-4">
                            <h3 className="font-bold text-ink dark:text-white mb-3">
                              {event.agendaBlocks!.length > 1 && `Day ${day} - `}{formattedDate}
                            </h3>
                            <div className="space-y-3">
                              {dayBlocks.map(block => (
                                <div key={block.id} className="flex gap-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                  <div className="flex-shrink-0 text-sm font-mono text-neutral-500 dark:text-neutral-400">
                                    {block.startTime} - {block.endTime}
                                  </div>
                                  <div>
                                    <p className="font-bold text-ink dark:text-white">{block.title}</p>
                                    {block.description && (
                                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                        {block.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Registered User View - Ticket with QR */}
                {isRegistered && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-gradient-to-br from-primary/10 via-accent-coral/5 to-accent-blue/10 dark:from-primary/20 dark:via-accent-coral/10 dark:to-accent-blue/20 border-2 border-primary/30 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-500 rounded-full">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-ink dark:text-white">You're Registered!</p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {isCheckedIn ? "✓ Checked in" : "Show QR code at entry"}
                          </p>
                        </div>
                      </div>
                      {registration?.ticketType && (
                        <span className="px-3 py-1 bg-white dark:bg-neutral-800 rounded-full text-sm font-bold">
                          {registration.ticketType.name}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={handleShowQR}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      <QrCode className="w-5 h-5" />
                      Show My Ticket QR Code
                    </button>
                  </motion.div>
                )}

                {/* Organizer View - Management Tabs */}
                {isOrganizer && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#1E1E1E] border-2 border-ink dark:border-neutral-700 rounded-xl shadow-neo overflow-hidden"
                  >
                    <div className="bg-ink text-white px-4 py-2 text-xs font-bold uppercase tracking-wider">
                      Organizer Dashboard
                    </div>
                    
                    {/* Tabs */}
                    <div className="flex border-b dark:border-neutral-700">
                      {[
                        { id: "attendees", label: "Attendees", icon: Users },
                        { id: "analytics", label: "Analytics", icon: BarChart3 },
                        { id: "settings", label: "Settings", icon: Settings },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveOrganizerTab(tab.id as any)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                            activeOrganizerTab === tab.id
                              ? "bg-primary/10 text-primary border-b-2 border-primary"
                              : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="p-4">
                      {activeOrganizerTab === "attendees" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">
                              {attendeeCount} registered • {event.checkedInCount || 0} checked in
                            </span>
                            <Link href={`/events/${event.id}/manage`}>
                              <button className="text-sm text-primary font-medium hover:underline">
                                View All →
                              </button>
                            </Link>
                          </div>
                          <Link href={`/events/${event.id}/scanner`}>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors">
                              <QrCode className="w-5 h-5" />
                              Open QR Scanner
                            </button>
                          </Link>
                        </div>
                      )}
                      
                      {activeOrganizerTab === "analytics" && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-center">
                              <p className="text-2xl font-bold text-ink dark:text-white">{attendeeCount}</p>
                              <p className="text-xs text-neutral-500">Registrations</p>
                            </div>
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-center">
                              <p className="text-2xl font-bold text-ink dark:text-white">
                                {totalCapacity > 0 ? Math.round((attendeeCount / totalCapacity) * 100) : 0}%
                              </p>
                              <p className="text-xs text-neutral-500">Capacity</p>
                            </div>
                          </div>
                          <Link href={`/events/${event.id}/manage?tab=analytics`}>
                            <button className="w-full text-sm text-primary font-medium hover:underline">
                              View Full Analytics →
                            </button>
                          </Link>
                        </div>
                      )}
                      
                      {activeOrganizerTab === "settings" && (
                        <div className="space-y-3">
                          <Link href={`/events/${event.id}/manage?tab=settings`}>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                              <Settings className="w-4 h-4" />
                              Manage Event Settings
                            </button>
                          </Link>
                          <Link href={`/events/${event.id}/certificates`}>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                              <Star className="w-4 h-4" />
                              Manage Certificates
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Similar Events */}
                {similarEvents.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white dark:bg-[#1E1E1E] border-2 border-ink dark:border-neutral-700 rounded-xl shadow-neo p-6"
                  >
                    <h2 className="font-display text-xl font-bold mb-4 dark:text-white">Similar Events</h2>
                    <div className="space-y-3">
                      {similarEvents.map((similar) => (
                        <Link key={similar.id} href={`/events/${similar.id}`}>
                          <div className="flex gap-3 p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                            <div className="w-16 h-16 rounded-lg bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                              {similar.coverImage ? (
                                <img src={similar.coverImage} alt={similar.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Calendar className="w-6 h-6 text-neutral-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-ink dark:text-white truncate">{similar.title}</p>
                              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {formatDate(similar.startsAt)}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                {similar.isFree ? "Free" : `₹${similar.minPrice}`}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar - Ticket Section */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-[#1E1E1E] border-2 border-ink dark:border-neutral-700 rounded-xl shadow-neo p-6 sticky top-24"
                >
                  {/* Price Display */}
                  <div className="text-center mb-6">
                    {event.isFree ? (
                      <p className="text-3xl font-display font-black text-green-600">FREE</p>
                    ) : (
                      <div>
                        <p className="text-3xl font-display font-black text-ink dark:text-white">
                          ₹{event.minPrice}
                          {event.maxPrice && event.maxPrice !== event.minPrice && (
                            <span className="text-lg text-neutral-500"> - ₹{event.maxPrice}</span>
                          )}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">per ticket</p>
                      </div>
                    )}
                  </div>

                  {/* No-Refund Policy Notice for Paid Events */}
                  {!event.isFree && (
                    <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-300">No Refund Policy</p>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                            This event does not support refunds. Please review before purchasing.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Capacity Info */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        {attendeeCount} attending
                      </span>
                    </div>
                    {totalCapacity > 0 && (
                      <span className="text-sm font-medium text-ink dark:text-white">
                        {availableTickets} spots left
                      </span>
                    )}
                  </div>

                  {/* Capacity Progress Bar */}
                  {totalCapacity > 0 && (
                    <div className="mb-6">
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            availableTickets === 0 ? "bg-red-500" :
                            availableTickets < totalCapacity * 0.2 ? "bg-yellow-500" :
                            "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(100, (attendeeCount / totalCapacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Ticket Types */}
                  {event.ticketTypes && event.ticketTypes.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase">
                        Available Tickets
                      </p>
                      {event.ticketTypes.map((ticket) => {
                        const available = ticket.quantity - ticket.sold;
                        const isSoldOut = available <= 0;
                        
                        return (
                          <div 
                            key={ticket.id}
                            className={`p-3 border-2 rounded-lg ${
                              isSoldOut 
                                ? "border-neutral-200 dark:border-neutral-700 opacity-60" 
                                : "border-ink dark:border-neutral-600"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-ink dark:text-white">{ticket.name}</p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                  {isSoldOut ? "Sold out" : `${available} available`}
                                </p>
                              </div>
                              <p className="font-bold text-lg text-ink dark:text-white">
                                {ticket.price === 0 ? "Free" : `₹${ticket.price}`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Register Button */}
                  {!isRegistered && !isPendingPayment && !isPastEvent && (
                    <>
                      {isRegistrationOpen ? (
                        <Link href={`/events/${event.id}/register`}>
                          <button 
                            className="w-full py-4 bg-primary border-2 border-ink font-bold text-lg shadow-neo hover:shadow-neo-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={availableTickets === 0}
                          >
                            {availableTickets === 0 ? "Sold Out" : "Register Now"}
                          </button>
                        </Link>
                      ) : (
                        <button 
                          className="w-full py-4 bg-neutral-200 dark:bg-neutral-700 border-2 border-neutral-300 dark:border-neutral-600 font-bold text-lg cursor-not-allowed"
                          disabled
                        >
                          Registration Closed
                        </button>
                      )}
                    </>
                  )}

                  {/* Pending Payment - Verify Payment Button (Requirement 25.2) */}
                  {isPendingPayment && (
                    <div className="space-y-3">
                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-amber-600" />
                        <p className="font-bold text-amber-700 dark:text-amber-400">Payment Pending</p>
                        <p className="text-sm text-amber-600 dark:text-amber-500">
                          Your payment is being processed
                        </p>
                      </div>
                      <button
                        onClick={handleVerifyPayment}
                        disabled={verifyingPayment}
                        className="w-full py-3 bg-ink dark:bg-white text-white dark:text-ink font-bold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {verifyingPayment ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            Verify Payment
                          </>
                        )}
                      </button>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                        If you completed payment but it's still pending, click to verify
                      </p>
                    </div>
                  )}

                  {/* Already Registered */}
                  {isRegistered && (
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <UserCheck className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="font-bold text-green-700 dark:text-green-400">You're Registered!</p>
                      <p className="text-sm text-green-600 dark:text-green-500">See you at the event</p>
                    </div>
                  )}

                  {/* Past Event */}
                  {isPastEvent && !isRegistered && (
                    <div className="text-center p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <p className="font-bold text-neutral-600 dark:text-neutral-400">Event has ended</p>
                    </div>
                  )}

                  {/* College Info */}
                  {event.college && (
                    <div className="mt-6 pt-4 border-t dark:border-neutral-700">
                      <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                        <Building className="w-4 h-4" />
                        <span>{event.college.name}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <BottomNav />

      {/* QR Code Modal */}
      {showQR && qrCodeUrl && (
        <QRDisplay qrCodeUrl={qrCodeUrl} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}