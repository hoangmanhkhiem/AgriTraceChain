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
import {useWallet} from "@meshsdk/react"
// Add Pinata SDK import'p
import axios from "axios"
import {} from "@/Pinata"

export default function ProductParametersPage() {
 
  const router = useRouter()
  const {wallet} = useWallet()
  const {  isConnected, walletAddress } = useWallet()
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

  // Pinata configuration
  const JWT = process.env.NEXT_PUBLIC_PINATA_JWT || "YOUR_PINATA_JWT_HERE"
  const pinataGateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY || "gateway.pinata.cloud"

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

  // Function to upload data to IPFS via Pinata
  const uploadToIPFS = async (data: any) => {
    try {
      setProcessingStep("Uploading product data to IPFS...")
      
      const jsonData = JSON.stringify(data)
      const formData = new FormData()
      
      // Create a file with the JSON data
      const blob = new Blob([jsonData], { type: "application/json" })
      const file = new File([blob], `product_${Date.now()}.json`, { type: "application/json" })
      
      formData.append("file", file)
      
      // Upload to Pinata
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            Authorization: `Bearer ${JWT}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      
      if (response.status === 200) {
        const ipfsHash = response.data.IpfsHash
        const url = `https://${pinataGateway}/ipfs/${ipfsHash}`
        setIpfsUrl(url)
        return url
      } else {
        throw new Error("Failed to upload to IPFS")
      }
    } catch (error) {
      console.error("Error uploading to IPFS:", error)
      throw new Error("Failed to upload product data to IPFS")
    }
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
      
      // Upload to IPFS
      const ipfsUrl = await uploadToIPFS(productDataForIPFS)
      
      // Create metadata for the NFT with the IPFS URL
      setProcessingStep("Creating product NFT...")
      const metadata = {
        name: formData.name,
        description: formData.description,
        image: "ipfs://bafkreiafswwrnu6pkez6csmreelfsk6stpuopuxnlgq2gbcrejielagkti", // Default product image
        productType: formData.type,
        quantity: formData.quantity,
        unit: formData.unit,
        location: formData.location,
        harvestDate: formData.harvestDate,
        // Reference to full data on IPFS
        productDataUrl: ipfsUrl
      }
      
      // Mint the NFT with the metadata
      const result = await mintNFT(
        wallet,
        `Product-${Date.now()}`, // Generate unique token name
        metadata
      )
      
      // Show success toast
      blockchainService.showBlockchainToast(
        "success",
        "Product Registered",
        "Product parameters have been successfully stored on the blockchain with data on IPFS.",
        result.txHash,
      )

      // Set registration complete and product ID
      setRegistrationComplete(true)
      setProductId(result.policyId)

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
          {/* Your existing form fields here */}
          
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