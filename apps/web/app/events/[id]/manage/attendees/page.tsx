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
import { Skeleton } from "../../../../components/ui/Skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../../../lib/api";
import { useAuth } from "../../../../context/AuthContext";
import {
  ChevronLeft,
  Users,
  Search,
  Filter,
  Download,
  UserCheck,
  Clock,
  X,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Ticket,
  FileText,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

interface Registration {
  id: string;
  eventId: string;
  ticketId: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "REFUNDED";
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInMethod: string | null;
  formResponses: Record<string, any> | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    profile: {
      fullName: string;
      avatarUrl: string | null;
    } | null;
  };
  ticket: {
    id: string;
    name: string;
    price: number;
  };
}

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
}

interface FormSchema {
  fields: FormField[];
  version: number;
}

interface Event {
  id: string;
  title: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  CONFIRMED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

export default function AttendeesPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Expanded rows for form responses
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [eventData, registrationsData, roleData] = await Promise.all([
        api.getEvent(id as string),
        api.getEventRegistrations(id as string),
        api.getMyEventRole(id as string),
      ]);
      setEvent(eventData);
      setRegistrations(Array.isArray(registrationsData) ? registrationsData : []);
      setUserRole(roleData.role);

      // Try to get form schema
      try {
        const formData = await api.getEventFormSchema(id as string);
        setFormSchema(formData);
      } catch {
        // Form schema might not exist
        setFormSchema(null);
      }

      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Failed to load attendees");
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

  const toggleRowExpand = (registrationId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(registrationId)) {
        next.delete(registrationId);
      } else {
        next.add(registrationId);
      }
      return next;
    });
  };

  const handleExport = async () => {
    try {
      const blob = await api.exportEventAttendees(id as string, "csv");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `attendees-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      alert(err.message || "Failed to export attendees");
    }
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((reg) => {
    // Status filter
    if (statusFilter !== "all" && reg.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const name = reg.user.profile?.fullName?.toLowerCase() || "";
      const email = reg.user.email?.toLowerCase() || "";
      const ticketName = reg.ticket.name.toLowerCase();
      
      if (!name.includes(query) && !email.includes(query) && !ticketName.includes(query)) {
        return false;
      }
    }

    return true;
  });

  const canViewAttendees = userRole === "CREATOR" || userRole === "CO_ORGANIZER" || userRole === "HEAD";
  const canExport = userRole === "CREATOR" || userRole === "CO_ORGANIZER";

  if (loading) {
    return <AttendeesLoadingSkeleton />;
  }

  if (!event || !canViewAttendees) {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl mb-4 dark:text-white">ACCESS DENIED</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to view attendees for this event.
          </p>
          <RetroButton onClick={() => router.push(`/events/${id}`)}>
            GO BACK
          </RetroButton>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <Link href={`/events/${id}/manage`}>
                    <RetroButton variant="outline" className="mb-4 text-sm">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      BACK TO MANAGE
                    </RetroButton>
                  </Link>
                  <h1 className="font-display text-3xl md:text-4xl font-black dark:text-white">
                    Attendees
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
                  {canExport && (
                    <RetroButton onClick={handleExport} className="text-sm">
                      <Download className="w-4 h-4 mr-1" />
                      EXPORT CSV
                    </RetroButton>
                  )}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  label="Total"
                  value={registrations.length}
                  icon={Users}
                  color="bg-blue-500"
                />
                <StatCard
                  label="Confirmed"
                  value={registrations.filter((r) => r.status === "CONFIRMED").length}
                  icon={UserCheck}
                  color="bg-green-500"
                />
                <StatCard
                  label="Checked In"
                  value={registrations.filter((r) => r.checkInTime).length}
                  icon={Clock}
                  color="bg-purple-500"
                />
                <StatCard
                  label="Pending"
                  value={registrations.filter((r) => r.status === "PENDING").length}
                  icon={Clock}
                  color="bg-yellow-500"
                />
              </div>

              {/* Search and Filters */}
              <NewspaperCard className="p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, email, or ticket..."
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:border-black dark:focus:border-white outline-none"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white"
                  >
                    <option value="all">All Status</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING">Pending</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>

                {/* Results count */}
                <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredRegistrations.length} of {registrations.length} attendees
                </div>
              </NewspaperCard>

              {/* Attendees List */}
              <NewspaperCard className="overflow-hidden">
                {filteredRegistrations.length === 0 ? (
                  <div className="p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="font-bold text-lg mb-2 dark:text-white">No Attendees Found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "No one has registered for this event yet"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredRegistrations.map((registration) => (
                      <AttendeeRow
                        key={registration.id}
                        registration={registration}
                        formSchema={formSchema}
                        isExpanded={expandedRows.has(registration.id)}
                        onToggleExpand={() => toggleRowExpand(registration.id)}
                      />
                    ))}
                  </div>
                )}
              </NewspaperCard>
            </div>
          </div>
        </Container>
        <BottomNav />
      </div>
    </PageTransition>
  );
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <NewspaperCard className="p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </NewspaperCard>
  );
}

// Attendee Row Component
function AttendeeRow({
  registration,
  formSchema,
  isExpanded,
  onToggleExpand,
}: {
  registration: Registration;
  formSchema: FormSchema | null;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const hasFormResponses =
    registration.formResponses &&
    Object.keys(registration.formResponses).length > 0;

  return (
    <div className="bg-white dark:bg-gray-800">
      {/* Main Row */}
      <div
        className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
          hasFormResponses ? "" : "cursor-default"
        }`}
        onClick={hasFormResponses ? onToggleExpand : undefined}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          {registration.user.profile?.avatarUrl ? (
            <img
              src={registration.user.profile.avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
              {registration.user.profile?.fullName?.charAt(0) || "?"}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold dark:text-white truncate">
              {registration.user.profile?.fullName || "Unknown"}
            </span>
            <Badge className={STATUS_COLORS[registration.status]}>
              {registration.status}
            </Badge>
            {registration.checkInTime && (
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Checked In
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {registration.user.email}
            </span>
            <span className="flex items-center gap-1">
              <Ticket className="w-3 h-3" />
              {registration.ticket.name}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right flex-shrink-0">
          <p className="font-bold dark:text-white">
            {registration.ticket.price > 0
              ? `₹${registration.ticket.price}`
              : "Free"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(registration.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Expand Button */}
        {hasFormResponses && (
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Form Responses */}
      <AnimatePresence>
        {isExpanded && hasFormResponses && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <FormResponsesPanel
              responses={registration.formResponses!}
              schema={formSchema}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Form Responses Panel Component
function FormResponsesPanel({
  responses,
  schema,
}: {
  responses: Record<string, any>;
  schema: FormSchema | null;
}) {
  // Get field labels from schema if available
  const getFieldLabel = (fieldId: string): string => {
    if (schema) {
      const field = schema.fields.find((f) => f.id === fieldId);
      if (field) return field.label;
    }
    // Fallback: convert camelCase/snake_case to Title Case
    return fieldId
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim();
  };

  const formatValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (value === null || value === undefined) {
      return "-";
    }
    return String(value);
  };

  return (
    <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Form Responses
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(responses).map(([fieldId, value]) => (
          <div
            key={fieldId}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {getFieldLabel(fieldId)}
            </p>
            <p className="text-sm font-medium dark:text-white break-words">
              {formatValue(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Loading Skeleton Component
function AttendeesLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg">
      <Navbar />
      <Container>
        <div className="pt-16 md:pt-20 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto mt-4 md:mt-8">
            {/* Header Skeleton */}
            <Skeleton className="w-32 h-10 mb-4" />
            <Skeleton className="w-48 h-10 mb-2" />
            <Skeleton className="w-64 h-5 mb-6" />

            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>

            {/* Search Skeleton */}
            <Skeleton className="h-24 rounded-lg mb-6" />

            {/* List Skeleton */}
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </Container>
      <BottomNav />
    </div>
  );
}
