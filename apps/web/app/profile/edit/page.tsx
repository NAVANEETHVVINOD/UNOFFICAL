"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Save, User, FileText, Github, Instagram, Linkedin, Tag, Camera } from "lucide-react";
import BottomNav from "../../components/ui/BottomNav";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    bio: "",
    githubUrl: "",
    instagram: "",
    linkedin: "",
    tags: "",
  });

  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        fullName: user.profile.fullName || "",
        bio: user.profile.bio || "",
        githubUrl: user.profile.githubUrl || "",
        instagram: user.profile.instagram || "",
        linkedin: user.profile.linkedin || "",
        tags: user.profile.tags ? user.profile.tags.join(", ") : "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await api.updateProfile({
        ...formData,
        tags: tagsArray,
      });

      await refreshUser();
      router.push("/profile");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const username = user?.email?.split("@")[0] || "user";

  return (
    <div className="min-h-screen bg-paper relative">
      {/* Background Pattern - Smooth dots */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #FFEB3B 1.5px, transparent 1.5px)',
            backgroundSize: '48px 48px',
            backgroundPosition: '24px 24px',
          }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-paper/95 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-2xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 font-bold text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="font-display text-base md:text-lg font-bold uppercase">Edit Profile</h1>
          <div className="w-10 md:w-16" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-16 md:pt-20 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-ink overflow-hidden bg-neutral-100 shadow-neo">
                <img
                  src={
                    user?.profile?.avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.profile?.fullName || "User"}`
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary border-2 border-ink rounded-full flex items-center justify-center shadow-neo-sm hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-3 font-mono text-sm text-neutral-500">@{username}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="card-paper p-6 rounded-xl">
              <label className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide mb-3">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input-retro rounded-lg"
                placeholder="Your full name"
              />
            </div>

            {/* Bio */}
            <div className="card-paper p-6 rounded-xl">
              <label className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide mb-3">
                <FileText className="w-4 h-4" />
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-retro rounded-lg min-h-[100px] resize-none"
                placeholder="Tell us about yourself..."
                maxLength={200}
              />
              <p className="text-xs text-neutral-400 mt-2 text-right">
                {formData.bio.length}/200
              </p>
            </div>

            {/* Interests */}
            <div className="card-paper p-6 rounded-xl">
              <label className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide mb-3">
                <Tag className="w-4 h-4" />
                Interests
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="input-retro rounded-lg"
                placeholder="Coding, Music, Football..."
              />
              <p className="text-xs text-neutral-400 mt-2">
                Separate interests with commas
              </p>
            </div>

            {/* Social Links */}
            <div className="card-paper p-6 rounded-xl">
              <h3 className="font-bold text-sm uppercase tracking-wide mb-4">Social Links</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="input-retro rounded-lg"
                    placeholder="https://github.com/username"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="input-retro rounded-lg"
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="input-retro rounded-lg"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ink text-white font-bold uppercase tracking-wide rounded-xl border-2 border-ink shadow-neo hover:shadow-neo-lg hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5" />
              {loading ? "Saving..." : "Save Changes"}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}
