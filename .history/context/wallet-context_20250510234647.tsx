"use client"

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet as useMeshWallet } from '@meshsdk/react';

// Create the context with default values
const WalletContext = createContext({
  isConnected: false,
  walletAddress: '',
  connect: async () => {},
  disconnect: () => {},
});

export const useWallet1 = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Use the MeshSDK wallet if needed
  const meshWallet = useMeshWallet();
  
  // Connect function that works with MeshSDK
  const connect = async () => {
    try {
      // Your connection logic here
      // You might use MeshSDK's wallet methods
      const connected = await meshWallet.connect();
      if (connected) {
        const addresses = await meshWallet.getUsedAddresses();
        setWalletAddress(addresses[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  const disconnect = () => {
    meshWallet.disconnect();
    setIsConnected(false);
    setWalletAddress('');
  };
  
  // Check if already connected when the component mounts
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await meshWallet.isConnected();
      if (connected) {
        const addresses = await meshWallet.getUsedAddresses();
        setWalletAddress(addresses[0]);
        setIsConnected(true);
      }
    };
    
    checkConnection();
  }, [meshWallet]);
  
  return (
    <WalletContext.Provider value={{
      isConnected,
      walletAddress,
      connect,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  );
};
