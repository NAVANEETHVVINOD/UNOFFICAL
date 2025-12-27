"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../../lib/api";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronRight,
  Building,
  Globe,
  History,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  venue?: string;
  collegeId?: string;
  scope: "COLLEGE" | "STATE";
  college?: {
    name: string;
    slug: string;
  };
  _count?: {
    attendees: number;
  };
  // Academic event properties
  classroomId?: string;
  isAcademic?: boolean;
}

type FilterType = "all" | "college" | "global" | "academic";

/**
 * Check if an event is academic (classroom-related).
 * Academic events have a classroomId or contain academic keywords.
 */
function isAcademicEvent(event: Event): boolean {
  if (event.classroomId || event.isAcademic) return true;
  
  const academicKeywords = [
    'class', 'lecture', 'exam', 'test', 'quiz', 'assignment',
    'deadline', 'submission', 'tutorial', 'lab', 'seminar',
    'workshop', 'presentation', 'project', 'review', 'study'
  ];
  
  const titleLower = event.title.toLowerCase();
  const descLower = (event.description || '').toLowerCase();
  
  return academicKeywords.some(keyword => 
    titleLower.includes(keyword) || descLower.includes(keyword)
  );
}

export default function EventsSection() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [showPast, setShowPast] = useState(false);
  
  // Check if current user is a teacher
  const isTeacher = user?.role === 'FACULTY';

  useEffect(() => {
    fetchEvents();
  }, [user?.profile?.college?.slug]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.getEvents(user?.profile?.college?.slug);
      const allEvents = response.events || response || [];
      
      const now = new Date();
      const upcoming = allEvents.filter(
        (e: Event) => new Date(e.startsAt) >= now
      );
      const past = allEvents.filter(
        (e: Event) => new Date(e.startsAt) < now
      );
      
      setEvents(upcoming);
      setPastEvents(past.slice(0, 5)); // Show last 5 past events
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    if (filter === "college") return event.scope === "COLLEGE";
    if (filter === "global") return event.scope === "STATE";
    if (filter === "academic") return isAcademicEvent(event);
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl p-4 shadow-neo">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3"></div>
          <div className="h-20 bg-neutral-200 rounded"></div>
          <div className="h-20 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl shadow-neo overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b-2 border-ink bg-accent-coral/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-coral" />
            <h3 className="font-display font-bold text-lg">Events</h3>
          </div>
          <Link
            href="/events"
            className="text-sm font-medium text-accent-coral hover:underline flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-ink text-white"
                : "bg-white border border-neutral-200 hover:border-ink"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("college")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              filter === "college"
                ? "bg-accent-coral text-white"
                : "bg-white border border-neutral-200 hover:border-ink"
            }`}
          >
            <Building className="w-3 h-3" />
            College
          </button>
          <button
            onClick={() => setFilter("global")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
              filter === "global"
                ? "bg-accent-blue text-white"
                : "bg-white border border-neutral-200 hover:border-ink"
            }`}
          >
            <Globe className="w-3 h-3" />
            Global
          </button>
          {/* Academic filter - highlighted for teachers */}
          {isTeacher && (
            <button
              onClick={() => setFilter("academic")}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                filter === "academic"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 border border-purple-300 text-purple-700 hover:border-purple-500"
              }`}
            >
              <Calendar className="w-3 h-3" />
              Academic
            </button>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="p-4 space-y-3">
        {filteredEvents.length === 0 ? (
          <p className="text-center text-neutral-500 py-4 text-sm">
            No upcoming events
          </p>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredEvents.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/events/${event.id}`}
                  className={`block p-3 rounded-xl border-2 hover:shadow-neo-sm transition-all group ${
                    isTeacher && isAcademicEvent(event)
                      ? "border-purple-300 bg-purple-50/50 hover:border-purple-500"
                      : "border-neutral-200 hover:border-ink"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Date Badge */}
                    <div className={`flex-shrink-0 w-12 h-12 border-2 rounded-lg flex flex-col items-center justify-center ${
                      isTeacher && isAcademicEvent(event)
                        ? "bg-purple-100 border-purple-300"
                        : "bg-accent-coral/10 border-accent-coral/30"
                    }`}>
                      <span className={`text-xs font-bold uppercase ${
                        isTeacher && isAcademicEvent(event) ? "text-purple-600" : "text-accent-coral"
                      }`}>
                        {isToday(event.startsAt)
                          ? "Today"
                          : isTomorrow(event.startsAt)
                          ? "Tmrw"
                          : formatDate(event.startsAt).split(" ")[0]}
                      </span>
                      <span className="text-lg font-black text-ink">
                        {isToday(event.startsAt) || isTomorrow(event.startsAt)
                          ? formatTime(event.startsAt)
                          : formatDate(event.startsAt).split(" ")[1]}
                      </span>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-sm truncate transition-colors ${
                          isTeacher && isAcademicEvent(event)
                            ? "group-hover:text-purple-600"
                            : "group-hover:text-accent-coral"
                        }`}>
                          {event.title}
                        </h4>
                        {/* Academic Badge for teachers */}
                        {isTeacher && isAcademicEvent(event) && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 bg-purple-200 text-purple-700 text-[10px] font-bold rounded">
                            ACADEMIC
                          </span>
                        )}
                        {/* College Badge */}
                        {event.scope === "COLLEGE" && event.college && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 bg-accent-coral/20 text-accent-coral text-[10px] font-bold rounded">
                            {event.college.name.slice(0, 3).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500">
                        {event.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.venue}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event._count?.attendees || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Past Events Section */}
      {pastEvents.length > 0 && (
        <div className="border-t-2 border-neutral-200">
          <button
            onClick={() => setShowPast(!showPast)}
            className="w-full p-3 flex items-center justify-between text-sm font-medium text-neutral-500 hover:bg-neutral-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Past Events ({pastEvents.length})
            </span>
            <ChevronRight
              className={`w-4 h-4 transition-transform ${
                showPast ? "rotate-90" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {showPast && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0 space-y-2">
                  {pastEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="block p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-600 truncate">
                          {event.title}
                        </span>
                        <span className="text-xs text-neutral-400 flex-shrink-0 ml-2">
                          {formatDate(event.startsAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <Users className="w-3 h-3" />
                        <span>{event._count?.attendees || 0} attended</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
