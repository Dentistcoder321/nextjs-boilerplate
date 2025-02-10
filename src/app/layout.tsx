import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "./globals.css"
import { ClientLayout } from './client-layout'

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "DentalChain - Secure Dental Records on the Blockchain",
  description: "A decentralized solution for managing dental records with enhanced security, transparency, and accessibility.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
} 