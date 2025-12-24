"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { checkOnboardingStatus } from "../hooks/useOnboardingGuard";
import Loading from "../loading";
import { motion } from "framer-motion";

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, user, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false });

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const { isComplete, missingFields } = checkOnboardingStatus(user);
      if (!isComplete) {
        if (missingFields.includes("collegeId") && !missingFields.includes("fullName")) {
          router.replace("/onboarding?step=college");
        } else {
          router.replace("/onboarding");
        }
      } else {
        router.replace("/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);



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

    const fullNameError = validateFullName(formData.fullName);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    setValidationErrors({ fullName: fullNameError, email: emailError, password: passwordError });
    setTouched({ fullName: true, email: true, password: true });

    if (fullNameError || emailError || passwordError) return;

    setLoading(true);

    try {
      await register(formData.email.trim(), formData.password, formData.fullName.trim());
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen overflow-hidden bg-paper flex flex-col">
      <header className="px-4 py-3 flex justify-between items-center border-b border-neutral-200">
        <Link href="/" className="font-display text-xl font-black">LINKER</Link>
        <Link href="/login" className="text-sm font-bold text-primary hover:underline">Sign In</Link>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 py-8 max-w-md mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-accent-coral rounded-2xl border-2 border-ink shadow-neo flex items-center justify-center">
              <span className="font-display text-3xl font-black text-white">L</span>
            </div>
            <h1 className="font-display text-2xl font-black mb-1">Join LINKER</h1>
            <p className="text-neutral-500 text-sm">Create your account to get started</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-neutral-700 mb-1.5">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleFieldChange("fullName", e.target.value)}
                onBlur={() => handleBlur("fullName")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all ${validationErrors.fullName && touched.fullName ? "border-red-400 bg-red-50" : "border-neutral-200 bg-white focus:border-primary"} focus:outline-none`}
                placeholder="John Doe"
                autoComplete="name"
              />
              {validationErrors.fullName && touched.fullName && <p className="text-red-500 text-xs mt-1">{validationErrors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all ${validationErrors.email && touched.email ? "border-red-400 bg-red-50" : "border-neutral-200 bg-white focus:border-primary"} focus:outline-none`}
                placeholder="you@college.edu"
                autoComplete="email"
              />
              {validationErrors.email && touched.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all ${validationErrors.password && touched.password ? "border-red-400 bg-red-50" : "border-neutral-200 bg-white focus:border-primary"} focus:outline-none`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {validationErrors.password && touched.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
              <p className="text-neutral-400 text-xs mt-1">At least 8 characters</p>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-ink text-white rounded-xl font-bold text-base hover:bg-neutral-800 transition-colors disabled:opacity-50">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200" /></div>
            <div className="relative flex justify-center"><span className="px-3 bg-paper text-neutral-400 text-sm">or</span></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} disabled={loading} className="w-full py-3.5 bg-white border-2 border-neutral-200 rounded-xl font-semibold text-base hover:bg-neutral-50 transition-colors flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center mt-8 text-neutral-600 text-sm">
            Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>

          <p className="text-center mt-4 text-neutral-400 text-xs">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </main>
    </div>
  );
}
