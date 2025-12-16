"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Container from "../../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../../../components/ui/NewspaperUI";
import { motion } from "framer-motion";
import { api } from "../../../../lib/api";
import { useAuth } from "../../../context/AuthContext";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Club {
  id: string;
  name: string;
  description: string | null;
  logoUrl?: string;
  bannerUrl?: string;
  instagram?: string;
  discord?: string;
  website?: string;
  members?: {
    id: string;
    userId: string;
    role: string;
    user: {
      id: string;
      profile?: {
        fullName: string;
        avatarUrl?: string;
      };
    };
  }[];
  _count?: {
    members: number;
    events: number;
  };
}

type Tab = "edit" | "members" | "events";

export default function ClubManagePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("edit");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    bannerUrl: "",
    instagram: "",
    discord: "",
    website: "",
  });

  // Check if user is club admin
  const isClubAdmin = club?.members?.some(
    (m) => m.userId === user?.id && (m.role === "ADMIN" || m.role === "OWNER")
  );
  const isGlobalAdmin = user?.role === "COLLEGE_ADMIN" || user?.role === "PLATFORM_ADMIN";
  const canManage = isClubAdmin || isGlobalAdmin;

  useEffect(() => {
    if (id) fetchClub();
  }, [id]);

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name || "",
        description: club.description || "",
        logoUrl: club.logoUrl || "",
        bannerUrl: club.bannerUrl || "",
        instagram: club.instagram || "",
        discord: club.discord || "",
        website: club.website || "",
      });
    }
  }, [club]);

  const fetchClub = async () => {
    try {
      const data = await api.getClub(id);
      setClub(data);
    } catch (error) {
      console.error("Failed to fetch club:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!club) return;
    setSaving(true);
    try {
      await api.updateClub(club.id, formData);
      alert("Club updated successfully!");
      fetchClub();
    } catch (error) {
      console.error("Failed to update club:", error);
      alert("Failed to update club. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if (!club) return;
    try {
      await api.updateClubMember(club.id, memberId, { role: newRole });
      fetchClub();
    } catch (error) {
      console.error("Failed to update member role:", error);
      alert("Failed to update role.");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!club || !confirm("Remove this member from the club?")) return;
    try {
      await api.removeClubMember(club.id, memberId);
      fetchClub();
    } catch (error) {
      console.error("Failed to remove member:", error);
      alert("Failed to remove member.");
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

  if (!canManage) {
    router.replace(`/clubs/${id}`);
    return null;
  }

  if (!club) {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="font-display text-4xl mb-4">CLUB NOT FOUND</h1>
          <RetroButton onClick={() => router.push("/clubs")}>GO BACK</RetroButton>
        </div>
      </Container>
    );
  }


  const tabs: { id: Tab; label: string }[] = [
    { id: "edit", label: "EDIT PROFILE" },
    { id: "members", label: "MEMBERS" },
    { id: "events", label: "EVENTS" },
  ];

  return (
    <Container>
      <div className="py-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <RetroButton
            onClick={() => router.push(`/clubs/${id}`)}
            variant="outline"
            className="mb-8 text-sm"
          >
            &lt;- BACK TO CLUB
          </RetroButton>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NewspaperCard className="p-8 relative">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />

              <div className="text-center mb-8">
                <Badge className="mb-2 bg-accent-yellow text-black border-black">
                  CLUB ADMIN
                </Badge>
                <h1 className="font-display text-4xl font-black">
                  MANAGE {club.name.toUpperCase()}
                </h1>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-8 border-b-2 border-black pb-4">
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

              {/* Edit Tab */}
              {activeTab === "edit" && (
                <div className="space-y-6">
                  <div>
                    <label className="block font-bold text-sm mb-2">CLUB NAME</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-sm mb-2">DESCRIPTION</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-sm mb-2">LOGO URL</label>
                      <input
                        type="text"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-sm mb-2">BANNER URL</label>
                      <input
                        type="text"
                        value={formData.bannerUrl}
                        onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-sm mb-2">INSTAGRAM</label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                        placeholder="@clubname"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-sm mb-2">DISCORD</label>
                      <input
                        type="text"
                        value={formData.discord}
                        onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                        placeholder="discord.gg/..."
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-sm mb-2">WEBSITE</label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full p-3 border-2 border-black rounded-lg focus:shadow-neo transition-shadow"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  <RetroButton
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-black text-white hover:bg-accent-green hover:text-black"
                  >
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                  </RetroButton>
                </div>
              )}


              {/* Members Tab */}
              {activeTab === "members" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">
                      {club.members?.length || 0} Members
                    </h3>
                  </div>
                  {club.members?.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No members yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {club.members?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 border-2 border-black rounded-lg bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold">
                              {member.user.profile?.fullName?.[0] || "?"}
                            </div>
                            <div>
                              <p className="font-bold">
                                {member.user.profile?.fullName || "Unknown"}
                              </p>
                              <Badge className="text-xs bg-gray-100 border-gray-300">
                                {member.role}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={member.role}
                              onChange={(e) => handleRoleChange(member.id, e.target.value)}
                              className="p-2 border-2 border-black rounded text-sm font-bold"
                            >
                              <option value="MEMBER">Member</option>
                              <option value="VOLUNTEER">Volunteer</option>
                              <option value="CORE_TEAM">Core Team</option>
                              <option value="LEAD">Lead</option>
                              <option value="CHAIR">Chair</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                              title="Remove member"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Events Tab */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Club Events</h3>
                    <RetroButton
                      onClick={() => router.push(`/clubs/${id}/events/create`)}
                      className="text-sm"
                    >
                      + CREATE EVENT
                    </RetroButton>
                  </div>
                  <p className="text-center text-gray-500 py-8">
                    Event management coming soon. Use the college events page for now.
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
