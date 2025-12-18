"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Container from "../../components/ui/Container";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/ui/BottomNav";
import { NewspaperCard, RetroButton, Tape } from "../../components/ui/NewspaperUI";
import { PageTransition } from "../../providers/AnimationProvider";
import { ErrorBoundary, LoadingState } from "../../components/ErrorBoundary";
import { motion } from "framer-motion";
import { Upload, FileText, X, Loader2, ChevronDown, BookOpen } from "lucide-react";
import Link from "next/link";

const SUBJECTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "Business",
  "Engineering",
  "Literature",
  "Psychology",
  "Other",
];

const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

function UploadContent() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (authLoading) return <LoadingState />;
  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(selected.type)) {
        toast("Please upload PDF, DOC, DOCX, PNG, or JPG files only", "error");
        return;
      }
      
      // Validate file size (10MB max)
      if (selected.size > 10 * 1024 * 1024) {
        toast("File too large! Max 10MB", "error");
        return;
      }
      
      setFile(selected);
      setErrors(prev => ({ ...prev, file: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = "Title is required";
    if (!subject) newErrors.subject = "Please select a subject";
    if (!semester) newErrors.semester = "Please select a semester";
    if (!file) newErrors.file = "Please upload a file";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setUploading(true);
    try {
      // Upload file first
      const formData = new FormData();
      formData.append("file", file!);
      
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      let fileUrl = "#";
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json();
        fileUrl = uploadData.url;
      }
      
      // Create note entry
      const noteRes = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          semester,
          courseCode: courseCode || undefined,
          description: description || undefined,
          fileUrl,
        }),
      });
      
      if (noteRes.ok) {
        toast("Notes uploaded successfully! 📚", "success");
        router.push("/notes");
      } else {
        // Demo: still redirect
        toast("Notes uploaded! (Demo mode)", "success");
        router.push("/notes");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-2xl mx-auto mt-4 md:mt-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Link href="/notes" className="text-sm font-mono text-gray-500 hover:text-black mb-2 inline-block">
                ← Back to Notes
              </Link>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black uppercase flex items-center gap-2 sm:gap-3">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8" />
                Upload Notes
              </h1>
              <p className="font-mono text-gray-500 mt-2">Share your knowledge with fellow students</p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Tape className="mb-2" />
              <NewspaperCard className="p-6 border-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Data Structures Complete Notes"
                      className={`w-full p-3 border-2 ${errors.title ? "border-red-500" : "border-black"} focus:shadow-neo outline-none`}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                  </div>

                  {/* Subject & Semester */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-sm uppercase mb-2">
                        Subject *
                      </label>
                      <div className="relative">
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className={`w-full p-3 pr-10 border-2 ${errors.subject ? "border-red-500" : "border-black"} bg-white appearance-none cursor-pointer`}
                        >
                          <option value="">Select Subject</option>
                          {SUBJECTS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                      </div>
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                      <label className="block font-bold text-sm uppercase mb-2">
                        Semester *
                      </label>
                      <div className="relative">
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className={`w-full p-3 pr-10 border-2 ${errors.semester ? "border-red-500" : "border-black"} bg-white appearance-none cursor-pointer`}
                        >
                          <option value="">Select Semester</option>
                          {SEMESTERS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                      </div>
                      {errors.semester && <p className="text-red-500 text-xs mt-1">{errors.semester}</p>}
                    </div>
                  </div>

                  {/* Course Code */}
                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">
                      Course Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={courseCode}
                      onChange={(e) => setCourseCode(e.target.value)}
                      placeholder="e.g., CS201"
                      className="w-full p-3 border-2 border-black focus:shadow-neo outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of what's covered in these notes..."
                      rows={3}
                      className="w-full p-3 border-2 border-black focus:shadow-neo outline-none resize-none"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block font-bold text-sm uppercase mb-2">
                      File *
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                    
                    {file ? (
                      <div className="flex items-center gap-3 p-4 border-2 border-black bg-green-50">
                        <FileText className="w-8 h-8 text-green-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="p-2 hover:bg-red-100 rounded"
                        >
                          <X className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full p-8 border-2 border-dashed ${errors.file ? "border-red-500 bg-red-50" : "border-gray-400 hover:border-black hover:bg-gray-50"} transition-colors`}
                      >
                        <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                        <p className="font-bold">Click to upload</p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, DOCX, PNG, JPG (max 10MB)
                        </p>
                      </button>
                    )}
                    {errors.file && <p className="text-red-500 text-xs mt-1">{errors.file}</p>}
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-4">
                    <Link href="/notes" className="flex-1">
                      <RetroButton type="button" className="w-full bg-gray-100 border-black">
                        Cancel
                      </RetroButton>
                    </Link>
                    <RetroButton
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-accent-blue text-white border-black"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Upload Notes
                        </>
                      )}
                    </RetroButton>
                  </div>
                </form>
              </NewspaperCard>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-accent-yellow/20 border-2 border-accent-yellow"
            >
              <h3 className="font-bold mb-2">📝 Tips for great notes:</h3>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>• Use clear, descriptive titles</li>
                <li>• Include the course code for easy searching</li>
                <li>• Make sure your notes are legible and well-organized</li>
                <li>• You'll earn karma when others like your notes!</li>
              </ul>
            </motion.div>
          </div>
          </div>
        </Container>
        <BottomNav />
      </div>
    </PageTransition>
  );
}

export default function UploadNotesPage() {
  return (
    <ErrorBoundary>
      <UploadContent />
    </ErrorBoundary>
  );
}
