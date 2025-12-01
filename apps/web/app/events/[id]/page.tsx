import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import EventDetailsClient from "./EventDetailsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Details | LINKER",
  description: "Event details and RSVP.",
};

export default async function EventDetailsPage() {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <EventDetailsClient />;
}
