"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreHorizontal, QrCode, Pencil, Trash2 } from "lucide-react"

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Organic Rice",
    type: "Grain",
    date: "2023-04-15",
    status: "Active",
    quantity: "500 kg",
    location: "Farm A",
    txHash: "tx_8f7d6c5e4b3a2c1d",
  },
  {
    id: "2",
    name: "Fresh Tomatoes",
    type: "Vegetable",
    date: "2023-04-12",
    status: "In Transit",
    quantity: "200 kg",
    location: "Distribution Center",
    txHash: "tx_1a2b3c4d5e6f7g8h",
  },
  {
    id: "3",
    name: "Coffee Beans",
    type: "Beans",
    date: "2023-04-10",
    status: "Active",
    quantity: "150 kg",
    location: "Farm B",
    txHash: "tx_9i8u7y6t5r4e3w2q",
  },
  {
    id: "4",
    name: "Honey",
    type: "Sweetener",
    date: "2023-04-05",
    status: "Sold",
    quantity: "50 kg",
    location: "Retail Store",
    txHash: "tx_2s3d4f5g6h7j8k9l",
  },
  {
    id: "5",
    name: "Organic Apples",
    type: "Fruit",
    date: "2023-04-02",
    status: "Active",
    quantity: "300 kg",
    location: "Farm A",
    txHash: "tx_0p9o8i7u6y5t4r3e",
  },
]

export default function ProductsPage() {
  const router = useRouter()
  const [mockProducts, setMockProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products")
      const data = await response.json()
      setMockProducts(data)
      console.log(data)
    }
    fetchProducts()
  }, [])

  // Filter products based on search term and filters
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesType = typeFilter === "all" || product.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">Manage and track your agricultural products.</p>
        </div>
        <Button asChild>
          <Link href="/products/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Product Filters</CardTitle>
          <CardDescription>Filter and search your products.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by type" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Grain">Grain</SelectItem>
                <SelectItem value="Vegetable">Vegetable</SelectItem>
                <SelectItem value="Fruit">Fruit</SelectItem>
                <SelectItem value="Beans">Beans</SelectItem>
                <SelectItem value="Sweetener">Sweetener</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        <div className="grid grid-cols-1 md:grid-cols-7 p-4 text-sm font-medium">
          <div className="md:col-span-2">Name</div>
          <div className="hidden md:block">Type</div>
          <div className="hidden md:block">Quantity</div>
          <div className="hidden md:block">Location</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="grid grid-cols-1 md:grid-cols-7 items-center p-4 text-sm">
                <div className="md:col-span-2 font-medium">{product.name}</div>
                <div className="hidden md:block">{product.type}</div>
                <div className="hidden md:block">{product.quantity}</div>
                <div className="hidden md:block">{product.location}</div>
                <div>
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
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link href={`/products/${product._id}`}>
                      <QrCode className="h-4 w-4" />
                      <span className="sr-only">View QR</span>
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/products/${product._id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/edit/${product._id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Product
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/products/transport/${product._id}`}>Update Status</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
