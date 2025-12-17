"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

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

  if (isAuthenticated && user) {
    router.replace("/dashboard");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields
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
    <Container>
      {/* Simplified Auth Navbar - Logo only */}
      <div className="py-3 flex justify-between items-center">
        <Link href="/" className="font-display text-xl font-black">
          LINKER
        </Link>
        <Link href="/register">
          <RetroButton variant="outline" className="text-xs py-1.5 px-3">
            Sign Up
          </RetroButton>
        </Link>
      </div>
      <div className="min-h-[calc(100vh-70px)] flex items-center justify-center py-4 md:py-6">
        <div className="w-full max-w-5xl relative">
          {/* Floating Decor */}
          <Doodle
            src="/doodles/sparkle.svg"
            className="absolute -top-8 -left-8 w-24 h-24 text-accent-pink animate-spin-slow z-0"
          />
          <Doodle
            src="/doodles/arrow-scribble.svg"
            className="absolute -bottom-12 -right-12 w-40 h-40 text-black rotate-12 hidden md:block z-0"
          />

          <NewspaperCard className="p-0 overflow-hidden grid md:grid-cols-2 shadow-neo-lg relative z-10 bg-white">
            {/* LEFT SIDE: Visual Branding */}
            <div className="bg-accent-yellow p-8 md:p-12 flex flex-col justify-between relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black min-h-[300px] md:min-h-full">
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
                <Badge className="bg-white border-black rotate-[-2deg] mb-6 inline-block shadow-neo-sm">
                  STUDENT_PORTAL
                </Badge>
                <h1 className="font-display text-5xl md:text-7xl font-black leading-[0.9] tracking-tight mb-4">
                  WELCOME
                  <br />
                  <span className="text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    BACK.
                  </span>
                </h1>
                <p className="font-serif italic text-xl md:text-2xl font-bold opacity-80">
                  "Chaos awaits, but first—coffee."
                </p>
              </div>

              <div className="relative z-10 mt-8 md:mt-0 hidden md:block">
                <div className="bg-black text-white p-4 rounded-xl border-2 border-white shadow-neo transform rotate-2">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="font-mono text-sm text-green-400">
                    &gt; system.login()
                    <br />
                    &gt; access_granted
                    <br />
                    &gt; welcome_user
                  </div>
                </div>
              </div>

              {/* Giant Doodle */}
              <Doodle
                src="/doodles/sparkle.svg"
                className="absolute -bottom-12 -right-12 w-64 h-64 text-white opacity-20 rotate-45"
              />
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="p-6 md:p-10 bg-white relative flex flex-col justify-center">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-1" />
              <Sticker className="absolute top-3 right-3 bg-accent-blue text-white rotate-6 hidden md:block text-xs">
                SECURE
              </Sticker>

              <div className="mb-5">
                <h2 className="font-bold text-xl mb-1">Access Your Account</h2>
                <p className="text-gray-500 text-xs">
                  Enter your credentials to continue.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold animate-pulse flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`w-full p-3 border-2 ${
                      validationErrors.email && touched.email
                        ? "border-red-500 bg-red-50"
                        : "border-black bg-input-bg"
                    } focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium text-sm`}
                    placeholder="student@college.edu"
                    autoComplete="email"
                  />
                  {validationErrors.email && touched.email && (
                    <p className="text-red-500 text-xs font-bold">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="font-bold text-xs uppercase tracking-wider text-gray-700"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs text-gray-400 hover:text-black underline decoration-dotted"
                    >
                      Forgot?
                    </a>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    onBlur={() => handleBlur("password")}
                    className={`w-full p-3 border-2 ${
                      validationErrors.password && touched.password
                        ? "border-red-500 bg-red-50"
                        : "border-black bg-input-bg"
                    } focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium text-sm`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  {validationErrors.password && touched.password && (
                    <p className="text-red-500 text-xs font-bold">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                <RetroButton
                  type="submit"
                  className="w-full py-3 text-base mt-2"
                  disabled={loading}
                >
                  {loading ? "AUTHENTICATING..." : "LOGIN ->"}
                </RetroButton>

                <div className="relative my-3">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500 font-bold tracking-widest">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="w-full py-3 border-2 border-black bg-white hover:bg-gray-50 transition-colors rounded-lg font-bold flex items-center justify-center gap-2 text-sm"
                  disabled={loading}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  GOOGLE
                </button>
              </form>

              <div className="mt-5 pt-5 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="font-black underline decoration-2 decoration-accent-yellow hover:bg-accent-yellow hover:text-black transition-colors px-1"
                  >
                    Join the Club
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
