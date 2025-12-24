"use client";

import { MapPin, Calendar, ExternalLink } from "lucide-react";

export default function EventTicket({ event }: { event: any }) {
    // Mock fallback
    const evt = event || {
        title: "Neon Nights Hackathon",
        date: "DEC 24",
        time: "10:00 AM",
        location: "Main Auditorium",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"
    };

    return (
        <div className="relative flex flex-col md:flex-row bg-paper border-2 border-black shadow-neo hover:shadow-neo-lg transition-transform hover:-translate-y-1 duration-300 cursor-pointer group rounded-card-lg overflow-hidden">

            {/* Left: Image / Visual */}
            <div className="relative md:w-1/3 min-h-[160px] overflow-hidden border-b-2 md:border-b-0 md:border-r-2 border-black border-dashed">
                <img src={evt.image} alt="Event" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-accent-blue/20 mix-blend-multiply"></div>

                {/* Date Badge */}
                <div className="absolute top-4 left-4 bg-white border-2 border-black p-2 text-center shadow-sm">
                    <span className="block font-black font-display text-xl leading-none">{evt.date.split(' ')[0]}</span>
                    <span className="block font-mono text-xs font-bold">{evt.date.split(' ')[1]}</span>
                </div>
            </div>

            {/* Right: Info */}
            <div className="flex-1 p-5 flex flex-col justify-between relative bg-paper">
                {/* Cutout Circles for "Ticket" look */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full border-2 border-black z-10 hidden md:block"></div>

                <div>
                    <div className="flex items-start justify-between">
                        {evt.status === 'PENDING' ? (
                            <span className="bg-accent-yellow text-black border-2 border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 inline-block animate-pulse">
                                ⏳ Pending Review
                            </span>
                        ) : evt.status === 'REJECTED' ? (
                            <span className="bg-accent-coral text-white border-2 border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 inline-block">
                                ❌ Rejected
                            </span>
                        ) : (
                            <span className="bg-black text-white px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider mb-2 inline-block">
                                Event Ticket
                            </span>
                        )}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="font-display font-black text-2xl mb-2 leading-none uppercase">{evt.title}</h3>
                    <div className="flex flex-col gap-1 text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> {evt.date} • {evt.time}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> {evt.location}
                        </div>
                    </div>
                </div>

                <button className="mt-4 w-full bg-accent-yellow border-2 border-black font-bold font-display py-2 shadow-sm hover:shadow-neo hover:translate-x-[2px] hover:-translate-y-[2px] transition-all">
                    RSVP NOW
                </button>
            </div>
        </div>
    );
}
