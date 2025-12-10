"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../../components/ui/NewspaperUI";
import Doodle from "../../components/ui/Doodle";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  seen: boolean;
  sender: {
    profile: {
      fullName: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUser, setOtherUser] = useState<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial Load (REST)
  useEffect(() => {
    if (user) {
      fetchMessages();
      markAsSeen();
    }
  }, [id, user]);

  const [peerTyping, setPeerTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Socket Events
  useEffect(() => {
    if (!socket || !id || !user) return;

    socket.emit('joinRoom', { roomId: id });

    const handleNewMessage = (msg: Message) => {
      // If message is from me, I already added it optimistically (or via Ack)
      // So only add if it's from someone else to avoid duplication/jumpiness
      // UNLESS I didn't add it optimistically? 
      // Safe bet: if senderId != user.id, add it.
      if (msg.senderId !== user.id) {
        setMessages((prev) => [...prev, msg]);
        markAsSeen(); // Mark as seen immediately if we are viewing
        setPeerTyping(false); // Stop typing if message received
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

  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await api.getMessages(id);
      setMessages(data);

      const other = data.find((m: any) => m.senderId !== user?.id);
      if (other) {
        setOtherUser(other.sender);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const markAsSeen = async () => {
    try {
      // We can also emit 'markSeen' socket event later
      await api.markAsSeen(id);
    } catch (error) {
      console.error("Failed to mark as seen:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socket || !user) return;

    // Emit typing
    socket.emit('typing', { conversationId: id, userId: user.id, isTyping: true });

    // Debounce stop typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { conversationId: id, userId: user.id, isTyping: false });
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !socket) return;

    const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
      senderId: user.id,
      content: newMessage,
      createdAt: new Date().toISOString(),
      seen: false,
      sender: {
        profile: { fullName: user.profile?.fullName || "Me" },
      },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setNewMessage("");

    // Emit via Socket
    socket.emit('sendMessage', {
      conversationId: id,
      content: optimisticMsg.content,
      senderId: user.id
    }, (response: any) => { // Ack Check
      if (response && response.id) {
        // Update the temporary message with real one
        setMessages((prev) => prev.map(m => m.id === tempId ? response : m));
      }
    });
  };

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <Doodle src="/doodles/loading.svg" className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] flex flex-col">
      <DashboardNavbar />

      <Container className="flex-grow py-4 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="hover:-translate-x-1 transition-transform font-bold"
          >
            ← BACK
          </button>
          {otherUser && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                <div className="w-full h-full bg-accent-blue text-white flex items-center justify-center font-bold text-xl">
                  {otherUser.profile.fullName[0]}
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg leading-none">
                  {otherUser.profile.fullName}
                </h2>
                <span className="text-xs text-gray-500 font-mono">Chat</span>
              </div>
            </div>
          )}
        </div>

        <NewspaperCard className="flex-grow flex flex-col p-0 overflow-hidden bg-white relative">
          <Tape className="absolute top-2 left-1/2 -translate-x-1/2 z-10" />

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[url('/doodles/grid.png')] bg-repeat">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${isMe
                      ? "bg-accent-yellow rounded-tr-none"
                      : "bg-white rounded-tl-none"
                      }`}
                  >
                    <p className="font-serif text-sm md:text-base">
                      {msg.content}
                    </p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                      <p className="text-[10px] font-mono opacity-50">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {isMe && (
                        <span className="text-[10px] font-bold text-black">
                          {msg.seen ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t-2 border-black bg-gray-50 relative">
            {/* Typing Indicator */}
            {peerTyping && (
              <div className="absolute -top-8 left-6 bg-black text-white text-xs px-2 py-1 rounded-t-lg animate-pulse font-mono">
                {otherUser?.profile?.fullName || "Someone"} is typing...
              </div>
            )}
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-3 border-2 border-black rounded-lg font-serif focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <RetroButton type="submit" className="bg-black text-white px-6">
                SEND
              </RetroButton>
            </form>
          </div>
        </NewspaperCard>
      </Container>
    </div>
  );
}
