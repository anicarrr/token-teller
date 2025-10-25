"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Sparkles, RefreshCw } from "lucide-react";
import { useFortune } from "@/hooks/useFortune";
import { useChat } from "@/hooks/useChat";
import { BirthDateForm } from "@/components/BirthDateForm";
import { useAppContext } from "@/contexts/AppContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FortunePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const router = useRouter();
  const { selectedChainId } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatError, setChatError] = useState<string>("");
  const [birthDate, setBirthDate] = useState<Date | null>(() => {
    if (typeof window !== "undefined") {
      const storedBirthDate = localStorage.getItem("birthDate");
      return storedBirthDate ? new Date(storedBirthDate) : null;
    }
    return null;
  });
  const [showBirthDateForm, setShowBirthDateForm] = useState(() => {
    if (typeof window !== "undefined") {
      const storedBirthDate = localStorage.getItem("birthDate");
      return !storedBirthDate;
    }
    return true;
  });

  const {
    data: fortuneData,
    isLoading: fortuneLoading,
    error: fortuneError,
    refetch: refetchFortune,
  } = useFortune({
    address,
    chainIds: [selectedChainId],
    birthDate,
    enabled: isConnected && !!address && !!chainId && !!birthDate,
  });

  const { mutate: sendMessageToAI, isPending: isSendingMessageToAI } =
    useChat();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const handleBirthDateSubmit = (selectedBirthDate: Date) => {
    setBirthDate(selectedBirthDate);
    setShowBirthDateForm(false);
    
    // Store in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("birthDate", selectedBirthDate.toISOString());
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

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setChatError("");

    sendMessageToAI(
      {
        messages: [...messages, userMessage],
        address,
        chainId,
      },
      {
        onSuccess: (data) => {
          if (data.reply) {
            const assistantMessage: Message = {
              role: "assistant",
              content: data.reply,
            };
            setMessages((prev) => [...prev, assistantMessage]);
          } else {
            setChatError("No response from AI.");
          }
        },
        onError: () => {
          setChatError("Error sending message. Please try again.");
        },
      }
    );
  };

  const fortune = fortuneData?.fortune;

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Birth Date Form */}
          {showBirthDateForm ? (
            <BirthDateForm
              onSubmit={handleBirthDateSubmit}
              onBack={birthDate ? handleBackFromForm : undefined}
              showBackButton={!!birthDate}
              initialBirthDate={birthDate}
              isLoading={fortuneLoading}
            />
          ) : (
            <>
              {/* Fortune Card */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Your BaZi Fortune</span>
                    </div>
                    <Button
                      onClick={handleChangeBirthDate}
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
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
                      <p className="text-muted-foreground mb-4">
                        Failed to generate your fortune.
                      </p>
                      <Button
                        onClick={() => refetchFortune()}
                        className="mystical-gradient text-white"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                      </Button>
                    </div>
                  ) : fortune ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="flex justify-between items-start mb-4">
                        <p className="text-lg leading-relaxed flex-1">{fortune}</p>
                        <Button
                          onClick={() => refetchFortune()}
                          variant="ghost"
                          size="sm"
                          className="ml-4"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              {/* Chat Interface */}
              {fortune && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ask About Your Fortune</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.role === "user"
                                ? "chat-message-user text-white"
                                : "chat-message-ai"
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

                    {chatError && (
                      <p className="text-red-500 text-center text-sm">
                        {chatError}
                      </p>
                    )}

                    <div className="flex space-x-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your fortune..."
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
