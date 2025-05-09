'use client';

import React, { useEffect, useState } from 'react';
import { BrowserWallet, Wallet } from '@meshsdk/core';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet as WalletIcon } from 'lucide-react';
import { useWallet } from '@/context/wallet-context';

export default function Login() {
  const router = useRouter();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [walletAvailable, setWalletAvailable] = useState<{ id: string; name: string; icon: string }[] | undefined>();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null); 
  const { connectWallet } = useWallet();

  useEffect(() => {
    async function getW() {
      const availableWallets = await BrowserWallet.getAvailableWallets();
      setWalletAvailable(availableWallets);
    }
    getW();
  }, []);

  async function connectWallet2() {
    if (!selectedWallet) return;
    try {
      setLoading(true);
      const walletInstance = await BrowserWallet.enable(selectedWallet);
      setWallet(walletInstance);

      const address = await walletInstance.getChangeAddress();
      setWalletAddress(address);
      setConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Please install a compatible wallet like Nami or Eternl!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const authenticate = async () => {
      if (connected && wallet) {
        setLoading(true);
        try {
          const { data: { nonce } } = await axios.get(`/api/login/getNonce?addressWallet=${walletAddress}`);
          const signedMessage = await wallet.signData(nonce);
          const { data: { accessToken } } = await axios.post('/api/login/verifySignature', {
            addressWallet: walletAddress,
            signature: signedMessage,
            nonce: nonce,
          });

          console.log('Access Token:', accessToken);

          localStorage.setItem('accessToken', accessToken);

          const response = await axios.get('/api/checkAddressWallet', {
            params: { addressWallet: walletAddress },
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          });

          console.log('Response:', response.data);
          const tien = await wallet.getBalance();
          localStorage.setItem('balance', tien);
          console.log('Tien:', tien);

          if (response.data.role != undefined) {
            connectWallet("lace", walletAddress);
            console.log('Role:', response.data.role);
            if(response.data.role == 0) {
              router.push('/farm/dashboard');
            } else if(response.data.role == 1) {
              router.push('/logistics/dashboard');
            } else if(response.data.role == 2) {
              router.push('/product/dashboard');
            }
          } else {
            alert('Account not registered. Please contact the administrator to create a new account.');
            router.push('/');
          }
        } catch (error) {
          setConnected(false);
          console.error('Authentication failed:', error);
          alert('Authentication failed!');
        } finally {
          setLoading(false);
        }
      }
    };

    authenticate();
  }, [connected, wallet, walletAddress, router]);

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          <CardDescription>Connect your Cardano wallet to access the AgriTraceChain platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {walletAvailable?.map((wallet) => (
              <Button
                key={wallet.id}
                variant={selectedWallet === wallet.id ? 'default' : 'outline'}
                className="flex justify-start h-16"
                onClick={() => setSelectedWallet(wallet.id)}
              >
                <div className="flex items-center w-full gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <img src={wallet.icon} alt={wallet.name} className="h-6 w-6" />
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
                Connect Wallet
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
