import { redirect } from "next/navigation";
import { getServerProfile } from "../../lib/server-utils";
import ProfileClient from "./ProfileClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | LINKER",
  description: "Your campus identity.",
};

export default async function ProfilePage() {
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

    return <ProfileClient />;
  } catch (error) {
    console.error("ProfilePage Error:", error);
    redirect("/login");
  }
}
