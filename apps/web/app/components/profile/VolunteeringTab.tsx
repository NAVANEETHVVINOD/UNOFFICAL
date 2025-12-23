"use client";

import { motion } from "framer-motion";
import { Heart, Plus, Trash2 } from "lucide-react";

interface VolunteerEntry {
  id: string;
  title: string; // role
  organization: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

interface VolunteeringTabProps {
  volunteering: VolunteerEntry[];
  isLoading?: boolean;
  isOwnProfile?: boolean;
  onAddVolunteering?: () => void;
  onRemoveVolunteering?: (id: string) => void;
}

export default function VolunteeringTab({ volunteering, isLoading, isOwnProfile, onAddVolunteering, onRemoveVolunteering }: VolunteeringTabProps) {
  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-neutral-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl">Volunteering</h2>
        {isOwnProfile && (
          <button
            onClick={onAddVolunteering}
            className="flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-full text-sm font-bold hover:bg-ink hover:text-white transition-colors"
          >
            ADD <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {(!volunteering || volunteering.length === 0) ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-accent-pink/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-accent-pink" />
          </div>
          <p className="text-neutral-600 mb-6">
            Build your professional story. Add your work history
          </p>
          {isOwnProfile && (
            <button
              onClick={onAddVolunteering}
              className="flex items-center gap-2 px-6 py-3 border-2 border-ink rounded-full font-bold hover:bg-ink hover:text-white transition-colors mx-auto"
            >
              Add <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {volunteering.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-paper-light rounded-xl border border-ink/10 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent-pink/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-6 h-6 text-accent-pink" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-ink">{entry.title}</h3>
                      <p className="text-neutral-600">{entry.organization}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {new Date(entry.startDate).getFullYear()} - {entry.endDate ? new Date(entry.endDate).getFullYear() : 'Present'}
                      </p>
                    </div>
                    {isOwnProfile && onRemoveVolunteering && (
                      <button
                        onClick={() => onRemoveVolunteering(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {entry.description && (
                    <p className="text-sm text-neutral-600 mt-3">{entry.description}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}


