'use client';

import { http, createConfig } from 'wagmi'
import { sepolia } from 'viem/chains'
import { defineChain } from 'viem'

const zetaChainTestnet = defineChain({
  id: 7001,
  name: 'ZetaChain Testnet',
  network: 'zetachain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Zeta',
    symbol: 'ZETA',
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ZETACHAIN_RPC_URL!],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.testnet.zetachain.com' },
  },
  testnet: true,
})

export const config = createConfig({
  chains: [sepolia, zetaChainTestnet],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL),
    [zetaChainTestnet.id]: http(process.env.NEXT_PUBLIC_ZETACHAIN_RPC_URL),
  },
})