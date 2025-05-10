"use client"

import React from "react"
import { useState, useEffect, type ReactNode } from "react"

type WalletContextType = {
  walletAddress: string | null
  isConnected: boolean
  walletType: string | null
  balance: number | null
  connectWallet: (walletType: string, address: string) => Promise<void>
  disconnectWallet: () => void
  isLoading: boolean
}

// Use React.createContext explicitly instead of direct import
const WalletContext = React.createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if wallet is already connected on page load
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const savedWalletType = localStorage.getItem("walletType")
      const savedWalletAddress = localStorage.getItem("walletAddress")
      const savedBalance = localStorage.getItem("balance")

      if (savedWalletType && savedWalletAddress) {
        setWalletType(savedWalletType)
        setWalletAddress(savedWalletAddress)
        if (savedBalance) {
          try {
            const balanceData = JSON.parse(savedBalance)
            setBalance(balanceData[0]?.quantity || null)
          } catch (e) {
            console.error("Error parsing balance data", e)
          }
        }
      }
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
      if (typeof window !== 'undefined') {
        localStorage.setItem("walletType", type)
        localStorage.setItem("walletAddress", mockAddress)
      }

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
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem("walletType")
      localStorage.removeItem("walletAddress")
      localStorage.removeItem("balance")
    }
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
  // Use React.useContext explicitly
  const context = React.useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

// Alias export for compatibility if you're using useWallet1 elsewhere
export const useWallet1 = useWallet;