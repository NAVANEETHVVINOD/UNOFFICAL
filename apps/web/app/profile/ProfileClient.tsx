"use client";

import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Staple,
  Tape,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import { PageTransition } from "../providers/AnimationProvider";
import DashboardNavbar from "../components/ui/DashboardNavbar";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import Link from "next/link";
import { Github, Instagram, Linkedin, MessageCircle, ExternalLink, Calendar, Users, FileText, Trophy, Award, Zap, TrendingUp } from "lucide-react";
import { api } from "../../lib/api";
import { containerVariants, itemVariants } from "../../lib/animations";
import { calculateLevel, getEarnedBadges, formatKarma, BADGES } from "../../lib/karma";

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
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "clubs">("posts");

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
      // Fetch user's posts, events, and clubs
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

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          <div className="max-w-4xl mx-auto mt-12 space-y-8">
            {/* Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 rotate-2 z-10" />
              <NewspaperCard className="p-8 md:p-12 bg-white border-4 border-black relative overflow-hidden">
                <Doodle
                  src="/doodles/sparkle.svg"
                  className="absolute -top-8 -right-8 w-32 h-32 opacity-10 animate-spin-slow"
                />

                {/* ID Card Header */}
                <div className="flex justify-between items-start mb-8 border-b-2 border-black pb-4">
                  <div>
                    <h1 className="font-display text-4xl md:text-5xl font-black uppercase">
                      Student ID
                    </h1>
                    <p className="font-mono text-sm text-gray-500">
                      LINKER_OS // VERIFIED_USER
                    </p>
                  </div>
                  <Badge className="bg-green-400 text-black border-black">
                    ACTIVE
                  </Badge>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* Avatar Section */}
                  <div className="shrink-0 flex flex-col items-center gap-4">
                    <div className="w-48 h-48 bg-gray-100 border-4 border-black overflow-hidden relative">
                      <img
                        src={
                          user.profile?.avatarUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.profile?.fullName || "User"}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-black text-white text-center text-[10px] py-1 font-mono">
                        IMG_REF_{user?.id?.substring(0, 4).toUpperCase()}
                      </div>
                    </div>
                    <Badge className="bg-accent-blue text-white border-black uppercase">
                      {user.role}
                    </Badge>
                    
                    {/* Karma & Level Display */}
                    {(() => {
                      const karma = user.profile?.karma || 0;
                      const levelInfo = calculateLevel(karma);
                      return (
                        <div className="mt-3 space-y-2 w-full">
                          <div className="flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold">LVL {levelInfo.level}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4 text-purple-500" />
                              <span className="font-bold">{formatKarma(karma)} REP</span>
                            </div>
                          </div>
                          <p className="text-xs font-mono text-gray-500 text-center">{levelInfo.title}</p>
                          {levelInfo.nextLevel && (
                            <div className="w-full">
                              <div className="h-2 bg-gray-200 border border-black/20 overflow-hidden">
                                <div 
                                  className="h-full bg-accent-blue transition-all"
                                  style={{ width: `${levelInfo.progress}%` }}
                                />
                              </div>
                              <p className="text-[10px] font-mono text-gray-400 text-center mt-1">
                                {levelInfo.nextLevel.minKarma - karma} to {levelInfo.nextLevel.title}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 w-full space-y-6">
                    <div>
                      <label className="font-bold text-xs uppercase text-gray-500 block mb-1">
                        Full Name
                      </label>
                      <p className="font-serif text-3xl italic border-b-2 border-gray-200 pb-2">
                        {user.profile?.fullName || "Unknown Student"}
                      </p>
                    </div>

                    <div>
                      <label className="font-bold text-xs uppercase text-gray-500 block mb-1">
                        Email Address
                      </label>
                      <p className="font-mono text-lg border-b-2 border-gray-200 pb-2">
                        {user.email}
                      </p>
                    </div>

                    {user.profile?.bio && (
                      <div>
                        <label className="font-bold text-xs uppercase text-gray-500 block mb-1">
                          Bio
                        </label>
                        <p className="text-lg leading-relaxed border-b-2 border-gray-200 pb-2">
                          {user.profile.bio}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-xs uppercase text-gray-500 block mb-1">
                          College ID
                        </label>
                        <p className="font-mono text-lg border-b-2 border-gray-200 pb-2">
                          {user.profile?.collegeId || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="font-bold text-xs uppercase text-gray-500 block mb-1">
                          User ID
                        </label>
                        <p className="font-mono text-sm border-b-2 border-gray-200 pb-2">
                          {user.id.substring(0, 12)}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-xs font-mono text-gray-400">
                    MEMBER_SINCE_{new Date().getFullYear()}
                  </div>
                  <div className="flex gap-3">
                    <Link href="/profile/edit">
                      <RetroButton className="bg-accent-blue text-white border-black">
                        EDIT PROFILE
                      </RetroButton>
                    </Link>
                    <RetroButton
                      onClick={logout}
                      className="bg-red-600 hover:bg-red-700 text-white border-black"
                    >
                      LOGOUT
                    </RetroButton>
                  </div>
                </div>
              </NewspaperCard>
            </motion.div>

            {/* Interests & Social Links */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Interests */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Staple className="mb-2" />
                <NewspaperCard className="p-6 border-4 bg-accent-yellow/10">
                  <h3 className="font-display text-2xl font-black mb-4 flex items-center gap-2">
                    <span>⭐</span> INTERESTS
                  </h3>
                  {user.profile?.tags && user.profile.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.profile.tags.map((tag, i) => (
                        <Badge key={i} className="bg-white border-black">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 font-mono text-sm">
                      No interests added yet.
                    </p>
                  )}
                </NewspaperCard>
              </motion.div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Staple className="mb-2" />
                <NewspaperCard className="p-6 border-4 bg-accent-pink/10">
                  <h3 className="font-display text-2xl font-black mb-4 flex items-center gap-2">
                    <span>🔗</span> SOCIALS
                  </h3>
                  <div className="space-y-3">
                    {user.profile?.githubUrl && (
                      <a
                        href={user.profile.githubUrl.startsWith('http') ? user.profile.githubUrl : `https://github.com/${user.profile.githubUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
                      >
                        <Github className="w-5 h-5" />
                        <span className="font-bold">GitHub</span>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {user.profile?.instagram && (
                      <a
                        href={user.profile.instagram.startsWith('http') ? user.profile.instagram : `https://instagram.com/${user.profile.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
                      >
                        <Instagram className="w-5 h-5 text-pink-500" />
                        <span className="font-bold">Instagram</span>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {user.profile?.linkedin && (
                      <a
                        href={user.profile.linkedin.startsWith('http') ? user.profile.linkedin : `https://linkedin.com/in/${user.profile.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
                      >
                        <Linkedin className="w-5 h-5 text-blue-600" />
                        <span className="font-bold">LinkedIn</span>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {(user.profile?.socials as any)?.discord && (
                      <a
                        href={(user.profile?.socials as any).discord.startsWith('http') ? (user.profile?.socials as any).discord : `https://discord.gg/${(user.profile?.socials as any).discord}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
                      >
                        <MessageCircle className="w-5 h-5 text-indigo-500" />
                        <span className="font-bold">Discord</span>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {(user.profile?.socials as any)?.whatsapp && (
                      <a
                        href={`https://wa.me/${(user.profile?.socials as any).whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow group"
                      >
                        <MessageCircle className="w-5 h-5 text-green-500" />
                        <span className="font-bold">WhatsApp</span>
                        <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                    {!user.profile?.githubUrl && !user.profile?.instagram && !user.profile?.linkedin && !(user.profile?.socials as any)?.discord && !(user.profile?.socials as any)?.whatsapp && (
                      <p className="text-gray-500 font-mono text-sm">
                        No social links added yet.
                      </p>
                    )}
                  </div>
                </NewspaperCard>
              </motion.div>
            </div>

            {/* Badges Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Staple className="mb-2" />
              <NewspaperCard className="p-6 border-4 bg-accent-purple/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-2xl font-black flex items-center gap-2">
                    <Award className="w-6 h-6" /> BADGES
                  </h3>
                  <Link href="/leaderboard" className="text-sm font-bold text-accent-blue hover:underline flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    View Leaderboard
                  </Link>
                </div>
                {(() => {
                  const karma = user.profile?.karma || 0;
                  const earnedBadges = getEarnedBadges(karma, {
                    posts: activity?.posts?.length || 0,
                    clubs: activity?.clubsJoined?.length || 0,
                    events: activity?.eventsAttended?.length || 0,
                  });
                  const lockedBadges = BADGES.filter(b => !earnedBadges.find(e => e.id === b.id));
                  
                  return (
                    <div className="space-y-4">
                      {/* Earned Badges */}
                      {earnedBadges.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                          {earnedBadges.map((badge) => (
                            <div
                              key={badge.id}
                              className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-black shadow-neo"
                              title={badge.description}
                            >
                              <span className="text-xl">{badge.icon}</span>
                              <span className="font-bold text-sm">{badge.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 font-mono text-sm">
                          No badges earned yet. Keep engaging to unlock badges!
                        </p>
                      )}
                      
                      {/* Locked Badges Preview */}
                      {lockedBadges.length > 0 && (
                        <div className="pt-4 border-t border-dashed border-gray-300">
                          <p className="text-xs font-mono text-gray-500 mb-2">LOCKED ({lockedBadges.length} remaining)</p>
                          <div className="flex flex-wrap gap-2">
                            {lockedBadges.slice(0, 4).map((badge) => (
                              <div
                                key={badge.id}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-2 border-gray-300 opacity-50"
                                title={badge.description}
                              >
                                <span className="text-lg grayscale">🔒</span>
                                <span className="font-bold text-xs text-gray-500">{badge.name}</span>
                              </div>
                            ))}
                            {lockedBadges.length > 4 && (
                              <span className="text-xs font-mono text-gray-400 self-center">
                                +{lockedBadges.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </NewspaperCard>
            </motion.div>

            {/* User Activity Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Staple className="mb-2" />
              <NewspaperCard className="p-6 border-4 bg-white">
                <h3 className="font-display text-2xl font-black mb-6 flex items-center gap-2">
                  <Trophy className="w-6 h-6" /> ACTIVITY
                </h3>

                {/* Activity Tabs */}
                <div className="flex gap-2 mb-6 border-b-2 border-black pb-4">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className={`flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-black transition-all ${
                      activeTab === "posts"
                        ? "bg-accent-yellow shadow-neo"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Posts ({activity?.posts?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("events")}
                    className={`flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-black transition-all ${
                      activeTab === "events"
                        ? "bg-accent-blue text-white shadow-neo"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    Events ({activity?.eventsAttended?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab("clubs")}
                    className={`flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-black transition-all ${
                      activeTab === "clubs"
                        ? "bg-accent-pink text-white shadow-neo"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Clubs ({activity?.clubsJoined?.length || 0})
                  </button>
                </div>

                {/* Activity Content */}
                {activityLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-100 animate-pulse border-2 border-gray-200" />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-3"
                  >
                    {activeTab === "posts" && (
                      <>
                        {activity?.posts && activity.posts.length > 0 ? (
                          activity.posts.slice(0, 5).map((post) => (
                            <motion.div
                              key={post.id}
                              variants={itemVariants}
                              className="p-4 border-2 border-black bg-gray-50 hover:shadow-neo transition-shadow"
                            >
                              <Link href={`/posts/${post.id}`}>
                                <p className="line-clamp-2 text-sm">{post.content}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-mono">
                                  <span>{post._count?.likes || 0} likes</span>
                                  <span>{post._count?.comments || 0} comments</span>
                                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                              </Link>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-gray-500 font-mono text-sm text-center py-8">
                            No posts yet. Start sharing!
                          </p>
                        )}
                      </>
                    )}

                    {activeTab === "events" && (
                      <>
                        {activity?.eventsAttended && activity.eventsAttended.length > 0 ? (
                          activity.eventsAttended.slice(0, 5).map((item) => (
                            <motion.div
                              key={item.id}
                              variants={itemVariants}
                              className="p-4 border-2 border-black bg-gray-50 hover:shadow-neo transition-shadow"
                            >
                              <Link href={`/events/${item.event.id}`}>
                                <p className="font-bold">{item.event.title}</p>
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                  {new Date(item.event.startsAt).toLocaleDateString()}
                                </p>
                              </Link>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-gray-500 font-mono text-sm text-center py-8">
                            No events attended yet. Check out upcoming events!
                          </p>
                        )}
                      </>
                    )}

                    {activeTab === "clubs" && (
                      <>
                        {activity?.clubsJoined && activity.clubsJoined.length > 0 ? (
                          activity.clubsJoined.slice(0, 5).map((item) => (
                            <motion.div
                              key={item.id}
                              variants={itemVariants}
                              className="p-4 border-2 border-black bg-gray-50 hover:shadow-neo transition-shadow flex items-center gap-3"
                            >
                              <Link href={`/clubs/${item.club.id}`} className="flex items-center gap-3 flex-1">
                                {item.club.logoUrl ? (
                                  <img
                                    src={item.club.logoUrl}
                                    alt={item.club.name}
                                    className="w-10 h-10 border-2 border-black object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 border-2 border-black bg-accent-yellow flex items-center justify-center font-bold">
                                    {item.club.name.charAt(0)}
                                  </div>
                                )}
                                <span className="font-bold">{item.club.name}</span>
                              </Link>
                            </motion.div>
                          ))
                        ) : (
                          <p className="text-gray-500 font-mono text-sm text-center py-8">
                            No clubs joined yet. Explore clubs on campus!
                          </p>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </NewspaperCard>
            </motion.div>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}

export default function ProfileClient() {
  return (
    <ErrorBoundary>
      <ProfileContent />
    </ErrorBoundary>
  );
}
