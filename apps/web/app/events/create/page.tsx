"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/ui/Container";
import { PageTransition } from "../../providers/AnimationProvider";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/ui/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../../lib/api";
import FormBuilder, { FormField } from "../../components/events/FormBuilder";
import AgendaEditor from "../../components/events/AgendaEditor";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Ticket,
  CreditCard,
  FileText,
  Users,
  Award,
  Eye,
  Save,
} from "lucide-react";

// Types
interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number | null;
  perUserLimit: number;
  salesStart: string;
  salesEnd: string;
}

interface AgendaBlock {
  id: string;
  day: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}

// FormField is now imported from FormBuilder

interface RoleAssignment {
  userId: string;
  username: string;
  role: "CO_ORGANIZER" | "HEAD" | "VOLUNTEER";
}

interface EventDraft {
  // Step 1: Basic Info
  title: string;
  description: string;
  coverUrl: string;
  scope: "COLLEGE" | "GLOBAL";
  category: string;
  visibility: "PUBLIC" | "INVITE_ONLY";
  // Step 2: When & Where
  startsAt: string;
  endsAt: string;
  timezone: string;
  venue: string;
  onlineLink: string;
  agendaBlocks: AgendaBlock[];
  // Step 3: Tickets
  tickets: TicketType[];
  isFree: boolean;
  // Step 4: Payment
  passFeesToBuyer: boolean;
  // Step 5: Registration Form
  formFields: FormField[];
  // Step 6: Roles
  roles: RoleAssignment[];
  // Step 7: Certificates
  certificateEnabled: boolean;
  certificateTemplateId: string;
  autoIssueCertificate: boolean;
  // Step 8: Settings
  waitlistEnabled: boolean;
  attendanceMode: "SINGLE_SCAN" | "ENTRY_EXIT";
}

const STEPS = [
  { id: 1, name: "Basic Info", icon: FileText },
  { id: 2, name: "When & Where", icon: Calendar },
  { id: 3, name: "Tickets", icon: Ticket },
  { id: 4, name: "Payment", icon: CreditCard, conditional: true },
  { id: 5, name: "Registration", icon: FileText },
  { id: 6, name: "Team", icon: Users },
  { id: 7, name: "Certificates", icon: Award },
  { id: 8, name: "Review", icon: Eye },
];

const CATEGORIES = [
  "Workshop",
  "Hackathon",
  "Cultural",
  "Sports",
  "Tech Talk",
  "Networking",
  "Competition",
  "Conference",
  "Other",
];

const initialDraft: EventDraft = {
  title: "",
  description: "",
  coverUrl: "",
  scope: "COLLEGE",
  category: "",
  visibility: "PUBLIC",
  startsAt: "",
  endsAt: "",
  timezone: "Asia/Kolkata",
  venue: "",
  onlineLink: "",
  agendaBlocks: [],
  tickets: [],
  isFree: true,
  passFeesToBuyer: false,
  formFields: [],
  roles: [],
  certificateEnabled: false,
  certificateTemplateId: "",
  autoIssueCertificate: false,
  waitlistEnabled: false,
  attendanceMode: "SINGLE_SCAN",
};

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [draft, setDraft] = useState<EventDraft>(initialDraft);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Get visible steps (skip payment step if free event)
  const visibleSteps = STEPS.filter(
    (step) => !step.conditional || (step.id === 4 && !draft.isFree)
  );

  // Auto-save draft to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("eventDraft");
    if (saved) {
      try {
        setDraft(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load draft:", e);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("eventDraft", JSON.stringify(draft));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [draft]);

  const updateDraft = (updates: Partial<EventDraft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    const currentIndex = visibleSteps.findIndex((s) => s.id === currentStep);
    if (currentIndex < visibleSteps.length - 1) {
      setCurrentStep(visibleSteps[currentIndex + 1].id);
    }
  };

  const prevStep = () => {
    const currentIndex = visibleSteps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(visibleSteps[currentIndex - 1].id);
    }
  };

  const goToStep = (stepId: number) => {
    if (visibleSteps.some((s) => s.id === stepId)) {
      setCurrentStep(stepId);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      const eventData = {
        title: draft.title,
        description: draft.description,
        coverUrl: draft.coverUrl || undefined,
        scope: draft.scope,
        category: draft.category || undefined,
        visibility: draft.visibility,
        startsAt: draft.startsAt,
        endsAt: draft.endsAt,
        timezone: draft.timezone,
        venue: draft.venue || undefined,
        onlineLink: draft.onlineLink || undefined,
        waitlistEnabled: draft.waitlistEnabled,
        attendanceMode: draft.attendanceMode,
        certificateEnabled: draft.certificateEnabled,
        autoIssueCertificate: draft.autoIssueCertificate,
        tickets: draft.tickets.map((t) => ({
          name: t.name,
          description: t.description || undefined,
          price: t.price * 100, // Convert to paise
          quantity: t.quantity,
          perUserLimit: t.perUserLimit,
          salesStart: t.salesStart || undefined,
          salesEnd: t.salesEnd || undefined,
        })),
        agendaBlocks: draft.agendaBlocks.map((a) => ({
          day: a.day,
          date: a.date,
          startTime: a.startTime,
          endTime: a.endTime,
          title: a.title,
          description: a.description || undefined,
        })),
      };

      const event = await api.createEvent(eventData);
      localStorage.removeItem("eventDraft");
      
      // Publish the event
      await api.publishEvent(event.id);
      
      router.push(`/events/${event.id}`);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const eventData = {
        title: draft.title || "Untitled Event",
        description: draft.description,
        startsAt: draft.startsAt || new Date().toISOString(),
        endsAt: draft.endsAt || new Date().toISOString(),
        scope: draft.scope,
      };
      await api.createEvent(eventData);
      alert("Draft saved!");
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setSaving(false);
    }
  };

  const isStepComplete = (stepId: number): boolean => {
    switch (stepId) {
      case 1:
        return !!draft.title && !!draft.description;
      case 2:
        return !!draft.startsAt && !!draft.endsAt;
      case 3:
        return draft.isFree || draft.tickets.length > 0;
      case 4:
        return draft.isFree || true; // Payment setup is optional
      case 5:
        return true; // Form fields are optional
      case 6:
        return true; // Roles are optional
      case 7:
        return true; // Certificates are optional
      case 8:
        return true;
      default:
        return false;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper dark:bg-gray-900">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto mt-4 md:mt-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => router.push("/events")}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Events
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-black dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Draft"}
                </button>
              </div>

              {/* Progress Steps */}
              <div className="mb-8 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max pb-2">
                  {visibleSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isComplete = isStepComplete(step.id);
                    const isPast = visibleSteps.findIndex((s) => s.id === currentStep) > index;

                    return (
                      <div key={step.id} className="flex items-center">
                        <button
                          onClick={() => goToStep(step.id)}
                          className={`flex items-center gap-2 px-3 py-2 border-2 transition-all ${
                            isActive
                              ? "border-black dark:border-yellow-400 bg-black dark:bg-yellow-400 text-white dark:text-black"
                              : isPast && isComplete
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                              : "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-black dark:hover:border-white"
                          }`}
                        >
                          {isPast && isComplete ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                          <span className="text-xs font-bold hidden sm:inline">
                            {step.name}
                          </span>
                        </button>
                        {index < visibleSteps.length - 1 && (
                          <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600 mx-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStep === 1 && (
                      <Step1BasicInfo draft={draft} updateDraft={updateDraft} />
                    )}
                    {currentStep === 2 && (
                      <Step2WhenWhere draft={draft} updateDraft={updateDraft} />
                    )}
                    {currentStep === 3 && (
                      <Step3Tickets draft={draft} updateDraft={updateDraft} />
                    )}
                    {currentStep === 4 && (
                      <Step4Payment draft={draft} updateDraft={updateDraft} />
                    )}
                    {currentStep === 5 && (
                      <Step5Registration draft={draft} updateDraft={updateDraft} />
                    )}
                    {currentStep === 6 && (
                      <Step6Team draft={draft} updateDraft={updateDraft} />
                    )}
                    {currentStep === 7 && (
                      <Step7Certificates draft={draft} updateDraft={updateDraft} />
                    )}
                    {currentStep === 8 && (
                      <Step8Review draft={draft} />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === visibleSteps[0].id}
                    className="flex items-center gap-2 px-4 py-2 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>

                  {currentStep === 8 ? (
                    <button
                      onClick={handlePublish}
                      disabled={loading || !draft.title || !draft.startsAt}
                      className="flex items-center gap-2 px-6 py-2 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Publishing..." : "Publish Event"}
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-yellow-400 text-white dark:text-black font-bold text-sm"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
        <BottomNav />
      </div>
    </PageTransition>
  );
}


// Step 1: Basic Info
function Step1BasicInfo({
  draft,
  updateDraft,
}: {
  draft: EventDraft;
  updateDraft: (updates: Partial<EventDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Basic Information</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Tell us about your event
        </p>
      </div>

      <div>
        <label className="block font-bold mb-2 text-sm dark:text-white">
          Event Title *
        </label>
        <input
          type="text"
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-400"
          placeholder="e.g. Hackathon 2024"
        />
      </div>

      <div>
        <label className="block font-bold mb-2 text-sm dark:text-white">
          Description *
        </label>
        <textarea
          value={draft.description}
          onChange={(e) => updateDraft({ description: e.target.value })}
          className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-400 h-32"
          placeholder="What's your event about?"
        />
      </div>

      <div>
        <label className="block font-bold mb-2 text-sm dark:text-white">
          Cover Image URL
        </label>
        <input
          type="url"
          value={draft.coverUrl}
          onChange={(e) => updateDraft({ coverUrl: e.target.value })}
          className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-yellow-400"
          placeholder="https://..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold mb-2 text-sm dark:text-white">
            Scope
          </label>
          <div className="flex gap-2">
            {(["COLLEGE", "GLOBAL"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => updateDraft({ scope: s })}
                className={`flex-1 px-4 py-2 border-2 border-black dark:border-gray-600 font-bold text-sm ${
                  draft.scope === s
                    ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                    : "bg-white dark:bg-gray-800 dark:text-white"
                }`}
              >
                {s === "COLLEGE" ? "Campus Only" : "Global"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 text-sm dark:text-white">
            Visibility
          </label>
          <div className="flex gap-2">
            {(["PUBLIC", "INVITE_ONLY"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => updateDraft({ visibility: v })}
                className={`flex-1 px-4 py-2 border-2 border-black dark:border-gray-600 font-bold text-sm ${
                  draft.visibility === v
                    ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                    : "bg-white dark:bg-gray-800 dark:text-white"
                }`}
              >
                {v === "PUBLIC" ? "Public" : "Invite Only"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block font-bold mb-2 text-sm dark:text-white">
          Category
        </label>
        <select
          value={draft.category}
          onChange={(e) => updateDraft({ category: e.target.value })}
          className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// Step 2: When & Where
function Step2WhenWhere({
  draft,
  updateDraft,
}: {
  draft: EventDraft;
  updateDraft: (updates: Partial<EventDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">When & Where</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Set the date, time, and location
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold mb-2 text-sm dark:text-white">
            Start Date & Time *
          </label>
          <input
            type="datetime-local"
            value={draft.startsAt}
            onChange={(e) => updateDraft({ startsAt: e.target.value })}
            className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
          />
        </div>
        <div>
          <label className="block font-bold mb-2 text-sm dark:text-white">
            End Date & Time *
          </label>
          <input
            type="datetime-local"
            value={draft.endsAt}
            onChange={(e) => updateDraft({ endsAt: e.target.value })}
            className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block font-bold mb-2 text-sm dark:text-white">
          Venue
        </label>
        <input
          type="text"
          value={draft.venue}
          onChange={(e) => updateDraft({ venue: e.target.value })}
          className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
          placeholder="e.g. Main Auditorium, Building A"
        />
      </div>

      <div>
        <label className="block font-bold mb-2 text-sm dark:text-white">
          Online Link (if virtual)
        </label>
        <input
          type="url"
          value={draft.onlineLink}
          onChange={(e) => updateDraft({ onlineLink: e.target.value })}
          className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
          placeholder="https://meet.google.com/..."
        />
      </div>

      <div>
        <label className="block font-bold mb-2 text-sm dark:text-white">
          Timezone
        </label>
        <select
          value={draft.timezone}
          onChange={(e) => updateDraft({ timezone: e.target.value })}
          className="w-full p-3 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono"
        >
          <option value="Asia/Kolkata">India (IST)</option>
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time (ET)</option>
          <option value="America/Los_Angeles">Pacific Time (PT)</option>
        </select>
      </div>

      {/* Agenda Editor for Multi-Day Events */}
      {draft.startsAt && draft.endsAt && (
        <div className="pt-6 border-t-2 border-gray-200 dark:border-gray-700">
          <AgendaEditor
            agendaBlocks={draft.agendaBlocks}
            eventStartDate={draft.startsAt}
            eventEndDate={draft.endsAt}
            onChange={(blocks) => updateDraft({ agendaBlocks: blocks })}
          />
        </div>
      )}
    </div>
  );
}


// Step 3: Tickets
function Step3Tickets({
  draft,
  updateDraft,
}: {
  draft: EventDraft;
  updateDraft: (updates: Partial<EventDraft>) => void;
}) {
  const addTicket = () => {
    const newTicket: TicketType = {
      id: Date.now().toString(),
      name: "",
      description: "",
      price: 0,
      quantity: null,
      perUserLimit: 1,
      salesStart: "",
      salesEnd: "",
    };
    updateDraft({ tickets: [...draft.tickets, newTicket] });
  };

  const updateTicket = (id: string, updates: Partial<TicketType>) => {
    updateDraft({
      tickets: draft.tickets.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    });
  };

  const removeTicket = (id: string) => {
    updateDraft({ tickets: draft.tickets.filter((t) => t.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Tickets & Pricing</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Set up your ticket types and pricing
        </p>
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.isFree}
            onChange={(e) => updateDraft({ isFree: e.target.checked })}
            className="w-5 h-5 border-2 border-black"
          />
          <span className="font-bold dark:text-white">This is a free event</span>
        </label>
      </div>

      {!draft.isFree && (
        <>
          <div className="space-y-4">
            {draft.tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold dark:text-white">
                    Ticket {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeTicket(ticket.id)}
                    className="text-red-500 text-sm font-bold"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-1 dark:text-white">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={ticket.name}
                      onChange={(e) =>
                        updateTicket(ticket.id, { name: e.target.value })
                      }
                      className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono text-sm"
                      placeholder="e.g. Early Bird"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 dark:text-white">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={ticket.price}
                      onChange={(e) =>
                        updateTicket(ticket.id, {
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 dark:text-white">
                      Quantity (leave empty for unlimited)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={ticket.quantity || ""}
                      onChange={(e) =>
                        updateTicket(ticket.id, {
                          quantity: e.target.value
                            ? parseInt(e.target.value)
                            : null,
                        })
                      }
                      className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1 dark:text-white">
                      Per User Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={ticket.perUserLimit}
                      onChange={(e) =>
                        updateTicket(ticket.id, {
                          perUserLimit: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full p-2 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addTicket}
            className="w-full p-3 border-2 border-dashed border-black dark:border-gray-600 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white"
          >
            + Add Ticket Type
          </button>
        </>
      )}
    </div>
  );
}

// Step 4: Payment
function Step4Payment({
  draft,
  updateDraft,
}: {
  draft: EventDraft;
  updateDraft: (updates: Partial<EventDraft>) => void;
}) {
  const totalTicketValue = draft.tickets.reduce(
    (sum, t) => sum + t.price * (t.quantity || 100),
    0
  );
  const platformFee = totalTicketValue * 0.03;
  const gatewayFee = totalTicketValue * 0.02;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Payment Setup</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Configure payment settings for your paid event
        </p>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Payments are processed through Razorpay. LINKER
          does not hold money or manage settlements. Razorpay is the source of
          truth for payment success.
        </p>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>No Refunds:</strong> This event does not support refunds.
          Attendees will be informed of this policy before purchase.
        </p>
      </div>

      <div className="p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800">
        <h3 className="font-bold mb-4 dark:text-white">Fee Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between dark:text-gray-300">
            <span>Platform Fee (3%)</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between dark:text-gray-300">
            <span>Gateway Fee (~2%)</span>
            <span>₹{gatewayFee.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.passFeesToBuyer}
            onChange={(e) => updateDraft({ passFeesToBuyer: e.target.checked })}
            className="w-5 h-5 border-2 border-black"
          />
          <span className="font-bold dark:text-white">
            Pass fees to buyer (buyer pays ticket price + fees)
          </span>
        </label>
      </div>
    </div>
  );
}


// Step 5: Registration Form
function Step5Registration({
  draft,
  updateDraft,
}: {
  draft: EventDraft;
  updateDraft: (updates: Partial<EventDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Registration Form</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Collect additional information from attendees (optional)
        </p>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Note:</strong> Basic attendee information (name, email) is collected automatically.
          Add custom fields below to gather additional data.
        </p>
      </div>

      <FormBuilder
        fields={draft.formFields}
        onChange={(formFields) => updateDraft({ formFields })}
      />

      {draft.formFields.length > 0 && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>{draft.formFields.length}</strong> custom field{draft.formFields.length !== 1 ? "s" : ""} configured.
            Drag fields to reorder them.
          </p>
        </div>
      )}
    </div>
  );
}

// Step 6: Team
function Step6Team({
  draft,
  updateDraft,
}: {
  draft: EventDraft;
  updateDraft: (updates: Partial<EventDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Team & Roles</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Add co-organizers, heads, and volunteers (optional)
        </p>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-600">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You can add team members after creating the event from the event
          management dashboard.
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="font-bold text-sm dark:text-white">Role Permissions:</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• <strong>Co-Organizer:</strong> Edit event, manage tickets, view attendees</li>
          <li>• <strong>Head:</strong> Scan QR codes, view attendee list, manual check-in</li>
          <li>• <strong>Volunteer:</strong> Scan QR codes only</li>
        </ul>
      </div>
    </div>
  );
}

// Step 7: Certificates
function Step7Certificates({
  draft,
  updateDraft,
}: {
  draft: EventDraft;
  updateDraft: (updates: Partial<EventDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Certificates</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Issue certificates to attendees (optional)
        </p>
      </div>

      <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-600">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.certificateEnabled}
            onChange={(e) => updateDraft({ certificateEnabled: e.target.checked })}
            className="w-5 h-5 border-2 border-black"
          />
          <span className="font-bold dark:text-white">Enable certificates for this event</span>
        </label>
      </div>

      {draft.certificateEnabled && (
        <>
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.autoIssueCertificate}
                onChange={(e) => updateDraft({ autoIssueCertificate: e.target.checked })}
                className="w-5 h-5 border-2 border-black"
              />
              <span className="font-bold dark:text-white">
                Auto-issue certificates to checked-in attendees after event ends
              </span>
            </label>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Certificates will only be issued to attendees who check in at the event.
              You can also manually issue certificates from the event dashboard.
            </p>
          </div>
        </>
      )}

      <div>
        <h3 className="font-bold text-sm mb-2 dark:text-white">Additional Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 border-2 border-black dark:border-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.waitlistEnabled}
                onChange={(e) => updateDraft({ waitlistEnabled: e.target.checked })}
                className="w-5 h-5 border-2 border-black"
              />
              <span className="font-bold dark:text-white">Enable waitlist when tickets sell out</span>
            </label>
          </div>

          <div>
            <label className="block font-bold mb-2 text-sm dark:text-white">
              Attendance Mode
            </label>
            <div className="flex gap-2">
              {(["SINGLE_SCAN", "ENTRY_EXIT"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateDraft({ attendanceMode: mode })}
                  className={`flex-1 px-4 py-2 border-2 border-black dark:border-gray-600 font-bold text-sm ${
                    draft.attendanceMode === mode
                      ? "bg-black text-white dark:bg-yellow-400 dark:text-black"
                      : "bg-white dark:bg-gray-800 dark:text-white"
                  }`}
                >
                  {mode === "SINGLE_SCAN" ? "Single Scan" : "Entry + Exit"}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {draft.attendanceMode === "SINGLE_SCAN"
                ? "Attendees scan once to check in"
                : "Track both entry and exit times"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


// Step 8: Review & Publish
function Step8Review({ draft }: { draft: EventDraft }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 dark:text-white">Review & Publish</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Review your event details before publishing
        </p>
      </div>

      {/* Basic Info */}
      <div className="p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800">
        <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Basic Information
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Title</span>
            <span className="font-bold dark:text-white">{draft.title || "Not set"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Scope</span>
            <span className="font-bold dark:text-white">
              {draft.scope === "COLLEGE" ? "Campus Only" : "Global"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Visibility</span>
            <span className="font-bold dark:text-white">
              {draft.visibility === "PUBLIC" ? "Public" : "Invite Only"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Category</span>
            <span className="font-bold dark:text-white">{draft.category || "Not set"}</span>
          </div>
        </div>
      </div>

      {/* When & Where */}
      <div className="p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800">
        <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          When & Where
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Starts</span>
            <span className="font-bold dark:text-white">{formatDate(draft.startsAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Ends</span>
            <span className="font-bold dark:text-white">{formatDate(draft.endsAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Venue</span>
            <span className="font-bold dark:text-white">{draft.venue || "Not set"}</span>
          </div>
          {draft.onlineLink && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Online Link</span>
              <span className="font-bold dark:text-white truncate max-w-[200px]">
                {draft.onlineLink}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tickets */}
      <div className="p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800">
        <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
          <Ticket className="w-4 h-4" />
          Tickets
        </h3>
        {draft.isFree ? (
          <p className="text-sm text-green-600 dark:text-green-400 font-bold">
            Free Event
          </p>
        ) : draft.tickets.length > 0 ? (
          <div className="space-y-2">
            {draft.tickets.map((ticket, index) => (
              <div
                key={ticket.id}
                className="flex justify-between text-sm p-2 bg-gray-50 dark:bg-gray-900"
              >
                <span className="dark:text-white">{ticket.name || `Ticket ${index + 1}`}</span>
                <span className="font-bold dark:text-white">
                  ₹{ticket.price} × {ticket.quantity || "∞"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            No tickets configured
          </p>
        )}
      </div>

      {/* Settings */}
      <div className="p-4 border-2 border-black dark:border-gray-600 bg-white dark:bg-gray-800">
        <h3 className="font-bold mb-3 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4" />
          Settings
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Certificates</span>
            <span className={`font-bold ${draft.certificateEnabled ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
              {draft.certificateEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          {draft.certificateEnabled && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Auto-issue</span>
              <span className={`font-bold ${draft.autoIssueCertificate ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                {draft.autoIssueCertificate ? "Yes" : "No"}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Waitlist</span>
            <span className={`font-bold ${draft.waitlistEnabled ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
              {draft.waitlistEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Attendance Mode</span>
            <span className="font-bold dark:text-white">
              {draft.attendanceMode === "SINGLE_SCAN" ? "Single Scan" : "Entry + Exit"}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {(!draft.title || !draft.startsAt || !draft.endsAt) && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <p className="text-sm text-red-800 dark:text-red-200 font-bold">
            Missing required fields:
          </p>
          <ul className="text-sm text-red-700 dark:text-red-300 mt-1 list-disc list-inside">
            {!draft.title && <li>Event title</li>}
            {!draft.startsAt && <li>Start date & time</li>}
            {!draft.endsAt && <li>End date & time</li>}
          </ul>
        </div>
      )}

      {/* No Refund Policy Notice */}
      {!draft.isFree && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Reminder:</strong> This is a paid event with no refund policy.
            Attendees will be required to acknowledge this before purchase.
          </p>
        </div>
      )}

      {/* Ready to Publish */}
      {draft.title && draft.startsAt && draft.endsAt && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Ready to publish!</strong> Click the "Publish Event" button below
            to make your event live.
          </p>
        </div>
      )}
    </div>
  );
}
