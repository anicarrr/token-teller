import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simplified header without client-side hooks */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 h-[70px]">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <h1 className="text-2xl font-bold mystical-text cursor-pointer">
                Token Teller
              </h1>
            </Link>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mystical-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The cosmic forces could not locate this page in the digital realm.
        </p>
        <Link href="/">
          <Button className="mystical-gradient text-white">
            Return to Oracle
          </Button>
        </Link>
      </div>
    </div>
  )
}