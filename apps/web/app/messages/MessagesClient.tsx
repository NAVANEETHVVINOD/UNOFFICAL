"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../components/ui/NewspaperUI";
import Doodle from "../components/ui/Doodle";
import DashboardNavbar from "../components/ui/DashboardNavbar";
import { api } from "../../lib/api";
import { useAuth } from "../context/AuthContext";

export default function MessagesClient() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const data = await api.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f0f0] flex items-center justify-center">
        <Doodle src="/doodles/loading.svg" className="w-16 h-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <DashboardNavbar />
      <Container className="py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="font-display text-4xl font-black">MESSAGES</h1>
              <p className="font-serif text-gray-600">
                Slide into DMs (Professionally, please).
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {conversations.map((conv) => {
              const otherParticipant = conv.participants[0]; // Filtered in backend to be the other person
              const lastMessage = conv.messages[0];
              const unread =
                lastMessage &&
                !lastMessage.seen &&
                lastMessage.senderId !== user?.id;

              return (
                <Link href={`/messages/${conv.id}`} key={conv.id}>
                  <NewspaperCard
                    className={`p-4 hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center gap-4 ${unread ? "bg-[#fffdf0] border-l-8 border-l-accent-yellow" : "bg-white"}`}
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-black overflow-hidden bg-gray-200">
                        <div className="w-full h-full bg-accent-blue text-white flex items-center justify-center font-bold text-xl">
                          {otherParticipant?.profile?.fullName?.[0] || "?"}
                        </div>
                      </div>
                      {unread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-black rounded-full" />
                      )}
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg">
                          {otherParticipant?.profile?.fullName ||
                            "Unknown User"}
                        </h3>
                        <span className="text-xs font-mono text-gray-500">
                          {lastMessage
                            ? new Date(
                                lastMessage.createdAt,
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-serif line-clamp-1">
                        {unread ? (
                          <strong>{lastMessage?.content}</strong>
                        ) : (
                          lastMessage?.content || "No messages yet"
                        )}
                      </p>
                      <div className="mt-2 flex gap-2">
                        {conv.listing && (
                          <Badge className="text-[10px] py-0 px-2 bg-gray-100 border-gray-400 text-gray-600">
                            Item: {conv.listing.title}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </NewspaperCard>
                </Link>
              );
            })}
          </div>

          {conversations.length === 0 && (
            <div className="text-center py-20">
              <Doodle
                src="/doodles/sad-face.svg"
                className="w-32 h-32 mx-auto mb-6 opacity-50"
              />
              <h3 className="font-bold text-2xl mb-2">No Messages Yet</h3>
              <p className="text-gray-600">
                Start a conversation from the Marketplace!
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
