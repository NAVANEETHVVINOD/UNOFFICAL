import { ReactNode } from "react";
import Link from "next/link";
import Container from "../../components/ui/Container";
import {
  NewspaperCard,
  RetroButton,
  Badge,
  Tape,
} from "../../components/ui/NewspaperUI";
import CollegeTabs from "../../components/ui/CollegeTabs";
import CollegeHeader from "../../components/ui/CollegeHeader";

interface CollegeLayoutProps {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export default async function CollegeLayout({
  children,
  params,
}: CollegeLayoutProps) {
  const { slug } = await params;
  const collegeName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-[#f0f0f0] pb-20">
      {/* College Header */}
      <CollegeHeader slug={slug} collegeName={collegeName} />

      <Container>
        {/* Navigation Tabs */}
        <div className="mt-8">
          <CollegeTabs slug={slug} />
        </div>
      </Container>

      {/* Main Content */}
      <Container className="pt-8">{children}</Container>
    </div>
  );
}
