'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useChat } from '@/hooks/useChat'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatProps {
  address: string
  chainId: number
}

export function Chat({ address, chainId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const chatMutation = useChat()

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError('')

    chatMutation.mutate(
      {
        messages: [...messages, userMessage],
        address,
        chainId
      },
      {
        onSuccess: (data) => {
          if (data.reply) {
            const assistantMessage: Message = { role: 'assistant', content: data.reply }
            setMessages(prev => [...prev, assistantMessage])
          } else {
            setError('No response from AI.')
          }
          setLoading(false)
        },
        onError: (error) => {
          setError('Error sending message. Please try again.')
          setLoading(false)
        }
      }
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Ask About Your Fortune</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 overflow-y-auto border p-2 rounded">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded text-sm ${msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={loading} className="px-4">
            {loading ? 'Sending...' : 'Send'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}