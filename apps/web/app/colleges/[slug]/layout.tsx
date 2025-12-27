import { ReactNode, use } from "react";
import Navbar from "../../components/Navbar";
import CategoryRibbon from "../../components/CategoryRibbon";

interface CollegeLayoutProps {
  children: ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export default function CollegeLayout({
  children,
  params,
}: CollegeLayoutProps) {
  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
        <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
      </div>

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Container */}
      <div className="relative z-10 pt-24 md:pt-28">
        {/* NavBox - College variant with 3 items */}
        <div className="max-w-[1400px] mx-auto px-4 mb-4">
          <CategoryRibbon variant="college" />
        </div>
        {children}
      </div>
    </>
  );
}
