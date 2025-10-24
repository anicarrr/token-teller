'use client'

import { Button } from '@/components/ui/button'
import { Header } from '@/components/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mystical-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The cosmic forces could not locate this page in the digital realm.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="mystical-gradient text-white"
        >
          Return to Oracle
        </Button>
      </div>
    </div>
  )
}