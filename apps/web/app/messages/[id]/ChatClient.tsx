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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [otherUser, setOtherUser] = useState<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      markAsSeen();
    }

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      if (user) fetchMessages(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [id, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const data = await api.getMessages(id);
      setMessages(data);

      // Find the other user from the messages (if any exist)
      // Ideally backend should return conversation details with participants
      // For now, let's infer from the first message that isn't ours, OR fetch conversation details separately
      // Since getMessages returns messages with sender included, we can find the other person.
      // BUT, if no messages, we don't know who we are talking to.
      // We should probably fetch conversation details.
      // Let's assume getMessages returns just messages for now as per my service implementation.
      // I should update service to return conversation details or make a separate call.
      // For MVP, if there are messages, we pick the one that isn't us.

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
      await api.markAsSeen(id);
    } catch (error) {
      console.error("Failed to mark as seen:", error);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

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

    setMessages([...messages, optimisticMsg]);
    setNewMessage("");

    try {
      await api.replyToConversation(id, optimisticMsg.content);
      fetchMessages(false); // Refresh to get real ID and timestamp
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId)); // Revert
    }
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
                    className={`max-w-[70%] p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${
                      isMe
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
          <div className="p-4 border-t-2 border-black bg-gray-50">
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
