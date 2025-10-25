import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { WagmiProvider } from 'wagmi';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { config } from '@/lib/wagmi';

export default function DynamicWallet({ children }: { children: React.ReactNode }) {
  return (
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
  );
}
