"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
  Sticker,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login, register, loginWithGoogle, user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    router.replace("/dashboard");
  }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ fullName: boolean; email: boolean; password: boolean }>({
    fullName: false,
    email: false,
    password: false,
  });

  const validateFullName = useCallback((value: string): string | undefined => {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  }, []);

  const validateEmail = useCallback((value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
    return undefined;
  }, []);

  const validatePassword = useCallback((value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return undefined;
  }, []);

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      let error: string | undefined;
      if (field === "fullName") error = validateFullName(value);
      else if (field === "email") error = validateEmail(value);
      else if (field === "password") error = validatePassword(value);
      setValidationErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let error: string | undefined;
    if (field === "fullName") error = validateFullName(formData.fullName);
    else if (field === "email") error = validateEmail(formData.email);
    else if (field === "password") error = validatePassword(formData.password);
    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setValidationErrors({ fullName: fullNameError, email: emailError, password: passwordError });
    setTouched({ fullName: true, email: true, password: true });

    if (fullNameError || emailError || passwordError) return;

    setLoading(true);

    try {
      // Register using Supabase (via AuthContext)
      await register(
        formData.email.trim(),
        formData.password,
        formData.fullName.trim()
      );

      // Redirect to Onboarding (AuthContext listener handles sync)
      router.push("/onboarding");
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      {/* Simplified Auth Navbar */}
      <div className="py-4 flex justify-between items-center">
        <Link href="/" className="font-display text-2xl font-black">
          LINKER
        </Link>
        <Link href="/login">
          <RetroButton variant="outline" className="text-sm py-2 px-4">
            Login
          </RetroButton>
        </Link>
      </div>
      <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-8 md:py-12">
        <div className="w-full max-w-5xl relative">
          {/* Floating Decor */}
          <Doodle
            src="/doodles/sparkle.svg"
            className="absolute -top-12 -right-8 w-32 h-32 text-accent-yellow animate-spin-slow z-0"
          />

          <NewspaperCard className="p-0 overflow-hidden grid md:grid-cols-2 shadow-neo-lg relative z-10 bg-white">
            {/* LEFT SIDE: Visual Branding */}
            <div className="bg-accent-pink p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[300px] md:min-h-full order-first md:order-last">
              {/* Background Pattern */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              ></div>

              <div className="relative z-10">
                <Badge className="bg-black text-white border-white rotate-[2deg] mb-6 inline-block shadow-neo-sm">
                  NEW_RECRUIT
                </Badge>
                <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.9] tracking-tight mb-4 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  JOIN
                  <br />
                  THE
                  <br />
                  CHAOS.
                </h1>
                <p className="font-serif italic text-xl md:text-2xl font-bold opacity-90 text-black mt-4">
                  "Your academic survival kit starts here."
                </p>
              </div>

              <div className="relative z-10 mt-8 md:mt-0 hidden md:block">
                <div className="bg-white text-black p-4 rounded-xl border-2 border-black shadow-neo transform -rotate-2">
                  <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pb-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-100 rounded w-4/6"></div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <div className="px-3 py-1 bg-accent-green text-xs font-bold rounded-full border border-black">
                      APPROVED
                    </div>
                  </div>
                </div>
              </div>

              {/* Giant Doodle */}
              <Doodle
                src="/doodles/star.svg"
                className="absolute -bottom-12 -left-12 w-64 h-64 text-black opacity-10 rotate-12"
              />
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="p-6 md:p-10 bg-white relative flex flex-col justify-center order-last md:order-first">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-1" />
              <Sticker className="absolute top-4 left-4 bg-accent-yellow text-black -rotate-6 hidden md:block">
                FREE
              </Sticker>

              <div className="mb-6">
                <h2 className="font-bold text-2xl mb-1">Create Account</h2>
                <p className="text-gray-500 text-sm">
                  Join thousands of students on Linker.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold animate-pulse">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label
                    htmlFor="fullName"
                    className="font-bold text-xs uppercase tracking-wider text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    className={`w-full p-3 border-2 ${
                      validationErrors.fullName && touched.fullName
                        ? "border-red-500 bg-red-50"
                        : "border-black bg-gray-50"
                    } focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium`}
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                  {validationErrors.fullName && touched.fullName && (
                    <p className="text-red-500 text-xs font-bold mt-1">
                      {validationErrors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="font-bold text-xs uppercase tracking-wider text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`w-full p-3 border-2 ${
                      validationErrors.email && touched.email
                        ? "border-red-500 bg-red-50"
                        : "border-black bg-gray-50"
                    } focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium`}
                    placeholder="student@college.edu"
                    autoComplete="email"
                  />
                  {validationErrors.email && touched.email && (
                    <p className="text-red-500 text-xs font-bold mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="password"
                    className="font-bold text-xs uppercase tracking-wider text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`w-full p-3 border-2 ${
                      validationErrors.password && touched.password
                        ? "border-red-500 bg-red-50"
                        : "border-black bg-gray-50"
                    } focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  {validationErrors.password && touched.password && (
                    <p className="text-red-500 text-xs font-bold mt-1">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <RetroButton
                  type="submit"
                  className="w-full py-3 text-base mt-3 bg-accent-green text-black hover:bg-green-400"
                  disabled={loading}
                >
                  {loading ? "CREATING PROFILE..." : "START ONBOARDING ->"}
                </RetroButton>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 font-bold tracking-widest">
                      Or join with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="w-full py-3 border-2 border-black bg-white hover:bg-gray-50 transition-colors rounded-lg font-bold flex items-center justify-center gap-3"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  GOOGLE
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-black underline decoration-2 decoration-accent-pink hover:bg-accent-pink hover:text-white transition-colors px-1"
                  >
                    Login Here
                  </Link>
                </p>
              </div>
            </div>
          </NewspaperCard>
        </div>
      </div>
    </Container>
  );
}
