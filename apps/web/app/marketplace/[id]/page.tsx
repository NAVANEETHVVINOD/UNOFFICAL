import { redirect } from "next/navigation";
import { getServerProfile } from "../../../lib/server-utils";
import ItemDetailsClient from "./ItemDetailsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Item Details | LINKER",
  description: "Marketplace listing details.",
};

export default async function ItemDetailsPage() {
  const user = await getServerProfile();

  if (!user?.profile?.isOnboarded) {
    redirect("/onboarding");
  }

  return <ItemDetailsClient />;
}
