"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { QrCode, Search, ArrowRight, Loader2 } from "lucide-react"

export default function ScanPage() {
  const [qrCode, setQrCode] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    // In a real implementation, this would activate the device camera
    // and scan for QR codes
    setTimeout(() => {
      setIsScanning(false)
      // Simulate finding a product
      setQrCode("product_1")
    }, 2000)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!qrCode) return

    setIsSearching(true)
    // In a real implementation, this would search for the product
    // using the QR code or product ID
    setTimeout(() => {
      setIsSearching(false)
      // Redirect to product page
      window.location.href = `/products/1`
    }, 1500)
  }

  return (
    <div className="container max-w-md py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Scan QR Code</h1>
        <p className="text-muted-foreground">
          Scan a product QR code to verify its authenticity and trace its journey.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Verification</CardTitle>
          <CardDescription>Scan a QR code or enter a product ID to trace its origin.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
            {isScanning ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <p>Scanning QR code...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <QrCode className="h-16 w-16 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Point your camera at a product QR code to scan
                </p>
                <Button onClick={handleScan}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or enter product ID</span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter product ID or QR code"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
              />
              <Button type="submit" disabled={!qrCode || isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Scanning a QR code allows you to verify the authenticity of agricultural products and trace their journey
            from farm to table.
          </p>
          <Button variant="outline" size="sm" asChild className="w-full">
            <Link href="/how-it-works">
              Learn How It Works
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
