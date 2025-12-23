"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Container from "../components/ui/Container";
import DashboardNavbar from "../components/ui/DashboardNavbar";
import { NewspaperCard, Badge, Tape } from "../components/ui/NewspaperUI";
import { PageTransition } from "../providers/AnimationProvider";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../lib/animations";
import { calculateLevel, formatKarma, BADGES } from "../../lib/karma";
import { Trophy, Medal, Award, Crown, Zap, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

import { api } from "../../lib/api";

interface LeaderboardProfile {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string;
  points: number; // mapped to karma
  college?: { name: string };
  user?: { role: string };
}

function LeaderboardContent() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [leaders, setLeaders] = useState<LeaderboardProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "college">("all");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, authLoading]);

  useEffect(() => {
    fetchLeaderboard();
  }, [filter, user?.profile?.collegeId]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      // api.getLeaderboard currently doesn't support filtering by college in backend yet?
      // We added getLeaderboard(limit) in service.
      // For now, let's fetch global leaderboard. 
      // Todo: Add college filter to backend getLeaderboard.

      const data = await api.getLeaderboard();
      // data is Profile[]
      setLeaders(data || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="font-mono font-bold text-lg">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-400";
      case 2: return "bg-gradient-to-r from-gray-100 to-gray-50 border-gray-400";
      case 3: return "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-400";
      default: return "bg-white";
    }
  };

  if (authLoading) return <LoadingState />;
  if (!isAuthenticated) return null;

  const userRank = leaders.findIndex(l => l.id === user?.id) + 1;
  const userKarma = user?.profile?.karma || 0;
  const levelInfo = calculateLevel(userKarma);

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          <div className="max-w-4xl mx-auto mt-12 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="font-display text-4xl md:text-5xl font-black uppercase flex items-center justify-center gap-3">
                <Trophy className="w-10 h-10 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="font-mono text-gray-500 mt-2">Top contributors on campus</p>
            </motion.div>

            {/* Your Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Tape className="mb-2" />
              <NewspaperCard className="p-6 border-4 bg-accent-yellow/10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-3 border-black overflow-hidden bg-white">
                      <img
                        src={user?.profile?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile?.fullName}`}
                        alt="You"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl">{user?.profile?.fullName || "You"}</h3>
                      <p className="font-mono text-sm text-gray-500">{levelInfo.title}</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <TrendingUp className="w-5 h-5" />
                        {userRank > 0 ? `#${userRank}` : "-"}
                      </div>
                      <p className="text-xs font-mono text-gray-500">RANK</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <Award className="w-5 h-5" />
                        {formatKarma(userKarma)}
                      </div>
                      <p className="text-xs font-mono text-gray-500">KARMA</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                        <Zap className="w-5 h-5" />
                        {levelInfo.level}
                      </div>
                      <p className="text-xs font-mono text-gray-500">LEVEL</p>
                    </div>
                  </div>
                </div>

                {/* Progress to next level */}
                {levelInfo.nextLevel && (
                  <div className="mt-4 pt-4 border-t-2 border-dashed border-black/20">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Progress to Level {levelInfo.nextLevel.level}</span>
                      <span>{levelInfo.progress}%</span>
                    </div>
                    <div className="h-3 bg-white border-2 border-black overflow-hidden">
                      <motion.div
                        className="h-full bg-accent-blue"
                        initial={{ width: 0 }}
                        animate={{ width: `${levelInfo.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs font-mono text-gray-500 mt-1">
                      {levelInfo.nextLevel.minKarma - userKarma} karma to {levelInfo.nextLevel.title}
                    </p>
                  </div>
                )}
              </NewspaperCard>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-black transition-all ${filter === "all" ? "bg-black text-white" : "bg-white hover:bg-gray-50"
                  }`}
              >
                <Users className="w-4 h-4" />
                All Students
              </button>
              <button
                onClick={() => setFilter("college")}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm border-2 border-black transition-all ${filter === "college" ? "bg-black text-white" : "bg-white hover:bg-gray-50"
                  }`}
              >
                <Trophy className="w-4 h-4" />
                My College
              </button>
            </div>

            {/* Leaderboard List */}
            <NewspaperCard className="p-6 border-4">
              <h2 className="font-display text-2xl font-black mb-6 flex items-center gap-2">
                <Medal className="w-6 h-6" />
                TOP CONTRIBUTORS
              </h2>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
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
                  {leaders.map((leader, index) => {
                    const rank = index + 1;
                    const leaderLevel = calculateLevel(leader.points); // points instead of karma
                    const isCurrentUser = leader.userId === user?.id; // check userId

                    return (
                      <motion.div
                        key={leader.id}
                        variants={itemVariants}
                        className={`p-4 border-2 border-black ${getRankBg(rank)} ${isCurrentUser ? "ring-2 ring-accent-blue ring-offset-2" : ""
                          } hover:shadow-neo transition-shadow`}
                      >
                        <Link href={isCurrentUser ? "/profile" : `/users/${leader.userId}`} className="flex items-center gap-4">
                          <div className="w-10 flex justify-center">
                            {getRankIcon(rank)}
                          </div>

                          <div className="w-12 h-12 border-2 border-black overflow-hidden bg-white flex-shrink-0">
                            <img
                              src={leader.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.fullName}`}
                              alt={leader.fullName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold truncate">
                                {leader.fullName}
                                {isCurrentUser && <span className="text-accent-blue ml-1">(You)</span>}
                              </h3>
                              <Badge className="bg-accent-purple/20 text-xs">
                                LVL {leaderLevel.level}
                              </Badge>
                            </div>
                            <p className="text-xs font-mono text-gray-500 truncate">
                              {leaderLevel.title} • {leader.college?.name || "Unknown College"}
                            </p>
                          </div>

                          <div className="text-right">
                            <div className="font-display font-bold text-lg flex items-center gap-1">
                              <Award className="w-4 h-4 text-accent-purple" />
                              {formatKarma(leader.points)}
                            </div>
                            <p className="text-xs font-mono text-gray-500">karma</p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </NewspaperCard>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}

export default function LeaderboardPage() {
  return (
    <ErrorBoundary>
      <LeaderboardContent />
    </ErrorBoundary>
  );
}
