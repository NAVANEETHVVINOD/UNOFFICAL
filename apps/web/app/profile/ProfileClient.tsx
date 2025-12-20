"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import Link from "next/link";
import { Settings, Send, MapPin, Github, Briefcase, GraduationCap, Heart, Star, Calendar } from "lucide-react";
import { api } from "../../lib/api";
import {
  ActivitiesTab,
  ProjectsTab,
  EducationTab,
  ExperienceTab,
  VolunteeringTab,
  GitHubContributions,
} from "../components/profile";

interface UserActivity {
  posts: Array<{ id: string; content: string; createdAt: string; _count?: { likes: number; comments: number } }>;
  eventsAttended: Array<{ id: string; event: { id: string; title: string; startsAt: string } }>;
  clubsJoined: Array<{ id: string; club: { id: string; name: string; logoUrl?: string } }>;
}

type ProfileTabId = "activities" | "projects" | "experience" | "education" | "volunteering";

function ProfileContent() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTabId>("activities");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, loading]);

  useEffect(() => {
    if (user?.id) {
      fetchUserActivity();
    }
  }, [user?.id]);

  const fetchUserActivity = async () => {
    setActivityLoading(true);
    try {
      const [postsRes, eventsRes, clubsRes] = await Promise.allSettled([
        api.getUserPosts?.(user!.id) || Promise.resolve([]),
        api.getUserEvents?.(user!.id) || Promise.resolve([]),
        api.getUserClubs?.(user!.id) || Promise.resolve([]),
      ]);

      setActivity({
        posts: postsRes.status === "fulfilled" ? postsRes.value : [],
        eventsAttended: eventsRes.status === "fulfilled" ? eventsRes.value : [],
        clubsJoined: clubsRes.status === "fulfilled" ? clubsRes.value : [],
      });
    } catch (error) {
      console.error("Failed to fetch user activity:", error);
    } finally {
      setActivityLoading(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!isAuthenticated || !user) return null;

  const collegeName = user.profile?.college?.name || "No Campus Selected";
  const username = user.email?.split("@")[0] || "user";
  const fullName = user.profile?.fullName || "Anonymous User";
  const avatarUrl = user.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`;

  // Data Selectors
  const activitiesData = activity?.eventsAttended?.map((item) => ({
    id: item.id,
    eventName: item.event.title,
    startDate: item.event.startsAt,
    status: "ATTENDED" as const,
    eventId: item.event.id,
  })) || [];

  const projectsData: any[] = []; // Mock
  const educationData = user.profile?.college ? [{
    id: "1",
    yearStart: "2023",
    yearEnd: "Present",
    degree: "Bachelor of Technology",
    field: "Computer Science",
    institution: user.profile.college.name,
    location: "",
  }] : [];
  const experienceData: any[] = []; // Mock
  const volunteeringData: any[] = []; // Mock

  const tabs = [
    { id: "activities", label: "Activities", icon: Calendar },
    { id: "projects", label: "Projects", icon: Star },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "volunteering", label: "Volunteering", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#121212] flex flex-col">
      {/* 
        INVERTED LAYOUT STRATEGY:
        1. Sticky Tabs at Top
        2. Content Area (Scrollable)
        3. Identity Card at Bottom (or after content)
      */}

      {/* STICKY HEADER & TABS */}
      <div className="sticky top-0 z-40 bg-paper dark:bg-[#1E1E1E] border-b-2 border-ink shadow-neo-sm">
        {/* Settings / Back Nav */}
        <div className="px-4 py-2 flex justify-between items-center border-b border-ink/10">
          <button onClick={() => router.back()} className="text-xs font-bold font-mono hover:text-primary">&larr; BACK</button>
          <Link href="/settings">
            <Settings className="w-5 h-5 text-neutral-500 hover:text-ink transition-colors" />
          </Link>
        </div>

        {/* Scrollable Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide p-2 bg-neutral-50 dark:bg-black/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProfileTabId)}
                className={`flex items-center gap-2 px-4 py-2 mx-1 rounded-full border-2 transition-all whitespace-nowrap ${isActive
                    ? "bg-primary border-ink text-black shadow-neo-sm transform -translate-y-0.5"
                    : "bg-white dark:bg-[#2D2D2D] border-transparent dark:border-white/10 text-neutral-500 hover:border-ink/20"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-bold font-display">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* SCROLLABLE MAIN CONTENT */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 space-y-6">

        {/* Content View */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "activities" && <ActivitiesTab activities={activitiesData} isLoading={activityLoading} />}
              {activeTab === "projects" && <ProjectsTab projects={projectsData} isOwnProfile={true} />}
              {activeTab === "experience" && <ExperienceTab experience={experienceData} isOwnProfile={true} />}
              {activeTab === "education" && <EducationTab education={educationData} isOwnProfile={true} />}
              {activeTab === "volunteering" && <VolunteeringTab volunteering={volunteeringData} isOwnProfile={true} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* IDENTITY CARD (AT BOTTOM) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-paper dark:bg-[#1E1E1E] border-2 border-ink rounded-xl shadow-neo p-6 relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 via-accent-coral/20 to-accent-blue/20" />

          <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-end mt-4">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full border-4 border-paper dark:border-[#1E1E1E] shadow-xl overflow-hidden bg-neutral-100 flex-shrink-0">
              <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1 min-w-0">
              <h1 className="font-display text-3xl font-black text-ink leading-none mb-1">{fullName}</h1>
              <p className="font-mono text-sm text-neutral-500 mb-3">@{username}</p>

              {user.profile?.bio && (
                <p className="text-neutral-700 dark:text-neutral-300 text-sm italic mb-4 max-w-md">"{user.profile.bio}"</p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold">
                <div className="flex items-center gap-1 px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg">
                  <MapPin className="w-3 h-3 text-accent-coral" />
                  <span>{collegeName}</span>
                </div>
                {/* Onboarding Details Stub */}
                <div className="flex items-center gap-1 px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg text-neutral-500">
                  <span>🎓 Student</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Link href="/profile/edit" className="w-full md:w-auto">
                <button className="w-full px-6 py-2 bg-ink text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-neo-sm">
                  Edit Profile
                </button>
              </Link>
              <div className="flex gap-2 justify-center">
                {user.profile?.githubUrl && (
                  <a href={user.profile.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-neutral-100 dark:bg-white/10 rounded-lg hover:bg-neutral-200 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                <button className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg hover:bg-accent-blue/20 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* GitHub Contributions Graph */}
          {user.profile?.githubUrl && (
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-white/10">
              <h4 className="font-bold text-xs uppercase text-neutral-400 mb-4">Contribution Graph</h4>
              <GitHubContributions username={user.profile.githubUrl.replace("https://github.com/", "").replace("/", "")} />
            </div>
          )}
        </motion.div>

        {/* Bottom Spacer */}
        <div className="h-24 md:h-12" />

      </main>
    </div>
  );
}

export default function ProfileClient() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
}
