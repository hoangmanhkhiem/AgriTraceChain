"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import { mintNFT } from "@/script/mint"
import { useWallet } from "@meshsdk/react"
import { useWallet1 } from "@/context/wallet-context"
// Import Pinata functions
import { uploadToIPFS, fetchFromIPFS } from "@/Pinata/ipfs"

export default function ProductParametersPage() {
  const router = useRouter()
  const { wallet } = useWallet()
  const { isConnected, walletAddress } = useWallet1()
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
  const [ipfsUrl, setIpfsUrl] = useState("")
  const [processingStep, setProcessingStep] = useState("")

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
      // First, upload product data to IPFS
      setProcessingStep("Preparing product data...")
      
      // Add timestamp and wallet address to the data
      const productDataForIPFS = {
        ...formData,
        registrationDate: new Date().toISOString(),
        registeredBy: walletAddress,
        timestamp: Date.now()
      }
      
      // Upload to IPFS using the imported function
      setProcessingStep("Uploading product data to IPFS...")
      const ipfsUrl = await uploadToIPFS(productDataForIPFS)
      
      // Create metadata for the NFT with the IPFS URL
      setProcessingStep("Creating product NFT...")
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: "ipfs://bafybeifq4vh5ebzq3h73pnksrdrxovt66g5ku3jjcggjjwxra3mcqxhe5m", // Default product image
        productType: formData.type,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        harvestDate: formData.harvestDate,
        productDataUrl: ipfsUrl
      }
      
      // Mint the NFT with the metadata
      setProcessingStep("Minting product NFT on blockchain...")
      const result = await mintNFT(
        wallet,
        `Product-${Date.now()}`, // 
        metadata
      )
      
      // After successful minting, store the IPFS URL and product ID
      setIpfsUrl(ipfsUrl)
      setProductId(result.policyId)
      
      // Show success toast
      blockchainService.showBlockchainToast(
        "success",
        "Product Registered",
        "Product parameters have been successfully stored on the blockchain with data on IPFS.",
        result.txHash,
      )

      // Set registration complete
      setRegistrationComplete(true)

    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: "Error",
        description: "An error occurred while registering the product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setProcessingStep("")
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Product Type</Label>
                <Select 
                  name="type" 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fruit">Fruit</SelectItem>
                    <SelectItem value="vegetable">Vegetable</SelectItem>
                    <SelectItem value="grain">Grain</SelectItem>
                    <SelectItem value="herb">Herb</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  value={formData.quantity} 
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  name="unit" 
                  value={formData.unit} 
                  onValueChange={(value) => handleSelectChange("unit", value)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="harvestDate">Harvest Date</Label>
                <Input 
                  id="harvestDate" 
                  name="harvestDate" 
                  type="date" 
                  value={formData.harvestDate} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (in ADA)</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                step="0.01" 
                value={formData.price} 
                onChange={handleChange} 
              />
            </div>

            {/* Additional parameters */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Parameters</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nutrientContent">Nutrient Content</Label>
                <Textarea 
                  id="nutrientContent" 
                  name="nutrientContent" 
                  value={formData.nutrientContent} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pesticidesUsed">Pesticides Used</Label>
                <Textarea 
                  id="pesticidesUsed" 
                  name="pesticidesUsed" 
                  value={formData.pesticidesUsed} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waterUsage">Water Usage</Label>
                  <Input 
                    id="waterUsage" 
                    name="waterUsage" 
                    value={formData.waterUsage} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Input 
                    id="soilType" 
                    name="soilType" 
                    value={formData.soilType} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <Textarea 
                  id="certifications" 
                  name="certifications" 
                  value={formData.certifications} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </CardContent>
          
          {/* Add a processing indicator */}
          {processingStep && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md mb-4 mx-6">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <p className="text-blue-800 font-medium">{processingStep}</p>
              </div>
            </div>
          )}
          
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

      {/* Registration complete card */}
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
            
            {ipfsUrl && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-800 font-medium">Product Data on IPFS:</p>
                <a href={ipfsUrl} target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-blue-600 hover:underline break-all">
                  {ipfsUrl}
                </a>
              </div>
            )}
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