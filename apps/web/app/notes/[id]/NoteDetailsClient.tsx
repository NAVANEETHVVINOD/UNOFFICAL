"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Staple,
  Tape,
} from "../../components/ui/NewspaperUI";
import Doodle from "../../components/ui/Doodle";
import { PageTransition } from "../../providers/AnimationProvider";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Note {
  id: string;
  title: string;
  subject: string;
  description: string | null;
  fileUrl: string;
  author: {
    profile: {
      fullName: string;
      collegeId: string | null;
    };
  };
  _count?: {
    likes: number;
  };
  createdAt: string;
}

export default function NoteDetailsClient() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchNoteDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchNoteDetails = async () => {
    try {
      const noteId = Array.isArray(id) ? id[0] : id;
      const data = await api.getNote(noteId as string);
      setNote(data);
    } catch (error) {
      console.error("Failed to fetch note details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!note || liking) return;
    setLiking(true);
    try {
      await api.likeNote(note.id);
      // In a real app, we'd update the like count locally or re-fetch
      alert("Liked!");
    } catch (error) {
      console.error("Failed to like note:", error);
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <Doodle
            src="/doodles/loading.svg"
            className="w-16 h-16 animate-spin"
          />
        </div>
      </Container>
    );
  }

  if (!note) {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl mb-4">NOTE NOT FOUND</h1>
          <RetroButton onClick={() => router.push("/notes")}>
            GO BACK
          </RetroButton>
        </div>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          <div className="max-w-4xl mx-auto mt-12">
            <RetroButton
              onClick={() => router.push("/notes")}
              variant="outline"
              className="mb-8 text-sm"
            >
              &lt;- BACK TO NOTES
            </RetroButton>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
              <NewspaperCard className="p-8 border-4">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b-2 border-black pb-6">
                  <div>
                    <Badge className="bg-accent-blue text-white border-black mb-2">
                      {note.subject}
                    </Badge>
                    <h1 className="font-display text-4xl md:text-5xl font-black mb-2">
                      {note.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 font-mono text-sm">
                      <span>By {note.author.profile.fullName}</span>
                      <span>•</span>
                      <span>
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <RetroButton
                      onClick={handleLike}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      ❤️ {note._count?.likes || 0}
                    </RetroButton>
                    <a
                      href={note.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <RetroButton className="bg-black text-white">
                        DOWNLOAD / VIEW
                      </RetroButton>
                    </a>
                  </div>
                </div>

                <div className="prose font-body text-lg leading-relaxed mb-8">
                  <h3 className="font-bold text-xl uppercase mb-4">
                    Description
                  </h3>
                  <p>{note.description || "No description provided."}</p>
                </div>

                {/* Preview Placeholder (if it were a PDF) */}
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-8 text-center rounded-lg">
                  <Doodle
                    src="/doodles/file.svg"
                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                  />
                  <p className="font-mono text-gray-500">
                    Preview not available. Please download to view.
                  </p>
                </div>
              </NewspaperCard>
            </motion.div>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
