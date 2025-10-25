'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useBalance } from '@/hooks/useBalance';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { ChainIdList } from '@/enums';
import { useAppContext } from '@/contexts/AppContext';

const CHAIN_OPTIONS = [
  { id: ChainIdList.EthereumSepolia, name: 'Ethereum Sepolia', shortName: 'Sepolia' },
  { id: ChainIdList.ZetaChainTestnet, name: 'ZetaChain Testnet', shortName: 'ZetaChain' }
];

export function Header() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { handleLogOut } = useDynamicContext();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const { selectedChainId, setSelectedChainId, setSelectedChainName } = useAppContext();

  const {
    data: balanceData,
    isLoading: loading,
    error,
    refetch
  } = useBalance({
    address,
    chainIds: [selectedChainId], // Only fetch for selected chain
    enabled: isConnected && !!address
  });

  const getUserDisplay = () => {
    if (isConnected) {
      return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
    }
    return 'Connect Wallet';
  };

  const balances = balanceData?.balances || [];
  const totalUsdValue = balanceData?.totalUsdValue || 0;
  const selectedChain = CHAIN_OPTIONS.find((chain) => chain.id === selectedChainId);

  const handleChainSelect = (chainId: number) => {
    setSelectedChainId(chainId);
    setSelectedChainName(selectedChain?.name || '');
    setShowChainDropdown(false);
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 h-[70px]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold mystical-text cursor-pointer" onClick={() => (window.location.href = '/')}>
            Token Teller
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {isConnected ? (
            <>
              <Button
                onClick={() => (window.location.href = '/fortune')}
                variant="outline"
                size="sm"
                className="fortune-button cursor-pointer text-white border-none hover:scale-105 transition-transform duration-300 flex items-center space-x-1"
              >
                <Sparkles className="h-4 w-4" />
                <span>Fortune</span>
              </Button>

              {/* MODAL */}
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
                        <AvatarFallback>{address?.slice(2, 4).toUpperCase()}</AvatarFallback>
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
                        <Button onClick={() => refetch()} variant="outline" size="sm" className="w-full">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Chain Selector */}
                        <div className="space-y-2">
                          <span className="text-sm font-medium">Network</span>
                          <div className="relative">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-between"
                              onClick={() => setShowChainDropdown(!showChainDropdown)}
                            >
                              <span>{selectedChain?.name}</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                            {showChainDropdown && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50">
                                {CHAIN_OPTIONS.map((chain) => (
                                  <button
                                    key={chain.id}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors"
                                    onClick={() => handleChainSelect(chain.id)}
                                  >
                                    {chain.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Value USD</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="mystical-gradient text-white">
                              ${totalUsdValue.toFixed(2)}
                            </Badge>
                            <Button onClick={() => refetch()} variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Token Balances</h4>
                          {balances
                            .filter((token) => parseFloat(token.balance) > 0)
                            .map((token, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <div>
                                  <span>{token.symbol}</span>
                                  <p className="text-xs text-muted-foreground">{token.chainName}</p>
                                </div>
                                <div className="text-right">
                                  <p>{parseFloat(token.balance).toFixed(4)}</p>
                                  {token.usdValue && (
                                    <p className="text-xs text-muted-foreground">${token.usdValue.toFixed(2)}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          {balances.filter((token) => parseFloat(token.balance) > 0).length === 0 && (
                            <p className="text-sm text-muted-foreground">No tokens found on {selectedChain?.shortName}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => {
                        handleLogOut();
                        disconnect();
                      }}
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
              <Button variant="secondary">{selectedChain?.name}</Button>
            </>
          ) : (
            <DynamicWidget
              innerButtonComponent={
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg mystical-gradient text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm`}
                >
                  {getUserDisplay()}
                </div>
              }
              buttonClassName="!bg-transparent !p-0"
            />
          )}
        </div>
      </div>
    </header>
  );
}
