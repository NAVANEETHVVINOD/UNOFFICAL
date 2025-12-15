import "./globals.css";
import BottomNav from "./components/ui/BottomNav";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { RBACProvider } from "./context/RBACContext";
import { NotificationProvider } from "./context/NotificationContext";
import ScrollRestoration from "./components/ScrollRestoration";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const dynamic = "force-dynamic";
export const revalidate = false;

export const metadata = {
  title: "LINKER - The Campus Collective",
  description: "Events, Clubs, Notes & Chaos — Organized.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Outfit:wght@300;400;700;900&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <RBACProvider>
            <SocketProvider>
              <NotificationProvider>
                <ScrollRestoration />
                <div className="min-h-screen pb-16 md:pb-0">
                  {children}
                  <SpeedInsights />
                </div>
                <BottomNav />
              </NotificationProvider>
            </SocketProvider>
          </RBACProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
