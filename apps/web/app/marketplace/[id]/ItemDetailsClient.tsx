"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Staple,
  Tape,
} from "../../components/ui/NewspaperUI";
import Doodle from "../../components/ui/Doodle";
import { PageTransition } from "../../providers/AnimationProvider";
import DashboardNavbar from "../../components/ui/DashboardNavbar";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";

interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  status: "ACTIVE" | "SOLD" | "HIDDEN";
  createdAt: string;
  owner: {
    id: string;
    email: string;
    profile: {
      fullName: string;
      collegeId: string | null;
    };
  };
}

export default function ItemDetailsClient() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchItemDetails();
    }
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      const data = await api.getMarketplaceListing(id as string);
      setItem(data);
    } catch (error) {
      console.error("Failed to fetch item details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!item || !user) return;

    if (user.id === item.owner.id) {
      alert("You can't message yourself!");
      return;
    }

    try {
      // Start conversation with a default message
      const message = await api.sendMessage({
        listingId: item.id,
        content: `Hi, I'm interested in "${item.title}". Is it still available?`,
      });

      // Redirect to the conversation
      router.push(`/messages/${message.conversation.id}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
      alert("Failed to start chat. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <Doodle
            src="/doodles/loading.svg"
            className="w-16 h-16 animate-spin"
          />
        </div>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container>
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <h1 className="font-display text-4xl mb-4">ITEM NOT FOUND</h1>
          <RetroButton onClick={() => router.push("/marketplace")}>
            GO BACK
          </RetroButton>
        </div>
      </Container>
    );
  }

  return (
    <PageTransition>
      <Container>
        <div className="py-8 min-h-screen">
          <DashboardNavbar />

          <div className="max-w-4xl mx-auto mt-12">
            <RetroButton
              onClick={() => router.push("/marketplace")}
              variant="outline"
              className="mb-8 text-sm"
            >
              &lt;- BACK TO MARKET
            </RetroButton>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Column: Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <Staple />
                <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[-2deg]">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-black">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Doodle
                        src="/doodles/camera.svg"
                        className="w-32 h-32 opacity-20"
                      />
                    )}
                  </div>
                  <div className="mt-4 text-center font-mono text-xs text-gray-500">
                    LISTED ON {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <Badge className="bg-accent-yellow text-black border-black mb-2 text-lg px-4 py-1">
                    ₹{item.price}
                  </Badge>
                  <h1 className="font-display text-4xl md:text-5xl font-black mb-4 leading-tight">
                    {item.title}
                  </h1>
                  <div className="flex items-center gap-2 mb-6">
                    <span
                      className={`px-3 py-1 text-xs font-bold border-2 border-black ${item.status === "ACTIVE" ? "bg-green-400" : "bg-red-400"}`}
                    >
                      {item.status}
                    </span>
                    <span className="font-mono text-sm text-gray-500">
                      Condition: Good (Assumed)
                    </span>
                  </div>
                </div>

                <NewspaperCard className="p-6 bg-white">
                  <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-black pb-2">
                    Description
                  </h3>
                  <p className="font-body text-lg leading-relaxed text-gray-800">
                    {item.description || "No description provided."}
                  </p>
                </NewspaperCard>

                <NewspaperCard className="p-6 bg-accent-blue/10">
                  <h3 className="font-bold text-lg uppercase mb-4 border-b-2 border-black pb-2">
                    Seller Info
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-bold text-xl">
                      {item.owner.profile.fullName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-lg">
                        {item.owner.profile.fullName}
                      </p>
                      <p className="font-mono text-xs text-gray-600">
                        Student ID: {item.owner.profile.collegeId || "N/A"}
                      </p>
                    </div>
                  </div>
                  <RetroButton onClick={handleContact} className="w-full">
                    CONTACT SELLER
                  </RetroButton>
                </NewspaperCard>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </PageTransition>
  );
}
