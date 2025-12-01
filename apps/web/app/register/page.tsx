"use client";

import { useState } from "react";
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

export default function RegisterPage() {
  const router = useRouter();
  const { login, user, isAuthenticated } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // 1. Register
      await api.register(
        formData.email,
        formData.password,
        formData.fullName,
        undefined, // College ID is now handled in onboarding
        undefined,
      );

      // 2. Auto Login
      await login(formData.email, formData.password);

      // 3. Redirect to Onboarding
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
      <div className="min-h-screen flex items-center justify-center py-8 md:py-12">
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
            <div className="p-8 md:p-16 bg-white relative flex flex-col justify-center order-last md:order-first">
              <Tape className="absolute -top-3 left-1/2 -translate-x-1/2 -rotate-1" />
              <Sticker className="absolute top-4 left-4 bg-accent-yellow text-black -rotate-6 hidden md:block">
                FREE
              </Sticker>

              <div className="mb-8">
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

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/google`)
                  }
                  className="flex items-center justify-center gap-2 p-3 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-5 h-5"
                    alt="Google"
                  />
                  GOOGLE
                </button>
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/github`)
                  }
                  className="flex items-center justify-center gap-2 p-3 border-2 border-black rounded-lg hover:bg-gray-50 transition-colors font-bold text-sm"
                >
                  <img
                    src="https://www.svgrepo.com/show/512317/github-142.svg"
                    className="w-5 h-5"
                    alt="GitHub"
                  />
                  GITHUB
                </button>
              </div>

              <div className="relative mb-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <span className="relative bg-white px-2 text-xs text-gray-500 font-mono">
                  OR JOIN WITH
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="font-bold text-xs uppercase tracking-wider text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full p-4 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-xs uppercase tracking-wider text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-4 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium"
                    placeholder="student@college.edu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-xs uppercase tracking-wider text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-4 border-2 border-black bg-gray-50 focus:bg-white focus:shadow-neo transition-all outline-none rounded-lg font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <RetroButton
                  type="submit"
                  className="w-full py-4 text-lg mt-4 bg-accent-green text-black hover:bg-green-400"
                  disabled={loading}
                >
                  {loading ? "CREATING PROFILE..." : "START ONBOARDING ->"}
                </RetroButton>
              </form>

              <div className="mt-8 pt-8 border-t border-gray-100 text-center">
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
