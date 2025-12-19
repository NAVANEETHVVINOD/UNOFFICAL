"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/ui/BottomNav";
import { motion } from "framer-motion";
import { api } from "../../../lib/api";
import { Briefcase, ShoppingBag, Store, User } from "lucide-react";

type ListingType = "PRODUCT" | "SERVICE" | "JOB";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    type: "PRODUCT" as ListingType,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createMarketplaceListing({
        ...formData,
        price: parseInt(formData.price),
      });
      router.push("/marketplace");
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getLabels = () => {
    switch (formData.type) {
      case "SERVICE":
        return {
          header: "POST A SERVICE",
          subheader: "Share your skills with the campus.",
          title: "Service Title",
          titlePlaceholder: "e.g. Graphic Design for Events",
          price: "Rate / Price (₹)",
          pricePlaceholder: "e.g. 500",
          descPlaceholder: "Describe what you can do, your experience, and what you offer...",
        };
      case "JOB":
        return {
          header: "POST A JOB",
          subheader: "Find the right talent for your project.",
          title: "Job Title",
          titlePlaceholder: "e.g. Need a Photographer for Club Event",
          price: "Budget (₹)",
          pricePlaceholder: "e.g. 1000",
          descPlaceholder: "Describe the task, requirements, and timeline...",
        };
      default:
        return {
          header: "SELL AN ITEM",
          subheader: "One student's trash is another's treasure.",
          title: "Item Name",
          titlePlaceholder: "e.g. Engineering Physics Textbook",
          price: "Price (₹)",
          pricePlaceholder: "e.g. 500",
          descPlaceholder: "Condition, edition, reason for selling...",
        };
    }
  };

  const labels = getLabels();

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <Navbar />
        <Container>
          <div className="pt-16 md:pt-20 pb-24 md:pb-8">
            <div className="max-w-2xl mx-auto mt-4 md:mt-8">
              <RetroButton
                onClick={() => router.push("/marketplace")}
                variant="outline"
                className="mb-8 text-sm"
              >
                &lt;- BACK TO MARKET
              </RetroButton>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <Tape className="absolute -top-4 left-1/2 -translate-x-1/2 z-10" />
                <NewspaperCard className="p-8 border-4">
                  <div className="text-center mb-6">
                    <h1 className="font-display text-2xl sm:text-4xl font-black mb-2 uppercase">
                      {labels.header}
                    </h1>
                    <p className="font-hand text-xl text-gray-600">
                      {labels.subheader}
                    </p>
                  </div>

                  {/* Type Selection */}
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "PRODUCT" })}
                      className={`p-3 border-2 border-black font-bold text-sm flex flex-col items-center gap-2 transition-all ${formData.type === "PRODUCT"
                          ? "bg-accent-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                          : "bg-white hover:bg-gray-50"
                        }`}
                    >
                      <Store className="w-5 h-5" />
                      <span>SELL ITEM</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "SERVICE" })}
                      className={`p-3 border-2 border-black font-bold text-sm flex flex-col items-center gap-2 transition-all ${formData.type === "SERVICE"
                          ? "bg-accent-blue text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                          : "bg-white hover:bg-gray-50"
                        }`}
                    >
                      <Briefcase className="w-5 h-5" />
                      <span>SERVICE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "JOB" })}
                      className={`p-3 border-2 border-black font-bold text-sm flex flex-col items-center gap-2 transition-all ${formData.type === "JOB"
                          ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
                          : "bg-white hover:bg-gray-50"
                        }`}
                    >
                      <User className="w-5 h-5" />
                      <span>HIRE</span>
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block font-bold mb-2 uppercase text-sm">
                        {labels.title}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                        placeholder={labels.titlePlaceholder}
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-2 uppercase text-sm">
                        {labels.price}
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                        placeholder={labels.pricePlaceholder}
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-2 uppercase text-sm">
                        Description
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-3 border-2 border-black font-mono focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow h-32"
                        placeholder={labels.descPlaceholder}
                      />
                    </div>

                    <div>
                      <label className="block font-bold mb-2 uppercase text-sm">
                        Image / Document
                      </label>
                      <div className="border-2 border-black border-dashed p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors relative min-h-[200px] flex flex-col items-center justify-center">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp, application/pdf"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            if (file.size > 5 * 1024 * 1024) {
                              alert("File size exceeds 5MB");
                              return;
                            }
                            const allowedTypes = [
                              "image/jpeg",
                              "image/png",
                              "image/webp",
                              "application/pdf",
                            ];
                            if (!allowedTypes.includes(file.type)) {
                              alert(
                                "Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.",
                              );
                              return;
                            }

                            setLoading(true); // Reuse loading state or add specific uploading state
                            try {
                              const response = await api.uploadFile(file);
                              setFormData({
                                ...formData,
                                imageUrl: response.url,
                              });
                            } catch (error) {
                              console.error("Upload failed:", error);
                              alert("Failed to upload file. Please try again.");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          disabled={loading}
                        />

                        {loading ? (
                          <div className="animate-pulse font-mono">
                            <p>UPLOADING...</p>
                          </div>
                        ) : formData.imageUrl ? (
                          <div className="relative w-full h-48 group">
                            {formData.imageUrl.endsWith(".pdf") ? (
                              <div className="flex flex-col items-center justify-center h-full bg-gray-100 border-2 border-black">
                                <span className="text-4xl">📄</span>
                                <p className="font-mono text-sm mt-2">
                                  PDF UPLOADED
                                </p>
                              </div>
                            ) : (
                              <img
                                src={formData.imageUrl}
                                alt="Preview"
                                className="h-full w-full object-contain"
                              />
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation(); // Prevent triggering file input
                                setFormData({ ...formData, imageUrl: "" });
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 z-20 flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="mb-2 text-4xl">📂</div>
                            <p className="font-bold text-lg">
                              CLICK OR DRAG TO UPLOAD
                            </p>
                            <p className="text-sm text-gray-500 font-mono mt-2">
                              PNG, JPG, WEBP, PDF (MAX 5MB)
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <RetroButton
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white hover:bg-gray-800"
                    >
                      {loading ? "LISTING..." : "POST LISTING"}
                    </RetroButton>
                  </form>
                </NewspaperCard>
              </motion.div>
            </div>
          </div>
        </Container>
        <BottomNav />
      </div>
    </PageTransition>
  );
}
