"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Truck, Leaf, Calendar, Map, ExternalLink, Clock, ShieldCheck, Download } from "lucide-react"
import { useParams } from "next/navigation"

// Mock product data - in a real app, this would come from an API call
const mockProductDetails = {
  id: "1",
  name: "Organic Rice",
  type: "Grain",
  quantity: "500 kg",
  location: "Farm A, District B",
  description:
    "Premium organic rice grown without pesticides or chemical fertilizers. Cultivated using traditional farming methods that preserve soil health and biodiversity.",
  harvestDate: "2023-04-10",
  price: "12.50",
  status: "Active",
  txHash: "tx_8f7d6c5e4b3a2c1d",
  blockHeight: "8245671",
  timestamp: "2023-04-15T09:30:45Z",
  farmer: {
    name: "John Smith",
    address: "addr1qxy8e...",
    verified: true,
  },
  transportHistory: [
    {
      date: "2023-04-15",
      location: "Farm A",
      status: "Harvested",
      handler: "John Smith",
      txHash: "tx_8f7d6c5e4b3a2c1d",
    },
    {
      date: "2023-04-18",
      location: "Processing Center",
      status: "Processing",
      handler: "Processing Co.",
      txHash: "tx_7e6d5c4b3a2f1e0d",
    },
    {
      date: "2023-04-22",
      location: "Distribution Center",
      status: "Ready for Distribution",
      handler: "Logistics Inc.",
      txHash: "tx_6f5e4d3c2b1a0z9y",
    },
  ],
  certifications: ["Organic", "Pesticide-Free", "Sustainable Farming"],
}

export default function ProductDetailPage() {
  const router = useRouter()
  const { isConnected } = useWallet()
  const [product, setProduct] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const id = useParams().id;

  // Redirect to connect wallet page if not connected
  useEffect(() => {

    // In a real app, fetch product data from API
    const fetchProduct = async () => {
      setIsLoading(true)
      const response = await fetch(`/api/products/${id}`)
      const data = await response.json()
      setProduct(data)
      console.log(data)
      setIsLoading(false)
    }

    fetchProduct()
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Details about this agricultural product registered on the blockchain.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Product Type</p>
                  <p>{product.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                  <p>{product.quantity}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                       "bg-green-100 text-green-800"
                         
                      }`}
                    >
                      active
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p className="flex items-center">
                    <Map className="h-4 w-4 mr-1 text-muted-foreground" />
                    {product.location}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Harvest Date</p>
                  <p className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    {product.createdAt}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm">{product.description}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                    >
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="transport" className="space-y-4">
            <TabsList>
              <TabsTrigger value="transport">Transport History</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain Data</TabsTrigger>
            </TabsList>
            <TabsContent value="transport" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transport History</CardTitle>
                  <CardDescription>Track the journey of this product through the supply chain.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
                    <div className="space-y-6">
                      {product.transportHistory.map((event, index) => (
                        <div key={index} className="relative pl-8">
                          <div className="absolute left-0 top-2 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                            <Truck className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{event.status}</h4>
                              <span className="text-xs text-muted-foreground">{event.date}</span>
                            </div>
                            <p className="text-sm">Location: {event.location}</p>
                            <p className="text-sm">Handler: {event.handler}</p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Transaction: {event.txHash.substring(0, 10)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Truck className="mr-2 h-4 w-4" />
                    Update Transport Status
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="blockchain" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Data</CardTitle>
                  <CardDescription>Immutable blockchain records for this product.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
                    <p className="text-sm font-mono">{product.txHash}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Block Height</p>
                    <p className="text-sm font-mono">{product.blockHeight}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                    <p className="text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(product.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Farmer Address</p>
                    <p className="text-sm font-mono">{product.farmer.address}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a
                      href={`https://explorer.cardano.org/tx/${product.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Blockchain Explorer
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>Scan this QR code to verify product authenticity.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="border p-4 rounded-lg mb-4">
                <QrCode className="h-48 w-48" />
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Producer Information</CardTitle>
              <CardDescription>Details about the farmer who produced this product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">{product.farmer.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center">
                    {product.farmer.verified && <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />}
                    {product.farmer.verified ? "Verified Producer" : "Producer"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                <p className="text-xs font-mono truncate">{product.farmer.address}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/producer-profile">View Producer Profile</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
