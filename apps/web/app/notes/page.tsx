import { Metadata } from "next";
import NotesClient from "./NotesClient";

export const metadata: Metadata = {
  title: "Academic Notes | LINKER",
  description: "Download study materials and previous year papers.",
};

import { redirect } from "next/navigation";
import { getServerProfile } from "../../lib/server-utils";

export default async function NotesPage() {
  const user = await getServerProfile();
  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <NotesClient />;
}
