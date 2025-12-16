"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

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

// Notification Preferences Interface
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: Record<NotificationType, boolean>;
}

// Default preferences - all enabled
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  inApp: true,
  types: {
    LIKE: true,
    COMMENT: true,
    FOLLOW: true,
    EVENT_REMINDER: true,
    EVENT_APPROVED: true,
    EVENT_REJECTED: true,
    MESSAGE: true,
    CLUB_UPDATE: true,
    CERTIFICATE_READY: true,
    KARMA_MILESTONE: true,
    ROLE_CHANGED: true,
    MENTION: true,
    SYSTEM: true,
  },
};

// Storage key for preferences
const PREFERENCES_STORAGE_KEY = "notificationPreferences";

interface NotificationContextType {
  notifications: Notification[];
  filteredNotifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  preferences: NotificationPreferences;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (newPreferences: NotificationPreferences) => void;
  toggleNotificationType: (type: NotificationType) => void;
  isNotificationTypeEnabled: (type: NotificationType) => boolean;
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
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFERENCES);
  
  // Always call useSocket unconditionally - it will return null values if not in SocketProvider
  const socketContext = useSocket();

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Merge with defaults to ensure all types are present
          setPreferences({
            ...DEFAULT_NOTIFICATION_PREFERENCES,
            ...parsed,
            types: {
              ...DEFAULT_NOTIFICATION_PREFERENCES.types,
              ...parsed.types,
            },
          });
        } catch {
          // Use defaults if parsing fails
        }
      }
    }
  }, []);

  // Filter notifications based on preferences
  const filteredNotifications = notifications.filter((n) => {
    // If in-app notifications are disabled, show nothing
    if (!preferences.inApp) return false;
    // Check if this notification type is enabled
    return preferences.types[n.type] !== false;
  });

  // Calculate unread count from filtered notifications
  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  // Update preferences and save to localStorage
  const updatePreferences = useCallback((newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    if (typeof window !== "undefined") {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(newPreferences));
    }
  }, []);

  // Toggle a specific notification type
  const toggleNotificationType = useCallback((type: NotificationType) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        types: {
          ...prev.types,
          [type]: !prev.types[type],
        },
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  // Check if a notification type is enabled
  const isNotificationTypeEnabled = useCallback((type: NotificationType): boolean => {
    return preferences.inApp && preferences.types[type] !== false;
  }, [preferences]);

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

  // Poll for new notifications every 30 seconds (fallback when socket not available)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // If socket is connected, reduce polling frequency
    const pollInterval = socketContext?.isConnected ? 60000 : 30000;
    const interval = setInterval(fetchNotifications, pollInterval);
    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications, socketContext?.isConnected]);

  // Listen for real-time notifications via Socket.io
  useEffect(() => {
    if (!socketContext || !socketContext.isConnected) return;

    const unsubscribe = socketContext.onNotification((payload) => {
      const notification: Notification = {
        id: payload.id,
        type: payload.type as NotificationType,
        title: payload.title,
        message: payload.message,
        read: false,
        createdAt: new Date(payload.createdAt),
        actionUrl: payload.actionUrl,
        actor: payload.actor,
      };
      
      // Check if this notification type is enabled before adding
      if (!isNotificationTypeEnabled(notification.type)) {
        return; // Skip this notification based on user preferences
      }
      
      // Add to the beginning of the list
      addNotification(notification);
      
      // Show browser notification if permitted and push notifications are enabled
      if (
        preferences.push &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/logo.png",
        });
      }
    });

    return unsubscribe;
  }, [socketContext, addNotification, isNotificationTypeEnabled, preferences.push]);

  const value: NotificationContextType = {
    notifications,
    filteredNotifications,
    unreadCount,
    isLoading,
    error,
    preferences,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    addNotification,
    removeNotification,
    clearAll,
    updatePreferences,
    toggleNotificationType,
    isNotificationTypeEnabled,
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

// Group notifications by type
export function groupNotificationsByType(notifications: Notification[]): Record<NotificationType, Notification[]> {
  const grouped: Record<NotificationType, Notification[]> = {
    LIKE: [],
    COMMENT: [],
    FOLLOW: [],
    EVENT_REMINDER: [],
    EVENT_APPROVED: [],
    EVENT_REJECTED: [],
    MESSAGE: [],
    CLUB_UPDATE: [],
    CERTIFICATE_READY: [],
    KARMA_MILESTONE: [],
    ROLE_CHANGED: [],
    MENTION: [],
    SYSTEM: [],
  };

  notifications.forEach((notification) => {
    if (grouped[notification.type]) {
      grouped[notification.type].push(notification);
    }
  });

  return grouped;
}

// Group notifications by date (Today, Yesterday, This Week, Earlier)
export function groupNotificationsByDate(notifications: Notification[]): Record<string, Notification[]> {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Earlier: [],
  };

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.createdAt);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() >= today.getTime()) {
      groups.Today.push(notification);
    } else if (notifDay.getTime() >= yesterday.getTime()) {
      groups.Yesterday.push(notification);
    } else if (notifDay.getTime() >= weekAgo.getTime()) {
      groups["This Week"].push(notification);
    } else {
      groups.Earlier.push(notification);
    }
  });

  return groups;
}

// Notification category labels
export const NOTIFICATION_CATEGORIES: Record<NotificationType, string> = {
  LIKE: "Likes",
  COMMENT: "Comments",
  FOLLOW: "Followers",
  EVENT_REMINDER: "Event Reminders",
  EVENT_APPROVED: "Event Approvals",
  EVENT_REJECTED: "Event Rejections",
  MESSAGE: "Messages",
  CLUB_UPDATE: "Club Updates",
  CERTIFICATE_READY: "Certificates",
  KARMA_MILESTONE: "Achievements",
  ROLE_CHANGED: "Role Changes",
  MENTION: "Mentions",
  SYSTEM: "System",
};
