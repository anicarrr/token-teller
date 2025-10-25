'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChat } from '@/hooks/useChat';
import { Loader2 } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  fortune: string;
}

export function Chat({ fortune }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutate: chatMutation, isPending: isLoading } = useChat();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setError('');
    
    chatMutation(
      {
        messages: [...messages, userMessage],
        fortune
      },
      {
        onSuccess: (data) => {
          if (data.reply) {
            const assistantMessage: Message = { role: 'assistant', content: data.reply };
            setMessages((prev) => [...prev, assistantMessage]);
          } else {
            setError('No response from AI.');
          }
        },
        onError: () => {
          setError('Error sending message. Please try again.');
        }
      }
    );
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto w-full flex-1 flex flex-col h-[80%] pb-[100px]">
        {/* Chat Header */}
        <div className="mb-6 px-4">
          <h2 className="text-xl font-semibold">Ask About Your Fortune</h2>
          <p className="text-sm text-muted-foreground mt-1">Have questions about your reading? Chat with our AI oracle.</p>
        </div>
        <CardContent className="flex flex-col flex-1 p-4 h-[100%]">
          <div className="flex-1 overflow-y-auto border p-2 rounded mb-4">
            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4 bg-background/50 backdrop-blur-sm h-full custom-scrollbar"
            >
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8 h-[90%]">
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
                    {msg.role === 'assistant' ? (
                      <TypewriterText
                        text={msg.content}
                        speed={50}
                        className="text-sm"
                        onComplete={() => scrollToBottom()}
                        onProgress={() => scrollToBottom()}
                        progressInterval={10}
                      />
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-message-ai p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat error */}
          {error && <p className="text-red-500 text-center text-sm mb-2">{error}</p>}
        </CardContent>
      </Card>
      <Card className="max-w-2xl mx-auto w-full flex mt-3">
        <div className="flex space-x-2 flex-shrink-0 w-full px-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your fortune..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading} className="px-4">
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </Card>
    </>
  );
}
