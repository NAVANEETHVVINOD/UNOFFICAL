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
    <div className="min-h-screen bg-[#F2F2F2] relative">
      {/* Background Pattern - Smooth tilted grid */}
      <div className="fixed inset-0 pointer-events-none z-0 top-16 md:top-20">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #E0E0E0 25%, transparent 25%), 
              linear-gradient(-45deg, #E0E0E0 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #E0E0E0 75%), 
              linear-gradient(-45deg, transparent 75%, #E0E0E0 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 0, 10px -10px, 0px 10px'
          }}
        />
      </div>

      {/* Global Navbar */}
      <Navbar />

      {/* Main Content Container - with top padding for fixed navbar */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-6 pt-16 md:pt-20">
        <div className="pt-4 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
