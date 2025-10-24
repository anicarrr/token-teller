import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, address, chainId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    // Build system prompt with wallet context
    const systemPrompt = `
      You are a BaZi fortune teller specializing in crypto portfolios. Respond in a mystical, insightful style based on the user's wallet and previous conversation.

      User's wallet address: ${address}
      Chain: ${chainId}
      Maintain the conversation context and provide advice on their crypto future.
    `

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: fullMessages,
      max_tokens: 200,
    })

    const reply = response.choices[0]?.message?.content || 'No response generated.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}