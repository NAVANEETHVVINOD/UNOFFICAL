"use client";

import { useState, useEffect } from "react";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import { PageTransition } from "../providers/AnimationProvider";
import Navbar from "../components/Navbar";
import BottomNav from "../components/ui/BottomNav";
import { ErrorBoundary, LoadingState } from "../components/ErrorBoundary";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../lib/animations";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { 
  FileText, Download, Heart, Search, Filter, Upload, 
  BookOpen, Calendar, User, Eye, Flag, ChevronDown 
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  subject: string;
  semester: string;
  courseCode?: string;
  description?: string;
  fileUrl: string;
  downloadCount: number;
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  uploader: {
    profile?: {
      fullName: string;
      avatarUrl?: string;
    };
  };
}

const SUBJECTS = [
  "All Subjects",
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
  "All Semesters",
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

function NotesContent() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "downloads">("recent");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, authLoading]);

  useEffect(() => {
    fetchNotes();
  }, [selectedSubject, selectedSemester, sortBy]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSubject !== "All Subjects") params.append("subject", selectedSubject);
      if (selectedSemester !== "All Semesters") params.append("semester", selectedSemester);
      params.append("sort", sortBy);

      const res = await fetch(`/api/notes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      } else {
        // Mock data for demo
        setNotes(generateMockNotes());
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setNotes(generateMockNotes());
    } finally {
      setLoading(false);
    }
  };

  const generateMockNotes = (): Note[] => {
    return [
      { id: "1", title: "Data Structures Complete Notes", subject: "Computer Science", semester: "Semester 3", courseCode: "CS201", downloadCount: 234, likeCount: 45, createdAt: new Date().toISOString(), fileUrl: "#", uploader: { profile: { fullName: "Alex Chen" } } },
      { id: "2", title: "Calculus II - Integration Techniques", subject: "Mathematics", semester: "Semester 2", courseCode: "MATH102", downloadCount: 189, likeCount: 32, createdAt: new Date().toISOString(), fileUrl: "#", uploader: { profile: { fullName: "Jordan Smith" } } },
      { id: "3", title: "Organic Chemistry Reactions", subject: "Chemistry", semester: "Semester 4", courseCode: "CHEM301", downloadCount: 156, likeCount: 28, createdAt: new Date().toISOString(), fileUrl: "#", uploader: { profile: { fullName: "Taylor Kim" } } },
      { id: "4", title: "Microeconomics Fundamentals", subject: "Economics", semester: "Semester 1", courseCode: "ECON101", downloadCount: 98, likeCount: 15, createdAt: new Date().toISOString(), fileUrl: "#", uploader: { profile: { fullName: "Morgan Lee" } } },
      { id: "5", title: "Database Management Systems", subject: "Computer Science", semester: "Semester 5", courseCode: "CS401", downloadCount: 312, likeCount: 67, createdAt: new Date().toISOString(), fileUrl: "#", uploader: { profile: { fullName: "Casey Brown" } } },
    ];
  };

  const handleLike = async (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isLiked: !note.isLiked, likeCount: note.isLiked ? note.likeCount - 1 : note.likeCount + 1 }
        : note
    ));
    
    try {
      await fetch(`/api/notes/${noteId}/like`, { method: "POST" });
    } catch (error) {
      console.error("Failed to like note:", error);
    }
  };

  const handleDownload = async (note: Note) => {
    // Track download
    try {
      await fetch(`/api/notes/${note.id}/download`, { method: "POST" });
    } catch (error) {
      console.error("Failed to track download:", error);
    }
    
    // Open file
    window.open(note.fileUrl, "_blank");
    
    // Update local count
    setNotes(prev => prev.map(n => 
      n.id === note.id ? { ...n, downloadCount: n.downloadCount + 1 } : n
    ));
  };

  const filteredNotes = notes.filter(note => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.courseCode?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (authLoading) return <LoadingState />;
  if (!isAuthenticated) return null;

  return (
    <PageTransition>
      <div className="bg-paper min-h-screen">
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}>
        </div>

        <Navbar />

        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8 min-h-screen relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 md:mt-8 mb-6 md:mb-8 text-center relative"
            >
              <Doodle
                src="/doodles/book.svg"
                className="w-20 h-20 md:w-24 md:h-24 absolute -top-10 md:-top-12 left-1/4 -z-10 opacity-20 -rotate-12"
              />
              <h1 className="font-display text-3xl md:text-5xl font-black mb-2">
                STUDY NOTES
              </h1>
              <p className="font-hand text-base md:text-lg text-gray-600">
                Share knowledge, ace exams together
              </p>
            </motion.div>

            {/* Actions Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes, subjects, courses..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-black focus:shadow-neo outline-none"
                  />
                </div>

                {/* Upload Button */}
                <Link href="/notes/upload">
                  <RetroButton className="bg-accent-blue text-white border-black">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Notes
                  </RetroButton>
                </Link>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="relative">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="appearance-none px-4 py-2 pr-8 border-2 border-black bg-white font-bold text-sm cursor-pointer"
                  >
                    {SUBJECTS.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="appearance-none px-4 py-2 pr-8 border-2 border-black bg-white font-bold text-sm cursor-pointer"
                  >
                    {SEMESTERS.map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none px-4 py-2 pr-8 border-2 border-black bg-white font-bold text-sm cursor-pointer"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="popular">Most Liked</option>
                    <option value="downloads">Most Downloaded</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </motion.div>

            {/* Notes Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 animate-pulse border-2 border-gray-300" />
                ))}
              </div>
            ) : filteredNotes.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredNotes.map((note) => (
                  <motion.div key={note.id} variants={itemVariants}>
                    <NewspaperCard className="p-5 border-4 hover:shadow-neo transition-shadow h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-accent-yellow/20 border-2 border-black flex items-center justify-center flex-shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg leading-tight line-clamp-2">
                            {note.title}
                          </h3>
                          <p className="text-xs font-mono text-gray-500 mt-1">
                            {note.courseCode && `${note.courseCode} • `}{note.subject}
                          </p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-accent-blue/10 text-accent-blue border-accent-blue/30 text-xs">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {note.semester}
                        </Badge>
                      </div>

                      {/* Uploader */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <User className="w-4 h-4" />
                        <span>{note.uploader.profile?.fullName || "Anonymous"}</span>
                        <span className="text-gray-300">•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Stats & Actions */}
                      <div className="mt-auto pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => handleLike(note.id)}
                            className={`flex items-center gap-1 transition-colors ${
                              note.isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${note.isLiked ? "fill-current" : ""}`} />
                            {note.likeCount}
                          </button>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Download className="w-4 h-4" />
                            {note.downloadCount}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Report"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          <RetroButton
                            onClick={() => handleDownload(note)}
                            className="bg-black text-white border-black text-xs py-1 px-3"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </RetroButton>
                        </div>
                      </div>
                    </NewspaperCard>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <NewspaperCard className="p-8 md:p-12 text-center border-4">
                <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="font-display text-xl md:text-2xl font-black mb-2">No Notes Found</h2>
                <p className="text-gray-500 mb-6 text-sm md:text-base">
                  {searchQuery 
                    ? `No notes match "${searchQuery}"`
                    : "Be the first to share notes for this subject!"}
                </p>
                <Link href="/notes/upload">
                  <RetroButton className="bg-accent-blue text-white border-black">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Notes
                  </RetroButton>
                </Link>
              </NewspaperCard>
            )}
          </div>
        </Container>

        <BottomNav />
      </div>
    </PageTransition>
  );
}

export default function NotesClient() {
  return (
    <ErrorBoundary>
      <NotesContent />
    </ErrorBoundary>
  );
}
