"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import UploadComponent from "../../components/ui/UploadComponent";

export default function UploadNotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: 1,
    description: "",
    fileUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, we would handle file upload here and get a URL
      // For now, we'll assume the user provides a link (e.g., Drive/Dropbox)
      await api.createNote(formData);
      router.push("/notes");
    } catch (error) {
      console.error("Failed to upload note:", error);
      alert("Failed to upload note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          <div className="max-w-2xl mx-auto mt-12">
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
                <div className="text-center mb-8">
                  <h1 className="font-display text-4xl font-black mb-2">
                    UPLOAD NOTES
                  </h1>
                  <p className="font-hand text-xl text-gray-600">
                    Help your peers. Share your knowledge.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block font-bold mb-2 uppercase text-sm">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                      placeholder="e.g. Calculus Module 1 Summary"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 uppercase text-sm">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                      placeholder="e.g. Mathematics"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 uppercase text-sm">
                      Semester
                    </label>
                    <select
                      required
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          semester: parseInt(e.target.value),
                        })
                      }
                      className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-2 uppercase text-sm">
                      Description
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow h-32"
                      placeholder="Briefly describe what's in these notes..."
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2 uppercase text-sm">
                      Upload File (PDF/Image)
                    </label>
                    {formData.fileUrl ? (
                      <div className="flex items-center gap-4 p-4 border-2 border-black bg-green-50">
                        <div className="flex-1 truncate font-mono text-sm">
                          {formData.fileUrl}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, fileUrl: "" })
                          }
                          className="text-red-500 font-bold hover:underline"
                        >
                          REMOVE
                        </button>
                      </div>
                    ) : (
                      <UploadComponent
                        onUpload={(url: string) =>
                          setFormData({ ...formData, fileUrl: url })
                        }
                        accept=".pdf,image/*"
                        label="Click to upload notes"
                      />
                    )}
                  </div>

                  <RetroButton
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    {loading ? "UPLOADING..." : "PUBLISH NOTES"}
                  </RetroButton>
                </form>
              </NewspaperCard>
            </motion.div>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
