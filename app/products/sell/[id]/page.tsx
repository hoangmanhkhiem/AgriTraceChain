"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Tag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

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
}

export default function SellProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isConnected, walletAddress } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState(mockProductDetails)
  const [formData, setFormData] = useState({
    price: "",
    quantity: "",
    unit: "kg",
    description: "",
    availableUntil: "",
    shippingOptions: "",
    paymentTerms: "Immediate payment via blockchain",
  })

  // Redirect to connect wallet page if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/connect-wallet")
      return
    }

    // In a real app, fetch product data from API
    const fetchProduct = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        // In a real app, we would fetch the product data using the ID
        // For now, we'll use the mock data
        setProduct({
          ...mockProductDetails,
          id: params.id,
        })
        setFormData((prev) => ({
          ...prev,
          price: mockProductDetails.price,
          quantity: mockProductDetails.quantity.split(" ")[0],
          unit: mockProductDetails.quantity.split(" ")[1],
        }))
      } catch (error) {
        console.error("Error fetching product:", error)
      }
    }

    fetchProduct()
  }, [isConnected, router, params.id])

  if (!isConnected) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, this would call the backend API to list the product for sale
      // and interact with the Cardano blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API delay

      // Show success toast
      toast({
        title: "Product Listed for Sale",
        description: "Your product has been successfully listed on the marketplace.",
      })

      // Redirect to products page after successful submission
      router.push("/products")
    } catch (error) {
      console.error("Error listing product for sale:", error)
      toast({
        title: "Error",
        description: "An error occurred while listing the product for sale. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href={`/products/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Sell Product</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>Review your product details before listing it for sale.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Product Name</p>
              <p className="font-medium">{product.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Product Type</p>
              <p>{product.type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Product ID</p>
              <p className="font-mono text-sm">{product.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Harvest Date</p>
              <p>{product.harvestDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selling Information</CardTitle>
          <CardDescription>Enter the details for selling your product on the marketplace.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price per unit (₳)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 12.50"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={formData.unit} onValueChange={(value) => handleSelectChange("unit", value)} required>
                    <SelectTrigger id="unit">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="g">Grams (g)</SelectItem>
                      <SelectItem value="ton">Tons</SelectItem>
                      <SelectItem value="l">Liters (L)</SelectItem>
                      <SelectItem value="ml">Milliliters (mL)</SelectItem>
                      <SelectItem value="pcs">Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableUntil">Available Until</Label>
              <Input
                id="availableUntil"
                name="availableUntil"
                type="date"
                value={formData.availableUntil}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingOptions">Shipping Options</Label>
              <Input
                id="shippingOptions"
                name="shippingOptions"
                placeholder="e.g., Local pickup, Nationwide shipping"
                value={formData.shippingOptions}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Listing Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide additional details about your product listing"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href={`/products/${params.id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listing Product...
                </>
              ) : (
                <>
                  <Tag className="mr-2 h-4 w-4" />
                  List Product for Sale
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
