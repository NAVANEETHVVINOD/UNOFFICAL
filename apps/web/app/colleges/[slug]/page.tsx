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
import { Metadata } from "next";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const college = await api.getCollegeBySlug(slug);
    return {
      title: `${college.name} | LINKER`,
      description: `Join the student community at ${college.name}. Events, clubs, notes, and more.`,
    };
  } catch (e) {
    return {
      title: `${slug.toUpperCase()} | LINKER`,
      description: "Join the student community on LINKER.",
    };
  }
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
    <div className="relative z-10 max-w-[1400px] mx-auto px-2 md:px-4">
      {/* Reduced padding top significantly since layout handles navbar spacing */}
      <div className="">
        <CollegeFeed collegeSlug={slug} initialEvents={upcomingEvents} />
      </div>
    </div>
  );
}
