import Product from "@/models/Product"
import connectMongo from "@/configs/mongoConfig"
import { NextRequest, NextResponse } from "next/server"

// Mock database for products (same as in the products route)
const products = [
  {
    id: "1",
    name: "Organic Rice",
    type: "Grain",
    quantity: "500 kg",
    unit: "kg",
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
    certifications: ["Organic", "Pesticide-Free", "Sustainable Farming"],
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
  },
  {
    id: "2",
    name: "Fresh Tomatoes",
    type: "Vegetable",
    quantity: "200 kg",
    unit: "kg",
    location: "Farm B, District C",
    description: "Fresh, vine-ripened tomatoes grown using sustainable farming practices.",
    harvestDate: "2023-04-12",
    price: "8.75",
    status: "In Transit",
    txHash: "tx_1a2b3c4d5e6f7g8h",
    blockHeight: "8245612",
    timestamp: "2023-04-12T14:22:33Z",
    farmer: {
      name: "Maria Garcia",
      address: "addr1qab7c...",
      verified: true,
    },
    certifications: ["Organic", "Non-GMO"],
    transportHistory: [
      {
        date: "2023-04-12",
        location: "Farm B",
        status: "Harvested",
        handler: "Maria Garcia",
        txHash: "tx_1a2b3c4d5e6f7g8h",
      },
      {
        date: "2023-04-14",
        location: "Packaging Facility",
        status: "Packaging",
        handler: "Fresh Pack Co.",
        txHash: "tx_2b3c4d5e6f7g8h9i",
      },
    ],
  },
]

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  
  const { id } = await params;

  const product = await Product.findOne({ _id: id })

  if (!product) {
    return new Response('Product not found', { status: 404 })
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const productIndex = products.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const updateData = await request.json()
    const updatedProduct = {
      ...products[productIndex],
      ...updateData,
      // In a real implementation, we would update the blockchain record
      // and add a new transaction hash
      txHash: `tx_update_${Math.random().toString(36).substring(2, 10)}`,
    }

    products[productIndex] = updatedProduct

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const productIndex = products.findIndex((p) => p.id === params.id)

  if (productIndex === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  }

  // In a real implementation, we would update the blockchain to mark the product as deleted
  // For demo purposes, we'll just remove it from our array
  const deletedProduct = products.splice(productIndex, 1)[0]

  return NextResponse.json({ message: "Product deleted successfully", product: deletedProduct })
}
