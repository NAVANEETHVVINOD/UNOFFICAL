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

interface PendingEvent {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  venue: string;
  status: string;
  createdBy?: {
    profile?: {
      fullName: string;
    };
  };
}

interface Report {
  id: string;
  reason: string;
  description: string;
  status: string;
  targetType: string;
  createdAt: string;
}

type Tab = "approvals" | "moderation" | "settings" | "stats";

export default function CollegeAdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("approvals");
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [collegeInfo, setCollegeInfo] = useState({
    name: "",
    description: "",
    website: "",
  });

  const isCollegeAdmin = user?.role === "COLLEGE_ADMIN" || user?.role === "PLATFORM_ADMIN";

  useEffect(() => {
    if (!authLoading && !isCollegeAdmin) {
      router.replace("/dashboard");
    }
  }, [authLoading, isCollegeAdmin, router]);

  useEffect(() => {
    if (isCollegeAdmin) {
      fetchData();
    }
  }, [isCollegeAdmin]);

  const fetchData = async () => {
    try {
      // Fetch pending events
      const events = await api.getPendingEvents();
      setPendingEvents(events || []);
      
      // Fetch reports
      const reportsData = await api.getReports();
      setReports(reportsData || []);
      
      // Fetch college info
      if (user?.profile?.collegeId) {
        const college = await api.getCollege(user.profile.collegeId);
        setCollegeInfo({
          name: college.name || "",
          description: college.description || "",
          website: college.website || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId: string) => {
    try {
      await api.approveEvent(eventId);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Failed to approve event:", error);
      alert("Failed to approve event.");
    }
  };

  const handleRejectEvent = async (eventId: string) => {
    const reason = prompt("Reason for rejection:");
    if (!reason) return;
    try {
      await api.rejectEvent(eventId, reason);
      setPendingEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Failed to reject event:", error);
      alert("Failed to reject event.");
    }
  };

  const handleResolveReport = async (reportId: string, action: string) => {
    try {
      await api.resolveReport(reportId, action);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (error) {
      console.error("Failed to resolve report:", error);
      alert("Failed to resolve report.");
    }
  };

  const handleSaveCollegeInfo = async () => {
    try {
      if (!user?.profile?.collegeId) return;
      await api.updateCollege(user.profile.collegeId, collegeInfo);
      alert("College info updated!");
    } catch (error) {
      console.error("Failed to update college:", error);
      alert("Failed to update college info.");
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

  if (!isCollegeAdmin) return null;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "approvals", label: "PENDING APPROVALS", count: pendingEvents.length },
    { id: "moderation", label: "REPORTS", count: reports.length },
    { id: "settings", label: "COLLEGE SETTINGS" },
    { id: "stats", label: "STATISTICS" },
  ];


  return (
    <Container>
      <div className="py-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NewspaperCard className="p-8 relative">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />

              <div className="text-center mb-8">
                <Badge className="mb-2 bg-accent-blue text-white border-black">
                  COLLEGE ADMIN
                </Badge>
                <h1 className="font-display text-4xl font-black">
                  ADMIN DASHBOARD
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage your college's content and users
                </p>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 border-b-2 border-black pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 font-bold text-sm border-2 border-black transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Approvals Tab */}
              {activeTab === "approvals" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl mb-4">Pending Event Approvals</h3>
                  {pendingEvents.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No pending approvals. 🎉
                    </p>
                  ) : (
                    pendingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 border-2 border-black rounded-lg bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{event.title}</h4>
                            <p className="text-sm text-gray-600">
                              By {event.createdBy?.profile?.fullName || "Unknown"} •{" "}
                              {new Date(event.startsAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            PENDING
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        <div className="flex gap-2">
                          <RetroButton
                            onClick={() => handleApproveEvent(event.id)}
                            className="bg-green-500 text-white hover:bg-green-600"
                          >
                            APPROVE
                          </RetroButton>
                          <RetroButton
                            onClick={() => handleRejectEvent(event.id)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            REJECT
                          </RetroButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Moderation Tab */}
              {activeTab === "moderation" && (
                <div className="space-y-4">
                  <h3 className="font-bold text-xl mb-4">Content Reports</h3>
                  {reports.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      No reports to review. 🎉
                    </p>
                  ) : (
                    reports.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 border-2 border-black rounded-lg bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge className="bg-red-100 text-red-800 border-red-300 mb-2">
                              {report.reason}
                            </Badge>
                            <p className="text-sm text-gray-600">
                              {report.targetType} • {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-4">{report.description}</p>
                        <div className="flex gap-2">
                          <RetroButton
                            onClick={() => handleResolveReport(report.id, "HIDE")}
                            className="bg-yellow-500 text-black"
                          >
                            HIDE CONTENT
                          </RetroButton>
                          <RetroButton
                            onClick={() => handleResolveReport(report.id, "DISMISS")}
                            variant="outline"
                          >
                            DISMISS
                          </RetroButton>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}


              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="font-bold text-xl mb-4">College Information</h3>
                  <div>
                    <label className="block font-bold text-sm mb-2">COLLEGE NAME</label>
                    <input
                      type="text"
                      value={collegeInfo.name}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, name: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">DESCRIPTION</label>
                    <textarea
                      rows={4}
                      value={collegeInfo.description}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, description: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">WEBSITE</label>
                    <input
                      type="text"
                      value={collegeInfo.website}
                      onChange={(e) => setCollegeInfo({ ...collegeInfo, website: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                      placeholder="https://..."
                    />
                  </div>
                  <RetroButton
                    onClick={handleSaveCollegeInfo}
                    className="w-full bg-black text-white hover:bg-accent-green hover:text-black"
                  >
                    SAVE CHANGES
                  </RetroButton>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === "stats" && (
                <div className="space-y-6">
                  <h3 className="font-bold text-xl mb-4">College Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-yellow/20 text-center">
                      <p className="font-display text-3xl font-black">--</p>
                      <p className="text-sm font-bold">Students</p>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-blue/20 text-center">
                      <p className="font-display text-3xl font-black">--</p>
                      <p className="text-sm font-bold">Clubs</p>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-pink/20 text-center">
                      <p className="font-display text-3xl font-black">--</p>
                      <p className="text-sm font-bold">Events</p>
                    </div>
                    <div className="p-4 border-2 border-black rounded-lg bg-accent-green/20 text-center">
                      <p className="font-display text-3xl font-black">--</p>
                      <p className="text-sm font-bold">Posts</p>
                    </div>
                  </div>
                  <p className="text-center text-gray-500 text-sm">
                    Detailed analytics coming soon.
                  </p>
                </div>
              )}
            </NewspaperCard>
          </motion.div>
        </div>
      </div>
    </Container>
  );
}
