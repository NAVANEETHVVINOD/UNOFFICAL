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
    <div className="min-h-screen relative">
      {/* Background Pattern - handled globally or via page.tsx if needed, but let's keep it simple here */}

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Container - Removed duplicate padding */}
      <div className="relative z-10 pt-16 md:pt-20">
        {children}
      </div>
    </div>
  );
}
