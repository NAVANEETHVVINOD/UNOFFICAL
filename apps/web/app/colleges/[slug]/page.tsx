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
  let listings: any[] = [];

  try {
    const results = await Promise.allSettled([
      api.getCollegeStats(slug),
      api.getEvents(slug),
      api.getClubs(slug),
      api.getMarketplaceListings(undefined, slug),
    ]);

    stats = results[0].status === 'fulfilled' ? results[0].value : null;
    events = results[1].status === 'fulfilled' ? results[1].value : [];
    clubs = results[2].status === 'fulfilled' ? results[2].value : [];
    listings = results[3].status === 'fulfilled' ? results[3].value : [];
  } catch (error) {
    console.error("Failed to fetch college data:", error);
  }

  const upcomingEvents = (Array.isArray(events) ? events : []).slice(0, 5);

  return (
    <div className="min-h-screen bg-paper relative">
      {/* Animated Background Pattern - Smaller dots with color */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Primary yellow dots - smaller */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #FFEB3B 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Secondary coral dots */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle, #FF6B6B 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            backgroundPosition: '24px 24px',
          }}
        />
        {/* Blue accent dots */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, #45B7D1 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
            backgroundPosition: '16px 16px',
          }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/60 via-transparent to-paper/80" />
      </div>

      <Navbar />

      <Container>
        <div className="py-6 space-y-6 relative z-10">
          {/* Compact Header */}
          <div className="bg-white/80 backdrop-blur-sm border-2 border-ink rounded-2xl p-4 md:p-6 shadow-neo">
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
              
              <div className="flex items-center gap-2 text-sm">
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

          <CollegeFeed collegeSlug={slug} initialEvents={upcomingEvents} />
        </div>
      </Container>
    </div>
  );
}
