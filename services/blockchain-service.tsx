"use client"

import React from "react"
import { toast } from "@/components/ui/use-toast"
import * as bip39 from "bip39";
import { decrypt, encrypt } from "@/utils/crypto";
import {
  BlockfrostProvider,
  MeshTxBuilder,
  MeshWallet,
  serializePlutusScript,
  UTxO,
  deserializeDatum,
  BrowserWallet,
  deserializeAddress

} from "@meshsdk/core";
// This is a mock service that simulates blockchain interactions
// In a real implementation, this would use Cardano SDK libraries
export const blockchainProvider = new BlockfrostProvider('preprod2DQWsQjqnzLW9swoBQujfKBIFyYILBiL');

export type ProductData = {
  id?: string
  name: string
  type: string
  quantity: string
  unit: string
  location: string
  description: string
  harvestDate: string
  price: string
  certifications?: string[]
}

export type TransportUpdate = {
  productId: string
  newStatus: string
  newLocation: string
  handler: string
}

export type PaymentData = {
  productId: string
  buyerAddress: string
  sellerAddress: string
  amount: number
}

class BlockchainService {
  // Connect to wallet
  async connectWallet(walletType: string): Promise<{ address: string; balance: number }> {
    try {
      console.log(`Connecting to ${walletType} wallet...`)
      // In a real implementation, this would use the Cardano wallet connector
      // For demo purposes, we'll simulate a connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate a mock wallet address based on the wallet type
      const mockAddress = `addr1q${walletType.toLowerCase()}${Math.random().toString(36).substring(2, 10)}...`
      const mockBalance = Math.random() * 1000

      return {
        address: mockAddress,
        balance: mockBalance,
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw new Error("Failed to connect wallet")
    }
  }

  // Register a new product on the blockchain
  async registerProduct(): Promise<{ mnemonic: string[] }> {
    try {
      // Tạo 24 từ khóa mnemonic (entropy 256 bits)
      const mnemonic = bip39.generateMnemonic(256); // 24 từ
      // const mnemonic = MeshWallet.brew();
      // console.log(mnemonic)
      // Convert mnemonic to string
      const mnemonicString = mnemonic.toString();
      console.log(mnemonicString)
      const mnemonicWords = mnemonicString.split(" ");
      // Convert mnemonicWords to string[]
      const mnemonicWordsArray = mnemonicWords.map(word => word.trim());

      console.log("🌐 Ví mới đã được tạo:");
      console.log("🧠 24 từ khóa bảo mật (mnemonic):", mnemonicWords.join(" "));

      const encryptedMnemonic = encrypt(mnemonicString);
      console.log("🧠 24 từ khóa bảo mật (mnemonic):", encryptedMnemonic);

      const decryptedMnemonic = decrypt(encryptedMnemonic);
      console.log("🧠 24 từ khóa bảo mật (mnemonic):", decryptedMnemonic);  
      const walletA = new MeshWallet({
          networkId: 0,
          fetcher: blockchainProvider, 
          submitter: blockchainProvider, 
          key: {
              type: 'mnemonic', 
              words: mnemonicWordsArray,
          },
      });

      // Lay dia chi
      const changeAddress = await walletA.getChangeAddress();
      console.log("🌐 Địa chỉ ví mới:", changeAddress); 

      return {
        mnemonic: mnemonicWords,
      };
    } catch (error) {
      console.error("❌ Lỗi khi tạo ví mới:", error);
      throw new Error("Không thể tạo ví mới");
    }
  }

  // Update product transport status
  async updateTransportStatus(transportData: TransportUpdate, walletAddress: string): Promise<{ txHash: string }> {
    try {
      console.log("Updating transport status on blockchain:", transportData)
      // In a real implementation, this would create a transaction using the Cardano SDK
      // and submit it to the blockchain using the supply-chain.ak contract

      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate mock transaction hash
      const txHash = `tx_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`

      return {
        txHash,
      }
    } catch (error) {
      console.error("Error updating transport status:", error)
      throw new Error("Failed to update transport status on blockchain")
    }
  }

  // Process payment for a product
  async processPayment(paymentData: PaymentData): Promise<{ txHash: string; success: boolean }> {
    try {
      console.log("Processing payment on blockchain:", paymentData)
      // In a real implementation, this would create a transaction using the Cardano SDK
      // and submit it to the blockchain using the payment.ak contract

      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock transaction hash
      const txHash = `tx_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`

      return {
        txHash,
        success: true,
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      throw new Error("Failed to process payment on blockchain")
    }
  }

  // Verify a product using its ID or QR code
  async verifyProduct(productIdOrQR: string): Promise<{
    isVerified: boolean
    productData: any
    transportHistory: any[]
  }> {
    try {
      console.log("Verifying product on blockchain:", productIdOrQR)
      // In a real implementation, this would query the blockchain for the product data
      // using the product ID or QR code

      // Simulate blockchain query delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, return mock data
      return {
        isVerified: true,
        productData: {
          id: productIdOrQR,
          name: "Organic Rice",
          type: "Grain",
          quantity: "500 kg",
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
        },
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
      }
    } catch (error) {
      console.error("Error verifying product:", error)
      throw new Error("Failed to verify product on blockchain")
    }
  }

  // Get transaction details
  async getTransactionDetails(txHash: string): Promise<any> {
    try {
      console.log("Getting transaction details from blockchain:", txHash)
      // In a real implementation, this would query the blockchain for the transaction details

      // Simulate blockchain query delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // For demo purposes, return mock data
      return {
        txHash,
        blockHeight: Math.floor(Math.random() * 1000000) + 8000000,
        timestamp: new Date().toISOString(),
        confirmations: Math.floor(Math.random() * 100) + 1,
        fee: Math.random() * 1,
        inputs: [
          {
            address: "addr1q...",
            amount: Math.random() * 100,
          },
        ],
        outputs: [
          {
            address: "addr1q...",
            amount: Math.random() * 100,
          },
        ],
      }
    } catch (error) {
      console.error("Error getting transaction details:", error)
      throw new Error("Failed to get transaction details from blockchain")
    }
  }

  // Helper method to show toast notifications for blockchain operations
  showBlockchainToast(type: "success" | "error" | "loading", title: string, description: string, txHash?: string) {
    if (type === "success") {
      toast({
        title,
        description: (
          <div>
            {description}
            {txHash && (
              <p className="mt-2 text-xs font-mono">
                Transaction Hash: <span className="font-semibold">{txHash}</span>
              </p>
            )}
          </div>
        )
      })
    } else if (type === "error") {
      toast({
        title,
        description,
        variant: "destructive",
      })
    } else if (type === "loading") {
      toast({
        title,
        description,
      })
    }
  }
}

// Export as singleton
export const blockchainService = new BlockchainService()
