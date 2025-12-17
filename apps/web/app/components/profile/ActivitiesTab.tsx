"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface ActivityEntry {
  id: string;
  eventName: string;
  eventIcon?: string;
  startDate: string;
  endDate?: string;
  status: "ATTENDED" | "REGISTERED" | "MISSED";
  venue?: string;
  eventId?: string;
}

interface ActivitiesTabProps {
  activities: ActivityEntry[];
  isLoading?: boolean;
}

// Event icons based on type
const eventIcons: Record<string, string> = {
  tech: "💻",
  music: "🎵",
  sports: "⚽",
  art: "🎨",
  workshop: "🔧",
  default: "📅",
};

const statusColors: Record<string, string> = {
  ATTENDED: "bg-accent-mint text-ink",
  REGISTERED: "bg-primary text-ink",
  MISSED: "bg-neutral-200 text-neutral-600",
};

export default function ActivitiesTab({ activities, isLoading }: ActivitiesTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-neutral-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
          <Calendar className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="font-display text-lg text-ink mb-2">No activities yet</h3>
        <p className="text-neutral-500 text-sm mb-6">
          Events you attend will appear here
        </p>
        <Link href="/events">
          <button className="btn-neo btn-primary text-sm">
            Browse Events
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl">Past Events</h2>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 bg-paper-light rounded-lg border border-ink/5 hover:border-ink/20 transition-colors"
          >
            {/* Event Icon */}
            <div className="text-2xl flex-shrink-0">
              {activity.eventIcon || eventIcons.default}
            </div>
            
            {/* Event Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-ink truncate">{activity.eventName}</h3>
              <div className="flex items-center gap-3 text-sm text-neutral-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(activity.startDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                  {activity.endDate && (
                    <>
                      {" - "}
                      {new Date(activity.endDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </>
                  )}
                </span>
                {activity.venue && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activity.venue}
                  </span>
                )}
              </div>
            </div>
            
            {/* Status Badge */}
            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${statusColors[activity.status]}`}>
              {activity.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
