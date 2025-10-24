'use client'

import { useAccount, useConnect } from 'wagmi'
import { Button } from '@/components/ui/button'

export function WalletConnect() {
  const { isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()

  if (isConnected) {
    return null
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="mystical-gradient text-white hover:scale-105 transition-transform duration-200"
        >
          Connect {connector.name}
        </Button>
      ))}
    </div>
  )
}