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
  GraduationCap,
  ArrowLeft,
  Loader2,
  BookOpen,
} from "lucide-react";

const classroomSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name too long"),
  subject: z.string().optional(),
  description: z.string().max(500, "Description too long").optional(),
});

type ClassroomFormValues = z.infer<typeof classroomSchema>;

export default function CreateClassroomPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
  });

  const onSubmit = async (data: ClassroomFormValues) => {
    if (!isAuthenticated || !user?.profile?.collegeId) {
      toast("Please complete your profile first", "error");
      return;
    }

    if (user.role !== "FACULTY") {
      toast("Only teachers can create classrooms", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const classroom = await api.createClassroom({
        name: data.name,
        subject: data.subject,
        description: data.description,
        collegeId: user.profile.collegeId,
      });

      toast("Classroom created successfully!", "success");
      router.push(`/classrooms/${classroom.id}`);
    } catch (error: any) {
      toast(error.message || "Failed to create classroom", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || user?.role !== "FACULTY") {
    return (
      <PageTransition>
        <div className="min-h-screen bg-paper dark:bg-dark-bg">
          <Navbar />
          <Container>
            <div className="pt-20 pb-24 text-center">
              <h1 className="font-display text-2xl mb-4">Access Denied</h1>
              <p className="text-neutral-500 mb-6">
                Only teachers can create classrooms
              </p>
              <button
                onClick={() => router.push("/classrooms")}
                className="btn-neo btn-primary"
              >
                Back to Classrooms
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
              <div className="p-3 bg-accent-purple border-2 border-ink rounded-xl shadow-neo-sm">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-black uppercase text-ink dark:text-dark-text">
                  Create Classroom
                </h1>
                <p className="font-mono text-sm text-neutral-500">
                  Set up a new class for your students
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
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-dark-text mb-2">
                  Class Name *
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g., Introduction to Computer Science"
                  className="w-full px-4 py-3 border-2 border-ink rounded-xl bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && (
                  <p className="text-accent-coral text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-dark-text mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Subject (Optional)
                </label>
                <input
                  {...register("subject")}
                  placeholder="e.g., Computer Science, Mathematics"
                  className="w-full px-4 py-3 border-2 border-ink rounded-xl bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-ink dark:text-dark-text mb-2">
                  Description (Optional)
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Describe what students will learn in this class..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-ink rounded-xl bg-white dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                {errors.description && (
                  <p className="text-accent-coral text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Info Box */}
              <div className="p-4 bg-accent-purple/10 border-2 border-accent-purple/30 rounded-xl">
                <p className="text-sm text-neutral-600">
                  A unique class code will be generated automatically. Share this
                  code with your students so they can join the classroom.
                </p>
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5" />
                      Create Classroom
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
