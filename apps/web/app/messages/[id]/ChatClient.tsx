"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Image as ImageIcon,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
  User
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  seen: boolean;
  sender: {
    profile: {
      fullName: string;
      avatarUrl?: string;
    };
  };
}

export default function ChatClient({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [peerTyping, setPeerTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      markAsSeen();
    }
  }, [id, user]);

  useEffect(() => {
    if (!socket || !id || !user) return;

    socket.emit('joinRoom', { roomId: id });

    const handleNewMessage = (msg: Message) => {
      if (msg.senderId !== user.id) {
        setMessages((prev) => [...prev, msg]);
        markAsSeen();
        setPeerTyping(false);
      }
    };

    const handleUserTyping = (payload: { userId: string; isTyping: boolean }) => {
      if (payload.userId !== user.id) {
        setPeerTyping(payload.isTyping);
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('userTyping', handleUserTyping);

    return () => {
      socket.emit('leaveRoom', { roomId: id });
      socket.off('newMessage', handleNewMessage);
      socket.off('userTyping', handleUserTyping);
    };
  }, [socket, id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await api.getMessages(id);
      setMessages(data);

      const other = data.find((m: any) => m.senderId !== user?.id);
      if (other) {
        setOtherUser(other.sender);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async () => {
    try {
      await api.markAsSeen(id);
    } catch (error) {
      console.error("Failed to mark as seen:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socket || !user) return;

    socket.emit('typing', { conversationId: id, userId: user.id, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { conversationId: id, userId: user.id, isTyping: false });
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !socket || sending) return;

    setSending(true);
    const tempId = Date.now().toString();
    const content = newMessage.trim();
    
    const optimisticMsg: Message = {
      id: tempId,
      senderId: user.id,
      content,
      createdAt: new Date().toISOString(),
      seen: false,
      sender: {
        profile: { fullName: user.profile?.fullName || "Me" },
      },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");
    inputRef.current?.focus();

    socket.emit('sendMessage', {
      conversationId: id,
      content,
      senderId: user.id
    }, (response: any) => {
      if (response && response.id) {
        setMessages((prev) => prev.map(m => m.id === tempId ? response : m));
      }
      setSending(false);
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups: any, msg) => {
    const date = formatDate(msg.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="fixed inset-0 bg-paper flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-ink border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-sm text-neutral-500">Loading chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-paper flex flex-col">
      {/* Chat Header - Fixed */}
      <header className="bg-paper border-b-2 border-ink px-3 py-2 flex items-center gap-3 safe-top">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 hover:bg-neutral-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {otherUser && (
          <Link href={`/profile/${otherUser.id || ''}`} className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-ink overflow-hidden bg-neutral-100">
                {otherUser.profile?.avatarUrl ? (
                  <img 
                    src={otherUser.profile.avatarUrl} 
                    alt={otherUser.profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center">
                    <span className="font-bold text-ink">
                      {otherUser.profile?.fullName?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-paper rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-base truncate">
                {otherUser.profile?.fullName || "User"}
              </h1>
              <p className="text-xs text-neutral-500 truncate">
                {peerTyping ? (
                  <span className="text-primary font-medium">typing...</span>
                ) : (
                  "Online"
                )}
              </p>
            </div>
          </Link>
        )}

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors hidden sm:flex">
            <Phone className="w-5 h-5 text-neutral-600" />
          </button>
          <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors hidden sm:flex">
            <Video className="w-5 h-5 text-neutral-600" />
          </button>
          <button className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {Object.entries(groupedMessages).map(([date, msgs]: [string, any]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 bg-neutral-100 rounded-full text-xs font-medium text-neutral-500">
                {date}
              </span>
            </div>

            {/* Messages for this date */}
            <div className="space-y-1">
              {msgs.map((msg: Message, idx: number) => {
                const isMe = msg.senderId === user?.id;
                const showAvatar = !isMe && (idx === 0 || msgs[idx - 1]?.senderId !== msg.senderId);
                const isLastInGroup = idx === msgs.length - 1 || msgs[idx + 1]?.senderId !== msg.senderId;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {/* Avatar for other user */}
                    {!isMe && (
                      <div className="w-7 h-7 flex-shrink-0">
                        {showAvatar && otherUser?.profile?.avatarUrl ? (
                          <img 
                            src={otherUser.profile.avatarUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : showAvatar ? (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-xs font-bold">
                              {otherUser?.profile?.fullName?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}

                    {/* Message bubble */}
                    <div
                      className={`max-w-[75%] sm:max-w-[65%] px-3 py-2 ${
                        isMe
                          ? "bg-primary text-ink rounded-2xl rounded-br-md"
                          : "bg-white border border-neutral-200 text-ink rounded-2xl rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] text-neutral-500">
                          {formatTime(msg.createdAt)}
                        </span>
                        {isMe && (
                          msg.seen ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-neutral-400" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {peerTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">
                  {otherUser?.profile?.fullName?.[0]?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="bg-white border border-neutral-200 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="bg-paper border-t border-neutral-200 px-3 py-2 safe-bottom">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button 
            type="button"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors hidden sm:flex"
          >
            <Paperclip className="w-5 h-5 text-neutral-500" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full px-4 py-2.5 bg-neutral-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform hidden sm:block"
            >
              <Smile className="w-5 h-5 text-neutral-400" />
            </button>
          </div>

          <motion.button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-2.5 rounded-full transition-all ${
              newMessage.trim() 
                ? "bg-primary text-ink shadow-neo-sm hover:shadow-neo" 
                : "bg-neutral-100 text-neutral-400"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
