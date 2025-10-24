import { useQuery } from '@tanstack/react-query'
import { TokenBalance } from '@/lib/balanceService'

interface UseFortuneParams {
  address: string | undefined
  chainIds: number[]
  enabled?: boolean
}

interface FortuneResponse {
  fortune: string
  balances: TokenBalance[]
  totalUsdValue: number
}

export function useFortune({ address, chainIds, enabled = true }: UseFortuneParams) {
  return useQuery<FortuneResponse>({
    queryKey: ['fortune', address, chainIds],
    queryFn: async () => {
      if (!address) {
        throw new Error('Address is required')
      }

      const response = await fetch('/api/fortune', {
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
        throw new Error('Failed to generate fortune')
      }

      return response.json()
    },
    enabled: enabled && !!address && chainIds.length > 0,
    staleTime: 300000, // 5 minutes (fortunes don't change as frequently)
    refetchInterval: false, // Don't auto-refetch fortunes
  })
}