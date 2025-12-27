import "./globals.css";
import BottomNav from "./components/ui/BottomNav";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import { RBACProvider } from "./context/RBACContext";
import { NotificationProvider } from "./context/NotificationContext";
import { RetroToastProvider } from "./context/ToastContext";
import ScrollRestoration from "./components/ScrollRestoration";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";

import { Metadata, Viewport } from "next";
import ClientLoader from "./components/ClientLoader";

export const dynamic = "force-dynamic";
export const revalidate = false;

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "LINKER - The Campus Collective",
  description: "Events, Clubs, Notes & Chaos — Organized.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LINKER",
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
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className="bg-paper dark:bg-dark-bg text-ink dark:text-dark-text transition-colors duration-300 bg-retro-pattern">
        <AuthProvider>
          <ThemeProvider>
            <RBACProvider>
              <SocketProvider>
                <RetroToastProvider>
                  <NotificationProvider>
                    <ClientLoader />
                    <ScrollRestoration />
                    <div className="min-h-screen pb-16 md:pb-0 relative z-10">
                      {children}
                      <SpeedInsights />
                    </div>
                    <BottomNav />
                  </NotificationProvider>
                </RetroToastProvider>
              </SocketProvider>
            </RBACProvider>
          </ThemeProvider>
        </AuthProvider>
        {/* Service Worker Registration with Update Handling */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                    
                    // Check for updates periodically
                    setInterval(() => {
                      registration.update();
                    }, 60 * 60 * 1000); // Check every hour
                    
                    // Handle updates
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content available, show update prompt
                            if (confirm('New version available! Reload to update?')) {
                              newWorker.postMessage({ type: 'SKIP_WAITING' });
                              window.location.reload();
                            }
                          }
                        });
                      }
                    });
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
                
                // Listen for SW messages
                navigator.serviceWorker.addEventListener('message', (event) => {
                  if (event.data && event.data.type === 'SW_UPDATED') {
                    console.log('Service Worker updated to version:', event.data.version);
                  }
                });
                
                // Handle controller change (new SW activated)
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                  console.log('New service worker activated');
                });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
