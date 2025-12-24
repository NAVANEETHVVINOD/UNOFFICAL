"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { checkOnboardingStatus } from "../hooks/useOnboardingGuard";
import Loading from "../loading";
import { motion } from "framer-motion";

interface ValidationErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

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

  const validateEmail = useCallback((value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
    return undefined;
  }, []);

  const validatePassword = useCallback((value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined;
  }, []);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      setValidationErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setValidationErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setValidationErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    } else {
      setValidationErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setValidationErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) return;

    setLoading(true);

    try {
      await login(email.trim(), password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-paper flex flex-col">
      <header className="px-4 py-3 flex justify-between items-center border-b border-neutral-200">
        <Link href="/" className="font-display text-xl font-black">LINKER</Link>
        <Link href="/register" className="text-sm font-bold text-primary hover:underline">Sign Up</Link>
      </header>

      <main className="flex-1 overflow-y-auto flex flex-col items-center justify-center p-4 w-full">
        <div className="w-full max-w-md mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-2xl border-2 border-ink shadow-neo flex items-center justify-center">
                <span className="font-display text-3xl font-black">L</span>
              </div>
              <h1 className="font-display text-2xl font-black mb-1">Welcome Back</h1>
              <p className="text-neutral-500 text-sm">Sign in to continue to LINKER</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-1.5">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all ${validationErrors.email && touched.email ? "border-red-400 bg-red-50" : "border-neutral-200 bg-white focus:border-primary"} focus:outline-none`}
                  placeholder="you@college.edu"
                  autoComplete="email"
                />
                {validationErrors.email && touched.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label htmlFor="password" className="text-sm font-semibold text-neutral-700">Password</label>
                  <Link href="/forgot-password" className="text-xs text-neutral-400 hover:text-primary">Forgot?</Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base transition-all ${validationErrors.password && touched.password ? "border-red-400 bg-red-50" : "border-neutral-200 bg-white focus:border-primary"} focus:outline-none`}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {validationErrors.password && touched.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 bg-ink text-white rounded-xl font-bold text-base hover:bg-neutral-800 transition-colors disabled:opacity-50">
                {loading ? "Signing in..." : "Sign In"}
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
              Don't have an account? <Link href="/register" className="font-bold text-primary hover:underline">Sign up</Link>
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
