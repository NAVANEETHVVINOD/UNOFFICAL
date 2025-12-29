"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Container from "../../../components/ui/Container";
import Navbar from "../../../components/Navbar";
import BottomNav from "../../../components/ui/BottomNav";
import { NewspaperCard, Badge, RetroButton } from "../../../components/ui/NewspaperUI";
import { PageTransition } from "../../../providers/AnimationProvider";
import { ErrorBoundary, LoadingState } from "../../../components/ErrorBoundary";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants, itemVariants } from "../../../../lib/animations";
import { api } from "../../../../lib/api";
import {
  Award,
  Download,
  FileText,
  Users,
  CheckCircle,
  Image,
  Loader2,
  ChevronLeft,
  AlertCircle,
  Send,
  X,
  Clock,
} from "lucide-react";

interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
}

interface Certificate {
  id: string;
  eventId: string;
  userId: string;
  templateId: string;
  fileUrl: string;
  issuedAt: string;
}

interface CertificateWithUser {
  certificate: Certificate;
  userName: string;
  userEmail: string;
}

interface Attendee {
  id: string;
  userId: string;
  status: string;
  checkInTime: string | null;
  certificateId: string | null;
  user: {
    id: string;
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
  certificateEnabled: boolean;
  certificateTemplateId?: string;
  club?: { name: string };
}


function CertificatesContent() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [certificates, setCertificates] = useState<CertificateWithUser[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>("default");
  const [generating, setGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [totalToGenerate, setTotalToGenerate] = useState(0);
  
  // Manual issuance modal state
  const [showManualIssue, setShowManualIssue] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  const [issueReason, setIssueReason] = useState("");
  const [issuing, setIssuing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!params.id) return;
    setLoading(true);
    try {
      const [eventData, roleData, templatesData, certsData, regsData] = await Promise.all([
        api.getEvent(params.id as string),
        api.getMyEventRole(params.id as string),
        api.getCertificateTemplates().catch(() => []),
        api.getEventCertificates(params.id as string).catch(() => ({ certificates: [] })),
        api.getEventRegistrations(params.id as string, "ATTENDED").catch(() => ({ registrations: [] })),
      ]);
      
      setEvent(eventData);
      setUserRole(roleData.role);
      setTemplates(Array.isArray(templatesData) ? templatesData : []);
      setCertificates(certsData.certificates || []);
      setAttendees(regsData.registrations || []);
      
      if (eventData.certificateTemplateId) {
        setSelectedTemplate(eventData.certificateTemplateId);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router, authLoading]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const canManageCertificates = userRole === "CREATOR" || userRole === "CO_ORGANIZER";

  const eligibleAttendees = attendees.filter(
    (a) => a.status === "ATTENDED" && !a.certificateId
  );
  const withCertificates = attendees.filter((a) => a.certificateId);

  const handleBatchGenerate = async () => {
    if (!event || eligibleAttendees.length === 0) return;
    
    setGenerating(true);
    setGeneratedCount(0);
    setTotalToGenerate(eligibleAttendees.length);
    
    try {
      const result = await api.batchIssueCertificates(params.id as string);
      if (result.success) {
        setGeneratedCount(result.issued || 0);
        await fetchData();
      } else {
        alert(result.error || "Failed to generate certificates");
      }
    } catch (error: any) {
      alert(error.message || "Failed to generate certificates");
    } finally {
      setGenerating(false);
    }
  };

  const handleManualIssue = async () => {
    if (!selectedAttendee || !issueReason.trim()) return;
    
    setIssuing(true);
    try {
      const result = await api.issueCertificate(
        params.id as string,
        selectedAttendee.userId,
        issueReason.trim()
      );
      
      if (result.success) {
        setShowManualIssue(false);
        setSelectedAttendee(null);
        setIssueReason("");
        await fetchData();
      } else {
        alert(result.error || "Failed to issue certificate");
      }
    } catch (error: any) {
      alert(error.message || "Failed to issue certificate");
    } finally {
      setIssuing(false);
    }
  };

  const openManualIssue = (attendee: Attendee) => {
    setSelectedAttendee(attendee);
    setIssueReason("");
    setShowManualIssue(true);
  };

  if (authLoading || loading) return <LoadingState />;
  if (!isAuthenticated) return null;

  if (!userRole || userRole === "VOLUNTEER") {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="font-display text-4xl mb-4 dark:text-white">ACCESS DENIED</h1>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            You don&apos;t have permission to manage certificates.
          </p>
          <RetroButton onClick={() => router.push(`/events/${params.id}`)}>
            GO BACK
          </RetroButton>
        </div>
      </Container>
    );
  }


  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-gray-900">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto mt-4 md:mt-8 space-y-6">
              {/* Back Button */}
              <RetroButton
                onClick={() => router.push(`/events/${params.id}/manage`)}
                variant="outline"
                className="text-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                BACK TO MANAGE
              </RetroButton>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="font-display text-3xl md:text-4xl font-black uppercase flex items-center gap-3 dark:text-white">
                  <Award className="w-8 h-8" />
                  Certificate Management
                </h1>
                <p className="font-serif text-xl mt-2 dark:text-gray-300">{event?.title}</p>
                {event?.club && (
                  <p className="font-mono text-sm text-gray-500 dark:text-gray-400">
                    by {event.club.name}
                  </p>
                )}
              </motion.div>

              {/* Certificate Status Warning */}
              {!event?.certificateEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-yellow-800 dark:text-yellow-200">
                      Certificates Not Enabled
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Certificates are not enabled for this event. Enable them in event settings to issue certificates.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-3 gap-4"
              >
                <NewspaperCard className="p-4 border-2 text-center dark:bg-gray-800 dark:border-gray-700">
                  <Users className="w-6 h-6 mx-auto mb-2 dark:text-gray-300" />
                  <div className="text-2xl font-bold dark:text-white">{attendees.length}</div>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">ATTENDED</p>
                </NewspaperCard>
                <NewspaperCard className="p-4 border-2 text-center bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <div className="text-2xl font-bold dark:text-white">{withCertificates.length}</div>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">ISSUED</p>
                </NewspaperCard>
                <NewspaperCard className="p-4 border-2 text-center bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                  <div className="text-2xl font-bold dark:text-white">{eligibleAttendees.length}</div>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">PENDING</p>
                </NewspaperCard>
              </motion.div>

              {/* Template Selection */}
              {templates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <NewspaperCard className="p-6 border-4 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="font-display text-xl font-black mb-4 flex items-center gap-2 dark:text-white">
                      <Image className="w-5 h-5" />
                      SELECT TEMPLATE
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template.id)}
                          className={`p-4 border-2 transition-all rounded-lg ${
                            selectedTemplate === template.id
                              ? "border-black dark:border-white shadow-neo bg-accent-yellow/20 dark:bg-yellow-900/30"
                              : "border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white"
                          }`}
                        >
                          <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 mb-2 flex items-center justify-center overflow-hidden rounded">
                            <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                          </div>
                          <p className="font-bold text-sm dark:text-white">{template.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {template.description}
                          </p>
                        </button>
                      ))}
                    </div>
                    
                    {canManageCertificates && event?.certificateEnabled && (
                      <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                        <p className="text-sm font-mono text-gray-500 dark:text-gray-400">
                          {eligibleAttendees.length} certificates will be generated
                        </p>
                        <RetroButton
                          onClick={handleBatchGenerate}
                          disabled={generating || eligibleAttendees.length === 0}
                          className="bg-accent-blue text-white border-black"
                        >
                          {generating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating ({generatedCount}/{totalToGenerate})
                            </>
                          ) : (
                            <>
                              <Award className="w-4 h-4 mr-2" />
                              Generate All
                            </>
                          )}
                        </RetroButton>
                      </div>
                    )}
                  </NewspaperCard>
                </motion.div>
              )}


              {/* Attendee List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <NewspaperCard className="p-6 border-4 dark:bg-gray-800 dark:border-gray-700">
                  <h2 className="font-display text-xl font-black mb-4 dark:text-white">
                    ATTENDEES ({attendees.length})
                  </h2>
                  
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-2"
                  >
                    {attendees.length > 0 ? (
                      attendees.map((attendee) => (
                        <motion.div
                          key={attendee.id}
                          variants={itemVariants}
                          className={`p-3 border-2 border-black dark:border-gray-600 flex items-center gap-3 rounded-lg ${
                            attendee.certificateId
                              ? "bg-green-50 dark:bg-green-900/20"
                              : "bg-white dark:bg-gray-700"
                          }`}
                        >
                          <div className="w-10 h-10 border-2 border-black dark:border-gray-500 overflow-hidden bg-gray-100 dark:bg-gray-600 flex-shrink-0 rounded-full">
                            {attendee.user.profile?.avatarUrl ? (
                              <img
                                src={attendee.user.profile.avatarUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold dark:text-white">
                                {attendee.user.profile?.fullName?.charAt(0) || "?"}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate dark:text-white">
                              {attendee.user.profile?.fullName || "Unknown"}
                            </p>
                            {attendee.checkInTime && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Checked in: {new Date(attendee.checkInTime).toLocaleString()}
                              </p>
                            )}
                          </div>
                          
                          {attendee.certificateId ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500 text-white border-black dark:border-green-400">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                ISSUED
                              </Badge>
                            </div>
                          ) : canManageCertificates && event?.certificateEnabled ? (
                            <RetroButton
                              onClick={() => openManualIssue(attendee)}
                              className="text-sm py-1 px-3"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Issue
                            </RetroButton>
                          ) : (
                            <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-400 dark:border-yellow-600">
                              PENDING
                            </Badge>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 font-mono py-8">
                        No attended users yet. Certificates can only be issued to users who checked in.
                      </p>
                    )}
                  </motion.div>
                </NewspaperCard>
              </motion.div>

              {/* Issued Certificates List */}
              {certificates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <NewspaperCard className="p-6 border-4 dark:bg-gray-800 dark:border-gray-700">
                    <h2 className="font-display text-xl font-black mb-4 dark:text-white">
                      ISSUED CERTIFICATES ({certificates.length})
                    </h2>
                    
                    <div className="space-y-2">
                      {certificates.map((cert) => (
                        <div
                          key={cert.certificate.id}
                          className="p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-700 flex items-center gap-3 rounded-lg"
                        >
                          <Award className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold truncate dark:text-white">{cert.userName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {cert.userEmail} • Issued: {new Date(cert.certificate.issuedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <a
                            href={cert.certificate.fileUrl}
                            download
                            className="p-2 border-2 border-black dark:border-gray-500 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 rounded transition-colors"
                          >
                            <Download className="w-4 h-4 dark:text-white" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </NewspaperCard>
                </motion.div>
              )}
            </div>
          </div>
        </Container>
        <BottomNav />


        {/* Manual Issue Modal */}
        <AnimatePresence>
          {showManualIssue && selectedAttendee && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md overflow-hidden shadow-xl"
              >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                  <h3 className="font-bold text-lg dark:text-white">Issue Certificate</h3>
                  <button
                    onClick={() => setShowManualIssue(false)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="w-5 h-5 dark:text-gray-300" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-12 h-12 border-2 border-black dark:border-gray-500 overflow-hidden bg-gray-100 dark:bg-gray-600 flex-shrink-0 rounded-full">
                      {selectedAttendee.user.profile?.avatarUrl ? (
                        <img
                          src={selectedAttendee.user.profile.avatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg dark:text-white">
                          {selectedAttendee.user.profile?.fullName?.charAt(0) || "?"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">
                        {selectedAttendee.user.profile?.fullName || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Checked in: {selectedAttendee.checkInTime
                          ? new Date(selectedAttendee.checkInTime).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Reason for Manual Issuance <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={issueReason}
                      onChange={(e) => setIssueReason(e.target.value)}
                      placeholder="e.g., Special recognition, Speaker, Organizer..."
                      className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:border-black dark:focus:border-white outline-none resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This reason will be logged for audit purposes.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <RetroButton
                      onClick={() => setShowManualIssue(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </RetroButton>
                    <RetroButton
                      onClick={handleManualIssue}
                      disabled={issuing || !issueReason.trim()}
                      className="flex-1 bg-green-500 text-white border-black"
                    >
                      {issuing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Issuing...
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Issue Certificate
                        </>
                      )}
                    </RetroButton>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
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
