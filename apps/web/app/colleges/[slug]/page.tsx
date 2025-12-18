/**
 * CollegeHome (Dynamic Route)
 *
 * The specific dashboard for a single college (/colleges/[slug]).
 * Modern redesign matching the global dashboard aesthetic.
 */
import Navbar from "../../components/Navbar";
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
  const collegeName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Fetch data in parallel with proper error handling
  let stats = null;
  let events: any[] = [];
  let clubs: any[] = [];

  try {
    const results = await Promise.allSettled([
      api.getCollegeStats(slug),
      api.getEvents(slug),
      api.getClubs(slug),
    ]);

    stats = results[0].status === 'fulfilled' ? results[0].value : null;
    events = results[1].status === 'fulfilled' ? results[1].value : [];
    clubs = results[2].status === 'fulfilled' ? results[2].value : [];
  } catch (error) {
    console.error("Failed to fetch college data:", error);
  }

  const upcomingEvents = (Array.isArray(events) ? events : []).slice(0, 5);

  return (
    <div className="min-h-screen bg-paper relative">
      {/* Background Pattern - Subtle dots matching global dashboard */}
      <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
        {/* Subtle dot pattern - only on main content, not header */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
      </div>

      {/* Fixed Header */}
      <Navbar />

      {/* Main Layout - with top padding for fixed navbar */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-6 pt-16 md:pt-20">
        <div className="pt-4 space-y-6">
          {/* Compact Header with Glass Effect */}
          <div className="bg-paper/80 backdrop-blur-sm border-2 border-ink rounded-card-lg p-4 md:p-6 shadow-neo">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary border-2 border-ink rounded-full shadow-neo-sm mb-2">
                  <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider">Campus Feed</span>
                </div>

                <h1 className="font-display text-2xl md:text-3xl font-black leading-tight">
                  {collegeName.toUpperCase()}
                </h1>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-paper border-2 border-ink rounded-full shadow-neo-sm">
                  <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse" />
                  <span className="font-mono text-xs uppercase">Live</span>
                </div>
                <span className="font-mono text-xs text-neutral-500">
                  {new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* College Feed Component - handles mobile nav internally */}
          <CollegeFeed collegeSlug={slug} initialEvents={upcomingEvents} />
        </div>
      </div>
    </div>
  );
}
