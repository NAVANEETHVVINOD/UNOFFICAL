import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import ClubDetailsClient from "./ClubDetailsClient";
import { Metadata } from "next";
import { api } from "../../../lib/api";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const club = await api.getClub(id);
    return {
      title: `${club.name} | LINKER`,
      description: club.description || "View club details on LINKER.",
    };
  } catch (e) {
    return {
      title: "Club Details | LINKER",
      description: "View club details on LINKER.",
    };
  }
}

export default async function ClubDetailsPage({ params }: PageProps) {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <ClubDetailsClient />;
}
