import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simama App',
  description: 'A health management app for doctors, patients, and pharmacists.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* We'll use this layout to wrap our pages */}
        {children}
      </body>
    </html>
  )
}