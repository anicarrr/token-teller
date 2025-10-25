'use client';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { WagmiProvider } from 'wagmi';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { config } from '@/lib/wagmi';
import dynamic from 'next/dynamic';

// Create a client-only wrapper for the providers
const ClientOnlyProviders = dynamic(
  () => Promise.resolve(({ children }: { children: React.ReactNode }) => (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
        walletConnectors: [EthereumWalletConnectors]
      }}
    >
      <WagmiProvider config={config}>
        <DynamicWagmiConnector>
          {children}
        </DynamicWagmiConnector>
      </WagmiProvider>
    </DynamicContextProvider>
  )),
  { ssr: false }
);

export default function DynamicWallet({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnlyProviders>
      {children}
    </ClientOnlyProviders>
  );
}
