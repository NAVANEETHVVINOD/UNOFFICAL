import "./globals.css";
import BottomNav from "./components/ui/BottomNav";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { RBACProvider } from "./context/RBACContext";
import { NotificationProvider } from "./context/NotificationContext";
import ScrollRestoration from "./components/ScrollRestoration";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const revalidate = false;

export const metadata = {
  title: "LINKER - The Campus Collective",
  description: "Events, Clubs, Notes & Chaos — Organized.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LINKER",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
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
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LINKER" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
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
        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
