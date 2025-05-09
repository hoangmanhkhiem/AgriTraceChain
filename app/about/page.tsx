import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Leaf, ShieldCheck, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">About AgriTraceChain</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Building trust and transparency in agricultural supply chains through blockchain technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            AgriTraceChain was founded with a clear mission: to create a transparent, secure, and efficient agricultural
            supply chain that benefits farmers, distributors, retailers, and consumers alike.
          </p>
          <p className="text-muted-foreground mb-6">
            By leveraging the power of blockchain technology, specifically the Cardano blockchain, we provide an
            immutable record of agricultural products from farm to table, ensuring authenticity, quality, and fair
            trade.
          </p>
          <p className="text-muted-foreground">
            Our platform empowers farmers to showcase their sustainable practices, helps distributors verify product
            origins, and gives consumers confidence in the food they purchase.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=400&width=400"
            width={400}
            height={400}
            alt="Farmers working in a field"
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1 flex justify-center">
          <Image
            src="/placeholder.svg?height=400&width=400"
            width={400}
            height={400}
            alt="Blockchain technology visualization"
            className="rounded-lg"
          />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why Blockchain?</h2>
          <p className="text-muted-foreground mb-6">
            Traditional supply chain systems often suffer from opacity, inefficiency, and vulnerability to fraud. By
            implementing blockchain technology, we address these challenges head-on:
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <ShieldCheck className="h-3 w-3 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Immutability</h3>
                <p className="text-sm text-muted-foreground">
                  Once data is recorded on the blockchain, it cannot be altered or deleted, ensuring data integrity and
                  trust.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Users className="h-3 w-3 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Decentralization</h3>
                <p className="text-sm text-muted-foreground">
                  No single entity controls the data, creating a more democratic and resilient system.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Leaf className="h-3 w-3 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">Sustainability</h3>
                <p className="text-sm text-muted-foreground">
                  We chose Cardano for its energy-efficient proof-of-stake consensus mechanism, aligning with our
                  commitment to environmental sustainability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle>Nguyen Van A</CardTitle>
              <CardDescription>Founder & CEO</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Agricultural expert with 15+ years of experience in sustainable farming practices and supply chain
                management.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle>Tran Thi B</CardTitle>
              <CardDescription>CTO</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Blockchain developer with expertise in Cardano smart contracts and distributed systems architecture.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle>Le Van C</CardTitle>
              <CardDescription>Head of Operations</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Supply chain specialist with a focus on optimizing agricultural logistics and quality control processes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-muted/50 rounded-lg p-8 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Our Partners</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            We collaborate with leading organizations across the agricultural and technology sectors to build a more
            transparent and sustainable food system.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium text-center">Sustainable Farming Association</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium text-center">Cardano Foundation</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium text-center">Agricultural Research Institute</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <p className="font-medium text-center">Food Safety Certification Board</p>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Join the Agricultural Revolution</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Whether you're a farmer, distributor, retailer, or consumer, AgriTraceChain offers benefits for everyone in
          the agricultural supply chain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/connect-wallet">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
