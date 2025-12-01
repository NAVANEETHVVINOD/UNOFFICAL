"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (token && refreshToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

      // Verify auth and redirect
      refreshUser()
        .then(() => {
          router.replace("/dashboard");
        })
        .catch(() => {
          router.replace("/login?error=auth_failed");
        });
    } else {
      router.replace("/login?error=missing_token");
    }
  }, [searchParams, router, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent-yellow">
      <div className="bg-white p-8 border-4 border-black shadow-neo-lg text-center">
        <h1 className="font-display text-4xl font-black mb-4">
          AUTHENTICATING...
        </h1>
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-mono mt-4 text-gray-600">
          Please wait while we log you in.
        </p>
      </div>
    </div>
  );
}
