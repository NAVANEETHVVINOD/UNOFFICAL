"use client";

import { motion } from "framer-motion";
import { GraduationCap, Plus } from "lucide-react";

interface EducationEntry {
  id: string;
  yearStart: string;
  yearEnd: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
}

interface EducationTabProps {
  education: EducationEntry[];
  isLoading?: boolean;
  isOwnProfile?: boolean;
  onAddEducation?: () => void;
}

export default function EducationTab({ education, isLoading, isOwnProfile, onAddEducation }: EducationTabProps) {
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
        <h2 className="font-display text-xl">Education</h2>
        {isOwnProfile && (
          <button 
            onClick={onAddEducation}
            className="flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-full text-sm font-bold hover:bg-ink hover:text-white transition-colors"
          >
            ADD <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {(!education || education.length === 0) ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-display text-lg text-ink mb-2">No education added</h3>
          <p className="text-neutral-500 text-sm mb-6">
            Add your educational background
          </p>
          {isOwnProfile && (
            <button 
              onClick={onAddEducation}
              className="btn-neo btn-primary text-sm"
            >
              Add Education
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-primary/30" />
          
          <div className="space-y-8">
            {education.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-10"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-6 h-6 bg-primary border-2 border-ink rounded-full flex items-center justify-center">
                  <GraduationCap className="w-3 h-3 text-ink" />
                </div>
                
                {/* Content */}
                <div>
                  <p className="text-sm text-neutral-500 font-mono">
                    {entry.yearStart} - {entry.yearEnd}
                  </p>
                  <h3 className="font-bold text-ink mt-1">
                    {entry.degree}, {entry.field}
                  </h3>
                  <p className="text-neutral-600 text-sm mt-0.5">
                    {entry.institution}
                    {entry.location && ` · ${entry.location}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
