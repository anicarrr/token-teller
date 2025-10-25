import { useMutation } from '@tanstack/react-query'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMutationParams {
  messages: ChatMessage[]
  fortune: string
}

interface ChatResponse {
  reply: string
}

export function useChat() {
  return useMutation<ChatResponse, Error, ChatMutationParams>({
    mutationFn: async ({ messages, fortune }) => {

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          fortune,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      return response.json()
    },
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })
}