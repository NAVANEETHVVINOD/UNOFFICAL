import { ReactNode, use } from "react";
import Navbar from "../../components/Navbar";

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
  // We don't really need slug/params here if we are just a shell, 
  // but we keep the signature correct.

  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
        <div className="absolute inset-0 opacity-40 bg-grid dark:opacity-20" />
      </div>

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Container - Removed duplicate padding */}
      <div className="relative z-10 pt-24 md:pt-36">
        {children}
      </div>
    </>
  );
}
