"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "../../../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
} from "../../../../components/ui/NewspaperUI";
import { PageTransition } from "../../../../providers/AnimationProvider";
import Navbar from "../../../../components/Navbar";
import BottomNav from "../../../../components/ui/BottomNav";
import { Skeleton, StatsCardSkeleton } from "../../../../components/ui/Skeleton";
import { motion } from "framer-motion";
import { api } from "../../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";
import {
  ChevronLeft,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Ticket,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  Calendar,
} from "lucide-react";
import Link from "next/link";

// Types matching backend analytics service
interface EventMetrics {
  totalRegistrations: number;
  confirmedRegistrations: number;
  checkedIn: number;
  totalRevenue: number;
  conversionRate: number;
  attendancePercentage: number;
  waitlistConversionRate: number;
}

interface RegistrationTimeline {
  date: string;
  count: number;
  cumulative: number;
}

interface TicketBreakdown {
  ticketId: string;
  ticketName: string;
  sold: number;
  total: number | null;
  revenue: number;
  percentage: number;
}

interface DropOffFunnel {
  stage: string;
  count: number;
  percentage: number;
}

interface DailyAttendance {
  day: number;
  date: string;
  checkedIn: number;
  total: number;
  percentage: number;
}

interface AnalyticsData {
  metrics: EventMetrics;
  timeline: RegistrationTimeline[];
  ticketBreakdown: TicketBreakdown[];
  funnel: DropOffFunnel[];
  dailyAttendance: DailyAttendance[];
}

interface Event {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
}

export default function EventAnalyticsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [eventData, analyticsData, roleData] = await Promise.all([
        api.getEvent(id as string),
        api.getEventAnalytics(id as string),
        api.getMyEventRole(id as string),
      ]);
      setEvent(eventData);
      setAnalytics(analyticsData);
      setUserRole(roleData.role);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const canViewAnalytics = userRole === "CREATOR" || userRole === "CO_ORGANIZER";

  if (loading) {
    return <AnalyticsLoadingSkeleton />;
  }

  if (!event || !canViewAnalytics) {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl mb-4 dark:text-white">ACCESS DENIED</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to view analytics for this event.
          </p>
          <RetroButton onClick={() => router.push(`/events/${id}`)}>
            GO BACK
          </RetroButton>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl mb-4 text-red-600">Error</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">{error}</p>
          <RetroButton onClick={handleRefresh}>TRY AGAIN</RetroButton>
        </div>
      </Container>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-dark-bg">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto mt-4 md:mt-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <Link href={`/events/${id}/manage`}>
                    <RetroButton variant="outline" className="mb-4 text-sm">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      BACK TO MANAGE
                    </RetroButton>
                  </Link>
                  <h1 className="font-display text-3xl md:text-4xl font-black dark:text-white">
                    Event Analytics
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {event.title}
                  </p>
                </div>
                <div className="flex gap-2">
                  <RetroButton
                    onClick={handleRefresh}
                    variant="outline"
                    disabled={refreshing}
                    className="text-sm"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                    {refreshing ? "..." : "REFRESH"}
                  </RetroButton>
                </div>
              </div>

              {analytics && (
                <>
                  {/* Key Metrics Cards */}
                  <MetricsGrid metrics={analytics.metrics} />

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Registration Timeline */}
                    <RegistrationTimelineChart timeline={analytics.timeline} />

                    {/* Ticket Breakdown */}
                    <TicketBreakdownChart tickets={analytics.ticketBreakdown} />
                  </div>

                  {/* Drop-off Funnel */}
                  <div className="mt-6">
                    <DropOffFunnelChart funnel={analytics.funnel} />
                  </div>

                  {/* Daily Attendance (for multi-day events) */}
                  {analytics.dailyAttendance.length > 1 && (
                    <div className="mt-6">
                      <DailyAttendanceChart attendance={analytics.dailyAttendance} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
        <BottomNav />
      </div>
    </PageTransition>
  );
}


// ============ Metrics Grid Component ============
function MetricsGrid({ metrics }: { metrics: EventMetrics }) {
  const cards = [
    {
      label: "Total Registrations",
      value: metrics.totalRegistrations,
      icon: Users,
      color: "bg-blue-500",
      darkColor: "dark:bg-blue-600",
    },
    {
      label: "Confirmed",
      value: metrics.confirmedRegistrations,
      icon: UserCheck,
      color: "bg-green-500",
      darkColor: "dark:bg-green-600",
    },
    {
      label: "Checked In",
      value: metrics.checkedIn,
      icon: Activity,
      color: "bg-purple-500",
      darkColor: "dark:bg-purple-600",
    },
    {
      label: "Total Revenue",
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-primary-500",
      darkColor: "dark:bg-primary-600",
    },
    {
      label: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
      darkColor: "dark:bg-orange-600",
      subtitle: "Confirmed / Total",
    },
    {
      label: "Attendance",
      value: `${metrics.attendancePercentage}%`,
      icon: UserCheck,
      color: "bg-teal-500",
      darkColor: "dark:bg-teal-600",
      subtitle: "Checked In / Confirmed",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <NewspaperCard className="p-4 h-full">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.color} ${card.darkColor}`}>
                <card.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-black dark:text-white mb-1">
              {card.value}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {card.label}
            </div>
            {card.subtitle && (
              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                {card.subtitle}
              </div>
            )}
          </NewspaperCard>
        </motion.div>
      ))}
    </div>
  );
}

// ============ Registration Timeline Chart ============
function RegistrationTimelineChart({ timeline }: { timeline: RegistrationTimeline[] }) {
  const maxCount = Math.max(...timeline.map((t) => t.count), 1);
  const maxCumulative = Math.max(...timeline.map((t) => t.cumulative), 1);

  // Show last 14 days for better visibility
  const recentTimeline = timeline.slice(-14);

  return (
    <NewspaperCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-bold text-lg dark:text-white">Registration Timeline</h3>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Daily</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded" />
          <span className="text-gray-600 dark:text-gray-400">Cumulative</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 flex items-end gap-1">
        {recentTimeline.map((day, index) => (
          <div
            key={day.date}
            className="flex-1 flex flex-col items-center gap-1 group relative"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
              <div className="bg-ink dark:bg-dark-elevated text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                <div className="font-bold">{formatDate(day.date)}</div>
                <div>Daily: {day.count}</div>
                <div>Total: {day.cumulative}</div>
              </div>
            </div>

            {/* Bars */}
            <div className="w-full flex flex-col items-center gap-0.5 h-40">
              {/* Cumulative line indicator */}
              <div
                className="w-full bg-blue-200 dark:bg-blue-900 rounded-t transition-all duration-300"
                style={{
                  height: `${(day.cumulative / maxCumulative) * 100}%`,
                  minHeight: day.cumulative > 0 ? "4px" : "0",
                }}
              />
              {/* Daily bar overlay */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.count / maxCount) * 60}%` }}
                transition={{ delay: index * 0.02, duration: 0.3 }}
                className="w-3/4 bg-primary-500 dark:bg-primary-400 rounded-t absolute bottom-0"
                style={{ minHeight: day.count > 0 ? "4px" : "0" }}
              />
            </div>

            {/* Date label */}
            <div className="text-[9px] text-gray-400 dark:text-gray-500 transform -rotate-45 origin-top-left mt-1">
              {formatShortDate(day.date)}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Last 14 days
        </span>
        <span className="font-bold dark:text-white">
          {recentTimeline.reduce((sum, d) => sum + d.count, 0)} registrations
        </span>
      </div>
    </NewspaperCard>
  );
}

// ============ Ticket Breakdown Chart ============
function TicketBreakdownChart({ tickets }: { tickets: TicketBreakdown[] }) {
  const colors = [
    "bg-primary-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
  ];

  const totalRevenue = tickets.reduce((sum, t) => sum + t.revenue, 0);
  const totalSold = tickets.reduce((sum, t) => sum + t.sold, 0);

  return (
    <NewspaperCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <PieChart className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-bold text-lg dark:text-white">Ticket Breakdown</h3>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No ticket data available
        </div>
      ) : (
        <>
          {/* Visual Pie Chart */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {tickets.map((ticket, index) => {
                  const offset = tickets
                    .slice(0, index)
                    .reduce((sum, t) => sum + t.percentage, 0);
                  const strokeDasharray = `${ticket.percentage} ${100 - ticket.percentage}`;
                  const strokeDashoffset = -offset;

                  return (
                    <circle
                      key={ticket.ticketId}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      strokeWidth="20"
                      className={`${colors[index % colors.length].replace("bg-", "stroke-")}`}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      style={{ transition: "stroke-dasharray 0.5s ease" }}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-2xl font-black dark:text-white">{totalSold}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">sold</div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {tickets.map((ticket, index) => (
              <div
                key={ticket.ticketId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${colors[index % colors.length]}`} />
                  <span className="text-sm dark:text-gray-300 truncate max-w-[120px]">
                    {ticket.ticketName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {ticket.sold}/{ticket.total || "∞"}
                  </span>
                  <Badge className="bg-gray-100 dark:bg-dark-elevated text-gray-700 dark:text-gray-300">
                    {ticket.percentage}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {/* Total Revenue */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              ₹{totalRevenue.toLocaleString()}
            </span>
          </div>
        </>
      )}
    </NewspaperCard>
  );
}


// ============ Drop-off Funnel Chart ============
function DropOffFunnelChart({ funnel }: { funnel: DropOffFunnel[] }) {
  const maxCount = Math.max(...funnel.map((f) => f.count), 1);

  const stageColors: Record<string, string> = {
    "Registration Started": "bg-blue-500 dark:bg-blue-600",
    "Form Completed": "bg-cyan-500 dark:bg-cyan-600",
    "Payment Completed": "bg-green-500 dark:bg-green-600",
    "Confirmed": "bg-primary-500 dark:bg-primary-600",
    "Checked In": "bg-purple-500 dark:bg-purple-600",
  };

  return (
    <NewspaperCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-bold text-lg dark:text-white">Registration Funnel</h3>
      </div>

      <div className="space-y-4">
        {funnel.map((stage, index) => {
          const widthPercent = (stage.count / maxCount) * 100;
          const dropOff = index > 0 ? funnel[index - 1].count - stage.count : 0;
          const dropOffPercent = index > 0 && funnel[index - 1].count > 0
            ? ((dropOff / funnel[index - 1].count) * 100).toFixed(1)
            : 0;

          return (
            <motion.div
              key={stage.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Stage Label */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium dark:text-gray-300">
                  {stage.stage}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold dark:text-white">
                    {stage.count}
                  </span>
                  <Badge className="text-xs bg-gray-100 dark:bg-dark-elevated">
                    {stage.percentage}%
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-8 bg-gray-100 dark:bg-dark-surface rounded-lg overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-full ${stageColors[stage.stage] || "bg-gray-500"} rounded-lg flex items-center justify-end pr-2`}
                >
                  {widthPercent > 15 && (
                    <span className="text-xs text-white font-medium">
                      {stage.count}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* Drop-off indicator */}
              {index > 0 && dropOff > 0 && (
                <div className="absolute -top-1 right-0 text-xs text-red-500 dark:text-red-400">
                  ↓ {dropOff} ({dropOffPercent}% drop)
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Funnel Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-green-600 dark:text-green-400">
              {funnel.length > 0 ? funnel[funnel.length - 1].percentage : 0}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Overall Conversion
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-primary-600 dark:text-primary-400">
              {funnel.length > 0 ? funnel[funnel.length - 1].count : 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Final Check-ins
            </div>
          </div>
        </div>
      </div>
    </NewspaperCard>
  );
}

// ============ Daily Attendance Chart ============
function DailyAttendanceChart({ attendance }: { attendance: DailyAttendance[] }) {
  const maxCheckedIn = Math.max(...attendance.map((a) => a.checkedIn), 1);

  return (
    <NewspaperCard className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        <h3 className="font-bold text-lg dark:text-white">Daily Attendance</h3>
        <Badge className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
          Multi-day Event
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {attendance.map((day, index) => (
          <motion.div
            key={day.day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="text-center"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Day {day.day}
            </div>
            <div className="relative h-24 bg-gray-100 dark:bg-dark-surface rounded-lg overflow-hidden mb-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.checkedIn / maxCheckedIn) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="absolute bottom-0 w-full bg-gradient-to-t from-primary-500 to-primary-400 dark:from-primary-600 dark:to-primary-500"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold dark:text-white z-10">
                  {day.checkedIn}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {day.percentage}%
            </div>
            <div className="text-[10px] text-gray-400 dark:text-gray-500">
              {formatShortDate(day.date)}
            </div>
          </motion.div>
        ))}
      </div>
    </NewspaperCard>
  );
}

// ============ Loading Skeleton ============
function AnalyticsLoadingSkeleton() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-dark-bg">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto mt-4 md:mt-8">
              {/* Header Skeleton */}
              <div className="mb-8">
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>

              {/* Metrics Grid Skeleton */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <StatsCardSkeleton key={i} />
                ))}
              </div>

              {/* Charts Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NewspaperCard className="p-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <Skeleton className="h-48 w-full" />
                </NewspaperCard>
                <NewspaperCard className="p-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <div className="flex justify-center mb-6">
                    <Skeleton className="w-40 h-40 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                </NewspaperCard>
              </div>

              {/* Funnel Skeleton */}
              <div className="mt-6">
                <NewspaperCard className="p-6">
                  <Skeleton className="h-6 w-48 mb-6" />
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                </NewspaperCard>
              </div>
            </div>
          </div>
        </Container>
        <BottomNav />
      </div>
    </PageTransition>
  );
}

// ============ Utility Functions ============
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
