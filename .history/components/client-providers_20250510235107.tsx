"use client"

import React from "react"
import { MeshProvider } from "@meshsdk/react"
import { WalletProvider } from "@/context/wallet-context"

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <MeshProvider>
      <WalletProvider>
        {children}
      </WalletProvider>
    </MeshProvider>
  )
}