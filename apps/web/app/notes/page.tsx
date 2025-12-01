import { redirect } from "next/navigation";
import { getServerProfile } from "../../lib/server-utils";
import NotesClient from "./NotesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes | LINKER",
  description: "Share knowledge. Ace exams.",
};

export default async function NotesPage() {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <NotesClient />;
}
