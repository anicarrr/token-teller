'use client'

import { useState, useEffect } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Send, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function FortunePage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const router = useRouter()
  const [fortune, setFortune] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [fortuneLoading, setFortuneLoading] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
    }
  }, [isConnected, router])

  useEffect(() => {
    if (isConnected && address && !fortune) {
      generateFortune()
    }
  }, [isConnected, address])

  const generateFortune = async () => {
    if (!address) return
    setFortuneLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/fortune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, chainId }),
      })
      const data = await response.json()
      if (data.fortune) {
        setFortune(data.fortune)
      } else {
        setError('Failed to generate fortune.')
      }
    } catch (error) {
      setError('Error generating fortune. Please try again.')
    } finally {
      setFortuneLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !address) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setChatLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage], 
          address, 
          chainId 
        }),
      })
      const data = await response.json()
      if (data.reply) {
        const assistantMessage: Message = { role: 'assistant', content: data.reply }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        setError('No response from AI.')
      }
    } catch (error) {
      setError('Error sending message. Please try again.')
    } finally {
      setChatLoading(false)
    }
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Fortune Card */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>Your BaZi Fortune</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fortuneLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Consulting the cosmic forces...</span>
                </div>
              ) : fortune ? (
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg leading-relaxed">{fortune}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Failed to generate your fortune.</p>
                  <Button onClick={generateFortune} className="mystical-gradient text-white">
                    Try Again
                  </Button>
                </div>
              )}
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
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'user'
                            ? 'chat-message-user text-white'
                            : 'chat-message-ai'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex justify-start">
                      <div className="chat-message-ai p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}

                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about your fortune..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={chatLoading || !input.trim()}
                    className="mystical-gradient text-white"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}