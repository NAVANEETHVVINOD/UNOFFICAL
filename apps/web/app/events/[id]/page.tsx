import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import EventDetailsClient from "./EventDetailsClient";
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
    const event = await api.getEvent(id);
    return {
      title: `${event.title} | LINKER`,
      description: event.description || "View event details on LINKER.",
    };
  } catch (e) {
    return {
      title: "Event Details | LINKER",
      description: "View event details on LINKER.",
    };
  }
}

export default async function EventDetailsPage({ params }: PageProps) {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  // We can pass initialData to client if we wanted, but for now just Client Component rules
  // Actually, passing id to client component is better than useParams but useParams works too.
  return <EventDetailsClient />;
}
