"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Container from "../../components/ui/Container";
import Loading from "../../loading";
import { API_URL } from "../../../lib/api"; // Ensure this internal helper or env var is available or inline it

export default function AuthCallback() {
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const handleSession = async (session: any) => {
      if (processed.current) return;
      processed.current = true;

      try {
        const res = await fetch(`${API_URL}/auth/supabase/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
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

    // Check immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleSession(session);
      } else {
        // If no session immediate, wait for event (implicit flow/pkce exchange)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            handleSession(session);
          }
        });
        return () => subscription.unsubscribe();
      }
    });
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
