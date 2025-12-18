"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import BottomNav from "../components/ui/BottomNav";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Search, 
  Users, 
  Plus, 
  Clock, 
  Check, 
  CheckCheck,
  X
} from "lucide-react";

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    profile: {
      fullName: string;
      avatarUrl?: string;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    seen: boolean;
    createdAt: string;
  }>;
  listing?: {
    id: string;
    title: string;
  };
  updatedAt: string;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}

export default function MessagesClient() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getConversations();
      const sorted = data.sort((a: Conversation, b: Conversation) => {
        const aTime = a.messages?.[0]?.createdAt || a.updatedAt;
        const bTime = b.messages?.[0]?.createdAt || b.updatedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
      setConversations(sorted);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const participantName = conv.participants[0]?.profile?.fullName?.toLowerCase() || "";
      const groupName = conv.groupName?.toLowerCase() || "";
      const lastMessage = conv.messages?.[0]?.content?.toLowerCase() || "";
      
      return participantName.includes(query) || 
             groupName.includes(query) || 
             lastMessage.includes(query);
    });
  }, [conversations, searchQuery]);

  const unreadCount = useMemo(() => {
    return conversations.filter((conv) => {
      const lastMessage = conv.messages?.[0];
      return lastMessage && !lastMessage.seen && lastMessage.senderId !== user?.id;
    }).length;
  }, [conversations, user]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-paper pb-20 md:pb-0">
      <Navbar />

      {/* Main Content - with top padding for fixed navbar */}
      <div className="pt-16 md:pt-20">
        {/* Header */}
        <div className="sticky top-14 md:top-16 z-40 bg-paper border-b border-neutral-200">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="font-display text-xl font-black">Messages</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-accent-coral text-white text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                </button>
                <Link 
                  href="/messages/new"
                  className="p-2 hover:bg-primary/20 rounded-xl transition-colors bg-primary/10"
                >
                  <Plus className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Search Bar */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Conversations List */}
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="divide-y divide-neutral-100">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-3 animate-pulse">
                  <div className="w-14 h-14 bg-neutral-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-neutral-100 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 px-4">
              <p className="text-red-500 font-medium mb-4">{error}</p>
              <button 
                onClick={fetchConversations}
                className="px-4 py-2 bg-ink text-white rounded-lg font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-10 h-10 text-neutral-300" />
              </div>
              <h3 className="font-bold text-lg mb-2">
                {searchQuery ? "No results found" : "No messages yet"}
              </h3>
              <p className="text-neutral-500 text-sm mb-6">
                {searchQuery 
                  ? "Try a different search term" 
                  : "Start a conversation from someone's profile"}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="text-primary font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredConversations.map((conv) => {
                if (!conv.participants || conv.participants.length === 0) return null;

                const otherParticipant = conv.participants[0];
                const lastMessage = conv.messages?.[0];
                const isUnread = lastMessage && !lastMessage.seen && lastMessage.senderId !== user?.id;
                const isFromMe = lastMessage?.senderId === user?.id;
                const avatarUrl = conv.isGroup ? conv.groupAvatar : otherParticipant?.profile?.avatarUrl;
                const name = conv.isGroup ? conv.groupName : otherParticipant?.profile?.fullName || "Unknown";
                const initial = name[0]?.toUpperCase() || "?";

                return (
                  <Link key={conv.id} href={`/messages/${conv.id}`}>
                    <motion.div
                      className={`px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 transition-colors ${
                        isUnread ? "bg-primary/5" : ""
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-full border-2 border-neutral-200 overflow-hidden bg-neutral-100">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                          ) : conv.isGroup ? (
                            <div className="w-full h-full bg-accent-blue flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center">
                              <span className="font-bold text-lg text-ink">{initial}</span>
                            </div>
                          )}
                        </div>
                        {isUnread && (
                          <div className="absolute top-0 right-0 w-4 h-4 bg-accent-coral border-2 border-paper rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className={`font-semibold text-base truncate ${isUnread ? "text-ink" : "text-neutral-800"}`}>
                            {name}
                          </h3>
                          <span className={`text-xs flex-shrink-0 ml-2 ${isUnread ? "text-primary font-semibold" : "text-neutral-400"}`}>
                            {lastMessage ? formatTime(lastMessage.createdAt) : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isFromMe && (
                            lastMessage?.seen ? (
                              <CheckCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            ) : (
                              <Check className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                            )
                          )}
                          <p className={`text-sm truncate ${isUnread ? "font-medium text-ink" : "text-neutral-500"}`}>
                            {lastMessage?.content || "No messages yet"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
