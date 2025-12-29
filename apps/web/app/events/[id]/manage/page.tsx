"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "../../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
} from "../../../components/ui/NewspaperUI";
import { PageTransition } from "../../../providers/AnimationProvider";
import Navbar from "../../../components/Navbar";
import BottomNav from "../../../components/ui/BottomNav";
import { motion } from "framer-motion";
import { api } from "../../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import {
  Users,
  UserPlus,
  Shield,
  Search,
  X,
  ChevronLeft,
  Crown,
  UserCog,
  User,
  Trash2,
  QrCode,
  BarChart3,
  Award,
} from "lucide-react";
import Link from "next/link";

interface RoleAssignment {
  id: string;
  userId: string;
  role: "CREATOR" | "CO_ORGANIZER" | "HEAD" | "VOLUNTEER";
  assignedBy: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

interface SearchUser {
  id: string;
  fullName: string;
  email: string;
  hasRole: boolean;
}

interface Event {
  id: string;
  title: string;
  createdById: string;
}

const ROLE_INFO = {
  CREATOR: {
    label: "Creator",
    description: "Full control over the event",
    icon: Crown,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  CO_ORGANIZER: {
    label: "Co-Organizer",
    description: "Can edit event, manage tickets, view attendees",
    icon: UserCog,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  HEAD: {
    label: "Head",
    description: "Can scan QR codes and view attendee list",
    icon: Shield,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  VOLUNTEER: {
    label: "Volunteer",
    description: "Can scan QR codes only",
    icon: User,
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  },
};

export default function EventManagePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [roles, setRoles] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Search state
  const [showAddRole, setShowAddRole] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"CO_ORGANIZER" | "HEAD" | "VOLUNTEER">("VOLUNTEER");
  const [assigning, setAssigning] = useState(false);

  // Remove role state
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [eventData, rolesData, roleData] = await Promise.all([
        api.getEvent(id as string),
        api.getEventRoles(id as string),
        api.getMyEventRole(id as string),
      ]);
      setEvent(eventData);
      setRoles(Array.isArray(rolesData) ? rolesData : rolesData.roles || []);
      setUserRole(roleData.role);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const result = await api.searchUsersForRole(id as string, query);
      setSearchResults(result.users || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleAssignRole = async (userId: string) => {
    setAssigning(true);
    try {
      await api.assignEventRole(id as string, userId, selectedRole);
      await fetchData();
      setShowAddRole(false);
      setSearchQuery("");
      setSearchResults([]);
    } catch (error: any) {
      alert(error.message || "Failed to assign role");
    } finally {
      setAssigning(false);
    }
  };

  const handleRemoveRole = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this role?")) return;
    setRemovingUserId(userId);
    try {
      await api.removeEventRole(id as string, userId);
      await fetchData();
    } catch (error: any) {
      alert(error.message || "Failed to remove role");
    } finally {
      setRemovingUserId(null);
    }
  };

  const canManageRoles = userRole === "CREATOR";

  if (loading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
        </div>
      </Container>
    );
  }

  if (!event || !userRole) {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl mb-4">ACCESS DENIED</h1>
          <p className="mb-4 text-gray-600">You don&apos;t have permission to manage this event.</p>
          <RetroButton onClick={() => router.push(`/events/${id}`)}>
            GO BACK
          </RetroButton>
        </div>
      </Container>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-gray-900">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto mt-4 md:mt-8">
              {/* Back Button */}
              <RetroButton
                onClick={() => router.push(`/events/${id}`)}
                variant="outline"
                className="mb-6 text-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                BACK TO EVENT
              </RetroButton>

              {/* Header */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl font-black mb-2 dark:text-white">
                    Manage Team
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {event.title}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(userRole === "CREATOR" || userRole === "CO_ORGANIZER" || userRole === "HEAD") && (
                    <Link href={`/events/${id}/manage/attendees`}>
                      <RetroButton className="bg-purple-500 text-white border-black">
                        <Users className="w-4 h-4 mr-2" />
                        Attendees
                      </RetroButton>
                    </Link>
                  )}
                  {(userRole === "CREATOR" || userRole === "CO_ORGANIZER") && (
                    <>
                      <Link href={`/events/${id}/manage/analytics`}>
                        <RetroButton className="bg-primary-500 text-black border-black">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </RetroButton>
                      </Link>
                      <Link href={`/events/${id}/certificates`}>
                        <RetroButton className="bg-amber-500 text-white border-black">
                          <Award className="w-4 h-4 mr-2" />
                          Certificates
                        </RetroButton>
                      </Link>
                    </>
                  )}
                  <Link href={`/events/${id}/scanner`}>
                    <RetroButton className="bg-green-500 text-white border-black">
                      <QrCode className="w-4 h-4 mr-2" />
                      QR Scanner
                    </RetroButton>
                  </Link>
                </div>
              </div>

              {/* Role Management Card */}
              <NewspaperCard className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <h2 className="font-bold text-xl">Team Members</h2>
                  </div>
                  {canManageRoles && (
                    <RetroButton
                      onClick={() => setShowAddRole(true)}
                      className="text-sm"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add Member
                    </RetroButton>
                  )}
                </div>

                {/* Role List */}
                <div className="space-y-3">
                  {/* Creator (from event) */}
                  {event.createdById && (
                    <RoleMemberCard
                      role="CREATOR"
                      user={{
                        id: event.createdById,
                        fullName: user?.id === event.createdById ? (user.profile?.fullName || "You") : "Event Creator",
                        email: "",
                      }}
                      isCurrentUser={user?.id === event.createdById}
                      canRemove={false}
                      onRemove={() => {}}
                      removing={false}
                    />
                  )}

                  {/* Assigned Roles */}
                  {roles.map((role) => (
                    <RoleMemberCard
                      key={role.id}
                      role={role.role}
                      user={role.user}
                      isCurrentUser={user?.id === role.userId}
                      canRemove={canManageRoles && role.role !== "CREATOR"}
                      onRemove={() => handleRemoveRole(role.userId)}
                      removing={removingUserId === role.userId}
                    />
                  ))}

                  {roles.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No team members assigned yet.
                      {canManageRoles && " Click 'Add Member' to get started."}
                    </p>
                  )}
                </div>
              </NewspaperCard>

              {/* Role Permissions Info */}
              <NewspaperCard className="p-6">
                <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Role Permissions
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {(Object.keys(ROLE_INFO) as Array<keyof typeof ROLE_INFO>).map((roleKey) => {
                    const info = ROLE_INFO[roleKey];
                    const Icon = info.icon;
                    return (
                      <div
                        key={roleKey}
                        className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" />
                          <span className="font-bold">{info.label}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </NewspaperCard>
            </div>
          </div>
        </Container>
        <BottomNav />

        {/* Add Role Modal */}
        {showAddRole && (
          <AddRoleModal
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            searchResults={searchResults}
            searching={searching}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            onAssign={handleAssignRole}
            assigning={assigning}
            onClose={() => {
              setShowAddRole(false);
              setSearchQuery("");
              setSearchResults([]);
            }}
          />
        )}
      </div>
    </PageTransition>
  );
}

// Role Member Card Component
function RoleMemberCard({
  role,
  user,
  isCurrentUser,
  canRemove,
  onRemove,
  removing,
}: {
  role: keyof typeof ROLE_INFO;
  user: { id: string; fullName: string; email: string };
  isCurrentUser: boolean;
  canRemove: boolean;
  onRemove: () => void;
  removing: boolean;
}) {
  const info = ROLE_INFO[role];
  const Icon = info.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold dark:text-white">
              {user.fullName}
              {isCurrentUser && " (You)"}
            </span>
            <Badge className={`text-xs ${info.color}`}>
              {info.label}
            </Badge>
          </div>
          {user.email && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </span>
          )}
        </div>
      </div>
      {canRemove && (
        <button
          onClick={onRemove}
          disabled={removing}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
          title="Remove role"
        >
          {removing ? (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5" />
          )}
        </button>
      )}
    </motion.div>
  );
}

// Add Role Modal Component
function AddRoleModal({
  searchQuery,
  onSearchChange,
  searchResults,
  searching,
  selectedRole,
  onRoleChange,
  onAssign,
  assigning,
  onClose,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: SearchUser[];
  searching: boolean;
  selectedRole: "CO_ORGANIZER" | "HEAD" | "VOLUNTEER";
  onRoleChange: (role: "CO_ORGANIZER" | "HEAD" | "VOLUNTEER") => void;
  onAssign: (userId: string) => void;
  assigning: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-lg dark:text-white">Add Team Member</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["CO_ORGANIZER", "HEAD", "VOLUNTEER"] as const).map((role) => {
                const info = ROLE_INFO[role];
                return (
                  <button
                    key={role}
                    onClick={() => onRoleChange(role)}
                    className={`p-2 text-sm border-2 rounded-lg transition-all ${
                      selectedRole === role
                        ? "border-black dark:border-white bg-gray-100 dark:bg-gray-700"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-300">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-black dark:focus:border-white outline-none"
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="max-h-60 overflow-y-auto">
            {searching ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border dark:border-gray-600 rounded-lg"
                  >
                    <div>
                      <div className="font-medium dark:text-white">{user.fullName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </div>
                    {user.hasRole ? (
                      <Badge className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        Has Role
                      </Badge>
                    ) : (
                      <RetroButton
                        onClick={() => onAssign(user.id)}
                        disabled={assigning}
                        className="text-sm py-1 px-3"
                      >
                        {assigning ? "..." : "Add"}
                      </RetroButton>
                    )}
                  </div>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <p className="text-center text-gray-500 py-8">
                No users found
              </p>
            ) : (
              <p className="text-center text-gray-500 py-8">
                Type at least 2 characters to search
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
