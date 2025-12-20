"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  };
  updatedAt: string;
  isGroup?: boolean;
  groupName?: string;
  groupAvatar?: string;
}

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
  }, [selectedConversation]);

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

      // Select first conversation if none selected on desktop, or if ID in URL
      // (Simplified logic for now: just load list. Click to select.)
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Tab filter (Mock logic for now as mostly DMs exist)
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

    const tempId = Date.now().toString();
    const newMessage = {
      id: tempId,
      content: messageInput,
      senderId: user.id,
      seen: false,
      createdAt: new Date().toISOString()
    };

    // Optimistic update
    const updatedConv = {
      ...selectedConversation,
      messages: [newMessage, ...selectedConversation.messages]
    };
    setSelectedConversation(updatedConv);
    setConversations(prev =>
      prev.map(c => c.id === selectedConversation.id ? updatedConv : c)
    );
    setMessageInput("");

    try {
      await api.replyToConversation(selectedConversation.id, messageInput);
      // Ideally re-fetch or rely on socket, but silent success for now
    } catch (err) {
      console.error("Failed to send message", err);
      // Revert on error would go here
    }
  };

  return (
    <div className="h-screen bg-paper flex flex-col overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden pt-16 md:pt-20">

        {/* SIDEBAR (Conversation List) 
            Hidden on Mobile if Chat is Open */}
        <div className={`w-full md:w-[380px] bg-paper dark:bg-[#1E1E1E] border-r-2 border-ink flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>

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
                  const lastMsg = conv.messages[0];
                  const isActive = selectedConversation?.id === conv.id;
                  const isUnread = lastMsg && !lastMsg.seen && lastMsg.senderId !== user?.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full p-4 flex items-center gap-4 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors text-left group ${isActive ? "bg-primary/5 border-r-4 border-primary" : ""}`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-ink overflow-hidden bg-neutral-200 flex items-center justify-center">
                          {avatar ? (
                            <img src={avatar} alt={name} className="w-full h-full object-cover" />
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
                            {name}
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
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                      Online
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
                {[...selectedConversation.messages].reverse().map((msg, idx) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
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

      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
