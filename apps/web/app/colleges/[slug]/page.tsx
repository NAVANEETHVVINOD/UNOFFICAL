/**
 * CollegeHome (Dynamic Route)
 *
 * The specific dashboard for a single college (/colleges/[slug]).
 * Displays:
 * - College-specific news ("The Daily [College]")
 * - College-specific events and clubs
 * - Notice board and stats
 */
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

  const upcomingEvents = events.slice(0, 3);
  const featuredClubs = clubs.slice(0, 4);
  const recentListings = listings.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Section: Breaking News & Quick Stats */}
      <div className="grid md:grid-cols-12 gap-8">
        {/* Main News Column */}
        <div className="md:col-span-8">
          <NewspaperCard variant="default" className="h-full p-8 relative">
            <Tape className="absolute -top-3 left-1/2 -translate-x-1/2" />
            <div className="border-b-4 border-black pb-4 mb-6 flex justify-between items-end">
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

            {/* Featured Article (Using first event or placeholder) */}
            {upcomingEvents.length > 0 ? (
              <div className="mb-8 group cursor-pointer">
                <div className="h-64 bg-gray-200 rounded-xl mb-4 overflow-hidden relative border-2 border-black">
                  <div className="absolute inset-0 bg-accent-blue/20 flex items-center justify-center">
                    <Doodle
                      src="/doodles/star.svg"
                      className="w-32 h-32 opacity-50"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <Badge className="absolute bottom-4 left-4 bg-accent-pink text-white border-white">
                    FEATURED EVENT
                  </Badge>
                </div>
                <h3 className="font-display text-3xl font-bold mb-2 group-hover:underline decoration-4 decoration-accent-yellow">
                  {upcomingEvents[0].title}
                </h3>
                <p className="font-serif text-lg text-gray-600 leading-relaxed line-clamp-2">
                  {upcomingEvents[0].description ||
                    "Join us for this amazing event!"}
                </p>
              </div>
            ) : (
              <div className="mb-8 text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                <Doodle
                  src="/doodles/sad-face.svg"
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                />
                <h3 className="font-bold text-xl">No News Yet</h3>
                <p className="text-gray-500">
                  Things are quiet on campus today.
                </p>
              </div>
            )}

            {/* Smaller News Items */}
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t-2 border-dashed border-gray-300">
              <div>
                <h4 className="font-bold text-xl mb-2">Library Hours</h4>
                <p className="text-sm text-gray-600">
                  Open 24/7 during exam week.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-xl mb-2">Campus Updates</h4>
                <p className="text-sm text-gray-600">
                  Check the notice board for latest announcements.
                </p>
              </div>
            </div>
          </NewspaperCard>
        </div>

        {/* Sidebar: Stats & Quick Links */}
        <div className="md:col-span-4 space-y-6">
          {/* Stats Card */}
          <NewspaperCard
            variant="curved"
            className="bg-accent-blue text-white p-6 relative overflow-hidden"
          >
            <Doodle
              src="/doodles/sparkle.svg"
              className="absolute top-2 right-2 w-12 h-12 text-white opacity-50"
            />
            <h3 className="font-display text-2xl font-black mb-4">
              CAMPUS PULSE
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="font-serif italic">Active Students</span>
                <span className="font-pixel text-xl">
                  {stats?.totalMembers || 0}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="font-serif italic">Clubs</span>
                <span className="font-pixel text-xl">
                  {stats?.totalClubs || 0}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="font-serif italic">Events</span>
                <span className="font-pixel text-xl">
                  {stats?.totalEvents || 0}
                </span>
              </div>
            </div>
          </NewspaperCard>

          {/* Notice Board */}
          <NewspaperCard className="p-6 bg-[#fffdf0] relative">
            <Sticker
              className="-top-3 -right-3 bg-red-500 text-white"
              rotate={10}
            >
              URGENT
            </Sticker>
            <h3 className="font-bold text-xl mb-4 border-b-2 border-black pb-2">
              NOTICE BOARD
            </h3>
            <ul className="space-y-3 list-disc list-inside text-sm font-serif">
              <li>Welcome to {collegeName}!</li>
              <li>Join a club to get started.</li>
              <li>Check out the marketplace.</li>
            </ul>
          </NewspaperCard>
        </div>
      </div>

      {/* Marquee Separator */}
      <div className="-mx-4 md:-mx-8 transform rotate-1">
        <div className="bg-accent-yellow py-3 border-y-4 border-black">
          <Marquee speed={40}>
            <span className="font-bold text-xl mx-8 uppercase">
              /// {collegeName} ///
            </span>
            <span className="font-serif italic text-xl mx-8">Student Hub</span>
            <span className="font-bold text-xl mx-8 uppercase">
              /// Events ///
            </span>
            <span className="font-serif italic text-xl mx-8">Clubs</span>
            <span className="font-bold text-xl mx-8 uppercase">
              /// Marketplace ///
            </span>
          </Marquee>
        </div>
      </div>

      {/* Events & Clubs Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <NewspaperCard className="p-0 overflow-hidden">
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <h3 className="font-display text-2xl font-bold">UPCOMING EVENTS</h3>
            <Link href={`/colleges/${slug}/events`}>
              <RetroButton
                variant="secondary"
                className="scale-75 origin-right"
              >
                View All
              </RetroButton>
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: any) => (
                <EventRow
                  key={event.id}
                  date={new Date(event.startsAt)
                    .toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                    .toUpperCase()}
                  title={event.title}
                  time={new Date(event.startsAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  icon="/doodles/book.svg"
                  color="bg-accent-blue"
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 font-serif italic">
                  No upcoming events.
                </p>
              </div>
            )}
          </div>
        </NewspaperCard>

        {/* Featured Clubs */}
        <NewspaperCard className="p-8 bg-white relative">
          <Tape className="absolute -top-3 right-12 rotate-45" />
          <h3 className="font-display text-2xl font-bold mb-6">
            FEATURED CLUBS
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {featuredClubs.length > 0 ? (
              featuredClubs.map((club: any) => (
                <Link key={club.id} href={`/clubs/${club.id}`}>
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-black hover:-translate-y-1 transition-transform cursor-pointer h-full">
                    <div className="w-10 h-10 bg-accent-purple rounded-full mb-3 border-2 border-black overflow-hidden">
                      {club.logoUrl && (
                        <img
                          src={club.logoUrl}
                          alt={club.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <h4 className="font-bold line-clamp-1">{club.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {club.description || "Join us!"}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-gray-500 font-serif italic">
                  No clubs found.
                </p>
              </div>
            )}

            <Link
              href={`/colleges/${slug}/clubs`}
              className="bg-gray-50 p-4 rounded-xl border-2 border-black hover:-translate-y-1 transition-transform cursor-pointer flex items-center justify-center"
            >
              <span className="font-bold text-gray-400">View All +</span>
            </Link>
          </div>
        </NewspaperCard>
      </div>

      {/* Marketplace Preview */}
      <NewspaperCard className="p-8 bg-white border-black">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-2xl font-bold">CAMPUS MARKET</h3>
          <Link href={`/colleges/${slug}/marketplace`}>
            <RetroButton variant="outline" className="scale-90">
              Browse All
            </RetroButton>
          </Link>
        </div>

        {recentListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentListings.map((item: any) => (
              <Link key={item.id} href={`/marketplace/${item.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-square bg-gray-100 rounded-lg border-2 border-black mb-2 overflow-hidden relative">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-300">
                        <Doodle
                          src="/doodles/box.svg"
                          className="w-12 h-12 opacity-50"
                        />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 bg-white text-black text-xs py-0">
                      ₹{item.price}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500 truncate">
                    {item.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
            <p className="text-gray-500 font-serif italic">
              Marketplace is empty. Be the first to sell!
            </p>
          </div>
        )}
      </NewspaperCard>
    </div>
  );
}
