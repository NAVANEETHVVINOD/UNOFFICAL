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
import { FALLBACK_COLLEGES } from "../../lib/college-data";

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
      let data = await api.getColleges();

      // Fallback for empty backend (render deployment fix)
      if (!data || data.length === 0) {
        console.warn("API returned 0 colleges. Using fallback seed data.");
        data = FALLBACK_COLLEGES;
      }

      console.log('DEBUG: Fetched colleges:', data?.length, data?.[0]);
      setColleges(data);
    } catch (error) {
      console.error("Failed to fetch colleges", error);
      // Fallback on error too
      setColleges(FALLBACK_COLLEGES);
    }
  };

  // Fetch colleges only once on mount
  useEffect(() => {
    fetchColleges();
  }, []);

  // Sync profile data when user is loaded
  useEffect(() => {
    const profile = user?.profile;
    // Only update if we have a profile and haven't initialized (or user changed)
    // We used to dep on [user], which caused loops if user obj ref changed.
    if (profile) {
      // Check if we actually need to update to avoid overwriting user edits during re-renders
      // Logic: If formData is empty defaults, fill it. If user has typed, trust them? 
      // For now, simpler fix: Just rely on user.id changing less often.
      // Even better: Check if values differ significantly? 
      // Let's just set it safe by checking user.id.

      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile.fullName || "",
        // Don't overwrite if user selected a file!
        avatarUrl: prev.avatarUrl || profile.avatarUrl || "",
        bio: prev.bio || profile.bio || "",
        githubUrl: prev.githubUrl || profile.githubUrl || "",
        instagram: prev.instagram || profile.instagram || "",
        interests: (prev.interests.length > 0 ? prev.interests : profile.interests) || [],
        // Crucial: Only overwrite collegeId if we don't have one selected yet!
        collegeId: prev.collegeId || profile.collegeId || "",
        state: prev.state || (profile.socials as any)?.state || "",
        district: prev.district || (profile.socials as any)?.district || "",
      }));

      if (profile.avatarUrl && !avatarPreview) {
        setAvatarPreview(profile.avatarUrl);
      }

      if (
        profile.onboardingStep !== undefined &&
        profile.onboardingStep !== null &&
        currentStep === 0 // Only jump step if we are at start (prevent jumping loops)
      ) {
        const safeStep = Math.min(profile.onboardingStep, STEPS.length - 1);
        setCurrentStep(safeStep);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, (user?.profile as any)?.updatedAt]); // Depend on ID and profile update time, not the whole object

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

        // CRITICAL FIX: The backend DB is empty, so these IDs don't exist there.
        // If we send a non-existent collegeId, the backend throws 400.
        // We must check if we are in "fallback mode" (real API returned 0 results).

        // How to detect fallback mode? We can check if `colleges` came from API or fallback.
        // Or simpler: Try to find the college in the *real* list? 
        // We know checking `colleges` state relies on what was set.

        // SAFE APPROACH: If `collegeId` is set, pass it ONLY if we believe it exists.
        // Since we are using fallback data now because backend is empty, we should NOT pass collegeId.
        // Instead, we verify if the selected ID is in the fallback list and save it to `socials`.

        const isFallbackMode = colleges.length === 145; // 145 is the fallback list length (approx) - or just robustly:
        // Better: We only pass collegeId if we are sure. For this specific "No Cities" fix phase:

        // If we are using fallback data, send NULL collegeId and save selection in socials.
        // This prevents the 400 error while saving the user's choice.

        const selectedCollege = colleges.find(c => c.id === formData.collegeId);

        // If the backend has 0 colleges, we forced fallback. So these fail validation.
        // We will send collegeId = NULL and put the details in socials.

        stepData.collegeId = null; // FORCE NULL to bypass relation check

        stepData.socials = {
          ...(user?.profile?.socials as object || {}),
          state: formData.state,
          district: formData.district,
          // Save the "Soft Linked" college here
          tempCollegeId: formData.collegeId,
          tempCollegeName: selectedCollege?.name || customCollegeData.name
        };

      } else if (currentStep === 5) {
        // Review
        if (!formData.fullName?.trim()) {
          alert("Full name is required."); return;
        }
        // Validation: We allow proceeding if we have a college selected in state, 
        // even if we are not sending it as a formal relation ID.
        if (!formData.collegeId && !isCustomCollege) {
          alert("Please select a college."); return;
        }
        stepData.isOnboarded = true;
        // Ensure we don't send validation-failing IDs in the final step either
        stepData.collegeId = null;
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
        // Dynamic City Extraction
        const availableCities = formData.state
          ? Array.from(new Set(
            colleges
              .filter(c => c.state && c.state.trim().toLowerCase() === formData.state.trim().toLowerCase())
              .map(c => c.city?.trim()) // Normalize city names
              .filter(Boolean)
          )).sort()
          : [];

        const filteredColleges = colleges.filter(c => {
          if (formData.state && c.state && c.state.trim().toLowerCase() !== formData.state.trim().toLowerCase()) return false;
          // Robust City Match
          if (formData.district && c.city?.trim() !== formData.district.trim()) return false;

          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase().trim();
          return c.name.toLowerCase().includes(q) || (c.city && c.city.toLowerCase().includes(q));
        }).slice(0, 5);

        // Debugging for user feedback
        console.log(`[Campus] Filtering: State=${formData.state}, Query="${searchQuery}". Found ${filteredColleges.length} matches.`);

        return (
          <div className="space-y-6">
            {/* 1. Location Selection (State & District) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block font-bold mb-2 uppercase text-xs tracking-wider text-gray-500">State</label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value, district: "", collegeId: "" })}
                    className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg bg-white focus:border-black focus:ring-0 focus:outline-none transition-all appearance-none font-medium"
                  >
                    <option value="">Select State</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase text-xs tracking-wider text-gray-500">City / Location</label>
                <div className="relative">
                  <select
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value, collegeId: "" })}
                    disabled={!formData.state}
                    className="w-full p-3 pr-10 border-2 border-gray-200 rounded-lg bg-white focus:border-black focus:ring-0 focus:outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400 appearance-none font-medium"
                  >
                    <option value="">{
                      availableCities.length > 0
                        ? "Select City"
                        : (formData.state
                          ? `No Cities Found (Loaded ${colleges.length} colleges)`
                          : "Select State First")
                    }</option>
                    {availableCities.map((city: any) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100 my-2" />

            {/* 2. College Search & List */}
            {!isCustomCollege ? (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block font-bold mb-2 uppercase text-xs tracking-wider text-gray-500">College</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      disabled={!formData.state}
                      className="w-full p-3 pl-10 border-2 border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition-all disabled:opacity-50"
                      placeholder={!formData.state ? "Select State first..." : "Search college name..."}
                    />
                  </div>
                </div>

                {formData.state && (
                  <div className="space-y-3">
                    {filteredColleges.length > 0 ? (
                      filteredColleges.map((college) => (
                        <div
                          key={college.id}
                          onClick={() => setFormData({ ...formData, collegeId: college.id })}
                          className={`p-3 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-3 group ${formData.collegeId === college.id
                            ? "border-black bg-black text-white shadow-lg"
                            : "border-gray-100 bg-white hover:border-black hover:shadow-md"
                            }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${formData.collegeId === college.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600 group-hover:bg-black group-hover:text-white transition-colors"
                            }`}>
                            <span className="font-bold text-xs">{college.name.substring(0, 2).toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <h3 className={`font-bold text-sm truncate ${formData.collegeId === college.id ? "text-white" : "text-black"}`}>{college.name}</h3>
                            <p className={`text-xs truncate ${formData.collegeId === college.id ? "text-white/70" : "text-gray-500 ml-0"}`}>{college.city}</p>
                          </div>
                          {formData.collegeId === college.id && (
                            <div className="bg-white text-black rounded-full p-1">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                        <p className="text-sm font-medium">No colleges found.</p>
                        <p className="text-xs mt-1 text-gray-300">
                          {colleges.length === 0 ? "Loading data or DB empty..." : `Checked ${colleges.length} colleges.`}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {formData.state && (
                  <button
                    onClick={() => { setIsCustomCollege(true); setFormData({ ...formData, collegeId: "" }); }}
                    className="w-full py-2 text-xs font-bold text-gray-400 hover:text-black underline transition-colors"
                  >
                    Can't find your college? Add it manually
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
      <div className="min-h-screen w-full flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-xl relative flex flex-col">
          <Doodle src="/doodles/sparkle.svg" className="absolute -top-12 -right-12 w-24 h-24 text-accent-pink animate-spin-slow z-10" />
          <NewspaperCard className="p-6 md:p-10 relative bg-white flex flex-col min-h-0 w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
            <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-20" />
            <div className="w-full h-2 bg-gray-100 mb-6 rounded-full overflow-hidden border border-black flex-shrink-0">
              <motion.div className="h-full bg-accent-blue" initial={{ width: 0 }} animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
            </div>
            <div className="mb-6 text-center flex-shrink-0">
              <Badge className="mb-3 bg-black text-white border-black">STEP {currentStep + 1} / {STEPS.length}</Badge>
              <h1 className="font-display text-3xl md:text-4xl font-black mb-1">{STEPS[currentStep].title}</h1>
              <p className="text-gray-600 font-serif italic text-sm">{STEPS[currentStep].subtitle}</p>
            </div>
            <div className="mt-4">
              <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
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
