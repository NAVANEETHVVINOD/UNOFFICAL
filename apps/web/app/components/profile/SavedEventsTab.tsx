"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Bookmark, Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { api } from "../../../lib/api";

interface SavedEvent {
  id: string;
  event: {
    id: string;
    title: string;
    coverImage?: string;
    startsAt: string;
    venue?: string;
    isFree?: boolean;
    minPrice?: number;
    club?: { name: string };
  };
}

interface SavedEventsTabProps {
  isOwnProfile?: boolean;
}

export default function SavedEventsTab({ isOwnProfile = true }: SavedEventsTabProps) {
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSavedEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.getSavedItems();
      const events = (data || []).filter((item: any) => item.event).map((item: any) => ({
        id: item.id,
        event: item.event,
      }));
      setSavedEvents(events);
    } catch (error) {
      console.error("Failed to fetch saved events:", error);
      setSavedEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOwnProfile) {
      fetchSavedEvents();
    }
  }, [isOwnProfile, fetchSavedEvents]);

  const handleUnsave = async (eventId: string) => {
    try {
      await api.unsaveEvent(eventId);
      setSavedEvents(prev => prev.filter(item => item.event.id !== eventId));
    } catch (error) {
      console.error("Failed to unsave event:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!savedEvents || savedEvents.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
          <Bookmark className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="font-display text-lg text-ink dark:text-white mb-2">No saved events</h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
          Save events you're interested in to find them here
        </p>
        <Link href="/events">
          <button className="px-6 py-2 bg-primary border-2 border-ink font-bold shadow-neo-sm hover:shadow-neo transition-all text-sm">
            Browse Events
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl dark:text-white">Saved Events ({savedEvents.length})</h2>
      </div>

      <div className="space-y-4">
        {savedEvents.map((item, index) => {
          const event = item.event;
          const eventDate = new Date(event.startsAt);
          const isUpcoming = eventDate > new Date();
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white dark:bg-neutral-800 rounded-xl border-2 border-ink/10 dark:border-neutral-700 overflow-hidden hover:border-ink/30 dark:hover:border-neutral-600 transition-all"
            >
              <Link href={`/events/${event.id}`}>
                <div className="flex gap-4 p-4">
                  {/* Event Image */}
                  <div className="w-20 h-20 rounded-lg bg-neutral-100 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                    {event.coverImage ? (
                      <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-ink dark:text-white truncate">{event.title}</h3>
                      {isUpcoming && (
                        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex-shrink-0">
                          Upcoming
                        </span>
                      )}
                    </div>
                    
                    {event.club && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        by {event.club.name}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      {event.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.venue}
                        </span>
                      )}
                      <span className="font-bold text-primary">
                        {event.isFree ? "Free" : `₹${event.minPrice}`}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Unsave Button */}
              {isOwnProfile && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleUnsave(event.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white dark:bg-neutral-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 dark:hover:bg-neutral-700"
                  title="Remove from saved"
                >
                  <Bookmark className="w-4 h-4 text-primary fill-primary" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}