"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Package, QrCode, ShoppingCart, Plus, Leaf } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { isConnected, walletAddress, walletType, balance } = useWallet()
  const [mockProducts, setMockProducts] = useState([])
  const [dataSize, setDataSize] = useState(0);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products")
      const data = await response.json()
      setMockProducts(data)
      setDataSize(data.length)
      console.log(data)
    }
    fetchProducts()
  }, [])

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Manage your agricultural products and track their journey.</p>
        </div>
        <Button asChild>
          <Link href="/products/parameters">
            <Plus className="mr-2 h-4 w-4" />
            Add Product Parameters
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSize}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">+1 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Scans</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">+22% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
          <div className="text-2xl font-bold">
            {balance ? balance : "0.00"} ₳
          </div>
            <p className="text-xs text-muted-foreground">
              {walletAddress
                ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} Wallet`
                : 'No Wallet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Recent Products</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Products</CardTitle>
              <CardDescription>Your recently added agricultural products.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 p-4 text-sm font-medium">
                  <div>Name</div>
                  <div>Type</div>
                  <div>Date Added</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {mockProducts.map((product: any) => (
                    <div key={product._id} className="grid grid-cols-5 items-center p-4 text-sm">
                      <div className="font-medium">{product.name}</div>
                      <div>{product.type}</div>
                      <div>{product.createdAt}</div>
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
                      <div className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/products/${product._id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/products">View All Products</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your recent blockchain transactions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-4 p-4 text-sm font-medium">
                  <div>Transaction ID</div>
                  <div>Type</div>
                  <div>Date</div>
                  <div className="text-right">Amount (₳)</div>
                </div>
                <div className="divide-y">
                  {[
                    {
                      id: "tx_1",
                      type: "Payment Received",
                      date: "2023-04-18",
                      amount: "+120.00",
                    },
                    {
                      id: "tx_2",
                      type: "Product Registration",
                      date: "2023-04-15",
                      amount: "-2.50",
                    },
                    {
                      id: "tx_3",
                      type: "Payment Received",
                      date: "2023-04-10",
                      amount: "+85.75",
                    },
                  ].map((tx) => (
                    <div key={tx.id} className="grid grid-cols-4 items-center p-4 text-sm">
                      <div className="font-medium">{tx.id.substring(0, 8)}...</div>
                      <div>{tx.type}</div>
                      <div>{tx.date}</div>
                      <div className={`text-right ${tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                        {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/transactions">View All Transactions</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Product performance and scan statistics.</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-lg font-medium">Analytics Visualization</h3>
                <p className="text-sm text-muted-foreground">Detailed analytics charts would be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
