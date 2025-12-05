"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Loading from "../loading";
import { supabase } from "../../lib/supabase";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface User {
  id: string;
  email: string;
  role: string;
  profile?: {
    fullName: string;
    bio?: string;
    collegeId?: string;
    avatarUrl?: string;
    githubUrl?: string;
    instagram?: string;
    linkedin?: string;
    tags?: string[];
    interests?: string[];
    socials?: any;
    isOnboarded?: boolean;
    onboardingStep?: number;
    college?: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    collegeSlug?: string,
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  // Initial Load & Listener
  useEffect(() => {
    let mounted = true;

    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        if (session) {
          syncSession(session);
        } else {
          setIsLoadingUser(false);
        }
      }
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        if (session) {
          await syncSession(session);
        } else {
          setUser(null);
          setIsLoadingUser(false);
          // Optional: clear local storage if you rely on it
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Onboarding Check
  useEffect(() => {
    if (isLoadingUser) return;

    if (user) {
      const isProfileComplete =
        user.profile?.isOnboarded && user.profile?.collegeId;

      if (!isProfileComplete && pathname !== "/onboarding") {
        router.replace("/onboarding");
      } else if (isProfileComplete && pathname.startsWith("/onboarding")) {
        router.replace("/dashboard");
      }
    }
  }, [user, isLoadingUser, pathname]);

  async function syncSession(session: any) {
    try {
      if (!session?.access_token) return;

      const res = await fetch(`${API_URL}/auth/supabase/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        // data contains { user, accessToken, refreshToken } from backend
        // We use backend accessToken for internal API calls, but Supabase handles Auth state.
        // We'll store internal token for API calls.
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken); // Internal refresh token if needed, but Supabase rotates its own.
        // Actually, internal refresh might be redundant if we just exchange Supabase token every time,
        // BUT for perf, we keep internal token.
        // The user plan says "Refresh Token Rotation ... internal JWT is still needed".

        setUser(data.user);
      } else {
        console.error("Failed to sync session with backend");
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.error("Sync session error", err);
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function loadUser() {
    // If using Supabase, usually we rely on syncSession. 
    // But if we want to manually reload user data from backend:
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function login(email: string, password: string) {
    setIsLoadingUser(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setIsLoadingUser(false);
      throw error;
    }
    // Listener will pick up session change
  }

  async function register(
    email: string,
    password: string,
    fullName: string,
    collegeSlug?: string,
  ) {
    setIsLoadingUser(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          // We can pass other metadata if we want supabase to hold it, 
          // but our backend creates profile based on what? 
          // Our backend validateSupabaseUser creates profile with empty fullName currently.
          // Wait, the plan said "create internal user ... profile: { create: { fullName: '' } }".
          // We should probably pass fullName to backend or update it later.
          // For now, let's stick to the plan.
        },
      },
    });

    if (error) {
      setIsLoadingUser(false);
      throw error;
    }
    // Listener will pick up session change
  }

  async function logout() {
    setIsLoadingUser(true);
    await supabase.auth.signOut();
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    router.push("/");
    setIsLoadingUser(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading: isLoadingUser,
        login,
        register,
        logout,
        refreshUser: loadUser,
      }}
    >
      {isLoadingUser ? <Loading /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

