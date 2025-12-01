import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import ChatClient from "./ChatClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | LINKER",
  description: "Private messages.",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ChatPage({ params }: PageProps) {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <ChatClient id={params.id} />;
}
