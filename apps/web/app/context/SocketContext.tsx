"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { API_URL } from "../../lib/api";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onNotification: (callback: (data: any) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  // Get token from storage if available, similar to how api.ts does it
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    if (socket && socket.connected) {
      return; // Already connected
    }

    const newSocket = io(API_URL, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"], // Try websocket first
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, token]);

  const onNotification = (callback: (data: any) => void) => {
    if (!socket) return () => { };
    socket.on("notification", callback);
    return () => socket.off("notification", callback);
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, onNotification }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
