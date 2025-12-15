"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";

// Notification Types
export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW"
  | "EVENT_REMINDER"
  | "EVENT_APPROVED"
  | "EVENT_REJECTED"
  | "MESSAGE"
  | "CLUB_UPDATE"
  | "CERTIFICATE_READY"
  | "KARMA_MILESTONE"
  | "ROLE_CHANGED"
  | "MENTION"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actor?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      setNotifications(
        data.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
      // Use mock data in development if API fails
      if (process.env.NODE_ENV === "development") {
        setNotifications(getMockNotifications());
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Mark single notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // Still update locally even if API fails
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      // Still update locally
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, []);

  // Add a new notification (for real-time updates)
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  // Remove a notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    addNotification,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}

// Mock notifications for development
function getMockNotifications(): Notification[] {
  return [
    {
      id: "1",
      type: "LIKE",
      title: "New Like",
      message: "Sarah liked your post about React Hooks",
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      actionUrl: "/posts/123",
      actor: { id: "user1", name: "Sarah", avatarUrl: undefined },
    },
    {
      id: "2",
      type: "COMMENT",
      title: "New Comment",
      message: "Alex commented on your marketplace listing",
      read: false,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      actionUrl: "/marketplace/456",
      actor: { id: "user2", name: "Alex", avatarUrl: undefined },
    },
    {
      id: "3",
      type: "EVENT_REMINDER",
      title: "Event Starting Soon",
      message: "Tech Talk: AI in 2025 starts in 1 hour",
      read: true,
      createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      actionUrl: "/events/789",
    },
  ];
}

// Notification type icons mapping
export const NOTIFICATION_ICONS: Record<NotificationType, string> = {
  LIKE: "❤️",
  COMMENT: "💬",
  FOLLOW: "👤",
  EVENT_REMINDER: "📅",
  EVENT_APPROVED: "✅",
  EVENT_REJECTED: "❌",
  MESSAGE: "✉️",
  CLUB_UPDATE: "🏛️",
  CERTIFICATE_READY: "🎓",
  KARMA_MILESTONE: "⭐",
  ROLE_CHANGED: "🔑",
  MENTION: "@",
  SYSTEM: "🔔",
};

// Format relative time
export function formatNotificationTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
