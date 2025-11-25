import './globals.css'
import BottomNav from './components/ui/BottomNav'
import { AuthProvider } from './context/AuthContext'
import ScrollRestoration from './components/ScrollRestoration'

export const dynamic = "force-dynamic";
export const revalidate = false;

export const metadata = {
    title: 'LINKER - The Campus Collective',
    description: 'Events, Clubs, Notes & Chaos — Organized.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <ScrollRestoration />
                    <div className="min-h-screen pb-16 md:pb-0">
                        {children}
                    </div>
                    <BottomNav />
                </AuthProvider>
            </body>
        </html>
    )
}