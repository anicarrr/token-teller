'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'
import { config } from '@/lib/wagmi'
import { fetchTokenBalances, TokenBalance } from '@/lib/tokenFetcher'
import { Chat } from '@/components/Chat'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [balances, setBalances] = useState<TokenBalance[]>([])
  const [fortune, setFortune] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [fortuneLoading, setFortuneLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const chains = config.chains

  const handleFetchBalances = async () => {
    if (!address) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchTokenBalances(address, chainId)
      setBalances(data)
    } catch (error) {
      setError('Failed to fetch balances. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateFortune = async () => {
    if (!address) return
    setFortuneLoading(true)
    setError('')
    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chainId }),
      })
      const data = await response.json()
      if (data.fortune) {
        setFortune(data.fortune)
      } else {
        setError('Failed to generate fortune.')
      }
    } catch (error) {
      setError('Error generating fortune. Please try again.')
    } finally {
      setFortuneLoading(false)
    }
  }

  if (isConnected) {
    return (
      <div className="flex flex-col items-center space-y-4 w-full max-w-lg mx-auto px-4">
        <p className="text-center">Connected to: {address}</p>
        <p className="text-center">Current Chain: {chains.find(c => c.id === chainId)?.name} (ID: {chainId})</p>
        <div className="flex flex-wrap justify-center space-x-2">
          {chains.map((chain) => (
            <Button
              key={chain.id}
              onClick={() => switchChain({ chainId: chain.id })}
              variant={chainId === chain.id ? 'default' : 'outline'}
              className="mb-2"
            >
              {chain.name}
            </Button>
          ))}
        </div>
        <Button onClick={handleFetchBalances} disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Fetching...' : 'Fetch Token Balances'}
        </Button>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {balances.length > 0 && (
          <div className="w-full">
            <h3 className="text-center">Token Balances:</h3>
            <ul className="list-disc list-inside space-y-1">
              {balances.map((token, index) => (
                <li key={index} className="text-sm">
                  {token.symbol}: {token.balance} {token.usdValue ? `($${token.usdValue.toFixed(2)})` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button onClick={handleGenerateFortune} disabled={fortuneLoading || balances.length === 0} className="w-full sm:w-auto">
          {fortuneLoading ? 'Generating...' : 'Generate Fortune'}
        </Button>
        {fortune && (
          <div className="w-full p-4 border rounded bg-gray-50 dark:bg-gray-800">
            <h3 className="text-center">Your BaZi Fortune:</h3>
            <p className="text-sm">{fortune}</p>
          </div>
        )}
        {fortune && address && <Chat address={address} chainId={chainId} />}
        <Button onClick={() => disconnect()} className="w-full sm:w-auto">Disconnect</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2>Connect Your Wallet</h2>
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
        >
          {connector.name}
        </Button>
      ))}
    </div>
  )
}