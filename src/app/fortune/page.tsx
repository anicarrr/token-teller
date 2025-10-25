'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Sparkles, RefreshCw } from 'lucide-react';
import { useFortune } from '@/hooks/useFortune';
import { useChat } from '@/hooks/useChat';
import { BirthDateForm } from '@/components/BirthDateForm';
import { MysticalImageLoader } from '@/components/MysticalImageLoader';
import { useAppContext } from '@/contexts/AppContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FortunePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const router = useRouter();
  const { selectedChainId } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatError, setChatError] = useState<string>('');
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
    refetch: refetchFortune
  } = useFortune({
    address,
    chainIds: [selectedChainId],
    birthDate,
    enabled: isConnected && !!address && !!chainId && !!birthDate
  });

  const { mutate: sendMessageToAI, isPending: isSendingMessageToAI } = useChat();

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

  const sendMessage = async () => {
    if (!input.trim() || !address) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setChatError('');

    sendMessageToAI(
      {
        messages: [...messages, userMessage],
        address,
        chainId
      },
      {
        onSuccess: (data) => {
          if (data.reply) {
            const assistantMessage: Message = {
              role: 'assistant',
              content: data.reply
            };
            setMessages((prev) => [...prev, assistantMessage]);
          } else {
            setChatError('No response from AI.');
          }
        },
        onError: () => {
          setChatError('Error sending message. Please try again.');
        }
      }
    );
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
          {(fortuneLoading || fortuneError || !fortune) ? (
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
                </CardHeader>
                <CardContent>
                  {fortuneLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <span className="ml-2">Consulting the cosmic forces...</span>
                    </div>
                  ) : fortuneError ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Failed to generate your fortune.</p>
                      <Button onClick={() => refetchFortune()} className="mystical-gradient text-white">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
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
                  <div className="max-w-2xl mx-auto">
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
                            <p className="text-lg leading-relaxed">{fortune}</p>
                          </div>
                          <Button onClick={() => refetchFortune()} variant="ghost" size="sm" className="ml-4">
                            <RefreshCw className="h-4 w-4" />
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
                  <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold">Ask About Your Fortune</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Have questions about your reading? Chat with our AI oracle.
                      </p>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 bg-background/50 backdrop-blur-sm mb-4 custom-scrollbar">
                      {messages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <p>Start a conversation about your fortune...</p>
                        </div>
                      )}
                      {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.role === 'user' ? 'chat-message-user text-white' : 'chat-message-ai'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </div>
                      ))}
                      {isSendingMessageToAI && (
                        <div className="flex justify-start">
                          <div className="chat-message-ai p-3 rounded-lg">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Error */}
                    {chatError && <p className="text-red-500 text-center text-sm mb-4">{chatError}</p>}

                    {/* Chat Input */}
                    <div className="flex space-x-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your fortune..."
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={isSendingMessageToAI || !input.trim()}
                        className="mystical-gradient text-white"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
