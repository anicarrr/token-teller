import { useQuery } from '@tanstack/react-query'
import { BalanceResponse } from '@/lib/balanceService'

interface UseBalanceParams {
  address: string | undefined
  chainIds: number[]
  enabled?: boolean
}

export function useBalance({ address, chainIds, enabled = true }: UseBalanceParams) {
  return useQuery<BalanceResponse>({
    queryKey: ['balance', address, chainIds],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address is required')
      }

      const response = await fetch('/api/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          chainIds,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch balances')
      }

      return response.json()
    },
    enabled: enabled && !!address && chainIds.length > 0,
    staleTime: 30000, // 30 seconds
  })
}