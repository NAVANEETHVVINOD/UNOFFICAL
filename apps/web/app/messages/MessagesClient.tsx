"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
} from "../components/ui/NewspaperUI";
import Navbar from "../components/Navbar";
import CategoryRibbon from "../components/CategoryRibbon";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Search, User, ShoppingBag, Clock } from "lucide-react";
import { containerVariants, itemVariants, pageVariants } from "../../lib/animations";
import { ConversationSkeleton } from "../components/ui/Skeleton";

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
}

export default function MessagesClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      // Sort by most recent message
      const sorted = data.sort((a: Conversation, b: Conversation) => {
        const aTime = a.messages?.[0]?.createdAt || a.updatedAt;
        const bTime = b.messages?.[0]?.createdAt || b.updatedAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
      setConversations(sorted);
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError("Failed to load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter conversations by search
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const participantName = conv.participants[0]?.profile?.fullName?.toLowerCase() || "";
      const listingTitle = conv.listing?.title?.toLowerCase() || "";
      const lastMessage = conv.messages?.[0]?.content?.toLowerCase() || "";
      
      return participantName.includes(query) || 
             listingTitle.includes(query) || 
             lastMessage.includes(query);
    });
  }, [conversations, searchQuery]);

  // Count unread conversations
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

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      className="min-h-screen bg-paper"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-halftone opacity-30" />

      <Navbar />

      <Container className="py-6 relative z-10">
        <CategoryRibbon className="mb-6" />

        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-display text-3xl md:text-4xl font-black">MESSAGES</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white border-black">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <p className="font-mono text-sm text-gray-600">
              Your conversations with other students
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-black bg-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent-yellow"
              />
            </div>
          </motion.div>

          {/* Conversations List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <ConversationSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <RetroButton onClick={fetchConversations}>Try Again</RetroButton>
            </div>
          ) : (
            <motion.div
              className="space-y-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {filteredConversations.map((conv) => {
                  if (!conv.participants || conv.participants.length === 0) return null;

                  const otherParticipant = conv.participants[0];
                  const lastMessage = conv.messages?.[0];
                  const isUnread = lastMessage && !lastMessage.seen && lastMessage.senderId !== user?.id;
                  const avatarUrl = otherParticipant?.profile?.avatarUrl;
                  const name = otherParticipant?.profile?.fullName || "Unknown User";
                  const initial = name[0]?.toUpperCase() || "?";

                  return (
                    <motion.div
                      key={conv.id}
                      variants={itemVariants}
                      layout
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Link href={`/messages/${conv.id}`}>
                        <motion.div
                          className={`bg-white border-2 border-black p-4 flex items-center gap-4 cursor-pointer transition-all ${
                            isUnread ? "border-l-4 border-l-accent-yellow bg-yellow-50/50" : ""
                          }`}
                          whileHover={{ x: 4, boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)" }}
                        >
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                              {avatarUrl ? (
                                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-accent-blue text-white flex items-center justify-center font-bold text-xl">
                                  {initial}
                                </div>
                              )}
                            </div>
                            {isUnread && (
                              <motion.div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1">
                              <h3 className={`font-bold text-base truncate ${isUnread ? "text-black" : "text-gray-800"}`}>
                                {name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 ml-2">
                                <Clock className="w-3 h-3" />
                                <span>{lastMessage ? formatTime(lastMessage.createdAt) : ""}</span>
                              </div>
                            </div>

                            <p className={`text-sm line-clamp-1 ${isUnread ? "font-semibold text-gray-800" : "text-gray-600"}`}>
                              {lastMessage?.content || "No messages yet"}
                            </p>

                            {conv.listing && (
                              <div className="mt-2 flex items-center gap-1">
                                <ShoppingBag className="w-3 h-3 text-gray-400" />
                                <span className="text-[10px] font-mono text-gray-500 truncate">
                                  Re: {conv.listing.title}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredConversations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-bold text-xl mb-2">
                {searchQuery ? "No Conversations Found" : "No Messages Yet"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Start a conversation from the Marketplace!"}
              </p>
              {searchQuery && (
                <RetroButton variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </RetroButton>
              )}
            </motion.div>
          )}
        </div>
      </Container>
    </motion.div>
  );
}
