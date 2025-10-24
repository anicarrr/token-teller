'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Wallet, LogOut, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useBalance } from '@/hooks/useBalance'
import { WalletConnect } from './WalletConnect'

export function Header() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const {
    data: balanceData,
    isLoading: loading,
    error,
    refetch
  } = useBalance({
    address,
    chainIds: [11155111, 7001], // Ethereum Sepolia and ZetaChain testnet
    enabled: isConnected && !!address
  })

  const balances = balanceData?.balances || []
  const totalUsdValue = balanceData?.totalUsdValue || 0

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 h-[70px]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold mystical-text cursor-pointer" onClick={() => window.location.href = '/'}>
            Token Teller
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <>
              <Button
                onClick={() => window.location.href = '/fortune'}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                Fortune
              </Button>
              <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Wallet Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {address?.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </p>
                        <p className="text-xs text-muted-foreground">Connected</p>
                      </div>
                    </div>

                    {loading ? (
                      <p className="text-sm text-muted-foreground">Loading balances...</p>
                    ) : error ? (
                      <div className="space-y-2">
                        <p className="text-sm text-red-500">Failed to load balances</p>
                        <Button
                          onClick={() => refetch()}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Value</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="mystical-gradient text-white">
                              ${totalUsdValue.toFixed(2)}
                            </Badge>
                            <Button
                              onClick={() => refetch()}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Token Balances</h4>
                          {balances.filter(token => parseFloat(token.balance) > 0).map((token, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <div>
                                <span>{token.symbol}</span>
                                <p className="text-xs text-muted-foreground">{token.chainName}</p>
                              </div>
                              <div className="text-right">
                                <p>{parseFloat(token.balance).toFixed(4)}</p>
                                {token.usdValue && (
                                  <p className="text-xs text-muted-foreground">
                                    ${token.usdValue.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                          {balances.filter(token => parseFloat(token.balance) > 0).length === 0 && (
                            <p className="text-sm text-muted-foreground">No tokens found</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => disconnect()}
                      variant="destructive"
                      size="sm"
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <WalletConnect />
          )}
        </div>
      </div>
    </header>
  )
}