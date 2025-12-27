/**
 * CollegeHome (Dynamic Route)
 *
 * The college information page (/colleges/[slug]).
 * Displays college details, stats, and quick links.
 * Feed is now in the global dashboard.
 */
import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import { api } from "../../../lib/api";
import CollegeInfo from "./CollegeInfo";
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

  // Fetch college data and stats
  let college: any = null;
  let stats: any = null;

  try {
    const results = await Promise.allSettled([
      api.getCollegeBySlug(slug),
      api.getCollegeStats(slug),
    ]);

    college = results[0].status === 'fulfilled' ? results[0].value : null;
    stats = results[1].status === 'fulfilled' ? results[1].value : null;
  } catch (error) {
    console.error("Failed to fetch college data:", error);
  }

  return (
    <div className="relative z-10 max-w-[1400px] mx-auto px-4 pb-24">
      <CollegeInfo college={college} stats={stats} collegeSlug={slug} />
    </div>
  );
}
