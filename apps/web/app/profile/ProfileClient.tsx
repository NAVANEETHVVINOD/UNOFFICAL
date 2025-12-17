"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import Link from "next/link";
import { Settings, Send, MapPin, Github } from "lucide-react";
import { api } from "../../lib/api";
import {
  ProfileTabs,
  ProfileTabId,
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

function ProfileContent() {
  const { user, isAuthenticated, logout, loading } = useAuth();
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

  if (loading) {
    return <LoadingState />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const collegeName = user.profile?.college?.name || "No Campus Selected";
  const username = user.email?.split("@")[0] || "user";

  // Transform activity data for tabs
  const activitiesData = activity?.eventsAttended?.map((item) => ({
    id: item.id,
    eventName: item.event.title,
    startDate: item.event.startsAt,
    status: "ATTENDED" as const,
    eventId: item.event.id,
  })) || [];

  // Mock data for other tabs (would come from API in real implementation)
  const projectsData: any[] = [];
  const educationData = user.profile?.college ? [{
    id: "1",
    yearStart: "2023",
    yearEnd: "Present",
    degree: "Bachelor of Technology",
    field: "Computer Science",
    institution: user.profile.college.name,
    location: user.profile.college.city || "",
  }] : [];
  const experienceData: any[] = [];
  const volunteeringData: any[] = [];

  return (
    <div className="min-h-screen bg-paper">
      {/* Header with back navigation */}
      <div className="sticky top-0 z-30 bg-paper border-b border-ink/10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="font-bold text-sm hover:text-primary transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Send className="w-5 h-5" />
            </button>
            <Link href="/settings">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-6 pb-4"
        >
          {/* Avatar and Username */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-ink overflow-hidden bg-neutral-100">
                <img
                  src={
                    user.profile?.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.profile?.fullName || "User"}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 bg-ink text-white text-sm font-mono rounded-full">
                  @{username}
                </span>
              </div>
            </div>
          </div>

          {/* Name and Info */}
          <div className="mt-4">
            <h1 className="font-display text-2xl font-bold text-ink uppercase">
              {user.profile?.fullName || "Anonymous User"}
            </h1>
            <div className="flex items-center gap-1 text-neutral-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{collegeName}</span>
            </div>
          </div>

          {/* Bio */}
          {user.profile?.bio && (
            <p className="mt-4 text-neutral-700 leading-relaxed">
              {user.profile.bio}
            </p>
          )}

          {/* Edit Profile Button */}
          <Link href="/profile/edit" className="block mt-6">
            <button className="w-full py-3 border-2 border-ink rounded-full font-bold text-ink hover:bg-ink hover:text-white transition-colors">
              Edit Profile
            </button>
          </Link>

          {/* Interests */}
          {user.profile?.tags && user.profile.tags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide">
                {user.profile.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-paper-light border border-ink/10 rounded-full text-sm font-medium whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          {user.profile?.githubUrl && (
            <div className="mt-4 flex items-center gap-2">
              <Github className="w-5 h-5" />
              <a
                href={user.profile.githubUrl.startsWith("http") ? user.profile.githubUrl : `https://github.com/${user.profile.githubUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-600 hover:text-ink"
              >
                {user.profile.githubUrl.replace("https://github.com/", "")}
              </a>
            </div>
          )}

          {/* Vouched By (placeholder) */}
          <div className="mt-4 text-sm text-neutral-500">
            <span className="font-bold text-ink">VOUCHED BY</span>{" "}
            <span className="font-bold">2 MAKERS</span>
          </div>
        </motion.div>

        {/* GitHub Contributions */}
        {user.profile?.githubUrl && (
          <GitHubContributions
            username={user.profile.githubUrl.replace("https://github.com/", "")}
          />
        )}
      </div>

      {/* Tab Navigation */}
      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="max-w-2xl mx-auto">
        {activeTab === "activities" && (
          <ActivitiesTab activities={activitiesData} isLoading={activityLoading} />
        )}
        {activeTab === "projects" && (
          <ProjectsTab projects={projectsData} isOwnProfile={true} />
        )}
        {activeTab === "experience" && (
          <ExperienceTab experience={experienceData} isOwnProfile={true} />
        )}
        {activeTab === "education" && (
          <EducationTab education={educationData} isOwnProfile={true} />
        )}
        {activeTab === "volunteering" && (
          <VolunteeringTab volunteering={volunteeringData} isOwnProfile={true} />
        )}
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 md:h-8" />
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
