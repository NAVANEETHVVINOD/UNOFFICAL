import { redirect } from "next/navigation";
import { getServerProfile } from "../../lib/server-utils";
import DashboardClient from "./DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | LINKER",
  description: "Your campus hub for events, clubs, and chaos.",
};

export default async function DashboardPage() {
  try {
    const user = await getServerProfile();

    if (!user) {
      redirect("/login");
    }

    // Check if user has completed onboarding (has college selected)
    const hasCollege = user.profile?.collegeId || user.profile?.college?.id || (user.profile?.socials as any)?.tempCollegeId;
    const hasFullName = user.profile?.fullName && user.profile.fullName.trim().length > 0;
    
    if (!hasCollege || !hasFullName) {
      redirect("/onboarding");
    }

    return <DashboardClient />;
  } catch (error) {
    console.error("DashboardPage Error:", error);
    redirect("/login");
  }
}
