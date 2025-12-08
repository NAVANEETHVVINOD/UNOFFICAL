"use client";

import { useState } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated && user) {
    router.replace("/dashboard");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      <div className="min-h-screen flex items-center justify-center py-8 md:py-12">
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
            <div className="p-8 md:p-16 bg-white relative flex flex-col justify-center">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 rotate-1" />
              <Sticker className="absolute top-4 right-4 bg-accent-blue text-white rotate-6 hidden md:block">
                SECURE
              </Sticker>

              <div className="mb-8">
                <h2 className="font-bold text-2xl mb-1">Access Your Account</h2>
                <p className="text-gray-500 text-sm">
                  Enter your credentials to continue.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-bold animate-pulse">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
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
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium"
                    placeholder="student@college.edu"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="space-y-2">
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <RetroButton
                  type="submit"
                  className="w-full py-4 text-lg mt-4"
                  disabled={loading}
                >
                  {loading ? "AUTHENTICATING..." : "LOGIN ->"}
                </RetroButton>

                <div className="relative my-4">
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
                  className="w-full py-4 border-2 border-black bg-white hover:bg-gray-50 transition-colors rounded-lg font-bold flex items-center justify-center gap-3"
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

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
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
