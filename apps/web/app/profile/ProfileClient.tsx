"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import Link from "next/link";
import { Settings, Send, MapPin, Github, Briefcase, GraduationCap, Heart, Star, Calendar, ArrowLeft } from "lucide-react";
import { api } from "../../lib/api";
import {
  ActivitiesTab,
  ProjectsTab,
  EducationTab,
  ExperienceTab,
  VolunteeringTab,
  GitHubContributions,
} from "../components/profile";
import ProfileSectionModal from "../components/profile/ProfileSectionModal";
import FollowButton from "../components/ui/FollowButton";

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

  const [profile, setProfile] = useState<any>(user?.profile || null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"education" | "experience" | "project" | "volunteering">("education");

  const openModal = (type: "education" | "experience" | "project" | "volunteering") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleAddItem = async (type: string, data: any) => {
    try {
      if (type === "education") await api.addProfileEducation(data);
      else if (type === "experience") await api.addProfileExperience(data);
      else if (type === "project") await api.addProfileProject(data);
      else if (type === "volunteering") await api.addProfileVolunteering(data);

      await fetchFullProfile();
    } catch (error) {
      console.error("Failed to add profile item:", error);
      alert("Failed to add " + type);
    }
  };

  const handleRemoveItem = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    try {
      if (type === "education") await api.removeProfileEducation(id);
      else if (type === "experience") await api.removeProfileExperience(id);
      else if (type === "project") await api.removeProfileProject(id);
      else if (type === "volunteering") await api.removeProfileVolunteering(id);

      await fetchFullProfile();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserActivity();
      fetchFullProfile();
    }
  }, [user?.id]);

  const fetchFullProfile = async () => {
    setProfileLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

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

  // Fallbacks using possibly incomplete user.profile or fetched profile
  const displayProfile = profile || user.profile;
  const collegeName = displayProfile?.college?.name || "No Campus Selected";
  const username = user.email?.split("@")[0] || "user";
  const fullName = displayProfile?.fullName || "Anonymous User";
  const avatarUrl = displayProfile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`;

  // Data
  const activitiesData = activity?.eventsAttended?.map((item) => ({
    id: item.id,
    eventName: item.event.title,
    startDate: item.event.startsAt,
    status: "ATTENDED" as const,
    eventId: item.event.id,
  })) || [];

  const projectsData = displayProfile?.projects || [];
  const educationData = displayProfile?.education || [];
  const experienceData = displayProfile?.experience || [];
  const volunteeringData = displayProfile?.volunteering || [];

  const tabs = [
    { id: "activities", label: "Activities", icon: Calendar },
    { id: "projects", label: "Projects", icon: Star },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "volunteering", label: "Volunteering", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-[#121212] flex flex-col pt-16 md:pt-20">
      <div className="max-w-3xl mx-auto w-full px-4 mb-4">
        <div className="flex justify-between items-center py-2">
          <button onClick={() => router.back()} className="text-sm font-bold font-mono hover:text-primary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> BACK
          </button>
          <Link href="/settings">
            <Settings className="w-5 h-5 text-neutral-500 hover:text-ink transition-colors" />
          </Link>
        </div>
      </div>

      {/* 1. PROFILE HEADER (Identity Card) - Now at Top */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto w-full px-4 mb-6"
      >
        <div className="bg-paper dark:bg-[#1E1E1E] border-2 border-ink rounded-xl shadow-neo p-6 relative overflow-hidden">
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
                <div className="flex items-center gap-1 px-3 py-1 bg-neutral-100 dark:bg-white/10 rounded-lg text-neutral-500">
                  <span>🎓 Student</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 w-full md:w-auto min-w-[140px]">
              {user.id === profile?.userId ? (
                <Link href="/profile/edit" className="w-full">
                  <button className="w-full px-6 py-2 bg-ink text-white font-bold rounded-lg hover:bg-neutral-800 transition-colors shadow-neo-sm text-sm">
                    Edit Profile
                  </button>
                </Link>
              ) : (
                <FollowButton userId={profile?.userId} className="w-full justify-center" />
              )}

              <div className="flex gap-2 justify-center">
                {user.profile?.githubUrl && (
                  <a href={user.profile.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-neutral-100 dark:bg-white/10 rounded-lg hover:bg-neutral-200 transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. STICKY TABS ("Nav Box") - Scrollable */}
      <div className="sticky top-16 md:top-20 z-40 bg-neutral-100/95 dark:bg-[#121212]/95 backdrop-blur-sm border-b border-ink/10 mb-6">
        <div className="max-w-3xl mx-auto w-full px-4 py-2">
          <div className="flex overflow-x-auto scrollbar-hide gap-2 pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTabId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap flex-shrink-0 ${isActive
                    ? "bg-primary border-ink text-black shadow-neo-sm"
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
      </div>

      {/* 3. SCROLLABLE MAIN CONTENT with Swipe */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pb-20 overflow-hidden">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            const swipeThreshold = 50;
            if (info.offset.x < -swipeThreshold) {
              // Swipe Left (Next Tab)
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id as ProfileTabId);
            } else if (info.offset.x > swipeThreshold) {
              // Swipe Right (Prev Tab)
              const currentIndex = tabs.findIndex(t => t.id === activeTab);
              if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id as ProfileTabId);
            }
          }}
          className="min-h-[300px] touch-pan-y"
        >
          {activeTab === "activities" && <ActivitiesTab activities={activitiesData} isLoading={activityLoading} />}
          {activeTab === "projects" && (
            <ProjectsTab
              projects={projectsData}
              isOwnProfile={true}
              onAddProject={() => openModal("project")}
              onRemoveProject={(id) => handleRemoveItem("project", id)}
            />
          )}
          {activeTab === "experience" && (
            <ExperienceTab
              experience={experienceData}
              isOwnProfile={true}
              onAddExperience={() => openModal("experience")}
              onRemoveExperience={(id) => handleRemoveItem("experience", id)}
            />
          )}
          {activeTab === "education" && (
            <EducationTab
              education={educationData}
              isOwnProfile={true}
              onAddEducation={() => openModal("education")}
              onRemoveEducation={(id) => handleRemoveItem("education", id)}
            />
          )}
          {activeTab === "volunteering" && (
            <VolunteeringTab
              volunteering={volunteeringData}
              isOwnProfile={true}
              onAddVolunteering={() => openModal("volunteering")}
              onRemoveVolunteering={(id) => handleRemoveItem("volunteering", id)}
            />
          )}
        </motion.div>

        {/* GitHub Graph at bottom of content if exists */}
        {user.profile?.githubUrl && (
          <div className="mt-12 pt-8 border-t border-ink/10">
            <h4 className="font-bold text-xs uppercase text-neutral-400 mb-4 text-center">Contribution Graph</h4>
            <div className="bg-paper p-4 rounded-xl border border-ink/10 overflow-x-auto">
              <GitHubContributions username={user.profile.githubUrl.replace("https://github.com/", "").replace("/", "")} />
            </div>
          </div>
        )}
      </main>

      <ProfileSectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddItem}
        type={modalType}
      />
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
