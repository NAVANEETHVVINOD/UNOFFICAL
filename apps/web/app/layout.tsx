import './globals.css'

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
        {children}
      </body>
    </html>
  )
}