"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SOCKET_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : process.env.NEXT_PUBLIC_API_URL || "https://linker-g0lw.onrender.com";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  seen: boolean;
}

interface TypingUser {
  conversationId: string;
  userId: string;
  userName: string;
}

interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  actor?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (conversationId: string, content: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (conversationId: string) => void;
  stopTyping: (conversationId: string) => void;
  onNewMessage: (callback: (message: Message) => void) => () => void;
  onTyping: (callback: (data: TypingUser) => void) => () => void;
  onStopTyping: (callback: (data: TypingUser) => void) => () => void;
  onMessageSeen: (callback: (data: { conversationId: string; userId: string }) => void) => () => void;
  onNotification: (callback: (notification: NotificationPayload) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("[Socket] Connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      if (!socket || !isConnected) {
        console.warn("[Socket] Cannot send message: not connected");
        return;
      }
      socket.emit("message:send", { conversationId, content });
    },
    [socket, isConnected]
  );

  const joinConversation = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) return;
      socket.emit("conversation:join", { conversationId });
    },
    [socket, isConnected]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) return;
      socket.emit("conversation:leave", { conversationId });
    },
    [socket, isConnected]
  );

  const startTyping = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) return;
      socket.emit("typing:start", { conversationId });
    },
    [socket, isConnected]
  );

  const stopTyping = useCallback(
    (conversationId: string) => {
      if (!socket || !isConnected) return;
      socket.emit("typing:stop", { conversationId });
    },
    [socket, isConnected]
  );

  const onNewMessage = useCallback(
    (callback: (message: Message) => void) => {
      if (!socket) return () => {};
      socket.on("message:new", callback);
      return () => {
        socket.off("message:new", callback);
      };
    },
    [socket]
  );

  const onTyping = useCallback(
    (callback: (data: TypingUser) => void) => {
      if (!socket) return () => {};
      socket.on("typing:start", callback);
      return () => {
        socket.off("typing:start", callback);
      };
    },
    [socket]
  );

  const onStopTyping = useCallback(
    (callback: (data: TypingUser) => void) => {
      if (!socket) return () => {};
      socket.on("typing:stop", callback);
      return () => {
        socket.off("typing:stop", callback);
      };
    },
    [socket]
  );

  const onMessageSeen = useCallback(
    (callback: (data: { conversationId: string; userId: string }) => void) => {
      if (!socket) return () => {};
      socket.on("message:seen", callback);
      return () => {
        socket.off("message:seen", callback);
      };
    },
    [socket]
  );

  const onNotification = useCallback(
    (callback: (notification: NotificationPayload) => void) => {
      if (!socket) return () => {};
      socket.on("notification:new", callback);
      return () => {
        socket.off("notification:new", callback);
      };
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
        joinConversation,
        leaveConversation,
        startTyping,
        stopTyping,
        onNewMessage,
        onTyping,
        onStopTyping,
        onMessageSeen,
        onNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// Default socket context for when used outside provider
const defaultSocketContext: SocketContextType = {
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  joinConversation: () => {},
  leaveConversation: () => {},
  startTyping: () => {},
  stopTyping: () => {},
  onNewMessage: () => () => {},
  onTyping: () => () => {},
  onStopTyping: () => () => {},
  onMessageSeen: () => () => {},
  onNotification: () => () => {},
};

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  // Return default context if not within SocketProvider (allows NotificationProvider to work independently)
  return context || defaultSocketContext;
}
