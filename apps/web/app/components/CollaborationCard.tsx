"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Calendar,
  MessageCircle,
  Heart,
  Clock,
  Tag,
  ArrowRight,
  User,
} from "lucide-react";

interface CollaborationCardProps {
  collaboration: {
    id: string;
    title?: string;
    content: string;
    skills?: string[];
    deadline?: string;
    status?: string;
    author?: {
      id: string;
      profile?: {
        fullName: string;
        avatarUrl?: string;
      };
    };
    createdAt: string;
    _count?: {
      comments: number;
      likes: number;
    };
  };
  onRespond?: () => void;
}

export default function CollaborationCard({
  collaboration,
  onRespond,
}: CollaborationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-accent-mint text-ink";
      case "in_progress":
        return "bg-accent-blue text-white";
      case "closed":
        return "bg-neutral-400 text-white";
      default:
        return "bg-accent-mint text-ink";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "closed":
        return "Closed";
      default:
        return "Open";
    }
  };

  const isDeadlineSoon = () => {
    if (!collaboration.deadline) return false;
    const deadline = new Date(collaboration.deadline);
    const now = new Date();
    const diffDays = Math.ceil(
      (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 7 && diffDays > 0;
  };

  const isDeadlinePassed = () => {
    if (!collaboration.deadline) return false;
    return new Date(collaboration.deadline) < new Date();
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-dark-surface border-2 border-ink rounded-2xl shadow-neo overflow-hidden transition-shadow hover:shadow-neo-lg"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {/* Author Avatar */}
            <Link
              href={`/profile/${collaboration.author?.id}`}
              className="relative"
            >
              {collaboration.author?.profile?.avatarUrl ? (
                <img
                  src={collaboration.author.profile.avatarUrl}
                  alt={collaboration.author.profile.fullName}
                  className="w-10 h-10 rounded-full border-2 border-ink object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-ink bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-ink" />
                </div>
              )}
            </Link>

            <div>
              <Link
                href={`/profile/${collaboration.author?.id}`}
                className="font-bold text-ink dark:text-dark-text hover:underline"
              >
                {collaboration.author?.profile?.fullName || "Anonymous"}
              </Link>
              <p className="text-xs text-neutral-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(collaboration.createdAt)}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
              collaboration.status
            )}`}
          >
            {getStatusLabel(collaboration.status)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl font-bold text-ink dark:text-dark-text mb-2">
          {collaboration.title || "Collaboration Request"}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 dark:text-dark-text-muted mb-4 line-clamp-3">
          {collaboration.content}
        </p>

        {/* Skills */}
        {collaboration.skills && collaboration.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 text-xs text-neutral-500 mb-2">
              <Tag className="w-3 h-3" />
              <span>Skills needed:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {collaboration.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-accent-mint/20 border border-accent-mint/50 rounded-lg text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {collaboration.skills.length > 5 && (
                <span className="px-2 py-1 bg-neutral-100 rounded-lg text-xs font-medium text-neutral-500">
                  +{collaboration.skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Deadline */}
        {collaboration.deadline && (
          <div
            className={`flex items-center gap-2 text-sm mb-4 ${
              isDeadlinePassed()
                ? "text-accent-coral"
                : isDeadlineSoon()
                ? "text-accent-coral"
                : "text-neutral-500"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>
              {isDeadlinePassed()
                ? "Deadline passed"
                : `Deadline: ${new Date(
                    collaboration.deadline
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`}
            </span>
            {isDeadlineSoon() && !isDeadlinePassed() && (
              <span className="px-2 py-0.5 bg-accent-coral/20 text-accent-coral rounded text-xs font-bold">
                Soon!
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-dark-border">
          <div className="flex items-center gap-4 text-neutral-500">
            <span className="flex items-center gap-1 text-sm">
              <Heart className="w-4 h-4" />
              {collaboration._count?.likes || 0}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <MessageCircle className="w-4 h-4" />
              {collaboration._count?.comments || 0}
            </span>
          </div>

          {/* Respond Button */}
          {collaboration.status !== "closed" && onRespond && (
            <motion.button
              onClick={onRespond}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-accent-mint border-2 border-ink rounded-xl font-bold text-sm shadow-neo-sm hover:shadow-neo transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Respond</span>
              <ArrowRight
                className={`w-4 h-4 transition-transform ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
