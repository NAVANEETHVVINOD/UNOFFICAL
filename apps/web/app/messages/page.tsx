import { redirect } from "next/navigation";
import { getServerProfile } from "../../lib/server-utils";
import MessagesClient from "./MessagesClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | LINKER",
  description: "Slide into DMs (Professionally, please).",
};

export default async function MessagesPage() {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <MessagesClient />;
}
