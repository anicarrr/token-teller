'use client'

import { WalletConnect } from '@/components/WalletConnect'

// export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-8 px-4 bg-white dark:bg-black rounded-lg shadow-lg">
        <WalletConnect />
      </main>
    </div>
  );
}
