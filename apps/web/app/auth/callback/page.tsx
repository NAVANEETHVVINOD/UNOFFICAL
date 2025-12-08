"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Container from "../../components/ui/Container";
import Loading from "../../loading";
import { API_URL } from "../../lib/api"; // Ensure this internal helper or env var is available or inline it

export default function AuthCallback() {
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const handleCallback = async () => {
      // 1. Check Supabase Session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        console.error("No session found after redirect");
        router.replace("/login");
        return;
      }

      try {
        // 2. Exchange Token with Backend
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "https://linker-g0lw.onrender.com";

        const res = await fetch(`${backendUrl}/auth/supabase/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          // Store backend token
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // 3. Redirect to Dashboard
          router.replace("/dashboard");
        } else {
          console.error("Backend sync failed");
          router.replace("/login?error=sync_failed");
        }
      } catch (err) {
        console.error("Callback error:", err);
        router.replace("/login?error=unknown");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading />
          <p className="mt-4 font-bold font-mono animate-pulse">
            AUTHENTICATING WITH SATELLITE...
          </p>
        </div>
      </div>
    </Container>
  );
}
