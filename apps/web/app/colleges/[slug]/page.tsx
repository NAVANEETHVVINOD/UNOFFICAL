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
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Primary dot grid */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              radial-gradient(circle, #FFEB3B 2px, transparent 2px),
              radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px, 24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-paper/50 to-paper" />
      </div>

      <Navbar />

      <Container>
        <div className="py-8 space-y-8 relative z-10">
          {/* Newspaper Header - Redesigned */}
          <div className="relative">
            {/* Decorative corner elements */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-ink" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-ink" />
            
            <div className="border-b-4 border-ink pb-6 pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  {/* Badge with animation */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary border-2 border-ink rounded-full shadow-neo-sm mb-3">
                    <span className="w-2 h-2 bg-accent-coral rounded-full animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">Campus Headlines</span>
                  </div>
                  
                  <h1 className="font-display text-4xl md:text-5xl font-black leading-tight">
                    THE DAILY{" "}
                    <span className="relative inline-block">
                      <span className="relative z-10">{collegeName.toUpperCase()}</span>
                      <span className="absolute bottom-1 left-0 right-0 h-3 bg-primary/40 -z-0" />
                    </span>
                  </h1>
                  
                  <p className="font-serif italic text-neutral-600 mt-2">
                    Your campus, your stories, your community.
                  </p>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
                    Vol. 42 • Issue {new Date().getDate()}
                  </span>
                  <span className="font-serif italic text-neutral-400">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Decorative bottom corners */}
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-ink" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-ink" />
          </div>

          <CollegeFeed collegeSlug={slug} initialEvents={upcomingEvents} />
        </div>
      </Container>
    </div>
  );
}
