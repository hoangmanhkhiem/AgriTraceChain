"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { blockchainService } from "@/services/blockchain-service"
import { toast } from "@/components/ui/use-toast"

export default function ProductParametersPage() {
  const router = useRouter()
  const { isConnected, walletAddress } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: "",
    unit: "kg",
    location: "",
    description: "",
    harvestDate: "",
    price: "",
    nutrientContent: "",
    pesticidesUsed: "",
    waterUsage: "",
    soilType: "",
    certifications: "",
  })

  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [productId, setProductId] = useState("")

  // Redirect to connect wallet page if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/auth")
    }
  }, [isConnected, router])

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
      // In a real implementation, this would call the backend API to register the product
      // and interact with the Cardano blockchain
      const result = await blockchainService.registerProduct(formData, walletAddress || "")

      // Show success toast
      blockchainService.showBlockchainToast(
        "success",
        "Product Registered",
        "Product parameters have been successfully stored on the blockchain.",
        result.txHash,
      )

      // Set registration complete and product ID
      setRegistrationComplete(true)
      setProductId(result.productId)

      // Don't redirect immediately, show the sell option
      // router.push("/products")
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "An error occurred while registering the product. Please try again.",
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
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Quay lại</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Product Parameters</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            Enter detailed parameters of your agricultural product to register it on the blockchain.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Organic Rice"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Product Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grain">Grain</SelectItem>
                    <SelectItem value="Vegetable">Vegetable</SelectItem>
                    <SelectItem value="Fruit">Fruit</SelectItem>
                    <SelectItem value="Beans">Beans</SelectItem>
                    <SelectItem value="Dairy">Dairy</SelectItem>
                    <SelectItem value="Meat">Meat</SelectItem>
                    <SelectItem value="Sweetener">Sweetener</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  placeholder="VD: 500"
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
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="ton">Tấn</SelectItem>
                    <SelectItem value="l">Litre (L)</SelectItem>
                    <SelectItem value="ml">Millilitre (mL)</SelectItem>
                    <SelectItem value="pcs">Piece</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per unit (₳)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="VD: 10.50"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Production Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Farm A, District B"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="harvestDate">Harvest Date</Label>
              <Input
                id="harvestDate"
                name="harvestDate"
                type="date"
                value={formData.harvestDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutrientContent">Nutrient Content</Label>
              <Textarea
                id="nutrientContent"
                name="nutrientContent"
                placeholder="List the main nutritional components and their content"
                rows={2}
                value={formData.nutrientContent}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pesticidesUsed">Pesticides Used</Label>
              <Textarea
                id="pesticidesUsed"
                name="pesticidesUsed"
                placeholder="List the pesticides used (if any)"
                rows={2}
                value={formData.pesticidesUsed}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterUsage">Water Usage</Label>
                <Input
                  id="waterUsage"
                  name="waterUsage"
                  placeholder="e.g., 500 liters/hectare"
                  value={formData.waterUsage}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Input
                  id="soilType"
                  name="soilType"
                  placeholder="e.g., Alluvial soil, basalt red soil"
                  value={formData.soilType}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Input
                id="certifications"
                name="certifications"
                placeholder="e.g., Organic, VietGAP, GlobalGAP"
                value={formData.certifications}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide details about your product, including growing methods, certifications, etc."
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Product on Blockchain"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {registrationComplete && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Product Successfully Registered</CardTitle>
            <CardDescription>
              Your product has been registered on the blockchain. What would you like to do next?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800 font-medium">Product ID: {productId}</p>
              <p className="text-sm text-green-700 mt-1">
                This ID can be used to track your product throughout the supply chain.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/products">View My Products</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/products/sell/${productId}`}>Sell This Product</Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
