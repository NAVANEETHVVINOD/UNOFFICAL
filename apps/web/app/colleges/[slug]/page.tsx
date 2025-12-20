/**
 * CollegeHome (Dynamic Route)
 *
 * The specific dashboard for a single college (/colleges/[slug]).
 * Modern redesign matching the global dashboard aesthetic.
 */
import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import { api } from "../../../lib/api";
import CollegeFeed from "./CollegeFeed";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollegeHome({ params }: PageProps) {
  let user;
  try {
    user = await getServerProfile();
  } catch (error) {
    console.error("Failed to get user profile:", error);
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  if (!user.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  const { slug } = await params;

  // Fetch data in parallel with proper error handling
  let events: any[] = [];

  try {
    const results = await Promise.allSettled([
      api.getEvents(slug),
    ]);

    events = results[0].status === 'fulfilled' ? results[0].value : [];
  } catch (error) {
    console.error("Failed to fetch college data:", error);
  }

  const upcomingEvents = (Array.isArray(events) ? events : []).slice(0, 5);

  return (
    <div className="min-h-screen bg-paper dark:bg-dark-bg relative transition-colors duration-300">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
        <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-6 pt-24 md:pt-36">
        <CollegeFeed collegeSlug={slug} initialEvents={upcomingEvents} />
      </div>
    </div>
  );
}
