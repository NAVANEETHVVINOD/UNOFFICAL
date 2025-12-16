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
import { generateEventQRData, getQRCodeImageUrl } from "../../../../lib/qrcode";
import { QrCode, Users, CheckCircle, Clock, Download, RefreshCw, UserCheck, UserX } from "lucide-react";
import Link from "next/link";

interface Attendee {
  id: string;
  userId: string;
  status: "GOING" | "INTERESTED" | "NOT_GOING";
  checkedIn: boolean;
  checkedInAt?: string;
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
  endsAt?: string;
  venue?: string;
  qrCode?: string;
  checkInLocked?: boolean;
  checkInLockedAt?: string;
  participants: Attendee[];
  _count: {
    going: number;
    checkedIn: number;
  };
}

function CheckInContent() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState<string>("");
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [locking, setLocking] = useState(false);

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
        // Generate or use existing QR code
        setQrData(data.qrCode || generateEventQRData(data.id));
      } else {
        // Mock data for demo
        const mockEvent: Event = {
          id: params.id as string,
          title: "Demo Event",
          startsAt: new Date().toISOString(),
          venue: "Main Hall",
          participants: [
            { id: "1", userId: "u1", status: "GOING", checkedIn: true, checkedInAt: new Date().toISOString(), user: { profile: { fullName: "Alex Chen" } } },
            { id: "2", userId: "u2", status: "GOING", checkedIn: false, user: { profile: { fullName: "Jordan Smith" } } },
            { id: "3", userId: "u3", status: "GOING", checkedIn: true, checkedInAt: new Date().toISOString(), user: { profile: { fullName: "Taylor Kim" } } },
            { id: "4", userId: "u4", status: "INTERESTED", checkedIn: false, user: { profile: { fullName: "Morgan Lee" } } },
          ],
          _count: { going: 4, checkedIn: 2 },
        };
        setEvent(mockEvent);
        setQrData(generateEventQRData(mockEvent.id));
      }
    } catch (error) {
      console.error("Failed to fetch event:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = async (participantId: string) => {
    setCheckingIn(participantId);
    try {
      const res = await fetch(`/api/events/${params.id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      
      if (res.ok) {
        // Update local state
        setEvent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            participants: prev.participants.map(p =>
              p.id === participantId
                ? { ...p, checkedIn: true, checkedInAt: new Date().toISOString() }
                : p
            ),
            _count: {
              ...prev._count,
              checkedIn: (prev._count?.checkedIn || 0) + 1,
            },
          };
        });
      } else {
        // Demo: update locally anyway
        setEvent(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            participants: prev.participants.map(p =>
              p.id === participantId
                ? { ...p, checkedIn: true, checkedInAt: new Date().toISOString() }
                : p
            ),
          };
        });
      }
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setCheckingIn(null);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = getQRCodeImageUrl(qrData, 400);
    link.download = `event-${params.id}-qr.png`;
    link.click();
  };

  const handleLockAttendance = async () => {
    if (isLocked) return;
    
    setLocking(true);
    try {
      const res = await fetch(`/api/events/${params.id}/lock-attendance`, {
        method: "POST",
      });
      
      if (res.ok) {
        setIsLocked(true);
        setEvent(prev => prev ? { ...prev, checkInLocked: true, checkInLockedAt: new Date().toISOString() } : prev);
      } else {
        // Demo: lock locally
        setIsLocked(true);
        setEvent(prev => prev ? { ...prev, checkInLocked: true, checkInLockedAt: new Date().toISOString() } : prev);
      }
    } catch (error) {
      console.error("Failed to lock attendance:", error);
      // Demo: lock locally anyway
      setIsLocked(true);
    } finally {
      setLocking(false);
    }
  };

  // Check if event is already locked
  useEffect(() => {
    if (event?.checkInLocked) {
      setIsLocked(true);
    }
  }, [event?.checkInLocked]);

  if (authLoading || loading) return <LoadingState />;
  if (!isAuthenticated || !event) return null;

  const goingAttendees = event.participants.filter(p => p.status === "GOING");
  const checkedInCount = goingAttendees.filter(p => p.checkedIn).length;
  const totalGoing = goingAttendees.length;

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
                <QrCode className="w-8 h-8" />
                Event Check-In
              </h1>
              <p className="font-serif text-xl mt-2">{event.title}</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* QR Code Display */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Tape className="mb-2" />
                <NewspaperCard className="p-6 border-4 bg-white text-center">
                  <h2 className="font-display text-xl font-black mb-4">SCAN TO CHECK IN</h2>
                  
                  <div className="bg-white p-4 border-4 border-black inline-block mb-4">
                    <img
                      src={getQRCodeImageUrl(qrData, 250)}
                      alt="Event QR Code"
                      className="w-[250px] h-[250px]"
                    />
                  </div>
                  
                  <p className="font-mono text-xs text-gray-500 mb-4">
                    Display this QR code at the event entrance
                  </p>
                  
                  <div className="flex gap-2 justify-center">
                    <RetroButton
                      onClick={downloadQRCode}
                      className="bg-accent-blue text-white border-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </RetroButton>
                    <RetroButton
                      onClick={() => setQrData(generateEventQRData(event.id))}
                      className="bg-gray-100 border-black"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </RetroButton>
                  </div>
                </NewspaperCard>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Tape className="mb-2" />
                <NewspaperCard className="p-6 border-4 bg-accent-yellow/10">
                  <h2 className="font-display text-xl font-black mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    ATTENDANCE
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border-2 border-black p-4 text-center">
                      <div className="text-3xl font-display font-black">{checkedInCount}</div>
                      <p className="text-xs font-mono text-gray-500">CHECKED IN</p>
                    </div>
                    <div className="bg-white border-2 border-black p-4 text-center">
                      <div className="text-3xl font-display font-black">{totalGoing}</div>
                      <p className="text-xs font-mono text-gray-500">REGISTERED</p>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span>Check-in Progress</span>
                      <span>{totalGoing > 0 ? Math.round((checkedInCount / totalGoing) * 100) : 0}%</span>
                    </div>
                    <div className="h-4 bg-white border-2 border-black overflow-hidden">
                      <motion.div
                        className="h-full bg-green-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${totalGoing > 0 ? (checkedInCount / totalGoing) * 100 : 0}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">
                      {new Date(event.startsAt).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Lock Attendance Button */}
                  {isLocked ? (
                    <div className="p-3 bg-red-50 border-2 border-red-500 text-center">
                      <p className="font-bold text-red-600 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Attendance Locked
                      </p>
                      <p className="text-xs text-red-500 mt-1">
                        {event.checkInLockedAt && `Locked at ${new Date(event.checkInLockedAt).toLocaleString()}`}
                      </p>
                    </div>
                  ) : (
                    <RetroButton
                      onClick={handleLockAttendance}
                      disabled={locking}
                      className="w-full bg-red-500 text-white border-black"
                    >
                      {locking ? "Locking..." : "Lock Attendance for Certificates"}
                    </RetroButton>
                  )}
                </NewspaperCard>
              </motion.div>
            </div>

            {/* Attendee List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <NewspaperCard className="p-6 border-4">
                <h2 className="font-display text-xl font-black mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  ATTENDEE LIST
                </h2>
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-2"
                >
                  {goingAttendees.length > 0 ? (
                    goingAttendees.map((attendee) => (
                      <motion.div
                        key={attendee.id}
                        variants={itemVariants}
                        className={`p-3 border-2 border-black flex items-center gap-3 ${
                          attendee.checkedIn ? "bg-green-50" : "bg-white"
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
                          {attendee.checkedIn && attendee.checkedInAt && (
                            <p className="text-xs font-mono text-gray-500">
                              Checked in at {new Date(attendee.checkedInAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                        
                        {attendee.checkedIn ? (
                          <Badge className="bg-green-500 text-white border-black flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            CHECKED IN
                          </Badge>
                        ) : isLocked ? (
                          <Badge className="bg-gray-400 text-white border-black flex items-center gap-1">
                            <UserX className="w-3 h-3" />
                            MISSED
                          </Badge>
                        ) : (
                          <RetroButton
                            onClick={() => handleManualCheckIn(attendee.id)}
                            disabled={checkingIn === attendee.id}
                            className="bg-accent-blue text-white border-black text-xs py-1 px-3"
                          >
                            {checkingIn === attendee.id ? "..." : "CHECK IN"}
                          </RetroButton>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 font-mono py-8">
                      No registered attendees yet.
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

export default function EventCheckInPage() {
  return (
    <ErrorBoundary>
      <CheckInContent />
    </ErrorBoundary>
  );
}
