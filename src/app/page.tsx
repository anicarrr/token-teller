'use client'

import { Header } from '@/components/Header'
import { HeroSection } from '@/components/HeroSection'

// export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
    </div>
  );
}
