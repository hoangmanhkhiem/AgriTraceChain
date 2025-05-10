import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ClientProviders from "../components/client-providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AgriTraceChain - Blockchain Agricultural Traceability",
  description: "Trace agricultural products from farm to table using blockchain technology",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ClientProviders>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}