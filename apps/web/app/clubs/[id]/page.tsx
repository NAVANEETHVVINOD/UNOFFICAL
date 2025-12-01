import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import ClubDetailsClient from "./ClubDetailsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Club Details | LINKER",
  description: "Club details and membership.",
};

export default async function ClubDetailsPage() {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <ClubDetailsClient />;
}
