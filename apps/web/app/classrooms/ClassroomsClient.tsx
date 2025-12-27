"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "../components/ui/Container";
import Navbar from "../components/Navbar";
import BottomNav from "../components/ui/BottomNav";
import { PageTransition } from "../providers/AnimationProvider";
import { FeedSkeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { api } from "../../lib/api";
import {
  BookOpen,
  Plus,
  Users,
  FileText,
  Calendar,
  BarChart2,
  ChevronRight,
  Copy,
  Check,
  GraduationCap,
} from "lucide-react";

interface Classroom {
  id: string;
  name: string;
  subject?: string;
  description?: string;
  code: string;
  bannerUrl?: string;
  teacherId: string;
  teacher: {
    id: string;
    profile?: {
      fullName: string;
      avatarUrl?: string;
    };
  };
  _count: {
    members: number;
    assignments: number;
  };
}

interface ClassroomAnalytics {
  studentCount: number;
  assignmentCount: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
  averageAttendance: number;
  attendanceDays: number;
}

export default function ClassroomsClient() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, ClassroomAnalytics>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const isTeacher = user?.role === "FACULTY";

  useEffect(() => {
    if (isAuthenticated) {
      fetchClassrooms();
    }
  }, [isAuthenticated]);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const data = await api.getClassrooms();
      setClassrooms(data);

      // Fetch analytics for teacher's classrooms
      if (isTeacher) {
        const analyticsData: Record<string, ClassroomAnalytics> = {};
        for (const classroom of data) {
          if (classroom.teacherId === user?.id) {
            try {
              const stats = await api.getClassroomAnalytics(classroom.id);
              analyticsData[classroom.id] = stats;
            } catch (e) {
              console.error(`Failed to fetch analytics for ${classroom.id}`);
            }
          }
        }
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch classrooms:", error);
      toast("Failed to load classrooms", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleJoinClassroom = async () => {
    if (!joinCode.trim()) {
      toast("Please enter a class code", "error");
      return;
    }

    setIsJoining(true);
    try {
      await api.joinClassroom(joinCode.trim().toUpperCase());
      toast("Successfully joined classroom!", "success");
      setShowJoinModal(false);
      setJoinCode("");
      fetchClassrooms();
    } catch (error: any) {
      toast(error.message || "Failed to join classroom", "error");
    } finally {
      setIsJoining(false);
    }
  };

  const teachingClassrooms = classrooms.filter(c => c.teacherId === user?.id);
  const enrolledClassrooms = classrooms.filter(c => c.teacherId !== user?.id);

  if (!isAuthenticated) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-paper dark:bg-dark-bg">
          <Navbar />
          <Container>
            <div className="pt-20 pb-24 text-center">
              <h1 className="font-display text-2xl mb-4">Please log in</h1>
              <button
                onClick={() => router.push("/login")}
                className="btn-neo btn-primary"
              >
                Go to Login
              </button>
            </div>
          </Container>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-dark-bg">
        <Navbar />

        <Container>
          <div className="pt-20 pb-24">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent-purple border-2 border-ink rounded-xl shadow-neo-sm">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-ink dark:text-dark-text tracking-tight">
                    Classrooms
                  </h1>
                  <p className="font-mono text-sm text-neutral-500 dark:text-dark-text-muted">
                    {isTeacher ? "Manage your classes" : "Your enrolled classes"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-4 py-2 border-2 border-ink rounded-xl font-bold hover:bg-neutral-100 transition-all"
                >
                  Join Class
                </button>
                {isTeacher && (
                  <Link
                    href="/classrooms/create"
                    className="btn-neo btn-primary flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Class</span>
                  </Link>
                )}
              </div>
            </div>

            {isLoading ? (
              <FeedSkeleton count={3} />
            ) : classrooms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-accent-purple/20 border-2 border-dashed border-accent-purple rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-accent-purple" />
                </div>
                <h3 className="font-display text-xl text-ink dark:text-dark-text mb-2">
                  No classrooms yet
                </h3>
                <p className="text-neutral-500 mb-6">
                  {isTeacher
                    ? "Create your first classroom to get started"
                    : "Join a classroom using a class code"}
                </p>
                {isTeacher ? (
                  <Link href="/classrooms/create" className="btn-neo btn-primary">
                    Create Classroom
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowJoinModal(true)}
                    className="btn-neo btn-primary"
                  >
                    Join Classroom
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Teaching Classrooms (for teachers) */}
                {isTeacher && teachingClassrooms.length > 0 && (
                  <div>
                    <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-accent-purple" />
                      Teaching
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <AnimatePresence mode="popLayout">
                        {teachingClassrooms.map((classroom, index) => (
                          <motion.div
                            key={classroom.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ClassroomCard
                              classroom={classroom}
                              analytics={analytics[classroom.id]}
                              isTeacher={true}
                              onCopyCode={copyCode}
                              copiedCode={copiedCode}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* Enrolled Classrooms */}
                {enrolledClassrooms.length > 0 && (
                  <div>
                    <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-accent-blue" />
                      Enrolled
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <AnimatePresence mode="popLayout">
                        {enrolledClassrooms.map((classroom, index) => (
                          <motion.div
                            key={classroom.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <ClassroomCard
                              classroom={classroom}
                              isTeacher={false}
                              onCopyCode={copyCode}
                              copiedCode={copiedCode}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>

        {/* Join Modal */}
        <AnimatePresence>
          {showJoinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowJoinModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl p-6 w-full max-w-md shadow-neo-lg"
              >
                <h3 className="font-display font-bold text-xl mb-4">
                  Join Classroom
                </h3>
                <p className="text-neutral-500 text-sm mb-4">
                  Enter the class code provided by your teacher
                </p>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter class code"
                  className="w-full px-4 py-3 border-2 border-ink rounded-xl text-center font-mono text-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={6}
                />
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowJoinModal(false)}
                    className="flex-1 px-4 py-2 border-2 border-ink rounded-xl font-bold hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleJoinClassroom}
                    disabled={isJoining || !joinCode.trim()}
                    className="flex-1 btn-neo btn-primary"
                  >
                    {isJoining ? "Joining..." : "Join"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <BottomNav />
      </div>
    </PageTransition>
  );
}

// Classroom Card Component
function ClassroomCard({
  classroom,
  analytics,
  isTeacher,
  onCopyCode,
  copiedCode,
}: {
  classroom: Classroom;
  analytics?: ClassroomAnalytics;
  isTeacher: boolean;
  onCopyCode: (code: string) => void;
  copiedCode: string | null;
}) {
  return (
    <Link
      href={`/classrooms/${classroom.id}`}
      className="block bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl shadow-neo overflow-hidden hover:shadow-neo-lg transition-shadow group"
    >
      {/* Banner */}
      <div
        className={`h-24 ${
          classroom.bannerUrl
            ? ""
            : "bg-gradient-to-br from-accent-purple to-accent-blue"
        }`}
        style={
          classroom.bannerUrl
            ? { backgroundImage: `url(${classroom.bannerUrl})`, backgroundSize: "cover" }
            : undefined
        }
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-lg group-hover:text-accent-purple transition-colors">
              {classroom.name}
            </h3>
            {classroom.subject && (
              <p className="text-sm text-neutral-500">{classroom.subject}</p>
            )}
          </div>

          {/* Class Code */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onCopyCode(classroom.code);
            }}
            className="flex items-center gap-1 px-2 py-1 bg-neutral-100 rounded-lg text-xs font-mono hover:bg-neutral-200 transition-colors"
          >
            {copiedCode === classroom.code ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {classroom.code}
          </button>
        </div>

        {/* Teacher Info (for students) */}
        {!isTeacher && classroom.teacher && (
          <p className="text-sm text-neutral-500 mb-3">
            {classroom.teacher.profile?.fullName || "Teacher"}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {classroom._count.members}
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {classroom._count.assignments}
          </span>
          {analytics && (
            <span className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              {analytics.averageAttendance}%
            </span>
          )}
        </div>

        {/* Analytics Summary (for teachers) */}
        {isTeacher && analytics && (
          <div className="mt-3 pt-3 border-t border-neutral-200 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-accent-purple">
                {analytics.pendingSubmissions}
              </p>
              <p className="text-xs text-neutral-500">Pending</p>
            </div>
            <div>
              <p className="text-lg font-bold text-accent-blue">
                {analytics.averageAttendance}%
              </p>
              <p className="text-xs text-neutral-500">Attendance</p>
            </div>
            <div>
              <p className="text-lg font-bold text-accent-mint">
                {analytics.studentCount}
              </p>
              <p className="text-xs text-neutral-500">Students</p>
            </div>
          </div>
        )}

        {/* Arrow */}
        <div className="flex justify-end mt-3">
          <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-accent-purple group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
