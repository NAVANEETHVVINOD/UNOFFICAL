"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../../lib/api";
import {
  Building,
  MapPin,
  Users,
  BookOpen,
  Calendar,
  Edit,
  Save,
  X,
  Loader2,
  Megaphone,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

interface CollegeData {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  description?: string;
  departments?: string[];
  initiatives?: string[];
  announcements?: Array<{
    id: string;
    title: string;
    content: string;
    createdAt: string;
  }>;
  _count?: {
    profiles: number;
    clubs: number;
    events: number;
  };
}

interface CollegeAboutProps {
  collegeSlug?: string;
  isAdmin?: boolean;
}

export default function CollegeAbout({ collegeSlug, isAdmin = false }: CollegeAboutProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [college, setCollege] = useState<CollegeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    description: "",
    departments: [] as string[],
    initiatives: [] as string[],
  });

  const slug = collegeSlug || user?.profile?.college?.slug;

  useEffect(() => {
    if (slug) {
      fetchCollege();
    }
  }, [slug]);

  const fetchCollege = async () => {
    if (!slug) return;
    setIsLoading(true);
    try {
      const data = await api.getCollegeBySlug(slug);
      setCollege(data);
      setEditForm({
        description: data.description || "",
        departments: data.departments || [],
        initiatives: data.initiatives || [],
      });
    } catch (error) {
      console.error("Failed to fetch college:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!college) return;
    setIsSaving(true);
    try {
      await api.updateCollege(college.id, editForm);
      setCollege({ ...college, ...editForm });
      setIsEditing(false);
      toast("College info updated!", "success");
    } catch (error: any) {
      toast(error.message || "Failed to update", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl p-6 shadow-neo">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          <div className="h-20 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl p-6 shadow-neo text-center">
        <Building className="w-12 h-12 mx-auto text-neutral-300 mb-4" />
        <p className="text-neutral-500">No college information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main About Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl shadow-neo overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-ink bg-primary/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary border-2 border-ink rounded-xl shadow-neo-sm">
                <Building className="w-8 h-8 text-ink" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-black text-ink dark:text-dark-text">
                  {college.name}
                </h2>
                {(college.city || college.state) && (
                  <p className="flex items-center gap-1 text-neutral-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    {[college.city, college.state].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>

            {isAdmin && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5 text-neutral-500" />
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-blue" />
              <span className="font-bold">{college._count?.profiles || 0}</span>
              <span className="text-neutral-500 text-sm">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent-purple" />
              <span className="font-bold">{college._count?.clubs || 0}</span>
              <span className="text-neutral-500 text-sm">Clubs</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent-coral" />
              <span className="font-bold">{college._count?.events || 0}</span>
              <span className="text-neutral-500 text-sm">Events</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-bold text-sm text-neutral-500 uppercase mb-2">
              About
            </h3>
            {isEditing ? (
              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full p-3 border-2 border-ink rounded-xl resize-none h-32 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your college..."
              />
            ) : (
              <p className="text-neutral-600 dark:text-dark-text-muted leading-relaxed">
                {college.description || "No description available."}
              </p>
            )}
          </div>

          {/* Departments */}
          {(college.departments?.length || isEditing) && (
            <div>
              <h3 className="font-bold text-sm text-neutral-500 uppercase mb-2">
                Departments
              </h3>
              {isEditing ? (
                <input
                  value={editForm.departments.join(", ")}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      departments: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  className="w-full p-3 border-2 border-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Computer Science, Engineering, Business..."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {college.departments?.map((dept, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent-blue/10 border border-accent-blue/30 rounded-full text-sm font-medium"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initiatives */}
          {(college.initiatives?.length || isEditing) && (
            <div>
              <h3 className="font-bold text-sm text-neutral-500 uppercase mb-2">
                Initiatives
              </h3>
              {isEditing ? (
                <input
                  value={editForm.initiatives.join(", ")}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      initiatives: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  className="w-full p-3 border-2 border-ink rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Research Programs, Sustainability, Innovation Hub..."
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {college.initiatives?.map((init, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent-mint/10 border border-accent-mint/30 rounded-full text-sm font-medium"
                    >
                      {init}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-3 pt-4 border-t border-neutral-200">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 border-2 border-ink rounded-xl font-bold hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 btn-neo btn-primary flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Announcements (Blog-style cards) */}
      {college.announcements && college.announcements.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-accent-coral" />
            <h3 className="font-display font-bold text-lg">Announcements</h3>
          </div>
          <div className="grid gap-4">
            {college.announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-surface border-2 border-ink rounded-xl p-4 shadow-neo-sm hover:shadow-neo transition-shadow"
              >
                <h4 className="font-bold text-lg mb-2">{announcement.title}</h4>
                <p className="text-neutral-600 dark:text-dark-text-muted text-sm mb-3">
                  {announcement.content}
                </p>
                <span className="text-xs text-neutral-400">
                  {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
