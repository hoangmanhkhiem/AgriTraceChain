import { randomBytes } from 'crypto';

export function generateWallet() {
  // Demo: sinh keypair ngẫu nhiên, thực tế dùng web3/ethers
  const privateKey = randomBytes(32).toString('hex');
  const publicKey = randomBytes(64).toString('hex');
  const address = '0x' + randomBytes(20).toString('hex');
  return { privateKey, publicKey, address };
}