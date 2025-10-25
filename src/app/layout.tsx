'use client';

import { Geist, Geist_Mono, Orbitron } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './globals.css';
import DynamicWallet from '@/components/DynamicWallet';
import { AppProvider } from '@/contexts/AppContext';
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin']
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${orbitron.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppProvider>
          <QueryClientProvider client={queryClient}>
            <DynamicWallet>{children}</DynamicWallet>
          </QueryClientProvider>
        </AppProvider>
      </body>
    </html>
  );
}
