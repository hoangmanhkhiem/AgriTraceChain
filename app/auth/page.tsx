"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { BrowserWallet, type Wallet } from "@meshsdk/core"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, WalletIcon, User, Mail, Phone, Home } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { set } from "mongoose"

export default function Register() {
  const router = useRouter()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [connected, setConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [walletAvailable, setWalletAvailable] = useState<{ id: string; name: string; icon: string }[] | undefined>()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const { connectWallet } = useWallet()
  const [signatureVerified, setSignatureVerified] = useState<boolean>(false)
  const [accessToken, setAccessToken] = useState<string>("")
  const [userFormLoading, setUserFormLoading] = useState<boolean>(false)

  // User information form state
  const [userInfo, setUserInfo] = useState({
    fullName: "",
    email: "",
    password: ""
  })

  useEffect(() => {
    async function getW() {
      const availableWallets = await BrowserWallet.getAvailableWallets()
      setWalletAvailable(availableWallets)
    }
    getW()
  }, [])

  async function connectWallet2() {
    if (!selectedWallet) return
    try {
      setLoading(true)
      const walletInstance = await BrowserWallet.enable(selectedWallet)
      setWallet(walletInstance)

      const address = await walletInstance.getChangeAddress()
      setWalletAddress(address)
      setConnected(true)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Please install a compatible wallet like Nami or Eternl!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const registerWallet = async () => {
      if (connected && wallet) {
        setLoading(true)
        try {
          console.log("Connected wallet address:", walletAddress)
          const {
            data: { nonce },
          } = await axios.get(`/api/login/getNonce?addressWallet=${walletAddress}`)
          const signedMessage = await wallet.signData(nonce)
          const {data: { accessToken }} = await axios.post("/api/login/verifySignature", {
            addressWallet: walletAddress,
            signature: signedMessage,
            nonce: nonce,
          })

          localStorage.setItem('accessToken', accessToken);
          setAccessToken(accessToken)

          try {
              // Check if the wallet address is already registered
            const response = await axios.get("/api/farm2/create", {
                params: { walletAddress: walletAddress },
                headers: { Authorization: `Bearer ${accessToken}` },
            })

            if (response.status === 200) {
               const tien = await wallet.getBalance()
          localStorage.setItem("balance", tien)
          connectWallet("lace", walletAddress)
                // Redirect to farm page if already registered
                router.push("/farm/dashboard")
                return
            }
          } catch (error) {
            console.log("OKE");
          }
          const tien = await wallet.getBalance()
          localStorage.setItem("balance", tien)
          connectWallet("lace", walletAddress)
          // Check if the wallet address is already registered    


          // Set the access token and mark signature as verified
          setAccessToken(accessToken)
          setSignatureVerified(true)
        } catch (error) {
          console.error("Registration failed:", error)
          alert("Registration failed! Please try again.")
        } finally {
          setLoading(false)
        }
      }
    }

    registerWallet()
  }, [connected, wallet, walletAddress, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUserInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUserFormLoading(true)

    console.log("User Info:", userInfo)
    console.log("Wallet Address:", walletAddress)

    try {
      // Send user information to your API
      await axios.post(
        "/api/farm2/create",
        {
          ...userInfo,
          walletAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      // Redirect to dashboard or home page after successful registration
      router.push("/farm/dashboard")
    } catch (error) {
      console.error("Failed to submit user information:", error)
      alert("Failed to submit user information. Please try again.")
    } finally {
      setUserFormLoading(false)
    }
  }

  // Render user information form if signature is verified
  if (signatureVerified) {
    return (
      <div className="container max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>Please provide your personal information to complete registration.</CardDescription>
          </CardHeader>
          <form onSubmit={handleUserInfoSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    className="pl-10"
                    value={userInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                    value={userInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="password"
                    name="password"
                    placeholder="*********"
                    className="pl-10"
                    value={userInfo.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={userFormLoading}>
                {userFormLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  // Render wallet connection UI if signature is not verified yet
  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register Your Wallet</CardTitle>
          <CardDescription>Connect your Cardano wallet to register for the AgriTraceChain platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {walletAvailable?.map((wallet) => (
              <Button
                key={wallet.id}
                variant={selectedWallet === wallet.id ? "default" : "outline"}
                className="flex justify-start h-16"
                onClick={() => setSelectedWallet(wallet.id)}
              >
                <div className="flex items-center w-full gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="h-6 w-6" />
                  </div>
                  <div className="font-medium">{wallet.name}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={connectWallet2} disabled={!selectedWallet || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <WalletIcon className="mr-2 h-4 w-4" />
                Connect & Register Wallet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
