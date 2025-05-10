"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type WalletContextType = {
  walletAddress: string | null
  isConnected: boolean
  walletType: string | null
  balance: number | null
  connectWallet: (walletType: string) => Promise<void>
  disconnectWallet: () => void
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if wallet is already connected on page load
  useEffect(() => {
    const savedWalletType = localStorage.getItem("walletType")
    const savedWalletAddress = localStorage.getItem("walletAddress")
    // convert string if address is addr1qasdasd to addr...asd
    const savedBalance = localStorage.getItem("balance")

    if (savedWalletType && savedWalletAddress) {
      setWalletType(savedWalletType)
      setWalletAddress(savedWalletAddress)
      setBalance(savedBalance[0].quantity)
    }
  }, [])

  const connectWallet = async (type: string, address: string) => {
    setIsLoading(true)
    try {
      // In a real implementation, this would use the actual Cardano wallet APIs
      // For demo purposes, we'll simulate a connection
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay

      // Generate a mock wallet address based on the wallet type
      const mockAddress = address;

      setWalletAddress(mockAddress)
      setWalletType(type)

      // Save to localStorage for persistence
      localStorage.setItem("walletType", type)
      localStorage.setItem("walletAddress", mockAddress)


      // In a real implementation, we would also authenticate with the backend
      // by sending the wallet address and a signed message
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setWalletType(null)
    setBalance(null)
    localStorage.removeItem("walletType")
    localStorage.removeItem("walletAddress")
    localStorage.removeItem("balance")
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isConnected: !!walletAddress,
        walletType,
        balance,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
