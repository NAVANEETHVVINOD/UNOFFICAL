"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Container from "../../components/ui/Container";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/ui/BottomNav";
import { PageTransition } from "../../providers/AnimationProvider";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { api } from "../../../lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Users,
  ArrowLeft,
  Loader2,
  Plus,
  X,
  Calendar,
  Tag,
} from "lucide-react";

const SKILL_OPTIONS = [
  "React", "Node.js", "Python", "Java", "UI/UX Design", "Graphic Design",
  "Video Editing", "Photography", "Music Production", "Writing",
  "Marketing", "Business Development", "Data Analysis", "Machine Learning",
  "Mobile Development", "DevOps", "Project Management", "Research",
];

const collabSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000, "Description too long"),
  deadline: z.string().optional(),
});

type CollabFormValues = z.infer<typeof collabSchema>;

export default function CreateCollaboPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollabFormValues>({
    resolver: zodResolver(collabSchema),
  });

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill) && selectedSkills.length < 10) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  const onSubmit = async (data: CollabFormValues) => {
    if (!isAuthenticated) {
      toast("Please log in to create a collaboration", "error");
      router.push("/login");
      return;
    }

    if (selectedSkills.length === 0) {
      toast("Please select at least one skill needed", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createPost({
        type: "COLLAB",
        title: data.title,
        content: data.description,
        skills: selectedSkills,
        deadline: data.deadline || null,
        collegeSlug: user?.profile?.college?.slug,
        visibility: "PUBLIC",
        collabData: {
          title: data.title,
          description: data.description,
          skills: selectedSkills,
          deadline: data.deadline,
        },
      });

      toast("Collaboration posted successfully!", "success");
      router.push("/collabo");
    } catch (error: any) {
      toast(error.message || "Failed to create collaboration", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <div className="pt-20 pb-24 max-w-2xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-neutral-500 hover:text-ink mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-accent-mint border-2 border-ink rounded-xl shadow-neo-sm">
                <Users className="w-8 h-8 text-ink" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-black uppercase text-ink dark:text-dark-text">
                  New Collaboration
                </h1>
                <p className="font-mono text-sm text-neutral-500">
                  Find teammates for your project
                </p>
              </div>
            </div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-dark-text mb-2">
                  Project Title *
                </label>
                <input
                  {...register("title")}
                  placeholder="e.g., Mobile App for Campus Events"
                  className="w-full px-4 py-3 border-2 border-ink rounded-xl bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.title && (
                  <p className="text-accent-coral text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-dark-text mb-2">
                  Description *
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Describe your project, what you're looking for, and what collaborators can expect..."
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-ink rounded-xl bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                {errors.description && (
                  <p className="text-accent-coral text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Skills Needed */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-dark-text mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Skills Needed *
                </label>
                
                {/* Selected Skills */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-accent-mint border-2 border-ink rounded-full text-sm font-medium"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-accent-coral"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Skill Options */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {SKILL_OPTIONS.filter((s) => !selectedSkills.includes(s)).map(
                    (skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addSkill(skill)}
                        className="px-3 py-1 border-2 border-neutral-200 rounded-full text-sm hover:border-ink hover:bg-neutral-100 transition-all"
                      >
                        {skill}
                      </button>
                    )
                  )}
                </div>

                {/* Custom Skill Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    placeholder="Add custom skill..."
                    className="flex-1 px-4 py-2 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-ink"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    className="px-4 py-2 border-2 border-ink rounded-xl hover:bg-neutral-100 transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-dark-text mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Deadline (Optional)
                </label>
                <input
                  {...register("deadline")}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border-2 border-ink rounded-xl bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 border-2 border-ink rounded-xl font-bold hover:bg-neutral-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-neo btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Users className="w-5 h-5" />
                      Post Collaboration
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          </div>
        </Container>

        <BottomNav />
      </div>
    </PageTransition>
  );
}
