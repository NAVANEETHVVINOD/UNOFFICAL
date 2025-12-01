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

  useEffect(() => {
    loadUser();
  }, []);

  // Onboarding Check
  // Onboarding Check
  useEffect(() => {
    if (isLoadingUser) return;

    if (user) {
      const isProfileComplete =
        user.profile?.isOnboarded && user.profile?.collegeId;

      // If logged in but not fully onboarded -> Force Onboarding
      if (!isProfileComplete && pathname !== "/onboarding") {
        router.replace("/onboarding");
      }
      // If logged in AND fully onboarded -> Prevent accessing Onboarding
      else if (isProfileComplete && pathname.startsWith("/onboarding")) {
        router.replace("/dashboard");
      }
    }
  }, [user, isLoadingUser, pathname]);

  // Session Heartbeat: Refresh user every 5 minutes
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      () => {
        refreshSession();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  async function loadUser(silent = false) {
    if (!silent) setIsLoadingUser(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoadingUser(false);
        return;
      }

      const res = await fetch(`${API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else if (res.status === 401) {
        console.warn("Token expired, attempting refresh...");
        const refreshSuccess = await refreshSession();
        if (refreshSuccess) {
          // Retry loadUser ONE time
          const newToken = localStorage.getItem("token");
          const retryRes = await fetch(`${API_URL}/users/me`, {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          if (retryRes.ok) {
            const userData = await retryRes.json();
            setUser(userData);
          } else {
            logout();
          }
        } else {
          logout();
        }
      } else {
        console.warn("Failed to load user", res.status);
        logout();
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function login(email: string, password: string) {
    setIsLoadingUser(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        await loadUser();
      } else {
        console.error("Login failed:", data);
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function register(
    email: string,
    password: string,
    fullName: string,
    collegeSlug?: string,
  ) {
    setIsLoadingUser(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fullName, collegeSlug }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
        await loadUser();
      } else {
        console.error("Registration failed:", data);
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function refreshSession(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return false;

      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        document.cookie = `token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;

        return true;
      } else {
        console.warn("Session refresh failed");
        return false;
      }
    } catch (error) {
      console.error("Session refresh error:", error);
      return false;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setUser(null);
    router.push("/");
  }

  // Always render provider, pass loading state
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading: isLoadingUser,
        login,
        register,
        logout,
        refreshUser: () => loadUser(false),
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
