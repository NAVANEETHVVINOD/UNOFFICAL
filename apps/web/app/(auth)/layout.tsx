"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative">
      {/* Navigation or Header could go here if needed, but for auth pages we keep it clean */}
      <div className="absolute top-6 left-6 z-50">
        <a href="/" className="font-display text-2xl text-black no-underline hover:text-gray-700">LINKER</a>
      </div>
      {children}
    </div>
  );
}