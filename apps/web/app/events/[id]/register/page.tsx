"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Container from "../../../components/ui/Container";
import { PageTransition } from "../../../providers/AnimationProvider";
import Navbar from "../../../components/Navbar";
import BottomNav from "../../../components/ui/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../../lib/api";
import {
  openRazorpayCheckout,
  formatAmountShort,
  type FeeBreakdown,
} from "../../../../lib/razorpay";
import {
  ArrowLeft,
  Ticket,
  Check,
  AlertCircle,
  Clock,
  Users,
  QrCode,
  Calendar,
  MapPin,
  Loader2,
  CreditCard,
  Info,
  Bell,
  UserPlus,
  X,
} from "lucide-react";
import QRCode from "qrcode";

interface TicketAvailability {
  ticketId: string;
  name: string;
  price: number;
  available: number | null;
  total: number | null;
  sold: number;
  status: "AVAILABLE" | "SOLD_OUT" | "NOT_ON_SALE" | "SALES_ENDED";
  salesStart: string | null;
  salesEnd: string | null;
  perUserLimit: number;
  userPurchased: number;
}

interface WaitlistEntry {
  ticketId: string;
  ticketName: string;
  position: number;
  status: "WAITING" | "NOTIFIED" | "CLAIMED" | "EXPIRED";
}

interface EventDetails {
  id: string;
  title: string;
  description: string;
  coverUrl: string | null;
  startsAt: string;
  endsAt: string;
  venue: string | null;
  onlineLink: string | null;
  noRefundPolicy: boolean;
  formSchema?: { schema: FormField[] };
}

interface FormField {
  id: string;
  type: "text" | "number" | "email" | "phone" | "select" | "radio" | "checkbox" | "file";
  label: string;
  required: boolean;
  options?: string[];
}

interface RegistrationResult {
  registrationId: string;
  qrToken: string;
  ticketName: string;
  eventTitle: string;
}

type Step = "select" | "form" | "confirm" | "success";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [step, setStep] = useState<Step>("select");
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [tickets, setTickets] = useState<TicketAvailability[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketAvailability | null>(null);
  const [formResponses, setFormResponses] = useState<Record<string, unknown>>({});
  const [noRefundConsent, setNoRefundConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<RegistrationResult | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [feeBreakdown, setFeeBreakdown] = useState<FeeBreakdown | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [joiningWaitlist, setJoiningWaitlist] = useState<string | null>(null);
  const [leavingWaitlist, setLeavingWaitlist] = useState<string | null>(null);
  const [claimingTicket, setClaimingTicket] = useState<string | null>(null);

  useEffect(() => {
    loadEventAndTickets();
  }, [eventId]);

  useEffect(() => {
    if (registration?.qrToken) {
      generateQrCode(registration.qrToken);
    }
  }, [registration?.qrToken]);

  // Calculate fees when a paid ticket is selected
  useEffect(() => {
    if (selectedTicket && selectedTicket.price > 0) {
      api.calculateFees(selectedTicket.price, true)
        .then(setFeeBreakdown)
        .catch((err) => console.error("Failed to calculate fees:", err));
    } else {
      setFeeBreakdown(null);
    }
  }, [selectedTicket]);

  const loadEventAndTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventData, ticketsData, waitlistData] = await Promise.all([
        api.getEvent(eventId),
        api.getTicketAvailability(eventId),
        api.getMyWaitlistStatus(eventId).catch(() => ({ entries: [] })),
      ]);
      setEvent(eventData);
      setTickets(ticketsData);
      setWaitlistEntries(waitlistData.entries || []);
    } catch (err: any) {
      setError(err.message || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async (token: string) => {
    try {
      const url = await QRCode.toDataURL(token, {
        width: 256,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code:", err);
    }
  };

  const handleSelectTicket = (ticket: TicketAvailability) => {
    if (ticket.status !== "AVAILABLE") return;
    if (ticket.userPurchased >= ticket.perUserLimit) return;
    setSelectedTicket(ticket);
    
    // Skip form step if no custom form fields
    if (!event?.formSchema?.schema?.length) {
      setStep("confirm");
    } else {
      setStep("form");
    }
  };

  const handleJoinWaitlist = async (ticketId: string) => {
    try {
      setJoiningWaitlist(ticketId);
      setError(null);
      await api.joinWaitlist(eventId, ticketId);
      // Refresh waitlist status
      const waitlistData = await api.getMyWaitlistStatus(eventId);
      setWaitlistEntries(waitlistData.entries || []);
    } catch (err: any) {
      setError(err.message || "Failed to join waitlist");
    } finally {
      setJoiningWaitlist(null);
    }
  };

  const handleLeaveWaitlist = async (ticketId: string) => {
    try {
      setLeavingWaitlist(ticketId);
      setError(null);
      await api.leaveWaitlist(eventId, ticketId);
      // Refresh waitlist status
      const waitlistData = await api.getMyWaitlistStatus(eventId);
      setWaitlistEntries(waitlistData.entries || []);
    } catch (err: any) {
      setError(err.message || "Failed to leave waitlist");
    } finally {
      setLeavingWaitlist(null);
    }
  };

  const handleClaimTicket = async (ticketId: string) => {
    try {
      setClaimingTicket(ticketId);
      setError(null);
      const result = await api.claimWaitlistTicket(eventId, ticketId);
      if (result.success) {
        // Refresh data and allow user to complete registration
        await loadEventAndTickets();
        // Find the ticket and select it
        const ticket = tickets.find(t => t.ticketId === ticketId);
        if (ticket) {
          setSelectedTicket(ticket);
          if (!event?.formSchema?.schema?.length) {
            setStep("confirm");
          } else {
            setStep("form");
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to claim ticket");
    } finally {
      setClaimingTicket(null);
    }
  };

  const handleFormSubmit = () => {
    // Validate required fields
    const formFields = event?.formSchema?.schema || [];
    for (const field of formFields) {
      if (field.required && !formResponses[field.id]) {
        setError(`Please fill in: ${field.label}`);
        return;
      }
    }
    setError(null);
    setStep("confirm");
  };

  const handleRegister = async () => {
    if (!selectedTicket) return;
    
    // Check no-refund consent for paid tickets
    if (selectedTicket.price > 0 && !noRefundConsent) {
      setError("Please acknowledge the no-refund policy");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // First, create the registration (PENDING status for paid tickets)
      const result = await api.registerForEvent(eventId, {
        ticketId: selectedTicket.ticketId,
        formResponses: Object.keys(formResponses).length > 0 ? formResponses : undefined,
        noRefundConsent: selectedTicket.price > 0 ? noRefundConsent : undefined,
      });

      if (!result.success) {
        setError(result.error || "Registration failed");
        return;
      }

      // For free tickets, registration is complete
      if (selectedTicket.price === 0) {
        setRegistration({
          registrationId: result.registrationId,
          qrToken: result.qrToken,
          ticketName: selectedTicket.name,
          eventTitle: event?.title || "",
        });
        setStep("success");
        return;
      }

      // For paid tickets, initiate Razorpay payment
      setPaymentProcessing(true);
      
      try {
        // Create payment order
        const orderResponse = await api.createPaymentOrder(result.registrationId, true);
        
        if (!orderResponse.order) {
          throw new Error("Failed to create payment order");
        }

        // Open Razorpay checkout
        const paymentResponse = await openRazorpayCheckout({
          amount: orderResponse.order.amount,
          currency: orderResponse.order.currency,
          name: "Linker Events",
          description: `${event?.title} - ${selectedTicket.name}`,
          order_id: orderResponse.order.id,
          prefill: {
            // User info will be auto-filled if available
          },
          notes: {
            registrationId: result.registrationId,
            eventId: eventId,
          },
          theme: {
            color: "#000000",
          },
        });

        // Verify payment with backend
        const verifyResult = await api.verifyPayment(
          paymentResponse.razorpay_order_id,
          paymentResponse.razorpay_payment_id,
          paymentResponse.razorpay_signature,
        );

        if (verifyResult.success) {
          // Fetch updated registration to get QR token
          const updatedRegistration = await api.getUserRegistration(eventId);
          
          setRegistration({
            registrationId: verifyResult.registrationId || result.registrationId,
            qrToken: updatedRegistration?.qrToken || result.qrToken,
            ticketName: selectedTicket.name,
            eventTitle: event?.title || "",
          });
          setStep("success");
        } else {
          // Payment verification failed - try manual verification
          setError("Payment verification failed. Checking payment status...");
          
          const manualResult = await api.manualVerifyPayment(orderResponse.order.id);
          if (manualResult.success) {
            const updatedRegistration = await api.getUserRegistration(eventId);
            setRegistration({
              registrationId: manualResult.registrationId || result.registrationId,
              qrToken: updatedRegistration?.qrToken || result.qrToken,
              ticketName: selectedTicket.name,
              eventTitle: event?.title || "",
            });
            setStep("success");
          } else {
            setError("Payment verification failed. Please contact support if amount was deducted.");
          }
        }
      } catch (paymentError: any) {
        // Handle payment cancellation or failure
        if (paymentError.message === "Payment cancelled by user") {
          setError("Payment was cancelled. Your registration is pending - you can retry payment.");
        } else {
          setError(paymentError.message || "Payment failed. Please try again.");
        }
      } finally {
        setPaymentProcessing(false);
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatPrice = (paise: number) => {
    if (paise === 0) return "Free";
    return `₹${(paise / 100).toFixed(0)}`;
  };

  const getStatusBadge = (ticket: TicketAvailability) => {
    switch (ticket.status) {
      case "AVAILABLE":
        if (ticket.userPurchased >= ticket.perUserLimit) {
          return { text: "Limit Reached", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" };
        }
        return { text: "Available", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
      case "SOLD_OUT":
        return { text: "Sold Out", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
      case "NOT_ON_SALE":
        return { text: "Coming Soon", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
      case "SALES_ENDED":
        return { text: "Sales Ended", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400" };
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-paper dark:bg-gray-900">
          <Navbar />
          <Container>
            <div className="pt-20 pb-24 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          </Container>
        </div>
      </PageTransition>
    );
  }

  if (error && !event) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-paper dark:bg-gray-900">
          <Navbar />
          <Container>
            <div className="pt-20 pb-24">
              <div className="max-w-lg mx-auto text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h1 className="text-xl font-bold mb-2 dark:text-white">Error</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <button
                  onClick={() => router.push("/events")}
                  className="px-4 py-2 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold"
                >
                  Back to Events
                </button>
              </div>
            </div>
          </Container>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-gray-900">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-2xl mx-auto mt-4 md:mt-8">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => step === "select" ? router.push(`/events/${eventId}`) : setStep("select")}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {step === "select" ? "Back to Event" : "Back"}
                </button>
              </div>

              {/* Event Summary */}
              {event && step !== "success" && (
                <div className="mb-6 p-4 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
                  <h1 className="text-xl font-bold mb-2 dark:text-white">{event.title}</h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(event.startsAt)}
                    </span>
                    {event.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {step === "select" && (
                    <TicketSelection
                      tickets={tickets}
                      selectedTicket={selectedTicket}
                      onSelect={handleSelectTicket}
                      formatPrice={formatPrice}
                      getStatusBadge={getStatusBadge}
                      waitlistEntries={waitlistEntries}
                      onJoinWaitlist={handleJoinWaitlist}
                      onLeaveWaitlist={handleLeaveWaitlist}
                      onClaimTicket={handleClaimTicket}
                      joiningWaitlist={joiningWaitlist}
                      leavingWaitlist={leavingWaitlist}
                      claimingTicket={claimingTicket}
                      error={error}
                    />
                  )}

                  {step === "form" && event?.formSchema?.schema && (
                    <FormStep
                      fields={event.formSchema.schema}
                      responses={formResponses}
                      onChange={setFormResponses}
                      onSubmit={handleFormSubmit}
                      error={error}
                    />
                  )}

                  {step === "confirm" && selectedTicket && (
                    <ConfirmStep
                      ticket={selectedTicket}
                      event={event!}
                      formResponses={formResponses}
                      noRefundConsent={noRefundConsent}
                      setNoRefundConsent={setNoRefundConsent}
                      onConfirm={handleRegister}
                      submitting={submitting}
                      paymentProcessing={paymentProcessing}
                      error={error}
                      formatPrice={formatPrice}
                      feeBreakdown={feeBreakdown}
                    />
                  )}

                  {step === "success" && registration && (
                    <SuccessStep
                      registration={registration}
                      qrCodeUrl={qrCodeUrl}
                      eventId={eventId}
                      router={router}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
        <BottomNav />
      </div>
    </PageTransition>
  );
}


// Ticket Selection Step
function TicketSelection({
  tickets,
  selectedTicket,
  onSelect,
  formatPrice,
  getStatusBadge,
  waitlistEntries,
  onJoinWaitlist,
  onLeaveWaitlist,
  onClaimTicket,
  joiningWaitlist,
  leavingWaitlist,
  claimingTicket,
  error,
}: {
  tickets: TicketAvailability[];
  selectedTicket: TicketAvailability | null;
  onSelect: (ticket: TicketAvailability) => void;
  formatPrice: (paise: number) => string;
  getStatusBadge: (ticket: TicketAvailability) => { text: string; color: string };
  waitlistEntries: WaitlistEntry[];
  onJoinWaitlist: (ticketId: string) => void;
  onLeaveWaitlist: (ticketId: string) => void;
  onClaimTicket: (ticketId: string) => void;
  joiningWaitlist: string | null;
  leavingWaitlist: string | null;
  claimingTicket: string | null;
  error: string | null;
}) {
  const getWaitlistEntry = (ticketId: string) => 
    waitlistEntries.find(e => e.ticketId === ticketId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Select Ticket</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Choose your ticket type to continue
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {tickets.length === 0 ? (
        <div className="p-6 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
          <Ticket className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">
            No tickets available for this event
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const badge = getStatusBadge(ticket);
            const isSelectable = ticket.status === "AVAILABLE" && ticket.userPurchased < ticket.perUserLimit;
            const isSelected = selectedTicket?.ticketId === ticket.ticketId;
            const waitlistEntry = getWaitlistEntry(ticket.ticketId);
            const isSoldOut = ticket.status === "SOLD_OUT";
            const isOnWaitlist = !!waitlistEntry;
            const isNotified = waitlistEntry?.status === "NOTIFIED";

            return (
              <div
                key={ticket.ticketId}
                className={`border-2 transition-all ${
                  isSelected
                    ? "border-black dark:border-yellow-400 bg-black dark:bg-yellow-400"
                    : isSelectable
                    ? "border-black dark:border-gray-600 bg-white dark:bg-gray-800"
                    : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                }`}
              >
                {/* Main Ticket Button */}
                <button
                  onClick={() => isSelectable && onSelect(ticket)}
                  disabled={!isSelectable}
                  className={`w-full p-4 text-left ${!isSelectable && !isSoldOut ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-bold ${isSelected ? "text-white dark:text-black" : "dark:text-white"}`}>
                          {ticket.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      
                      <div className={`text-sm ${isSelected ? "text-white/80 dark:text-black/70" : "text-gray-600 dark:text-gray-400"}`}>
                        {ticket.available !== null ? (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {ticket.available} of {ticket.total} left
                          </span>
                        ) : (
                          <span>Unlimited availability</span>
                        )}
                      </div>

                      {ticket.salesStart && ticket.status === "NOT_ON_SALE" && (
                        <div className={`text-xs mt-1 ${isSelected ? "text-white/70 dark:text-black/60" : "text-gray-500 dark:text-gray-500"}`}>
                          <Clock className="w-3 h-3 inline mr-1" />
                          Sales start: {new Date(ticket.salesStart).toLocaleDateString()}
                        </div>
                      )}

                      {ticket.perUserLimit > 1 && (
                        <div className={`text-xs mt-1 ${isSelected ? "text-white/70 dark:text-black/60" : "text-gray-500 dark:text-gray-500"}`}>
                          Limit: {ticket.perUserLimit} per person
                          {ticket.userPurchased > 0 && ` (${ticket.userPurchased} purchased)`}
                        </div>
                      )}
                    </div>

                    <div className={`text-xl font-bold ${isSelected ? "text-white dark:text-black" : "dark:text-white"}`}>
                      {formatPrice(ticket.price)}
                    </div>
                  </div>
                </button>

                {/* Waitlist Section for Sold Out Tickets */}
                {isSoldOut && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                    {isNotified ? (
                      // User has been notified - show claim button
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <Bell className="w-4 h-4" />
                          <span className="text-sm font-bold">A ticket is available for you!</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Claim your ticket now before it expires. You have 24 hours to complete your registration.
                        </p>
                        <button
                          onClick={() => onClaimTicket(ticket.ticketId)}
                          disabled={claimingTicket === ticket.ticketId}
                          className="w-full p-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {claimingTicket === ticket.ticketId ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Claim Ticket Now
                            </>
                          )}
                        </button>
                      </div>
                    ) : isOnWaitlist ? (
                      // User is on waitlist - show position and leave option
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-bold">You're on the waitlist</span>
                          </div>
                          <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                            #{waitlistEntry.position}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          We'll notify you when a ticket becomes available. Your position: #{waitlistEntry.position}
                        </p>
                        <button
                          onClick={() => onLeaveWaitlist(ticket.ticketId)}
                          disabled={leavingWaitlist === ticket.ticketId}
                          className="w-full p-2 border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                        >
                          {leavingWaitlist === ticket.ticketId ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Leaving...
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              Leave Waitlist
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      // User is not on waitlist - show join option
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          This ticket is sold out. Join the waitlist to be notified when a spot opens up.
                        </p>
                        <button
                          onClick={() => onJoinWaitlist(ticket.ticketId)}
                          disabled={joiningWaitlist === ticket.ticketId}
                          className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {joiningWaitlist === ticket.ticketId ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Joining...
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4" />
                              Join Waitlist
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Form Step
function FormStep({
  fields,
  responses,
  onChange,
  onSubmit,
  error,
}: {
  fields: FormField[];
  responses: Record<string, unknown>;
  onChange: (responses: Record<string, unknown>) => void;
  onSubmit: () => void;
  error: string | null;
}) {
  const updateField = (fieldId: string, value: unknown) => {
    onChange({ ...responses, [fieldId]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Registration Details</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Please fill in the required information
        </p>
      </div>

      <div className="p-6 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 space-y-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block font-bold mb-2 text-sm dark:text-white">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={(responses[field.id] as string) || ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
              />
            )}

            {field.type === "email" && (
              <input
                type="email"
                value={(responses[field.id] as string) || ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
              />
            )}

            {field.type === "phone" && (
              <input
                type="tel"
                value={(responses[field.id] as string) || ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={(responses[field.id] as number) || ""}
                onChange={(e) => updateField(field.id, parseInt(e.target.value) || "")}
                className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
              />
            )}

            {field.type === "select" && field.options && (
              <select
                value={(responses[field.id] as string) || ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
              >
                <option value="">Select an option</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {field.type === "radio" && field.options && (
              <div className="space-y-2">
                {field.options.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt}
                      checked={responses[field.id] === opt}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="dark:text-white">{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {field.type === "checkbox" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!responses[field.id]}
                  onChange={(e) => updateField(field.id, e.target.checked)}
                  className="w-5 h-5 border-2 border-black"
                />
                <span className="dark:text-white">Yes</span>
              </label>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={onSubmit}
        className="w-full p-3 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold"
      >
        Continue
      </button>
    </div>
  );
}


// Confirm Step
function ConfirmStep({
  ticket,
  event,
  formResponses,
  noRefundConsent,
  setNoRefundConsent,
  onConfirm,
  submitting,
  paymentProcessing,
  error,
  formatPrice,
  feeBreakdown,
}: {
  ticket: TicketAvailability;
  event: EventDetails;
  formResponses: Record<string, unknown>;
  noRefundConsent: boolean;
  setNoRefundConsent: (v: boolean) => void;
  onConfirm: () => void;
  submitting: boolean;
  paymentProcessing: boolean;
  error: string | null;
  formatPrice: (paise: number) => string;
  feeBreakdown: FeeBreakdown | null;
}) {
  const isPaid = ticket.price > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Confirm Registration</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Review your registration details
        </p>
      </div>

      {/* Order Summary */}
      <div className="p-4 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="font-bold mb-3 dark:text-white">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Ticket</span>
            <span className="font-bold dark:text-white">{ticket.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Quantity</span>
            <span className="font-bold dark:text-white">1</span>
          </div>
          
          {/* Fee Breakdown for paid tickets */}
          {isPaid && feeBreakdown && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ticket Price</span>
                  <span className="dark:text-white">{formatAmountShort(feeBreakdown.ticketPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    Platform Fee (3%)
                    <Info className="w-3 h-3" />
                  </span>
                  <span className="dark:text-white">{formatAmountShort(feeBreakdown.platformFee)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    Payment Gateway Fee (2%)
                    <Info className="w-3 h-3" />
                  </span>
                  <span className="dark:text-white">{formatAmountShort(feeBreakdown.gatewayFee)}</span>
                </div>
              </div>
            </>
          )}
          
          <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-2 mt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold dark:text-white">Total</span>
              <span className="font-bold dark:text-white">
                {isPaid && feeBreakdown 
                  ? formatAmountShort(feeBreakdown.totalCharge)
                  : formatPrice(ticket.price)
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method Info */}
      {isPaid && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="font-bold dark:text-white">Payment via Razorpay</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Secure payment powered by Razorpay. Supports UPI, Cards, Net Banking, and Wallets.
          </p>
        </div>
      )}

      {/* No Refund Policy */}
      {isPaid && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
            <strong>No Refund Policy:</strong> This event does not support refunds.
            Once payment is complete, you will not be able to get a refund.
          </p>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={noRefundConsent}
              onChange={(e) => setNoRefundConsent(e.target.checked)}
              className="w-5 h-5 border-2 border-black mt-0.5"
            />
            <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
              I understand and agree to the no-refund policy
            </span>
          </label>
        </div>
      )}

      {/* Form Responses Preview */}
      {Object.keys(formResponses).length > 0 && (
        <div className="p-4 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800">
          <h3 className="font-bold mb-3 dark:text-white">Your Information</h3>
          <div className="space-y-1 text-sm">
            {Object.entries(formResponses).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{key}</span>
                <span className="dark:text-white">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={submitting || paymentProcessing || (isPaid && !noRefundConsent)}
        className="w-full p-3 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting || paymentProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {paymentProcessing ? "Processing Payment..." : "Processing..."}
          </>
        ) : isPaid ? (
          <>
            <CreditCard className="w-4 h-4" />
            Pay {feeBreakdown ? formatAmountShort(feeBreakdown.totalCharge) : formatPrice(ticket.price)}
          </>
        ) : (
          "Complete Registration"
        )}
      </button>
    </div>
  );
}

// Success Step
function SuccessStep({
  registration,
  qrCodeUrl,
  eventId,
  router,
}: {
  registration: RegistrationResult;
  qrCodeUrl: string | null;
  eventId: string;
  router: ReturnType<typeof useRouter>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Registration Complete!</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          You're all set for {registration.eventTitle}
        </p>
      </div>

      {/* QR Code */}
      <div className="p-6 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 text-center">
        <h3 className="font-bold mb-4 dark:text-white flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" />
          Your Ticket
        </h3>
        
        {qrCodeUrl ? (
          <div className="inline-block p-4 bg-white border-2 border-black">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        <div className="mt-4 space-y-1 text-sm">
          <p className="text-gray-600 dark:text-gray-400">Ticket Type</p>
          <p className="font-bold dark:text-white">{registration.ticketName}</p>
        </div>

        <div className="mt-2 space-y-1 text-sm">
          <p className="text-gray-600 dark:text-gray-400">Registration ID</p>
          <p className="font-mono text-xs dark:text-white">{registration.registrationId}</p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Tip:</strong> Take a screenshot of your QR code or access it anytime
          from "My Events" in your profile.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/events/${eventId}`)}
          className="flex-1 p-3 border-2 border-black dark:border-gray-600 font-bold dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          View Event
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 p-3 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold"
        >
          My Events
        </button>
      </div>
    </div>
  );
}
