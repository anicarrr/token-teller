import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { fetchTokenBalances } from '@/lib/tokenFetcher'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { address, chainId } = await request.json()

    if (!address || !chainId) {
      return NextResponse.json({ error: 'Address and chainId are required' }, { status: 400 })
    }

    // Fetch token balances
    const balances = await fetchTokenBalances(address, chainId)

    // Build prompt for OpenAI
    const tokenSummary = balances.map(b => `${b.symbol}: ${b.balance} ${b.usdValue ? `($${b.usdValue.toFixed(2)})` : ''}`).join(', ')
    const prompt = `
      Based on the user's crypto portfolio, generate a personalized fortune in the style of BaZi (Chinese Four Pillars of Destiny). Interpret their token holdings as elements of their financial destiny.

      Portfolio: ${tokenSummary}

      Provide a creative, positive, and insightful fortune, including advice on their crypto future. Keep it engaging and metaphysics-inspired.
    `

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    })

    const fortune = response.choices[0]?.message?.content || 'No fortune generated.'

    return NextResponse.json({ fortune, balances })
  } catch (error) {
    console.error('Error generating fortune:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}