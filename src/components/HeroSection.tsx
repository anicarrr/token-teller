'use client'

import { Button } from '@/components/ui/button'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { WalletConnect } from './WalletConnect'
import { useState } from 'react'

export function HeroSection() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const [showWalletConnect, setShowWalletConnect] = useState(false)

  const handleGetFortune = () => {
    if (isConnected) {
      router.push('/fortune')
    } else {
      setShowWalletConnect(true)
    }
  }

  return (
    <div className="min-h-(--hero-height) flex items-center justify-center hero-bg">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold mystical-text leading-tight">
            Unveil Your
            <br />
            Crypto Destiny
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover what the ancient wisdom of BaZi reveals about your digital fortune. 
            Connect your wallet and let the cosmic forces guide your crypto journey.
          </p>

          <div className="pt-8">
            {showWalletConnect && !isConnected ? (
              <div className="max-w-md mx-auto">
                <WalletConnect />
              </div>
            ) : (
              <Button 
                onClick={handleGetFortune}
                size="lg" 
                className="mystical-gradient text-white text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-200"
              >
                Tell me my fortune!
              </Button>
            )}
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
              <h3 className="font-semibold">Ancient Wisdom</h3>
              <p className="text-sm text-muted-foreground">
                BaZi fortune telling meets modern crypto analysis
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">⛓️</span>
              </div>
              <h3 className="font-semibold">Multi-Chain</h3>
              <p className="text-sm text-muted-foreground">
                Support for Ethereum and ZetaChain networks
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold">AI Powered</h3>
              <p className="text-sm text-muted-foreground">
                Personalized insights based on your portfolio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}