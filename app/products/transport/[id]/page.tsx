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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Truck } from "lucide-react"
import { blockchainService, type TransportUpdate } from "@/services/blockchain-service"
import { toast } from "@/components/ui/use-toast"

// Mock product data - in a real app, this would come from an API call
const mockProductDetails = {
  id: "1",
  name: "Organic Rice",
  type: "Grain",
  quantity: "500 kg",
  location: "Farm A, District B",
  status: "Active",
}

export default function UpdateTransportPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isConnected, walletAddress } = useWallet()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [product, setProduct] = useState(mockProductDetails)
  const [formData, setFormData] = useState({
    status: "",
    location: "",
    notes: "",
  })

  // Redirect to connect wallet page if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/connect-wallet")
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
      // Prepare transport update data
      const transportData: TransportUpdate = {
        productId: params.id,
        newStatus: formData.status,
        newLocation: formData.location,
        handler: walletAddress || "",
      }

      // Call blockchain service to update transport status
      const result = await blockchainService.updateTransportStatus(transportData, walletAddress || "")

      // Show success toast
      blockchainService.showBlockchainToast(
        "success",
        "Transport Status Updated",
        "The product transport status has been successfully updated on the blockchain.",
        result.txHash,
      )

      // Redirect to product details page
      router.push(`/products/${params.id}`)
    } catch (error) {
      console.error("Error updating transport status:", error)
      toast({
        title: "Error Updating Transport Status",
        description: "There was an error updating the transport status. Please try again.",
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
        <h1 className="text-3xl font-bold tracking-tight">Update Transport Status</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transport Information</CardTitle>
          <CardDescription>Update the transport status and location of your product.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Product Name</p>
                <p className="font-medium">{product.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "In Transit"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)} required>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Harvested">Harvested</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Distribution">Distribution Center</SelectItem>
                  <SelectItem value="Retail">Retail Store</SelectItem>
                  <SelectItem value="Sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">New Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g., Distribution Center, City"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any additional information about this transport update"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
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
                  Updating...
                </>
              ) : (
                <>
                  <Truck className="mr-2 h-4 w-4" />
                  Update Transport Status
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
