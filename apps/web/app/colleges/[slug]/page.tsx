/**
 * CollegeHome (Dynamic Route)
 *
 * The specific dashboard for a single college (/colleges/[slug]).
 * Displays:
 * - College-specific news ("The Daily [College]")
 * - College-specific events and clubs
 * - Notice board and stats
 */
import Navbar from "../../components/Navbar";
import Container from "../../components/ui/Container";

import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
  Sticker,
  EventRow,
  Marquee,
} from "../../components/ui/NewspaperUI";
import Doodle from "../../components/ui/Doodle";
import Link from "next/link";
import CollegeFeed from "./CollegeFeed";

import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import { api } from "../../../lib/api";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollegeHome({ params }: PageProps) {
  const user = await getServerProfile();

  if (!user) {
    redirect("/login");
  }

  if (!user.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  const { slug } = await params;
  const collegeName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Fetch data in parallel
  const [stats, events, clubs, listings] = await Promise.all([
    api.getCollegeStats(slug).catch(() => null),
    api.getEvents(slug).catch(() => []),
    api.getClubs(slug).catch(() => []),
    api.getMarketplaceListings(undefined, slug).catch(() => []),
  ]);

  const upcomingEvents = events.slice(0, 5);

  return (
    <div className="bg-paper min-h-screen">
      <div className="fixed inset-0 pointer-events-none opacity-5 z-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

      <Navbar showLinks={true} />

      <Container>
        <div className="py-8 space-y-8">
          {/* Newspaper Header */}
          <div className="border-b-4 border-black pb-4 flex justify-between items-end">
            <div>
              <Badge className="mb-2">HEADLINES</Badge>
              <h2 className="font-display text-4xl font-black">
                THE DAILY {collegeName.toUpperCase()}
              </h2>
            </div>
            <span className="font-serif italic text-gray-500">
              Vol. 42 • {new Date().toLocaleDateString()}
            </span>
          </div>

          <CollegeFeed collegeSlug={slug} initialEvents={upcomingEvents} />
        </div>
      </Container>
    </div>
  );
}
