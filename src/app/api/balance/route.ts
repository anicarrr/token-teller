import { NextRequest, NextResponse } from 'next/server'
import { BalanceService } from '@/lib/balanceService'

// Re-export types for backward compatibility
export type { TokenBalance, BalanceResponse } from '@/lib/balanceService'

export async function POST(request: NextRequest) {
  try {
    const { address, chainIds } = await request.json()

    if (!address || !chainIds || !Array.isArray(chainIds)) {
      return NextResponse.json({
        error: 'Address and chainIds array are required'
      }, { status: 400 })
    }

    const response = await BalanceService.fetchBalances(address, chainIds)
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching balances:', error)
    
    // Handle specific error types
    if (error instanceof Error && error.message === 'Invalid address format') {
      return NextResponse.json({
        error: 'Invalid address format'
      }, { status: 400 })
    }
    
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}