"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../../lib/supabase";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import { logEvent } from "../../lib/analytics";

// Steps
// 1. Identity (Avatar + Name)
// 2. Vibe (Bio)
// 3. Socials
// 4. Interests
// 5. Campus (College + Location)
// 6. Review

const STEPS = [
  { id: "identity", title: "WHO ARE YOU?", subtitle: "Let's see that face." },
  { id: "vibe", title: "VIBE CHECK", subtitle: "Tell us your story." },
  {
    id: "socials",
    title: "PLUG YOURSELF",
    subtitle: "Where can we stalk you?",
  },
  { id: "interests", title: "YOUR POISON", subtitle: "What keeps you awake?" },
  { id: "campus", title: "YOUR TURF", subtitle: "Where do you belong?" },
  { id: "review", title: "LAST CHANCE", subtitle: "Ready to enter the void?" },
];

const KERALA_DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshUser, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [initialStepSet, setInitialStepSet] = useState(false);

  // Auth Check
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth/login");
    }
  }, [user, authLoading, router]);

  // Handle ?step=college query parameter
  useEffect(() => {
    if (initialStepSet) return;

    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step");

    if (stepParam === "college") {
      const campusStepIndex = STEPS.findIndex(s => s.id === "campus");
      if (campusStepIndex !== -1) {
        setCurrentStep(campusStepIndex);
        setInitialStepSet(true);
      }
    }
  }, [initialStepSet]);

  const step = STEPS[currentStep];
  const [loading, setLoading] = useState(false);
  const [colleges, setColleges] = useState<any[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    avatarUrl: "",
    bio: "",
    githubUrl: "",
    instagram: "",
    interests: [] as string[],
    collegeId: "",
    state: "",      // New
    district: "",   // New
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState("");
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  const [customCollegeData, setCustomCollegeData] = useState({
    name: "",
    city: "",
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Analytics: Duration Tracking
  const startTimeRef = useRef<number>(Date.now());

  // Real-time validation functions
  const validateField = (field: string, value: string) => {
    let error = "";
    switch (field) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        break;
      case "bio":
        if (!value.trim()) error = "Bio is required";
        else if (value.trim().length < 10) error = "Bio should be at least 10 characters";
        break;
      case "customCollegeName":
        if (!value.trim()) error = "College name is required";
        break;
    }
    setValidationErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const fetchColleges = async () => {
    try {
      const data = await api.getColleges();
      setColleges(data);
    } catch (error) {
      console.error("Failed to fetch colleges", error);
    }
  };

  useEffect(() => {
    const profile = user?.profile;
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.fullName || "",
        avatarUrl: profile.avatarUrl || "",
        bio: profile.bio || "",
        githubUrl: profile.githubUrl || "",
        instagram: profile.instagram || "",
        interests: profile.interests || [],
        collegeId: profile.collegeId || "",
        state: (profile.socials as any)?.state || "",
        district: (profile.socials as any)?.district || "",
      }));

      if (profile.avatarUrl) {
        setAvatarPreview(profile.avatarUrl);
      }

      if (
        profile.onboardingStep !== undefined &&
        profile.onboardingStep !== null
      ) {
        const safeStep = Math.min(profile.onboardingStep, STEPS.length - 1);
        setCurrentStep(safeStep);
      }
    }
    fetchColleges();
  }, [user]);

  // Analytics hooks...
  useEffect(() => {
    if (currentStep < STEPS.length) {
      logEvent("onboarding_step_viewed", {
        step: currentStep,
        stepName: STEPS[currentStep].id,
      });
    }
    const handleUnload = () => {
      if (currentStep < STEPS.length) {
        logEvent("onboarding_abandoned_step", {
          step: currentStep,
          stepName: STEPS[currentStep].id,
        });
      }
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [currentStep]);

  const validateStep = () => {
    switch (currentStep) {
      case 0: // Identity
        return !!formData.fullName.trim();
      case 1: // Vibe
        return !!formData.bio.trim();
      case 4: // Campus
        if (isCustomCollege) return !!customCollegeData.name.trim();
        // Require state/district if State is Kerala? Or generally?
        // Let's make State mandatory if we want data.
        // User asked "collect more information".
        return !!formData.collegeId;
      default:
        return true;
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("File size too large (max 2MB)");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, avatarUrl: "" })); // Clear URL if file selected
    }
  };

  const handleNext = async () => {
    if (!validateStep()) {
      alert("Please fill in the required fields.");
      return;
    }

    setLoading(true);
    try {
      const stepData: any = { onboardingStep: currentStep + 1 };

      if (currentStep === 0) {
        // Identity
        stepData.fullName = formData.fullName;

        // Handle Avatar Upload
        if (avatarFile && user?.id) {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

          stepData.avatarUrl = publicUrl;
        } else if (formData.avatarUrl) {
          stepData.avatarUrl = formData.avatarUrl;
        }
      } else if (currentStep === 1) {
        // Vibe
        stepData.bio = formData.bio;
      } else if (currentStep === 2) {
        // Socials
        const normalizeUrl = (url?: string) => {
          if (!url?.trim()) return undefined;
          let cleaned = url.trim();
          if (!/^https?:\/\//i.test(cleaned)) return `https://${cleaned}`;
          return cleaned;
        };
        const github = normalizeUrl(formData.githubUrl);
        const instagram = normalizeUrl(formData.instagram);
        // Using spread to avoid wiping other socials if we had them? 
        // Ideally backend handles merge or we send full social object.
        // For now, simpler:
        stepData.githubUrl = github;
        stepData.instagram = instagram;
      } else if (currentStep === 3) {
        // Interests
        stepData.interests = formData.interests;
      } else if (currentStep === 4) {
        // Campus + Location
        stepData.collegeId = formData.collegeId || null;

        // Save State/District in 'socials' json or a new field?
        // Schema doesn't have address fields. We'll put it in 'socials' JSON
        // or ensure 'updateProfile' handles generic JSON?
        // User updateProfile interface might only accept specific fields.
        // Assuming api.updateProfile accepts 'socials' object.
        stepData.socials = {
          ...(user?.profile?.socials as object || {}),
          state: formData.state,
          district: formData.district
        };

      } else if (currentStep === 5) {
        // Review
        if (!formData.fullName?.trim()) {
          alert("Full name is required."); return;
        }
        if (!formData.collegeId && !isCustomCollege) {
          alert("Please select a college."); return;
        }
        stepData.isOnboarded = true;
      }

      await api.updateProfile(stepData);
      await refreshUser();

      logEvent("onboarding_step_completed", {
        step: currentStep,
        stepName: STEPS[currentStep].id,
      });

      if (currentStep === STEPS.length - 1) {
        const duration = Date.now() - startTimeRef.current;
        logEvent("onboarding_completed", { duration_ms: duration });
        localStorage.setItem("showWelcome", "true");
        router.push("/dashboard");
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        // handleNext(); // Can conflict with textarea
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading]);

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identity
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-bold mb-2 uppercase text-sm tracking-wider">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  validateField("fullName", e.target.value);
                }}
                className={`w-full p-3 border-2 ${validationErrors.fullName ? "border-red-500 bg-red-50" : "border-black bg-gray-50"
                  } focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all`}
                placeholder="John Doe"
                autoFocus
              />
            </div>
            <div>
              <label className="block font-bold mb-2 uppercase text-sm tracking-wider">
                Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 border-2 border-black overflow-hidden relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                  )}
                </div>
                <div>
                  <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:-translate-y-0.5 transition-transform flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]">
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Max 2MB. JPG, PNG, GIF.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 1: // Vibe
        return (
          <div>
            <label className="block font-bold mb-2 uppercase text-sm tracking-wider">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => {
                setFormData({ ...formData, bio: e.target.value });
                validateField("bio", e.target.value);
              }}
              className={`w-full p-3 border-2 ${validationErrors.bio ? "border-red-500 bg-red-50" : "border-black bg-gray-50"
                } focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all h-32`}
              placeholder="I code, I coffee, I conquer..."
              autoFocus
            />
            <p className="text-gray-400 text-xs mt-1">{formData.bio.length} characters</p>
          </div>
        );
      case 2: // Socials
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-bold mb-2 uppercase text-sm tracking-wider">GitHub URL</label>
              <input
                type="text"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block font-bold mb-2 uppercase text-sm tracking-wider">Instagram URL</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        );
      case 3: // Interests
        const INTERESTS = ["Coding", "Design", "Music", "Sports", "Gaming", "Reading", "Travel", "Food", "Art", "Tech"];
        return (
          <div className="grid grid-cols-2 gap-4">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => {
                  const newInterests = formData.interests.includes(interest)
                    ? formData.interests.filter((i) => i !== interest)
                    : [...formData.interests, interest];
                  setFormData({ ...formData, interests: newInterests });
                }}
                className={`p-3 border-2 border-black font-bold transition-all ${formData.interests.includes(interest)
                  ? "bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white hover:bg-gray-50"
                  }`}
              >
                {interest}
              </button>
            ))}
          </div>
        );
      case 4: // Campus
        const filteredColleges = colleges.filter(c => {
          // 1. Filter by Location (if selected)
          // Use Case-Insensitive comparison and handle trimming
          if (formData.state && c.state && c.state.trim().toLowerCase() !== formData.state.trim().toLowerCase()) return false;

          // Note: Backend doesn't currently support district on College model, so skipping strict district filter
          // if (formData.district && c.district && c.district !== formData.district) return false;

          // 2. Filter by Search Query
          if (!searchQuery) return true; // Show all (filtered by location) if no search
          const q = searchQuery.toLowerCase().trim();
          return c.name.toLowerCase().includes(q) || c.city?.toLowerCase().includes(q);
        }).slice(0, 50); // Increased limit to 50 to ensure results aren't hidden prematurely

        // Debugging for user feedback
        console.log(`[Campus] Filtering: State=${formData.state}, Query="${searchQuery}". Found ${filteredColleges.length} matches.`);

        return (
          <div className="space-y-6">
            {/* 1. Location Selection (State & District) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-2 uppercase text-sm tracking-wider">State</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value, district: "", collegeId: "" })}
                  className="w-full p-3 border-2 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <option value="">Select State</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase text-sm tracking-wider">District</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value, collegeId: "" })}
                  disabled={!formData.state || formData.state === 'Other'}
                  className="w-full p-3 border-2 border-black bg-white focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">Select District</option>
                  {formData.state === 'Kerala' ? KERALA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  )) : (
                    <option value="Other">Other</option>
                  )}
                </select>
              </div>
            </div>

            <hr className="border-black/10 my-4" />

            {/* 2. College Search & List */}
            {!isCustomCollege ? (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block font-bold mb-2 uppercase text-sm tracking-wider">College</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={!formData.state} // Encourage picking state first
                    className="w-full p-3 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={!formData.state ? "Select State first..." : "Search your college..."}
                  />
                </div>

                {formData.state && (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {filteredColleges.length > 0 ? (
                      filteredColleges.map((college) => (
                        <div
                          key={college.id}
                          onClick={() => setFormData({ ...formData, collegeId: college.id })}
                          className={`p-3 border-2 border-black cursor-pointer transition-all flex justify-between items-center ${formData.collegeId === college.id ? "bg-accent-green shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-white hover:bg-gray-50"}`}
                        >
                          <div className="truncate pr-2">
                            <h3 className="font-bold text-sm truncate">{college.name}</h3>
                            <p className="text-xs text-gray-600 truncate">{college.city}</p>
                          </div>
                          {formData.collegeId === college.id && (
                            <span className="text-green-800 font-bold flex-shrink-0">✓</span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-400 text-sm">
                        No colleges found in this location.{searchQuery && " Try a different search."}
                      </div>
                    )}
                  </div>
                )}

                {formData.state && (
                  <button
                    onClick={() => { setIsCustomCollege(true); setFormData({ ...formData, collegeId: "" }); }}
                    className="w-full py-2 text-xs font-bold text-gray-500 hover:text-black underline"
                  >
                    My college is not listed
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-sm text-yellow-800 mb-4">
                  Top Tip: Adding a new college takes a while to verify. Check the search one more time?
                </div>

                <div>
                  <label className="block font-bold mb-2 uppercase text-sm tracking-wider">College Name</label>
                  <input
                    type="text"
                    value={customCollegeData.name}
                    onChange={e => setCustomCollegeData({ ...customCollegeData, name: e.target.value })}
                    className="w-full p-3 border-2 border-black"
                    placeholder="e.g. St. Thomas Institute"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-2 uppercase text-sm tracking-wider">City</label>
                  <input
                    type="text"
                    value={customCollegeData.city}
                    onChange={e => setCustomCollegeData({ ...customCollegeData, city: e.target.value })}
                    className="w-full p-3 border-2 border-black"
                    placeholder="e.g. Trivandrum"
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button onClick={() => setIsCustomCollege(false)} className="text-xs underline font-bold text-gray-500">Back to Search</button>
                </div>
              </div>
            )}
          </div>
        );
      case 5: // Review
        return (
          <div className="space-y-4 text-left">
            <div className="p-4 bg-gray-50 border-2 border-black">
              <p className="font-bold text-xs uppercase text-gray-500">Name</p>
              <p className="font-bold text-lg">{formData.fullName}</p>
            </div>
            <div className="p-4 bg-gray-50 border-2 border-black">
              <p className="font-bold text-xs uppercase text-gray-500">College</p>
              <p className="font-bold text-lg">
                {isCustomCollege ? `${customCollegeData.name} (Custom)` : colleges.find((c) => c.id === formData.collegeId)?.name || "Not Selected"}
              </p>
            </div>
            <div className="p-4 bg-gray-50 border-2 border-black">
              <p className="font-bold text-xs uppercase text-gray-500">Location</p>
              <p className="font-bold text-lg">{formData.district ? `${formData.district}, ${formData.state}` : "Not Specified"}</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (!step && currentStep > 0) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Container>
      <div className="h-screen w-full flex items-center justify-center overflow-hidden p-4">
        <div className="w-full max-w-xl relative flex flex-col max-h-full">
          <Doodle src="/doodles/sparkle.svg" className="absolute -top-12 -right-12 w-24 h-24 text-accent-pink animate-spin-slow z-10" />
          <NewspaperCard className="p-6 md:p-10 relative bg-white flex flex-col h-full max-h-[85vh] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-20" />
            <div className="w-full h-2 bg-gray-100 mb-6 rounded-full overflow-hidden border border-black flex-shrink-0">
              <motion.div className="h-full bg-accent-blue" initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
            </div>
            <div className="mb-6 text-center flex-shrink-0">
              <Badge className="mb-3 bg-black text-white border-black">STEP {currentStep + 1} / {STEPS.length}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-black mb-1">{STEPS[currentStep].title}</h1>
              <p className="text-gray-600 font-serif italic text-sm">{STEPS[currentStep].subtitle}</p>
            </div>
            <div className="flex-grow overflow-y-auto px-1 custom-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="py-2">
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-6 flex-shrink-0 pt-2 bg-white sticky bottom-0 z-10">
              <div className="flex gap-4">
                {currentStep > 0 && <RetroButton onClick={handleBack} variant="outline" className="flex-1" disabled={loading}>BACK</RetroButton>}
                <RetroButton onClick={handleNext} className="flex-1 bg-black text-white hover:bg-neutral-800" disabled={loading}>
                  {loading ? "SAVING..." : currentStep === STEPS.length - 1 ? "FINISH ->" : "NEXT ->"}
                </RetroButton>
              </div>
            </div>
          </NewspaperCard>
        </div>
      </div>
    </Container>
  );
}
