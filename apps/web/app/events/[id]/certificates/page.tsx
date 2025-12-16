"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Container from "../../../components/ui/Container";
import DashboardNavbar from "../../../components/ui/DashboardNavbar";
import { NewspaperCard, Badge, RetroButton, Tape } from "../../../components/ui/NewspaperUI";
import { PageTransition } from "../../../providers/AnimationProvider";
import { ErrorBoundary, LoadingState } from "../../../components/ErrorBoundary";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../../../lib/animations";
import { Award, Download, FileText, Users, CheckCircle, Image, Loader2 } from "lucide-react";
import Link from "next/link";

interface Attendee {
  id: string;
  userId: string;
  checkedIn: boolean;
  certificateUrl?: string;
  user: {
    profile?: {
      fullName: string;
      avatarUrl?: string;
    };
  };
}

interface Event {
  id: string;
  title: string;
  startsAt: string;
  club?: { name: string };
  participants: Attendee[];
}

interface CertificateTemplate {
  id: string;
  name: string;
  previewUrl: string;
}

const DEFAULT_TEMPLATES: CertificateTemplate[] = [
  { id: "classic", name: "Classic", previewUrl: "/templates/classic.png" },
  { id: "modern", name: "Modern", previewUrl: "/templates/modern.png" },
  { id: "minimal", name: "Minimal", previewUrl: "/templates/minimal.png" },
];

// Allowed file types for template upload
const ALLOWED_TEMPLATE_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const MAX_TEMPLATE_SIZE = 5 * 1024 * 1024; // 5MB

function CertificatesContent() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("classic");
  const [generating, setGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [customTemplates, setCustomTemplates] = useState<CertificateTemplate[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, authLoading]);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setEvent(data);
      } else {
        // Mock data
        setEvent({
          id: params.id as string,
          title: "Demo Workshop",
          startsAt: new Date().toISOString(),
          club: { name: "Tech Club" },
          participants: [
            { id: "1", userId: "u1", checkedIn: true, user: { profile: { fullName: "Alex Chen" } } },
            { id: "2", userId: "u2", checkedIn: true, user: { profile: { fullName: "Jordan Smith" } } },
            { id: "3", userId: "u3", checkedIn: true, certificateUrl: "/cert/sample.pdf", user: { profile: { fullName: "Taylor Kim" } } },
          ],
        });
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file type
    if (!ALLOWED_TEMPLATE_TYPES.includes(file.type)) {
      setUploadError("Please upload a PNG, JPEG, or PDF file");
      return;
    }

    // Validate file size
    if (file.size > MAX_TEMPLATE_SIZE) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // In production, upload to server
      const formData = new FormData();
      formData.append("template", file);
      formData.append("eventId", params.id as string);

      const res = await fetch("/api/certificates/templates", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const newTemplate: CertificateTemplate = {
          id: data.id || `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          previewUrl: data.url || previewUrl,
        };
        setCustomTemplates((prev) => [...prev, newTemplate]);
        setSelectedTemplate(newTemplate.id);
      } else {
        // Demo: add locally
        const newTemplate: CertificateTemplate = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          previewUrl,
        };
        setCustomTemplates((prev) => [...prev, newTemplate]);
        setSelectedTemplate(newTemplate.id);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadError("Failed to upload template. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const allTemplates = [...DEFAULT_TEMPLATES, ...customTemplates];

  const generateCertificates = async () => {
    if (!event) return;
    
    setGenerating(true);
    setGeneratedCount(0);
    
    const eligibleAttendees = event.participants.filter(p => p.checkedIn && !p.certificateUrl);
    
    for (let i = 0; i < eligibleAttendees.length; i++) {
      const attendee = eligibleAttendees[i];
      
      try {
        // In production, this would call the backend to generate certificates
        await fetch(`/api/events/${params.id}/certificates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: attendee.id,
            templateId: selectedTemplate,
          }),
        });
      } catch (error) {
        console.error("Failed to generate certificate:", error);
      }
      
      setGeneratedCount(i + 1);
      
      // Simulate delay for demo
      await new Promise(r => setTimeout(r, 500));
    }
    
    // Update local state
    setEvent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        participants: prev.participants.map(p =>
          p.checkedIn && !p.certificateUrl
            ? { ...p, certificateUrl: `/certificates/${p.id}.pdf` }
            : p
        ),
      };
    });
    
    setGenerating(false);
  };

  if (authLoading || loading) return <LoadingState />;
  if (!isAuthenticated || !event) return null;

  const checkedInAttendees = event.participants.filter(p => p.checkedIn);
  const withCertificates = checkedInAttendees.filter(p => p.certificateUrl);
  const pendingCertificates = checkedInAttendees.filter(p => !p.certificateUrl);

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          <div className="max-w-4xl mx-auto mt-12 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link href={`/events/${params.id}`} className="text-sm font-mono text-gray-500 hover:text-black mb-2 inline-block">
                ← Back to Event
              </Link>
              <h1 className="font-display text-3xl md:text-4xl font-black uppercase flex items-center gap-3">
                <Award className="w-8 h-8" />
                Certificate Generation
              </h1>
              <p className="font-serif text-xl mt-2">{event.title}</p>
              {event.club && (
                <p className="font-mono text-sm text-gray-500">by {event.club.name}</p>
              )}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-3 gap-4"
            >
              <NewspaperCard className="p-4 border-2 text-center">
                <Users className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{checkedInAttendees.length}</div>
                <p className="text-xs font-mono text-gray-500">CHECKED IN</p>
              </NewspaperCard>
              <NewspaperCard className="p-4 border-2 text-center bg-green-50">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{withCertificates.length}</div>
                <p className="text-xs font-mono text-gray-500">GENERATED</p>
              </NewspaperCard>
              <NewspaperCard className="p-4 border-2 text-center bg-yellow-50">
                <FileText className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{pendingCertificates.length}</div>
                <p className="text-xs font-mono text-gray-500">PENDING</p>
              </NewspaperCard>
            </motion.div>

            {/* Template Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tape className="mb-2" />
              <NewspaperCard className="p-6 border-4">
                <h2 className="font-display text-xl font-black mb-4 flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  SELECT TEMPLATE
                </h2>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {allTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 border-2 transition-all ${
                        selectedTemplate === template.id
                          ? "border-black shadow-neo bg-accent-yellow/20"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      <div className="aspect-[4/3] bg-gray-100 border border-gray-200 mb-2 flex items-center justify-center overflow-hidden">
                        {template.previewUrl.startsWith("blob:") || template.previewUrl.startsWith("/") ? (
                          <img src={template.previewUrl} alt={template.name} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <p className="font-bold text-sm">{template.name}</p>
                      {template.id.startsWith("custom-") && (
                        <Badge className="text-[10px] mt-1 bg-accent-pink text-white">Custom</Badge>
                      )}
                    </button>
                  ))}
                  
                  {/* Upload Custom Template */}
                  <label className="p-4 border-2 border-dashed border-gray-300 hover:border-black transition-all cursor-pointer flex flex-col items-center justify-center">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={handleTemplateUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="font-bold text-sm text-gray-500">Upload Custom</p>
                        <p className="text-[10px] text-gray-400">PNG, JPG, PDF</p>
                      </>
                    )}
                  </label>
                </div>
                
                {uploadError && (
                  <p className="text-red-500 text-sm mb-4">{uploadError}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <p className="text-sm font-mono text-gray-500">
                    {pendingCertificates.length} certificates will be generated
                  </p>
                  <RetroButton
                    onClick={generateCertificates}
                    disabled={generating || pendingCertificates.length === 0}
                    className="bg-accent-blue text-white border-black"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating ({generatedCount}/{pendingCertificates.length})
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4 mr-2" />
                        Generate All
                      </>
                    )}
                  </RetroButton>
                </div>
              </NewspaperCard>
            </motion.div>

            {/* Attendee List with Certificates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NewspaperCard className="p-6 border-4">
                <h2 className="font-display text-xl font-black mb-4">ATTENDEES</h2>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {checkedInAttendees.length > 0 ? (
                    checkedInAttendees.map((attendee) => (
                      <motion.div
                        key={attendee.id}
                        variants={itemVariants}
                        className={`p-3 border-2 border-black flex items-center gap-3 ${
                          attendee.certificateUrl ? "bg-green-50" : "bg-white"
                        }`}
                      >
                        <div className="w-10 h-10 border-2 border-black overflow-hidden bg-gray-100 flex-shrink-0">
                          {attendee.user.profile?.avatarUrl ? (
                            <img
                              src={attendee.user.profile.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold">
                              {attendee.user.profile?.fullName?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">
                            {attendee.user.profile?.fullName || "Unknown"}
                          </p>
                        </div>
                        
                        {attendee.certificateUrl ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 text-white border-black">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              READY
                            </Badge>
                            <a
                              href={attendee.certificateUrl}
                              download
                              className="p-2 border-2 border-black bg-white hover:bg-gray-50"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-400">
                            PENDING
                          </Badge>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 font-mono py-8">
                      No checked-in attendees. Certificates can only be generated for attendees who checked in.
                    </p>
                  )}
                </motion.div>
              </NewspaperCard>
            </motion.div>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}

export default function CertificatesPage() {
  return (
    <ErrorBoundary>
      <CertificatesContent />
    </ErrorBoundary>
  );
}
