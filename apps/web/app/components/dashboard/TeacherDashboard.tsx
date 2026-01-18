"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../../lib/api";
import Link from "next/link";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  BookOpen,
  UserCheck,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import ProfileSidebar from "./ProfileSidebar";
import UpcomingEventsWidget from "./UpcomingEventsWidget";
import { FeedSkeleton } from "../ui/Skeleton";

/**
 * TeacherDashboard Component
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 * 
 * A classroom-focused dashboard for teachers that displays:
 * - My Classrooms (with name, student count, recent activity)
 * - Upcoming Verified Events (events that require teacher verification)
 * - Attendance Requests (pending attendance verification requests)
 * 
 * Provides quick access to classroom management and attendance verification
 */

// Types
interface Classroom {
  id: string;
  name: string;
  description: string | null;
  studentCount: number;
  recentActivity: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VerifiedEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  venue: string | null;
  requiresVerification: boolean;
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
}

interface AttendanceRequest {
  id: string;
  studentName: string;
  eventTitle: string;
  requestedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

export default function TeacherDashboard() {
  const { user, loading: authLoading } = useAuth();

  // State
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [verifiedEvents, setVerifiedEvents] = useState<VerifiedEvent[]>([]);
  const [attendanceRequests, setAttendanceRequests] = useState<AttendanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher data
  useEffect(() => {
    if (!user) return;

    const fetchTeacherData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API calls when classroom endpoints are available
        // For now, using placeholder data structure
        
        // Fetch classrooms
        // const classroomsData = await api.getClassrooms();
        // setClassrooms(classroomsData || []);
        setClassrooms([]);

        // Fetch verified events
        // const eventsData = await api.getVerifiedEvents();
        // setVerifiedEvents(eventsData || []);
        setVerifiedEvents([]);

        // Fetch attendance requests
        // const requestsData = await api.getAttendanceRequests();
        // setAttendanceRequests(requestsData || []);
        setAttendanceRequests([]);
      } catch (error) {
        console.error("Failed to fetch teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user]);

  // Loading state
  if (authLoading || loading) {
    return (
      <DashboardLayout
        leftSidebarContent={<ProfileSidebar />}
        rightSidebarContent={<UpcomingEventsWidget />}
      >
        <FeedSkeleton count={3} />
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout
      leftSidebarContent={<ProfileSidebar />}
      rightSidebarContent={<UpcomingEventsWidget />}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="font-display text-3xl md:text-4xl font-black mb-2 dark:text-dark-text">
            Teacher Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-dark-text-muted font-mono text-sm">
            Manage classrooms and verify attendance
          </p>
        </motion.div>

        {/* My Classrooms Section - Requirement 7.1, 7.2, 7.3 */}
        {classrooms.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold dark:text-dark-text flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                My Classrooms
              </h2>
              <Link 
                href="/classrooms" 
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classrooms.map((classroom) => (
                <ClassroomCard key={classroom.id} classroom={classroom} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Upcoming Verified Events Section - Requirement 7.4 */}
        {verifiedEvents.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold dark:text-dark-text flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent-mint" />
                Upcoming Verified Events
              </h2>
              <Link 
                href="/events?verified=true" 
                className="text-sm font-medium text-accent-mint hover:underline flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verifiedEvents.map((event) => (
                <VerifiedEventCard key={event.id} event={event} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Attendance Requests Section - Requirement 7.5 */}
        {attendanceRequests.length > 0 && (
          <motion.section variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold dark:text-dark-text flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-accent-coral" />
                Attendance Requests
              </h2>
              <Link 
                href="/attendance/requests" 
                className="text-sm font-medium text-accent-coral hover:underline flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {attendanceRequests.map((request) => (
                <AttendanceRequestCard key={request.id} request={request} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Empty State - When no classrooms are available */}
        {classrooms.length === 0 && 
         verifiedEvents.length === 0 && 
         attendanceRequests.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center py-20 bg-paper dark:bg-dark-surface border-2 border-dashed border-ink/20 dark:border-dark-border rounded-card-lg"
          >
            {/* Classroom/chalkboard doodle illustration */}
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <img
                src="/doodles/book.svg"
                alt="Classroom illustration"
                className="w-full h-full object-contain opacity-60 dark:opacity-40"
              />
            </div>
            <h3 className="font-display text-2xl font-black text-ink dark:text-dark-text mb-3">
              No classrooms created yet
            </h3>
            <p className="text-neutral-500 dark:text-dark-text-muted mb-8 max-w-md mx-auto font-mono text-sm">
              Create your first classroom to start managing students and verifying attendance
            </p>
            <Link href="/classrooms/create">
              <button className="btn-neo btn-primary px-8 py-3 text-base font-bold">
                Create Classroom
              </button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}

/**
 * ClassroomCard Component
 * 
 * Requirements: 7.3
 * 
 * Displays classroom information:
 * - Classroom name
 * - Student count
 * - Recent activity
 */
function ClassroomCard({ classroom }: { classroom: Classroom }) {
  const activityDate = classroom.recentActivity 
    ? new Date(classroom.recentActivity).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    : 'No recent activity';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark-lg transition-all group cursor-pointer overflow-hidden rounded-card-lg"
    >
      <Link href={`/classrooms/${classroom.id}`}>
        {/* Classroom Header */}
        <div className="h-24 bg-gradient-to-br from-primary/20 to-accent-blue/20 dark:from-primary/10 dark:to-accent-blue/10 relative overflow-hidden flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-primary/40 dark:text-primary/20" />
        </div>

        {/* Classroom Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-display text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary dark:text-dark-text dark:group-hover:text-primary transition-colors">
            {classroom.name}
          </h3>

          {/* Description */}
          {classroom.description && (
            <p className="text-xs text-neutral-600 dark:text-dark-text-muted mb-3 line-clamp-2">
              {classroom.description}
            </p>
          )}

          {/* Stats */}
          <div className="space-y-2 mb-3 pb-3 border-b border-ink/10 dark:border-dark-border">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{classroom.studentCount} students</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Last activity: {activityDate}</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/classrooms/${classroom.id}`;
            }}
            className="w-full btn-neo btn-primary text-xs py-2"
          >
            Manage Classroom
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * VerifiedEventCard Component
 * 
 * Requirements: 7.4
 * 
 * Displays events that require teacher verification
 */
function VerifiedEventCard({ event }: { event: VerifiedEvent }) {
  const eventDate = new Date(event.startsAt);
  const statusColor = 
    event.verificationStatus === 'APPROVED' ? 'text-accent-mint' :
    event.verificationStatus === 'REJECTED' ? 'text-accent-coral' :
    'text-accent-yellow';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border shadow-neo dark:shadow-neo-dark hover:shadow-neo-lg dark:hover:shadow-neo-dark-lg transition-all group cursor-pointer overflow-hidden rounded-card-lg"
    >
      <Link href={`/events/${event.id}`}>
        {/* Event Header */}
        <div className="h-24 bg-gradient-to-br from-accent-mint/20 to-accent-blue/20 dark:from-accent-mint/10 dark:to-accent-blue/10 relative overflow-hidden flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-accent-mint/40 dark:text-accent-mint/20" />
          
          {/* Verification Status Badge */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-[10px] font-bold uppercase rounded ${statusColor}`}>
              {event.verificationStatus}
            </span>
          </div>
        </div>

        {/* Event Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-display text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary dark:text-dark-text dark:group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          {/* Event Details */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {eventDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-dark-text-muted">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {eventDate.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = `/events/${event.id}`;
            }}
            className="w-full btn-neo btn-primary text-xs py-2"
          >
            View Event
          </button>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * AttendanceRequestCard Component
 * 
 * Requirements: 7.5
 * 
 * Displays pending attendance verification requests
 */
function AttendanceRequestCard({ request }: { request: AttendanceRequest }) {
  const requestDate = new Date(request.requestedAt);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);
    
    try {
      // TODO: Call API to approve attendance
      // await api.approveAttendance(request.id);
      console.log('Approving attendance request:', request.id);
    } catch (error) {
      console.error('Failed to approve attendance:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsProcessing(true);
    
    try {
      // TODO: Call API to reject attendance
      // await api.rejectAttendance(request.id);
      console.log('Rejecting attendance request:', request.id);
    } catch (error) {
      console.error('Failed to reject attendance:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-paper dark:bg-dark-surface border-2 border-ink dark:border-dark-border shadow-neo dark:shadow-neo-dark p-4 rounded-card-lg"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Request Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck className="w-4 h-4 text-accent-coral flex-shrink-0" />
            <h4 className="font-display font-bold text-sm dark:text-dark-text">
              {request.studentName}
            </h4>
          </div>
          <p className="text-xs text-neutral-600 dark:text-dark-text-muted mb-2">
            {request.eventTitle}
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-dark-text-muted">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>
              {requestDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {request.status === 'PENDING' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="p-2 border-2 border-ink dark:border-dark-border bg-accent-mint hover:bg-accent-mint/80 transition-colors rounded disabled:opacity-50"
              title="Approve"
            >
              <CheckCircle className="w-4 h-4 text-ink" />
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="p-2 border-2 border-ink dark:border-dark-border bg-accent-coral hover:bg-accent-coral/80 transition-colors rounded disabled:opacity-50"
              title="Reject"
            >
              <AlertCircle className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Status Badge */}
        {request.status !== 'PENDING' && (
          <div>
            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${
              request.status === 'APPROVED' 
                ? 'bg-accent-mint text-ink' 
                : 'bg-accent-coral text-white'
            }`}>
              {request.status}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
