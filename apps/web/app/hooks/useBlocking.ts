"use client";

import { useState, useCallback, useEffect } from "react";
import { api } from "../../lib/api";

export interface BlockedUser {
  id: string;
  blockedUserId: string;
  blockedUser: {
    id: string;
    profile?: {
      fullName: string;
      avatarUrl?: string;
    };
  };
  createdAt: string;
}

interface UseBlockingReturn {
  blockedUsers: BlockedUser[];
  isLoading: boolean;
  error: string | null;
  blockUser: (userId: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  isBlocked: (userId: string) => boolean;
  fetchBlockedUsers: () => Promise<void>;
}

export function useBlocking(): UseBlockingReturn {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch blocked users list
  const fetchBlockedUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getBlockedUsers();
      setBlockedUsers(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blocked users");
      // Use localStorage as fallback
      const stored = localStorage.getItem("blockedUsers");
      if (stored) {
        try {
          setBlockedUsers(JSON.parse(stored));
        } catch {
          // Ignore parse errors
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Block a user
  const blockUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      await api.blockUser(userId);
      
      // Optimistically update local state
      const newBlock: BlockedUser = {
        id: `temp-${Date.now()}`,
        blockedUserId: userId,
        blockedUser: {
          id: userId,
        },
        createdAt: new Date().toISOString(),
      };
      
      setBlockedUsers((prev) => {
        const updated = [...prev, newBlock];
        localStorage.setItem("blockedUsers", JSON.stringify(updated));
        return updated;
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to block user");
      return false;
    }
  }, []);

  // Unblock a user
  const unblockUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      await api.unblockUser(userId);
      
      // Update local state
      setBlockedUsers((prev) => {
        const updated = prev.filter((b) => b.blockedUserId !== userId);
        localStorage.setItem("blockedUsers", JSON.stringify(updated));
        return updated;
      });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unblock user");
      return false;
    }
  }, []);

  // Check if a user is blocked
  const isBlocked = useCallback(
    (userId: string): boolean => {
      return blockedUsers.some((b) => b.blockedUserId === userId);
    },
    [blockedUsers]
  );

  // Load blocked users on mount
  useEffect(() => {
    fetchBlockedUsers();
  }, [fetchBlockedUsers]);

  return {
    blockedUsers,
    isLoading,
    error,
    blockUser,
    unblockUser,
    isBlocked,
    fetchBlockedUsers,
  };
}

// Filter content to hide blocked users' posts
export function filterBlockedContent<T extends { authorId?: string; userId?: string }>(
  items: T[],
  blockedUserIds: string[]
): T[] {
  return items.filter((item) => {
    const userId = item.authorId || item.userId;
    return !userId || !blockedUserIds.includes(userId);
  });
}
