"use client";

import { useAuth } from "../../context/AuthContext";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function UpcomingEventsStack() {
    const { loading } = useAuth();

    // Mock Data
    const events = [
        { id: 1, title: "HackNight 4.0", date: "12 DEC", color: "bg-accent-blue" },
        { id: 2, title: "Standup Comedy", date: "15 DEC", color: "bg-accent-yellow" },
    ];

    if (loading) return <StackSkeleton />;

    if (events.length === 0) return <EmptyEvents />;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> UPCOMING
                </h3>
            </div>

            <div className="prose-none">
                {events.map((event, i) => (
                    <div
                        key={event.id}
                        className={`
                        relative group
                        bg-white border-2 border-black p-3 
                        shadow-neo-sm hover:shadow-neo hover:-translate-y-1 transition-all
                        ${i !== 0 ? '-mt-2' : ''} 
                    `}
                        style={{ zIndex: 10 - i }}
                    >
                        {/* Ticket Stub Line */}
                        <div className="absolute right-8 top-0 bottom-0 w-0 border-l-2 border-dashed border-gray-300"></div>
                        <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-paper rounded-full border-2 border-black z-20"></div>

                        <div className="flex gap-3">
                            {/* Date Box */}
                            <div className={`${event.color} border-2 border-black p-2 text-center min-w-[60px] flex flex-col justify-center`}>
                                <span className="font-black text-lg leading-none">{event.date.split(' ')[0]}</span>
                                <span className="font-mono text-xs font-bold leading-none">{event.date.split(' ')[1]}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 pr-4">
                                <h4 className="font-bold font-display leading-tight group-hover:text-accent-blue transition-colors">{event.title}</h4>
                                <div className="flex items-center gap-1 text-[10px] font-mono text-gray-500 mt-1">
                                    <MapPin className="w-3 h-3" /> Main Audi
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Link href="/events" className="block text-center text-xs font-bold py-2 border-2 border-black border-dashed rounded hover:bg-gray-50">
                View All Events
            </Link>
        </div>
    );
}

function EmptyEvents() {
    return (
        <div className="border-card border-black bg-white p-6 text-center shadow-neo">
            <p className="font-mono text-xs text-gray-400 mb-2">My Campus</p>
            <h4 className="font-display font-bold">Your campus is strangely calm...</h4>
            <div className="my-4 w-16 h-1 bg-gray-100 mx-auto"></div>
            <button className="text-xs underline font-bold">Create Event</button>
        </div>
    )
}

function StackSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
            <div className="space-y-[-10px]">
                <div className="h-20 bg-white border-2 border-gray-200 z-10 relative"></div>
                <div className="h-20 bg-white border-2 border-gray-200 z-0 relative scale-95"></div>
            </div>
        </div>
    )
}
