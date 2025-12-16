"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../../components/ui/NewspaperUI";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface User {
  id: string;
  email: string;
  role: string;
  isBanned: boolean;
  profile?: {
    fullName: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

interface College {
  id: string;
  name: string;
  city: string;
  _count?: {
    profiles: number;
    clubs: number;
  };
}

type Tab = "analytics" | "colleges" | "users" | "config";

export default function PlatformAdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [users, setUsers] = useState<User[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const isPlatformAdmin = user?.role === "PLATFORM_ADMIN";

  useEffect(() => {
    if (!authLoading && !isPlatformAdmin) {
      router.replace("/dashboard");
    }
  }, [authLoading, isPlatformAdmin, router]);

  useEffect(() => {
    if (isPlatformAdmin) {
      fetchData();
    }
  }, [isPlatformAdmin]);

  const fetchData = async () => {
    try {
      const [usersData, collegesData] = await Promise.all([
        api.getAllUsers(),
        api.getColleges(),
      ]);
      setUsers(usersData || []);
      setColleges(collegesData || []);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role.");
    }
  };

  const handleBanUser = async (userId: string, ban: boolean) => {
    const reason = ban ? prompt("Reason for ban:") : null;
    if (ban && !reason) return;
    try {
      await api.banUser(userId, ban, reason || undefined);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isBanned: ban } : u))
      );
    } catch (error) {
      console.error("Failed to ban/unban user:", error);
      alert("Failed to update ban status.");
    }
  };

  if (authLoading || loading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      </Container>
    );
  }

  if (!isPlatformAdmin) return null;

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.profile?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: { id: Tab; label: string }[] = [
    { id: "analytics", label: "ANALYTICS" },
    { id: "colleges", label: "COLLEGES" },
    { id: "users", label: "USERS" },
    { id: "config", label: "CONFIG" },
  ];


  return (
    <Container>
      <div className="py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NewspaperCard className="p-8 relative">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />

              <div className="text-center mb-8">
                <Badge className="mb-2 bg-black text-white border-black">
                  PLATFORM ADMIN
                </Badge>
                <h1 className="font-display text-4xl font-black">
                  SYSTEM DASHBOARD
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage the entire LINKER platform
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-black pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-bold text-sm border-2 border-black transition-all ${
                      activeTab === tab.id
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Analytics Tab */}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <h3 className="font-bold text-xl mb-4">Platform Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-yellow/20 text-center">
                      <p className="font-display text-3xl font-black">{users.length}</p>
                      <p className="text-sm font-bold">Total Users</p>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-blue/20 text-center">
                      <p className="font-display text-3xl font-black">{colleges.length}</p>
                      <p className="text-sm font-bold">Colleges</p>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-pink/20 text-center">
                      <p className="font-display text-3xl font-black">
                        {users.filter((u) => u.isBanned).length}
                      </p>
                      <p className="text-sm font-bold">Banned Users</p>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-green/20 text-center">
                      <p className="font-display text-3xl font-black">✓</p>
                      <p className="text-sm font-bold">System Health</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Colleges Tab */}
              {activeTab === "colleges" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">All Colleges ({colleges.length})</h3>
                    <RetroButton className="text-sm">+ ADD COLLEGE</RetroButton>
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {colleges.map((college) => (
                      <div
                        key={college.id}
                        className="p-4 border-2 border-black rounded-lg bg-white flex justify-between items-center"
                      >
                        <div>
                          <p className="font-bold">{college.name}</p>
                          <p className="text-sm text-gray-600">{college.city}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {college._count?.profiles || 0} students
                          </p>
                          <p className="text-sm text-gray-500">
                            {college._count?.clubs || 0} clubs
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">All Users ({users.length})</h3>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="p-2 border-2 border-black rounded-lg w-64"
                    />
                  </div>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        className={`p-4 border-2 border-black rounded-lg flex justify-between items-center ${
                          u.isBanned ? "bg-red-50" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                            {u.profile?.fullName?.[0] || "?"}
                          </div>
                          <div>
                            <p className="font-bold">
                              {u.profile?.fullName || "Unknown"}
                              {u.isBanned && (
                                <span className="ml-2 text-red-500 text-xs">BANNED</span>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">{u.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            className="p-2 border-2 border-black rounded text-sm font-bold"
                          >
                            <option value="STUDENT">Student</option>
                            <option value="CLUB_ADMIN">Club Admin</option>
                            <option value="COLLEGE_ADMIN">College Admin</option>
                            <option value="PLATFORM_ADMIN">Platform Admin</option>
                          </select>
                          <button
                            onClick={() => handleBanUser(u.id, !u.isBanned)}
                            className={`p-2 rounded text-sm font-bold ${
                              u.isBanned
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }`}
                          >
                            {u.isBanned ? "UNBAN" : "BAN"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Config Tab */}
              {activeTab === "config" && (
                <div className="space-y-6">
                  <h3 className="font-bold text-xl mb-4">Platform Configuration</h3>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-black rounded-lg">
                      <h4 className="font-bold mb-2">Global Announcement</h4>
                      <textarea
                        rows={3}
                        placeholder="Enter a global announcement to show all users..."
                        className="w-full p-3 border-2 border-black rounded-lg"
                      />
                      <RetroButton className="mt-2">PUBLISH</RetroButton>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg">
                      <h4 className="font-bold mb-2">Feature Flags</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span>Enable Marketplace</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span>Enable Anonymous Posts</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span>Enable Notes Sharing</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </NewspaperCard>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
