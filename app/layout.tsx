import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PropIntelli - Property Intelligence Platform',
  description: 'Find your perfect property with data-driven insights and neighborhood analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



