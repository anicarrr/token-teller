'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { useFortune } from '@/hooks/useFortune';
import { BirthDateForm } from '@/components/BirthDateForm';
import { MysticalImageLoader } from '@/components/MysticalImageLoader';
import { TypewriterText } from '@/components/TypewriterText';
import { RotatingLoadingText } from '@/components/RotatingLoadingText';
import { useAppContext } from '@/contexts/AppContext';
import { Chat } from '@/components/Chat';

export default function FortunePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const router = useRouter();
  const { selectedChainId, selectedChainName } = useAppContext();

  const [birthDate, setBirthDate] = useState<Date | null>(() => {
    if (typeof window !== 'undefined') {
      const storedBirthDate = localStorage.getItem('birthDate');
      return storedBirthDate ? new Date(storedBirthDate) : null;
    }
    return null;
  });
  const [showBirthDateForm, setShowBirthDateForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedBirthDate = localStorage.getItem('birthDate');
      return !storedBirthDate;
    }
    return true;
  });

  const {
    data: fortuneData,
    isLoading: fortuneLoading,
    error: fortuneError,
    refetch: refetchFortune,
    isRefetching: fortuneIsRefetching
  } = useFortune({
    address,
    chainIds: [selectedChainId],
    birthDate,
    enabled: isConnected && !!address && !!chainId && !!birthDate
  });

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  const handleBirthDateSubmit = (selectedBirthDate: Date) => {
    setBirthDate(selectedBirthDate);
    setShowBirthDateForm(false);

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('birthDate', selectedBirthDate.toISOString());
    }
  };

  const handleChangeBirthDate = () => {
    setShowBirthDateForm(true);
  };

  const handleBackFromForm = () => {
    setShowBirthDateForm(false);
  };

  const fortune = fortuneData?.fortune;
  const imageUrl = fortuneData?.imageUrl;

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Birth Date Form - Full Screen */}
      {showBirthDateForm ? (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <BirthDateForm
            onSubmit={handleBirthDateSubmit}
            onBack={birthDate ? handleBackFromForm : undefined}
            showBackButton={!!birthDate}
            initialBirthDate={birthDate}
            isLoading={fortuneLoading}
          />
        </div>
      ) : (
        <>
          {/* Loading or Error State - Full Screen */}
          {fortuneLoading || fortuneError || !fortune ? (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Your BaZi Fortune</span>
                    </div>
                    <Button onClick={handleChangeBirthDate} variant="ghost" size="sm" className="text-xs">
                      Change Birth Date
                    </Button>
                  </CardTitle>
                  {birthDate && (
                    <p className="text-sm text-muted-foreground">
                      Birth Date: {birthDate.toLocaleDateString()}
                      {birthDate.getHours() !== 12 && ` at ${birthDate.toLocaleTimeString()}`}
                    </p>
                  )}
                  {selectedChainName && <p className="text-sm text-muted-foreground">Chain: {selectedChainName}</p>}
                </CardHeader>
                <CardContent>
                  {fortuneLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">
                        <RotatingLoadingText />
                      </span>
                    </div>
                  ) : fortuneError ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Failed to generate your fortune.</p>
                      <Button
                        onClick={() => refetchFortune()}
                        disabled={fortuneLoading}
                        className="mystical-gradient text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${fortuneIsRefetching ? 'animate-spin' : ''}`} />
                        {fortuneIsRefetching ? 'Retrying...' : 'Try Again'}
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Split Screen Layout - When Fortune is Available */
            <div className="flex h-[var(--hero-height)] split-screen-expand">
              {/* Left Panel - Fortune Display */}
              <div className="flex-1 overflow-y-auto bg-background subtle-scrollbar split-left-expand">
                <div className="p-6 h-full">
                  <div className="max-w-2xl mx-auto pb-8">
                    {/* Fortune Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h1 className="text-2xl font-bold">Your BaZi Fortune</h1>
                      </div>
                      <Button onClick={handleChangeBirthDate} variant="ghost" size="sm" className="text-xs">
                        Change Birth Date
                      </Button>
                    </div>

                    {birthDate && (
                      <p className="text-sm text-muted-foreground mb-6">
                        Birth Date: {birthDate.toLocaleDateString()}
                        {birthDate.getHours() !== 12 && ` at ${birthDate.toLocaleTimeString()}`}
                      </p>
                    )}

                    {/* Fortune Content */}
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <MysticalImageLoader
                          imageUrl={imageUrl}
                          alt="Fortune Reading Visualization"
                          className="max-w-md w-full h-auto"
                        />
                      </div>

                      <div className="prose prose-invert max-w-none">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-lg leading-relaxed">
                              <TypewriterText text={fortune} speed={50} className="text-lg leading-relaxed" />
                            </p>
                          </div>

                          <Button
                            onClick={() => refetchFortune()}
                            disabled={fortuneIsRefetching}
                            className="mystical-gradient cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className={`h-4 w-4 ${fortuneIsRefetching ? 'animate-spin' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Chat Interface */}
              <div className="flex-1 overflow-y-auto bg-muted/30 border-l border-border subtle-scrollbar split-right-expand">
                <div className="p-6 h-full flex flex-col">
                  <Chat fortune={fortune || ''} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
