"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";
import Container from "../../components/ui/Container";
import { 
  User, MapPin, Calendar, Link as LinkIcon, Github, Instagram, Linkedin,
  MessageCircle, UserPlus, UserCheck, QrCode, Share2, ArrowLeft,
  Briefcase, GraduationCap, Heart, Users, FileText, ShoppingBag
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  profile?: {
    fullName: string;
    bio?: string;
    avatarUrl?: string;
    githubUrl?: string;
    instagram?: string;
    linkedin?: string;
    interests?: string[];
    college?: {
      id: string;
      name: string;
    };
    level?: number;
    karma?: number;
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ posts: 0, clubs: 0, events: 0 });

  const userId = params.id as string;
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    if (isOwnProfile) {
      router.replace("/profile");
      return;
    }

    fetchUserProfile();
  }, [userId, isOwnProfile]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      
      // Fetch user profile
      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        if (res.status === 404) {
          setError("User not found");
        } else {
          setError("Failed to load profile");
        }
        return;
      }

      const data = await res.json();
      setProfile(data);

      // Fetch user stats
      const [postsRes, clubsRes, eventsRes] = await Promise.allSettled([
        fetch(`${API_URL}/users/${userId}/posts`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/users/${userId}/clubs`).then(r => r.ok ? r.json() : []),
        fetch(`${API_URL}/users/${userId}/events`).then(r => r.ok ? r.json() : []),
      ]);

      setStats({
        posts: postsRes.status === "fulfilled" ? postsRes.value.length : 0,
        clubs: clubsRes.status === "fulfilled" ? clubsRes.value.length : 0,
        events: eventsRes.status === "fulfilled" ? eventsRes.value.length : 0,
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    // TODO: Implement connection/follow functionality
    setIsConnected(!isConnected);
  };

  const handleMessage = () => {
    router.push(`/messages?user=${userId}`);
  };

  const handleShare = async () => {
    const profileUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.profile?.fullName}'s Profile`,
          url: profileUrl,
        });
      } catch (err) {
        navigator.clipboard.writeText(profileUrl);
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <Container>
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-ink border-t-transparent rounded-full" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-paper">
        <Navbar />
        <Container>
          <div className="py-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
            <h2 className="font-display text-2xl font-bold mb-2">{error || "User not found"}</h2>
            <p className="text-neutral-500 mb-6">This profile doesn't exist or has been removed.</p>
            <Link href="/dashboard">
              <button className="px-6 py-3 bg-primary border-2 border-ink font-bold shadow-neo hover:shadow-neo-lg transition-all">
                Go to Dashboard
              </button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #FFEB3B 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <Navbar />

      <Container>
        <div className="py-6 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-600 hover:text-ink mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          {/* Profile Card */}
          <motion.div
            className="bg-white border-2 border-ink shadow-neo rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Cover/Header */}
            <div className="h-32 bg-gradient-to-r from-primary via-accent-coral to-accent-blue relative">
              <div className="absolute inset-0 bg-halftone opacity-20" />
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 rounded-2xl border-4 border-white bg-neutral-100 overflow-hidden shadow-neo">
                  {profile.profile?.avatarUrl ? (
                    <img
                      src={profile.profile.avatarUrl}
                      alt={profile.profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20">
                      <User className="w-16 h-16 text-ink/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-display text-3xl font-black">
                    {profile.profile?.fullName || "Unknown User"}
                  </h1>
                  {profile.profile?.college && (
                    <div className="flex items-center gap-2 text-neutral-600 mt-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{profile.profile.college.name}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleConnect}
                    className={`flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-ink shadow-neo-sm transition-all ${
                      isConnected
                        ? "bg-neutral-100 text-ink"
                        : "bg-primary text-ink hover:bg-primary-600"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isConnected ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </motion.button>
                  <motion.button
                    onClick={handleMessage}
                    className="flex items-center gap-2 px-4 py-2 bg-white font-bold text-sm border-2 border-ink shadow-neo-sm hover:bg-neutral-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="p-2 bg-white border-2 border-ink shadow-neo-sm hover:bg-neutral-50 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Bio */}
              {profile.profile?.bio && (
                <p className="text-neutral-700 mb-6 max-w-2xl">
                  {profile.profile.bio}
                </p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="font-display text-2xl font-black">{stats.posts}</div>
                  <div className="text-sm text-neutral-500">Posts</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="font-display text-2xl font-black">{stats.clubs}</div>
                  <div className="text-sm text-neutral-500">Clubs</div>
                </div>
                <div className="text-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="font-display text-2xl font-black">{stats.events}</div>
                  <div className="text-sm text-neutral-500">Events</div>
                </div>
              </div>

              {/* Interests */}
              {profile.profile?.interests && profile.profile.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-500 mb-3">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.profile.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary/20 text-ink text-sm font-medium rounded-full border border-primary/30"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-3">
                {profile.profile?.githubUrl && (
                  <a
                    href={profile.profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile.profile?.instagram && (
                  <a
                    href={profile.profile.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {profile.profile?.linkedin && (
                  <a
                    href={profile.profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}