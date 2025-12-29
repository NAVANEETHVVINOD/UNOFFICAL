"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Event = {
    id: string;
    title: string;
    startsAt: string;
    venue?: string;
};

export default function UpcomingEventsWidget({ collegeSlug }: { collegeSlug?: string }) {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchEvents() {
            try {
                setLoading(true);
                // Fetch valid upcoming events
                const data = await api.getEvents(collegeSlug ? { collegeSlug, limit: 3 } : { limit: 3 });
                const eventsArray = data?.events || data || [];
                const upcoming = Array.isArray(eventsArray)
                    ? eventsArray
                        .filter((e: any) => new Date(e.startsAt) > new Date())
                        .sort((a: any, b: any) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
                        .slice(0, 3)
                    : [];
                setEvents(upcoming);
            } catch (err) {
                console.error("Failed to fetch upcoming events", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, [collegeSlug]);

    if (!loading && events.length === 0) return null; // Don't show if empty

    return (
        <motion.div
            className="card-neo p-4 rounded-card-lg bg-paper"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" />
                <h3 className="font-display text-sm uppercase">Upcoming</h3>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 p-2">
                            <div className="w-12 h-12 bg-neutral-100 rounded animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-neutral-100 rounded w-3/4 animate-pulse" />
                                <div className="h-2 bg-neutral-100 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-sm text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">Failed to load events</span>
                </div>
            ) : (
                <div className="space-y-3">
                    {events.map((event) => {
                        const date = new Date(event.startsAt);
                        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
                        const day = date.getDate();

                        return (
                            <Link key={event.id} href={`/events/${event.id}`}>
                                <div className="flex gap-3 p-2 hover:bg-neutral-50 rounded transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 bg-primary/20 border border-ink rounded flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <span className="font-display text-xs">{month}</span>
                                        <span className="font-display text-lg leading-none">{day}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{event.title}</p>
                                        <p className="text-xs text-neutral-500 truncate">{event.venue || "TBA"} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            <Link href={collegeSlug ? `/colleges/${collegeSlug}/events` : "/events"} className="block mt-4 text-center text-sm font-medium text-ink hover:text-primary transition-colors">
                View All Events →
            </Link>
        </motion.div>
    );
}
