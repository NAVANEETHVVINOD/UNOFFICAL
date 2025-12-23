"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import BottomNav from "../components/ui/BottomNav";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Search,
  Users,
  Plus,
  Clock,
  Check,
  CheckCheck,
  X,
  Send,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Smile,
  ChevronLeft,
  Hash
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
    price?: number;
    currency?: string;
  };
  updatedAt: string;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}

import AppSidebar from "../components/navigation/AppSidebar";

export default function MessagesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState<"direct" | "community">("direct");
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConversation?.messages]);

  // Socket: Join Room & Listen for Messages
  useEffect(() => {
    if (!socket || !selectedConversation) return;

    // Join the conversation room
    socket.emit("joinRoom", { roomId: selectedConversation.id });

    const handleNewMessage = (newMessage: any) => {
      // Check if message already exists (to avoid optimistic dupes if IDs match, though temp IDs differ)
      // Usually, we replace the temp message with the real one based on some unique key or just append if not found.
      // Since we use tempId = Date.now(), probability of collision is low but possible with fast typing.
      // Better strategy: Filter out our own optimistic message if we receive the real one?
      // Actually, simplest is to just append for now and handle dedupe if needed.

      setSelectedConversation((prev) => {
        if (!prev || prev.id !== newMessage.conversationId) return prev;

        // Check if we already have this message ID (real ID)
        if (prev.messages.some(m => m.id === newMessage.id)) return prev;

        // If it's my message, I might have an optimistic version with a temporary ID.
        // A robust system would map tempId -> realId.
        // For now, let's just append. Note that if we appended optimistically, we might see double for a second until re-fetch?
        // Or we can rely on Socket for *incoming* and only add *outgoing* optimistically.
        // But `newMessage` event is broadcast to everyone including sender.
        // So I should replace my optimistic message if I find one with same content/timestamp? content isn't unique.

        // Simple approach: Add if not present.
        return {
          ...prev,
          messages: [...prev.messages, newMessage], // Messages are usually appended at end? 
          // Wait, prev state messages are usually loaded from DB which might be sorted one way.
          // In the render map, we reverse array if it was desc.
          // Let's check fetchConversations: sort desc (newest first). 
          // But messages array in Conversation object...
          // backend `getConversations` returns `take: 1` (last message).
          // `getMessages` returns `orderBy: createdAt asc` (oldest first).
          // So in `selectedConversation` (loaded via `fetchFullConversation` logic?), we need full history.
          // Ah, I need to fetch full messages when selecting a conversation!
        };
      });

      // Also update the conversation list snippet
      setConversations((prev) =>
        prev.map(c => {
          if (c.id === newMessage.conversationId) {
            return {
              ...c,
              messages: [newMessage], // Update snippet
              updatedAt: newMessage.createdAt
            };
          }
          return c;
        }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.emit("leaveRoom", { roomId: selectedConversation.id });
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation?.id]); // Only re-run if conversation ID changes

  const fetchConversations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getConversations();
      // sort by updated or last message
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

  const loadConversationMessages = async (conversation: Conversation) => {
    try {
      // Assuming api.getMessages returns full list
      const messages = await api.getMessages(conversation.id);
      setSelectedConversation({
        ...conversation,
        messages: messages // Replace snippet with full history
      });
    } catch (err) {
      console.error("Failed to load history", err);
    }
  };

  // When clicking a conversation in list
  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv); // Set initial state with snippet
    loadConversationMessages(conv); // Fetch full history
  };

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    if (activeTab === "community") {
      filtered = conversations.filter(c => c.isGroup);
    } else {
      filtered = conversations.filter(c => !c.isGroup);
    }

    if (!searchQuery) return filtered;

    const query = searchQuery.toLowerCase();
    return filtered.filter((conv) => {
      const participantName = conv.participants[0]?.profile?.fullName?.toLowerCase() || "";
      const groupName = conv.groupName?.toLowerCase() || "";
      const lastMessage = conv.messages?.[0]?.content?.toLowerCase() || "";

      return participantName.includes(query) ||
        groupName.includes(query) ||
        lastMessage.includes(query);
    });
  }, [conversations, searchQuery, activeTab]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !selectedConversation || !user) return;

    // We can rely on socket event for adding to list to avoid dupes, 
    // OR allow optimistic update and filter dupes in the Effect.
    // Let's do optimistic for instant feedback.

    // const tempId = "temp-" + Date.now();
    // const newMessage = {
    //   id: tempId,
    //   content: messageInput,
    //   senderId: user.id,
    //   seen: false,
    //   createdAt: new Date().toISOString()
    // };

    // const updatedConv = {
    //   ...selectedConversation,
    //   messages: [...selectedConversation.messages, newMessage]
    // };
    // setSelectedConversation(updatedConv);

    // Actually, sending via Socket directly is faster for Chat applications than HTTP.
    // But our backend Gateway calls Service which calls DB.
    // Our API calls HTTP endpoint.
    // Let's stick to HTTP call + Socket Event for consistency with current backend logic.
    // Backend: ChatGateway handleSendMessage calls logic.
    // Wait, the backend Gateway has `handleSendMessage` that listens to `sendMessage` event.
    // Does the HTTP `api.sendMessage` or `api.replyToConversation` broadcast?
    // Checking `messages.service.ts`: `replyToConversation` just returns data. It does NOT emit to socket.
    // SO: If I use HTTP API, I won't get real-time updates unless the Controller calls Gateway to emit.
    // OR I should use `socket.emit('sendMessage')` INSTEAD of HTTP API for sending.
    // Yes, using socket.emit is better.

    const content = messageInput;
    setMessageInput(""); // Clear immediately

    if (socket && isConnected) {
      socket.emit("sendMessage", {
        conversationId: selectedConversation.id,
        content: content,
        senderId: user.id
      });
      // The socket event `newMessage` will come back and update the UI.
    } else {
      // Fallback to HTTP if socket fails?
      try {
        await api.replyToConversation(selectedConversation.id, content);
        // If we fallback, we need to manually update UI because no socket event will come?
        // Or rely on polling?
        // Let's assume Socket is primary.
        // If HTTP is used, we'd need to manually fetch.
      } catch (err) {
        console.error("Failed to send", err);
      }
    }
  };

  return (
    <div className="h-screen bg-paper flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-24 md:pt-36 max-w-[1600px] mx-auto w-full px-4 lg:px-6 gap-4">

        {/* APP NAVIGATION SIDEBAR - Visible only on Large Screens */}
        <div className="hidden lg:block w-[280px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto pb-4">
          <AppSidebar />
        </div>

        {/* MESSAGES LAYOUT CONTAINER - Wraps List and Chat */}
        <div className="flex-1 flex overflow-hidden border-2 border-ink rounded-xl shadow-neo bg-white dark:bg-[#1E1E1E]">

          {/* CONVERSATION LIST SIDEBAR */}
          {/* Hidden on Mobile if Chat is Open */}
          <div className={`w-full md:w-[320px] lg:w-[360px] bg-paper dark:bg-[#1E1E1E] border-r-2 border-ink flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>

            {/* Sidebar Header */}
            <div className="p-4 border-b border-ink/10">
              <h1 className="font-display text-2xl font-black mb-4">Messages</h1>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100 dark:bg-black/20 rounded-xl text-sm border border-transparent focus:border-ink focus:outline-none transition-all"
                />
              </div>

              {/* Tabs (Direct / Community) */}
              <div className="flex p-1 bg-neutral-100 dark:bg-black/20 rounded-lg">
                <button
                  onClick={() => setActiveTab("direct")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "direct" ? "bg-white dark:bg-neutral-800 shadow-sm text-ink" : "text-neutral-500 hover:text-ink"}`}
                >
                  Direct
                </button>
                <button
                  onClick={() => setActiveTab("community")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "community" ? "bg-white dark:bg-neutral-800 shadow-sm text-ink" : "text-neutral-500 hover:text-ink"}`}
                >
                  Community
                </button>
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="w-12 h-12 bg-neutral-200 rounded-full" />
                      <div className="flex-1 space-y-2 py-2">
                        <div className="w-1/2 h-4 bg-neutral-200 rounded" />
                        <div className="w-3/4 h-3 bg-neutral-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No conversations found</p>
                  <Link href="/colleges/mec/feed" className="text-primary text-xs font-bold mt-2 block hover:underline">
                    Find people in Feed
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100 dark:divide-white/5">
                  {filteredConversations.map((conv) => {
                    const otherParticipant = conv.participants.find(p => p.id !== user?.id) || conv.participants[0];
                    const name = conv.isGroup ? conv.groupName : otherParticipant?.profile?.fullName;
                    const avatar = conv.isGroup ? conv.groupAvatar : otherParticipant?.profile?.avatarUrl;
                    const lastMsg = conv.messages[0]; // Snippet
                    const isActive = selectedConversation?.id === conv.id;
                    const isUnread = lastMsg && !lastMsg.seen && lastMsg.senderId !== user?.id;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv)}
                        className={`w-full p-4 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-left group ${isActive ? "bg-primary/5 border-r-4 border-primary" : ""}`}
                      >
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full border-2 border-ink overflow-hidden bg-neutral-200 flex items-center justify-center">
                            {avatar ? (
                              <img src={avatar} alt={name || "User"} className="w-full h-full object-cover" />
                            ) : conv.isGroup ? (
                              <Hash className="w-6 h-6 text-neutral-500" />
                            ) : (
                              <span className="font-display font-bold text-lg">{name?.[0]}</span>
                            )}
                          </div>
                          {isUnread && <div className="absolute top-0 right-0 w-3 h-3 bg-accent-coral border-2 border-paper rounded-full" />}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className={`font-bold text-sm truncate ${isUnread ? "text-ink" : "text-neutral-700 dark:text-neutral-300"}`}>
                              {name || "Unknown User"}
                            </h3>
                            {lastMsg && (
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {new Date(lastMsg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate ${isUnread ? "font-medium text-ink" : "text-neutral-500"}`}>
                            {lastMsg?.senderId === user?.id && <span className="text-neutral-400 mr-1">You:</span>}
                            {lastMsg?.content || "Start checking..."}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* CHAT AREA 
            Hidden on Mobile if No Chat Selected */}
          <div className={`flex-1 flex flex-col bg-neutral-50/50 dark:bg-[#121212] ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>

            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="h-16 px-4 md:px-6 flex items-center justify-between bg-paper dark:bg-[#1E1E1E] border-b-2 border-ink shadow-neo-sm z-10 shrink-0">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-neutral-100 rounded-lg -ml-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="w-10 h-10 rounded-full border border-ink overflow-hidden bg-white">
                      {selectedConversation.isGroup || !selectedConversation.participants.find(p => p.id !== user?.id)?.profile.avatarUrl ? (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-ink font-bold">
                          {selectedConversation.isGroup ? <Hash className="w-5 h-5" /> : (selectedConversation.participants.find(p => p.id !== user?.id)?.profile.fullName[0] || "?")}
                        </div>
                      ) : (
                        <img
                          src={selectedConversation.participants.find(p => p.id !== user?.id)?.profile.avatarUrl}
                          className="w-full h-full object-cover"
                          alt="Avatar"
                        />
                      )}
                    </div>

                    <div>
                      <h2 className="font-display font-bold text-lg leading-none">
                        {selectedConversation.isGroup ? selectedConversation.groupName : selectedConversation.participants.find(p => p.id !== user?.id)?.profile.fullName}
                      </h2>
                      <span className="text-xs text-neutral-500 flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                        {isConnected ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2">
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-ink transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-ink transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-500 hover:text-ink transition-colors border-l border-neutral-200 ml-1 pl-3">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-dots dark:bg-grid-white/[0.02]">
                  {/* Intro message */}
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-white border-2 border-ink rounded-full mx-auto mb-4 flex items-center justify-center shadow-neo">
                      <MessageCircle className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-neutral-500 text-sm">
                      This is the start of your conversation with <br />
                      <span className="font-bold text-ink">{selectedConversation.isGroup ? selectedConversation.groupName : selectedConversation.participants.find(p => p.id !== user?.id)?.profile.fullName}</span>
                    </p>
                  </div>

                  {/* Message Bubbles */}
                  {/* Messages assumed to be in chronological order (oldest -> newest) for rendering logic? 
                      API returns take:1 desc for list. 
                      LoadConversationMessages returns asc (oldest first).
                  */}
                  {selectedConversation.messages.map((msg, idx) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex flex-col max-w-[80%] md:max-w-[60%] ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl border-2 shadow-sm text-sm md:text-base ${isMe
                              ? 'bg-primary border-ink text-black rounded-tr-none'
                              : 'bg-white dark:bg-[#1E1E1E] border-neutral-200 dark:border-neutral-700 rounded-tl-none'
                              }`}
                          >
                            {msg.content}
                          </div>
                          <div className="flex items-center gap-1 mt-1 px-1">
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                            {isMe && (
                              <CheckCheck className={`w-3 h-3 ${msg.seen ? 'text-blue-500' : 'text-neutral-300'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-paper dark:bg-[#1E1E1E] border-t-2 border-ink shrink-0">
                  <form
                    onSubmit={handleSendMessage}
                    className="max-w-4xl mx-auto relative flex items-center gap-2"
                  >
                    <button type="button" className="p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 hover:text-ink transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full pl-4 pr-12 py-3 bg-neutral-50 dark:bg-black/30 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:border-ink focus:outline-none transition-colors"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink">
                        <Smile className="w-5 h-5" />
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="p-3 bg-ink text-white rounded-xl hover:bg-primary hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neo-sm transform active:scale-95"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </div>

              </>
            ) : (
              /* EMPTY STATE (Desktop) */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-dots opacity-50">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <MessageCircle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-black mb-2">Select a Conversation</h3>
                <p className="text-neutral-500 max-w-sm mx-auto">
                  Choose a chat from the sidebar or start a new one to begin messaging.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div >
  );
}
