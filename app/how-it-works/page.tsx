import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, QrCode, ShieldCheck, Truck, Wallet, ArrowRight, ArrowDown } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">How AgriTraceChain Works</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Our blockchain-based agricultural traceability system ensures transparency, security, and trust throughout the
          supply chain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Blockchain-Powered Traceability</h2>
          <p className="text-muted-foreground mb-6">
            AgriTraceChain uses the Cardano blockchain to create immutable records of agricultural products. This
            ensures that product information cannot be tampered with and provides a transparent view of the entire
            supply chain.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <ShieldCheck className="h-3 w-3 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Immutable Records</h3>
                <p className="text-sm text-muted-foreground">
                  Once data is recorded on the blockchain, it cannot be altered or deleted, ensuring data integrity.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Wallet className="h-3 w-3 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Wallet-Based Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Secure authentication using Cardano wallets instead of traditional username/password systems.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <QrCode className="h-3 w-3 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">QR Code Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Each product gets a unique QR code that consumers can scan to verify authenticity and origin.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=400&width=400"
            width={400}
            height={400}
            alt="Blockchain visualization"
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">The Journey from Farm to Table</h2>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-muted hidden md:block" />
          <div className="space-y-12 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:text-right order-2 md:order-1">
                <h3 className="text-xl font-bold mb-2">1. Farmer Registration</h3>
                <p className="text-muted-foreground">
                  Farmers connect their Cardano wallet and register on the platform, creating a verified digital
                  identity.
                </p>
              </div>
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative">
                  <div className="absolute -left-4 md:left-auto md:-right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-primary-foreground font-bold">1</span>
                  </div>
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wallet className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -right-4 md:left-auto md:-left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-primary-foreground font-bold">2</span>
                  </div>
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2. Product Registration</h3>
                <p className="text-muted-foreground">
                  Farmers register their products with detailed information including harvest date, location, and
                  farming methods.
                </p>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:text-right order-2 md:order-1">
                <h3 className="text-xl font-bold mb-2">3. Blockchain Verification</h3>
                <p className="text-muted-foreground">
                  Product information is securely stored on the Cardano blockchain, creating an immutable record.
                </p>
              </div>
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative">
                  <div className="absolute -left-4 md:left-auto md:-right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-primary-foreground font-bold">3</span>
                  </div>
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -right-4 md:left-auto md:-left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-primary-foreground font-bold">4</span>
                  </div>
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">4. Supply Chain Tracking</h3>
                <p className="text-muted-foreground">
                  Each step in the supply chain is recorded on the blockchain, from farm to processing to distribution.
                </p>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowDown className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:text-right order-2 md:order-1">
                <h3 className="text-xl font-bold mb-2">5. Consumer Verification</h3>
                <p className="text-muted-foreground">
                  Consumers scan the product QR code to verify authenticity and view the complete journey of the
                  product.
                </p>
              </div>
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative">
                  <div className="absolute -left-4 md:left-auto md:-right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary flex items-center justify-center z-10">
                    <span className="text-primary-foreground font-bold">5</span>
                  </div>
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Key Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>For Farmers</CardTitle>
              <CardDescription>Benefits for agricultural producers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Premium Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified products can command higher prices in the market.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Direct Consumer Connection</h3>
                  <p className="text-sm text-muted-foreground">Build trust and loyalty with end consumers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Reduced Counterfeiting</h3>
                  <p className="text-sm text-muted-foreground">
                    Protect your brand from counterfeit products in the market.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Consumers</CardTitle>
              <CardDescription>Benefits for end consumers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Product Authenticity</h3>
                  <p className="text-sm text-muted-foreground">Verify that products are genuine and as advertised.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    See the complete journey of products from farm to table.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Informed Choices</h3>
                  <p className="text-sm text-muted-foreground">
                    Make purchasing decisions based on verified information.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Supply Chain</CardTitle>
              <CardDescription>Benefits for the entire supply chain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Improved Efficiency</h3>
                  <p className="text-sm text-muted-foreground">Streamlined processes and reduced paperwork.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Reduced Fraud</h3>
                  <p className="text-sm text-muted-foreground">
                    Minimize fraud and ensure compliance with regulations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <ShieldCheck className="h-3 w-3 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">Faster Issue Resolution</h3>
                  <p className="text-sm text-muted-foreground">
                    Quickly identify and address issues in the supply chain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Join the agricultural revolution and start building trust with your customers through blockchain verification.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/connect-wallet">
              Connect Wallet
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/scan">
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR Code
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
