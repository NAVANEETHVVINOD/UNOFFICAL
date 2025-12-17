"use client";

import { motion } from "framer-motion";
import { Briefcase, Plus } from "lucide-react";

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description?: string;
  location?: string;
}

interface ExperienceTabProps {
  experience: ExperienceEntry[];
  isLoading?: boolean;
  isOwnProfile?: boolean;
  onAddExperience?: () => void;
}

export default function ExperienceTab({ experience, isLoading, isOwnProfile, onAddExperience }: ExperienceTabProps) {
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
        <h2 className="font-display text-xl">Experience</h2>
        {isOwnProfile && (
          <button 
            onClick={onAddExperience}
            className="flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-full text-sm font-bold hover:bg-ink hover:text-white transition-colors"
          >
            ADD <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {(!experience || experience.length === 0) ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-accent-blue/10 rounded-full flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-accent-blue" />
          </div>
          <p className="text-neutral-600 mb-6">
            Build your professional story. Add your work history
          </p>
          {isOwnProfile && (
            <button 
              onClick={onAddExperience}
              className="flex items-center gap-2 px-6 py-3 border-2 border-ink rounded-full font-bold hover:bg-ink hover:text-white transition-colors mx-auto"
            >
              Add <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {experience.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 bg-paper-light rounded-xl border border-ink/10"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-neutral-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-ink">{entry.title}</h3>
                  <p className="text-neutral-600">{entry.company}</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    {entry.startDate} - {entry.endDate || "Present"}
                    {entry.location && ` · ${entry.location}`}
                  </p>
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
