import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { BalanceService, TokenBalance } from '@/lib/balanceService'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { address, chainIds } = await request.json()

    if (!address || !chainIds) {
      return NextResponse.json({ error: 'Address and chainIds are required' }, { status: 400 })
    }

    // Fetch balances using the service
    const { balances, totalUsdValue } = await BalanceService.fetchBalances(address, chainIds)

    // Build prompt for OpenAI
    const tokenSummary = balances
      .map((b: TokenBalance) => `${b.symbol} (${b.chainName}): ${parseFloat(b.balance).toFixed(4)} ($${b.usdValue.toFixed(2)})`)
      .join(', ')
    
    const prompt = `
      Based on the user's crypto portfolio, generate a personalized fortune in the style of BaZi (Chinese Four Pillars of Destiny). Interpret their token holdings as elements of their financial destiny.

      Portfolio: ${tokenSummary}
      Total Portfolio Value: $${totalUsdValue.toFixed(2)}

      Provide a creative, positive, and insightful fortune, including advice on their crypto future. Keep it engaging and metaphysics-inspired.
    `

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    })

    const fortune = response.choices[0]?.message?.content || 'No fortune generated.'

    return NextResponse.json({ fortune, balances, totalUsdValue })
  } catch (error) {
    console.error('Error generating fortune:', error)
    
    // Handle specific error types
    if (error instanceof Error && error.message === 'Invalid address format') {
      return NextResponse.json({
        error: 'Invalid address format'
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}