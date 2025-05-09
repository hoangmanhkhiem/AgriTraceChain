"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, ExternalLink, Search } from "lucide-react"
import { blockchainService } from "@/services/blockchain-service"

// Mock transaction data
const mockTransactions = [
  {
    id: "tx_1a2b3c4d",
    type: "Payment Received",
    date: "2023-04-18",
    amount: "+120.00",
    status: "Confirmed",
    confirmations: 42,
    productId: "1",
    counterparty: "addr1q7g...3t5",
  },
  {
    id: "tx_2b3c4d5e",
    type: "Product Registration",
    date: "2023-04-15",
    amount: "-2.50",
    status: "Confirmed",
    confirmations: 56,
    productId: "1",
    counterparty: "Self",
  },
  {
    id: "tx_3c4d5e6f",
    type: "Transport Update",
    date: "2023-04-16",
    amount: "-1.25",
    status: "Confirmed",
    confirmations: 48,
    productId: "1",
    counterparty: "Self",
  },
  {
    id: "tx_4d5e6f7g",
    type: "Payment Received",
    date: "2023-04-10",
    amount: "+85.75",
    status: "Confirmed",
    confirmations: 102,
    productId: "2",
    counterparty: "addr1q8h...4u6",
  },
  {
    id: "tx_5e6f7g8h",
    type: "Product Registration",
    date: "2023-04-08",
    amount: "-2.50",
    status: "Confirmed",
    confirmations: 120,
    productId: "2",
    counterparty: "Self",
  },
]

export default function TransactionsPage() {
  const router = useRouter()
  const { isConnected } = useWallet()
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [transactions, setTransactions] = useState(mockTransactions)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to connect wallet page if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/connect-wallet")
    }
  }, [isConnected, router])

  if (!isConnected) {
    return null
  }

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.counterparty.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || tx.type === typeFilter

    return matchesSearch && matchesType
  })

  const handleViewDetails = async (txId: string) => {
    setIsLoading(true)
    try {
      // In a real implementation, this would fetch transaction details from the blockchain
      const txDetails = await blockchainService.getTransactionDetails(txId)
      setSelectedTransaction(txDetails)
    } catch (error) {
      console.error("Error fetching transaction details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">View and manage your blockchain transactions.</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8 min-w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Payment Received">Payments</option>
              <option value="Product Registration">Registrations</option>
              <option value="Transport Update">Transport Updates</option>
            </select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-6 p-4 text-sm font-medium">
              <div className="md:col-span-2">Transaction ID</div>
              <div className="hidden md:block">Type</div>
              <div className="hidden md:block">Date</div>
              <div>Status</div>
              <div className="text-right">Amount (₳)</div>
            </div>
            <div className="divide-y">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="grid grid-cols-1 md:grid-cols-6 items-center p-4 text-sm hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewDetails(tx.id)}
                  >
                    <div className="md:col-span-2 font-medium">{tx.id}</div>
                    <div className="hidden md:block">{tx.type}</div>
                    <div className="hidden md:block flex items-center">
                      <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                      {tx.date}
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          tx.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : tx.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                    <div className={`text-right ${tx.amount.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {tx.amount}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No transactions found matching your filters.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incoming" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-6 p-4 text-sm font-medium">
              <div className="md:col-span-2">Transaction ID</div>
              <div className="hidden md:block">Type</div>
              <div className="hidden md:block">Date</div>
              <div>Status</div>
              <div className="text-right">Amount (₳)</div>
            </div>
            <div className="divide-y">
              {filteredTransactions.filter((tx) => tx.amount.startsWith("+")).length > 0 ? (
                filteredTransactions
                  .filter((tx) => tx.amount.startsWith("+"))
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="grid grid-cols-1 md:grid-cols-6 items-center p-4 text-sm hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewDetails(tx.id)}
                    >
                      <div className="md:col-span-2 font-medium">{tx.id}</div>
                      <div className="hidden md:block">{tx.type}</div>
                      <div className="hidden md:block flex items-center">
                        <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                        {tx.date}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            tx.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-right text-green-600">{tx.amount}</div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No incoming transactions found.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="outgoing" className="space-y-4">
          <div className="rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-6 p-4 text-sm font-medium">
              <div className="md:col-span-2">Transaction ID</div>
              <div className="hidden md:block">Type</div>
              <div className="hidden md:block">Date</div>
              <div>Status</div>
              <div className="text-right">Amount (₳)</div>
            </div>
            <div className="divide-y">
              {filteredTransactions.filter((tx) => tx.amount.startsWith("-")).length > 0 ? (
                filteredTransactions
                  .filter((tx) => tx.amount.startsWith("-"))
                  .map((tx) => (
                    <div
                      key={tx.id}
                      className="grid grid-cols-1 md:grid-cols-6 items-center p-4 text-sm hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewDetails(tx.id)}
                    >
                      <div className="md:col-span-2 font-medium">{tx.id}</div>
                      <div className="hidden md:block">{tx.type}</div>
                      <div className="hidden md:block flex items-center">
                        <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                        {tx.date}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            tx.status === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-right text-red-600">{tx.amount}</div>
                    </div>
                  ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No outgoing transactions found.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedTransaction && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
            <CardDescription>Detailed information about the selected transaction.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Transaction Hash</p>
                <p className="text-sm font-mono">{selectedTransaction.txHash}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Block Height</p>
                <p className="text-sm">{selectedTransaction.blockHeight}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Timestamp</p>
                <p className="text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                  {new Date(selectedTransaction.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Confirmations</p>
                <p className="text-sm">{selectedTransaction.confirmations}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Fee</p>
                <p className="text-sm">{selectedTransaction.fee} ₳</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Inputs</h3>
              <div className="rounded-md border p-2">
                {selectedTransaction.inputs.map((input: any, index: number) => (
                  <div key={index} className="text-sm py-1 flex justify-between">
                    <span className="font-mono text-xs truncate">{input.address}</span>
                    <span>{input.amount} ₳</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Outputs</h3>
              <div className="rounded-md border p-2">
                {selectedTransaction.outputs.map((output: any, index: number) => (
                  <div key={index} className="text-sm py-1 flex justify-between">
                    <span className="font-mono text-xs truncate">{output.address}</span>
                    <span>{output.amount} ₳</span>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full" asChild>
              <a
                href={`https://explorer.cardano.org/tx/${selectedTransaction.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Blockchain Explorer
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
