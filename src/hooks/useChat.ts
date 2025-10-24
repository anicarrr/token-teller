import { useMutation } from '@tanstack/react-query'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMutationParams {
  messages: ChatMessage[]
  address: string
  chainId: number
}

interface ChatResponse {
  reply: string
}

export function useChat() {
  return useMutation<ChatResponse, Error, ChatMutationParams>({
    mutationFn: async ({ messages, address, chainId }) => {
      if (!address) {
        throw new Error('Address is required')
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          address,
          chainId,
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